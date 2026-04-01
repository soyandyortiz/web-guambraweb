"use server";

import { revalidatePath } from "next/cache";

export async function revalidateAdmin() {
  revalidatePath("/admin", "layout");
}
