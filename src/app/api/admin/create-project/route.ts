import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    // 1. Obtener la sesión del usuario para verificar si está logueado
    const supabase = await createClient();
    const { data: { user: requester }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !requester) {
      return NextResponse.json(
        { error: "Sesión no válida o no encontrada. Inicie sesión nuevamente." }, 
        { status: 401 }
      );
    }

    // 2. Verificar rol 'admin' de forma estricta usando el Service Role Client
    const adminClient = createAdminClient();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (adminClient as any)
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Prohibido. Solo los administradores pueden crear proyectos." }, 
        { status: 403 }
      );
    }

    // 3. Procesar datos del proyecto
    const body = await req.json();
    const { 
      name, 
      description, 
      customer_id, 
      status, 
      start_date, 
      end_date, 
      repo_url,
      developer_ids 
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "El nombre del proyecto es obligatorio." }, 
        { status: 400 }
      );
    }

    // 4. Insertar el proyecto usando el cliente administrativo (bypas RLS)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: project, error: insertError } = await (adminClient as any)
      .from("projects")
      .insert([
        {
          name,
          description: description || null,
          customer_id: customer_id || null,
          status: status || "design",
          start_date: start_date || null,
          end_date: end_date || null,
          repo_url: repo_url || null,
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: `Error al insertar en la base de datos: ${insertError.message}` }, 
        { status: 500 }
      );
    }

    // 5. Asignar desarrolladores si se proporcionan
    if (developer_ids && Array.isArray(developer_ids) && developer_ids.length > 0) {
      const assignments = developer_ids.map(profileId => ({
        project_id: project.id,
        profile_id: profileId
      }));

      const { error: assignError } = await (adminClient as any)
        .from("project_assignments")
        .insert(assignments);

      if (assignError) {
        console.error("Error creating assignments:", assignError);
        // Podríamos continuar aunque falle esto, o retornar advertencia.
      }
    }

    // Revalidar el cache completo del layout admin para sincronizar UI y DB
    revalidatePath("/admin", "layout");

    return NextResponse.json({
      message: "Proyecto creado exitosamente.",
      project: project
    }, { status: 201 });

  } catch (error: any) {
    console.error("Critical error in create-project route:", error);
    return NextResponse.json(
      { error: "Error interno del servidor.", details: error.message }, 
      { status: 500 }
    );
  }
}
