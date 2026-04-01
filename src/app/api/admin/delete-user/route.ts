import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Endpoint para eliminar usuarios (Auth + Perfil)
 * Solo accesible por administradores.
 */
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: requester }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !requester) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar rol admin
    const adminClient = createAdminClient();
    const { data: profile } = await (adminClient as any)
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    // 1. Eliminar de Supabase Auth (esto borra automáticamente de profiles si hay CASCADE, 
    // pero lo hacemos manual para asegurar consistencia si no hay trigger)
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(targetUserId);

    if (deleteAuthError) {
      return NextResponse.json({ error: `Error eliminando de Auth: ${deleteAuthError.message}` }, { status: 500 });
    }

    await (adminClient as any)
      .from("profiles")
      .delete()
      .eq("id", targetUserId);

    revalidatePath("/admin", "layout");

    return NextResponse.json({ message: "Usuario eliminado correctamente" });

  } catch (error: any) {
    console.error("Critical error in delete-user API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
