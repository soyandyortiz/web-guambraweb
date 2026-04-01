/**
 * Script para crear el usuario administrador en Supabase.
 * Uso: node scripts/create-admin.mjs
 *
 * IMPORTANTE: Necesitas la SERVICE ROLE KEY de Supabase (no la anon key).
 * La encuentras en: Supabase Dashboard → Settings → API → service_role
 */

import { createClient } from "@supabase/supabase-js";

// ─── CONFIGURACIÓN ─────────────────────────────────────
const SUPABASE_URL = "https://eqhfyakjchzvzyzevovs.supabase.co";

// ⚠️  Reemplaza esto con tu SERVICE ROLE KEY (secreta, solo para scripts)
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "REEMPLAZA_CON_TU_SERVICE_ROLE_KEY";

// Datos del admin a crear
const ADMIN_EMAIL    = "admin@guambraweb.com";
const ADMIN_PASSWORD = "GuambraAdmin2026!";
const ADMIN_NAME     = "Administrador GuambraWeb";
// ───────────────────────────────────────────────────────

if (SERVICE_ROLE_KEY === "REEMPLAZA_CON_TU_SERVICE_ROLE_KEY") {
  console.error("\n❌ ERROR: Debes proporcionar la SERVICE ROLE KEY.");
  console.error("   Pásala como variable de entorno:");
  console.error("   $env:SUPABASE_SERVICE_ROLE_KEY='tu_key_aqui'; node scripts/create-admin.mjs\n");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("\n🚀 Creando usuario admin en Supabase...\n");

  // 1. Verificar si ya existe
  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing?.users?.find(u => u.email === ADMIN_EMAIL);

  if (alreadyExists) {
    console.log(`ℹ️  El usuario ${ADMIN_EMAIL} ya existe.`);
    console.log(`   ID: ${alreadyExists.id}`);
    console.log(`   Confirmado: ${alreadyExists.email_confirmed_at ? "✅ Sí" : "❌ No"}`);

    // Actualizar contraseña si ya existe
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      alreadyExists.id,
      { password: ADMIN_PASSWORD, email_confirm: true }
    );
    if (updateError) {
      console.error("❌ Error actualizando contraseña:", updateError.message);
    } else {
      console.log(`   Contraseña actualizada a: ${ADMIN_PASSWORD}`);
    }

    // Verificar perfil
    await ensureProfile(alreadyExists.id);
    return;
  }

  // 2. Crear el usuario
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,  // confirmar email automáticamente
    user_metadata: { full_name: ADMIN_NAME },
  });

  if (error) {
    console.error("❌ Error creando usuario:", error.message);
    process.exit(1);
  }

  console.log(`✅ Usuario creado con ID: ${data.user.id}`);
  await ensureProfile(data.user.id);
}

async function ensureProfile(userId) {
  // Verificar si tiene perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profile) {
    // Actualizar rol a admin si no lo es
    if (profile.role !== "admin") {
      await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", userId);
      console.log("✅ Rol actualizado a: admin");
    } else {
      console.log(`✅ Perfil ya existe con rol: ${profile.role}`);
    }
  } else {
    // Crear perfil
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      full_name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: "admin",
    });

    if (profileError) {
      console.error("⚠️  Error creando perfil (puede que el trigger lo cree automáticamente):", profileError.message);
    } else {
      console.log("✅ Perfil admin creado en tabla profiles");
    }
  }

  console.log("\n─────────────────────────────────────");
  console.log("🎉 ¡Usuario admin listo!");
  console.log(`   Email:      ${ADMIN_EMAIL}`);
  console.log(`   Contraseña: ${ADMIN_PASSWORD}`);
  console.log(`   URL login:  http://localhost:3000/auth/login`);
  console.log("─────────────────────────────────────\n");
}

main().catch(console.error);
