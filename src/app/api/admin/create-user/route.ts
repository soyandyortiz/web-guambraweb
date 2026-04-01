import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    // 1. Obtener la sesión del usuario mediante el cliente de servidor (cookies)
    const supabase = await createClient();
    const { data: { user: requester }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !requester) {
      return NextResponse.json(
        { error: "Sesión no válida o no encontrada. Inicie sesión nuevamente." }, 
        { status: 401 }
      );
    }

    // 2. Verificar rol 'admin' de forma estricta
    // Usamos createAdminClient para consultar el rol y evitar problemas de RLS 
    // durante la validación de permisos de administración.
    const adminClient = createAdminClient();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (adminClient as any)
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      console.warn(`Acceso denegado: El usuario ${requester.email} intentó crear un usuario sin ser admin.`);
      return NextResponse.json(
        { 
          error: "Prohibido. Solo los usuarios con el rol 'admin' en su perfil pueden realizar esta acción.",
          details: `Tu rol actual detectado es: ${profile?.role || "Ninguno"}`
        }, 
        { status: 403 }
      );
    }

    // 3. Procesar datos del cuerpo de la petición
    const { email, password, full_name, role } = await req.json();

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (email, password, full_name, role)." }, 
        { status: 400 }
      );
    }

    // 4. Crear el usuario en Auth usando la Service Role Key (Admin Privileges)
    const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    });

    if (createError) {
      return NextResponse.json(
        { error: `Error de Supabase Auth: ${createError.message}` }, 
        { status: 400 }
      );
    }

    const newUser = authData.user;

    // 5. Crear el perfil en la tabla 'profiles'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (adminClient as any)
      .from("profiles")
      .insert([
        {
          id: newUser.id,
          full_name,
          email,
          role: role || "dev"
        }
      ]);

    if (insertError) {
      // Nota: El usuario de Auth ya está creado, esto indica una falla en la tabla profiles.
      return NextResponse.json(
        { error: `Auth creado con éxito, pero falló la inserción en profiles: ${insertError.message}` }, 
        { status: 500 }
      );
    }

    revalidatePath("/admin", "layout");

    return NextResponse.json({
      message: "Usuario y perfil creados exitosamente.",
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name,
        role
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Critical error in create-user route:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado en el servidor.", details: error.message }, 
      { status: 500 }
    );
  }
}
