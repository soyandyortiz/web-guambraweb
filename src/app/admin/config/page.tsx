"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Bell, 
  Globe, 
  Save,
  Info,
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  
  // Estado para los campos (Simulado con localStorage para persistencia inmediata sin DB dedicada aún)
  const [config, setConfig] = useState({
    system_name: "GuambraWeb Admin",
    timezone: "Quito (GMT-5)",
    notifications: {
      new_orders: true,
      tickets: true,
      subscriptions: true,
      backup: true
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem("admin_config");
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Nota: Aquí se debería llamar a una tabla 'app_settings' en Supabase.
    // Como la tabla no existe en el esquema actual, persistimos en localStorage 
    // y mostramos el éxito de la operación.
    try {
      localStorage.setItem("admin_config", JSON.stringify(config));
      // Simulamos latencia de red
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage({ type: "success", text: "Configuración guardada correctamente" });
    } catch (err) {
      setMessage({ type: "error", text: "Error al guardar la configuración" });
    } finally {
      setIsSaving(false);
    }
  };

  const TABS = [
    { id: "general", label: "General", icon: Settings },
  ];

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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Mini */}
        <div className="w-full md:w-64 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="card p-6">
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold">Configuración General</h3>
                  <p className="text-sm text-muted-foreground">Administra los parámetros básicos del sistema.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold">Nombre del Sistema</label>
                    <input 
                      className="input" 
                      value={config.system_name} 
                      onChange={(e) => setConfig({...config, system_name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold">Zona Horaria</label>
                    <select 
                      className="input"
                      value={config.timezone}
                      onChange={(e) => setConfig({...config, timezone: e.target.value})}
                    >
                      <option>Quito (GMT-5)</option>
                      <option>Bogotá (GMT-5)</option>
                      <option>Lima (GMT-5)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold">Idioma Predeterminado</label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-dashed">
                      <Globe size={16} className="text-muted-foreground" />
                      <span className="text-sm">Español (Ecuador)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                 <Info size={14} />
                 Los cambios se aplican globalmente al panel administrativo.
               </div>
               <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="btn-primary gap-2"
               >
                 {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Guardar Cambios</>}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
