"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Camera,
  Loader2,
  CheckCircle2,
  X,
  Lock,
  Check
} from "lucide-react";
import { updateProfile, updatePassword } from "@/app/actions/profile";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "" });
  const [passForm, setPassForm] = useState({ password: "", confirm: "" });

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setProfile(profileData);
        setEditForm({ full_name: profileData?.full_name ?? "" });
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateProfile(editForm);
    if (res.success) {
      setProfile({ ...profile, full_name: editForm.full_name });
      setShowEditModal(false);
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } else {
      setMessage({ type: "error", text: res.message || "Error al actualizar" });
    }
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.password !== passForm.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setIsSaving(true);
    const res = await updatePassword(passForm.password);
    if (res.success) {
      setShowPasswordModal(false);
      setPassForm({ password: "", confirm: "" });
      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
    } else {
      setMessage({ type: "error", text: res.message || "Error al actualizar" });
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {message && (
        <div className={`p-4 rounded-xl flex items-center justify-between animate-fade-in ${
          message.type === "success" ? "bg-success/10 text-success border border-success/30" : "bg-destructive/10 text-destructive border border-destructive/30"
        }`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}><X size={14} /></button>
        </div>
      )}

      {/* Header del Perfil */}
      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-3xl font-bold text-primary shadow-xl">
                {profile?.full_name?.charAt(0) ?? "A"}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-primary text-white border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1 pb-1">
              <h2 className="text-2xl font-display font-bold">{profile?.full_name ?? "Administrador"}</h2>
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Shield size={14} className="text-primary" />
                {profile?.role === "admin" ? "Administrador del Sistema" : "Desarrollador"}
              </p>
            </div>
            <button onClick={() => setShowEditModal(true)} className="btn-primary btn-sm mb-1">Editar Perfil</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Detalles de la Cuenta
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre Completo</label>
                  <p className="mt-1 font-medium">{profile?.full_name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Correo Electrónico</label>
                  <p className="mt-1 font-medium flex items-center gap-2">
                    {user?.email}
                    <CheckCircle2 size={14} className="text-success" />
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ID de Usuario</label>
                  <p className="mt-1 font-mono text-xs text-muted-foreground truncate">{user?.id}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fecha de Registro</label>
                  <p className="mt-1 font-medium flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    {profile?.created_at && new Date(profile.created_at).toLocaleDateString("es-EC", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 border-dashed border-2 bg-muted/20">
            <h3 className="text-lg font-bold mb-2">Seguridad</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Mantén tu cuenta protegida cambiando tu contraseña regularmente.
            </p>
            <button onClick={() => setShowPasswordModal(true)} className="btn-secondary btn-sm">Cambiar Contraseña</button>
          </div>
        </div>

        {/* Sidebar del perfil */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-success/10 text-success mb-3">
              <Shield size={24} />
            </div>
            <h4 className="font-bold">Estado de Cuenta</h4>
            <p className="text-xs text-muted-foreground mt-1">Verificado y Activo</p>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Último acceso</span>
                <span className="font-medium">Hoy, {new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rol</span>
                <span className="font-bold text-primary uppercase">{profile?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar Perfil */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-display font-bold text-lg">Editar Perfil</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    required
                    className="input pl-10"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex-1">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-display font-bold text-lg">Cambiar Contraseña</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input pl-10"
                    value={passForm.password}
                    onChange={(e) => setPassForm({...passForm, password: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="password"
                    required
                    className="input pl-10"
                    value={passForm.confirm}
                    onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex-1">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Actualizar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
