"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProject(id: string, data: {
  name?: string;
  description?: string;
  status?: "design" | "development" | "qa" | "live" | "unsupervised" | any;
  repo_url?: string;
  customer_id?: string;
  start_date?: string | null;
  end_date?: string | null;
  developer_ids?: string[];
}) {
  const supabase = await createClient();

  // 1. Actualizar datos básicos del proyecto
  const { developer_ids, ...projectData } = data;
  
  const { error } = await supabase
    .from("projects")
    .update(projectData)
    .eq("id", id);

  if (error) {
    console.error("Error updating project:", error);
    return { success: false, message: error.message };
  }

  // 2. Actualizar desarrolladores asignados si se proporcionaron IDs
  if (developer_ids) {
    // Eliminar asignaciones actuales
    await supabase.from("project_assignments").delete().eq("project_id", id);
    
    // Insertar nuevas asignaciones
    if (developer_ids.length > 0) {
      const assignments = developer_ids.map(devId => ({
        project_id: id,
        profile_id: devId
      }));
      const { error: assignError } = await supabase.from("project_assignments").insert(assignments);
      if (assignError) {
        console.error("Error updating assignments:", assignError);
      }
    }
  }

  revalidatePath("/admin/produccion/proyectos");
  revalidatePath(`/admin/produccion/proyectos/${id}`);
  
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/produccion/proyectos");
  
  return { success: true };
}
