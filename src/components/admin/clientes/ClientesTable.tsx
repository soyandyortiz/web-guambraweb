"use client";

import { useState, useTransition, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Search, 
  Plus, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Hash
} from "lucide-react";
import { useRouter } from "next/navigation";
import { revalidateAdmin } from "@/app/actions/admin";

/* ─────────────────────────────────────────
   TIPOS
    ───────────────────────────────────────── */
export type CustomerRow = {
  id: string;
  profile_id: string | null;
  is_company: boolean | null;
  company_name: string | null;
  tax_id: string | null;
  phone: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  country: string | null;
  email: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
};

export type ProfileOption = {
  id: string;
  full_name: string;
  email: string;
};

type Props = { 
  initialCustomers: CustomerRow[];
  availableProfiles: ProfileOption[];
};

/* ─────────────────────────────────────────
   UBICACIONES ECUADOR
    ───────────────────────────────────────── */
const ECUADOR_LOCATIONS: Record<string, string[]> = {
  "Azuay": ["Cuenca", "Gualaceo", "Paute", "Sigsig", "Girón", "Otro"],
  "Bolívar": ["Guaranda", "San Miguel", "Chimbo", "Otro"],
  "Cañar": ["Azogues", "La Troncal", "Cañar", "Biblián", "Otro"],
  "Carchi": ["Tulcán", "San Gabriel", "El Ángel", "Mira", "Otro"],
  "Chimborazo": ["Riobamba", "Guano", "Alausí", "Chambo", "Otro"],
  "Cotopaxi": ["Latacunga", "Pujilí", "Salcedo", "Saquisilí", "Otro"],
  "El Oro": ["Machala", "Pasaje", "Santa Rosa", "Huaquillas", "El Guabo", "Otro"],
  "Esmeraldas": ["Esmeraldas", "Quinindé", "Atacames", "Muisne", "Otro"],
  "Galápagos": ["Puerto Baquerizo Moreno", "Puerto Ayora", "Puerto Villamil", "Otro"],
  "Guayas": ["Guayaquil", "Durán", "Milagro", "Samborondón", "Daule", "Playas", "Otro"],
  "Imbabura": ["Ibarra", "Otavalo", "Atuntaqui", "Cotacachi", "Otro"],
  "Loja": ["Loja", "Catamayo", "Macará", "Cariamanga", "Otro"],
  "Los Ríos": ["Babahoyo", "Quevedo", "Buena Fe", "Ventanas", "Vinces", "Otro"],
  "Manabí": ["Portoviejo", "Manta", "Chone", "El Carmen", "Bahía de Caráquez", "Otro"],
  "Morona Santiago": ["Macas", "Sucúa", "Gualaquiza", "Otro"],
  "Napo": ["Tena", "Archidona", "El Chaco", "Otro"],
  "Orellana": ["Puerto Francisco de Orellana (Coca)", "Joya de los Sachas", "Otro"],
  "Pastaza": ["Puyo", "Mera", "Arajuno", "Otro"],
  "Pichincha": ["Quito", "Cayambe", "Machachi", "Sangolquí", "Tabacundo", "Otro"],
  "Santa Elena": ["Santa Elena", "La Libertad", "Salinas", "Otro"],
  "Santo Domingo de los Tsáchilas": ["Santo Domingo", "La Concordia", "Otro"],
  "Sucumbíos": ["Nueva Loja", "Shushufindi", "Cuyabeno", "Otro"],
  "Tungurahua": ["Ambato", "Baños", "Pelileo", "Píllaro", "Otro"],
  "Zamora Chinchipe": ["Zamora", "Yantzaza", "Otro"]
};

/* ─────────────────────────────────────────
   COMPONENTE: ClientesTable
    ───────────────────────────────────────── */
export function ClientesTable({ initialCustomers, availableProfiles }: Props) {
  const [customers, setCustomers] = useState<CustomerRow[]>(initialCustomers);

  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Estados del Formulario
  const [formData, setFormData] = useState({
    company_name: "",
    tax_id: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    country: "Ecuador",
    email: "",
    is_company: true,
    profile_id: ""
  });

  const resetForm = () => {
    setFormData({
      company_name: "",
      tax_id: "",
      phone: "",
      province: "",
      city: "",
      address: "",
      country: "Ecuador",
      email: "",
      is_company: true,
      profile_id: ""
    });
    setEditingCustomer(null);
  };

  const openNewModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (customer: CustomerRow) => {
    setEditingCustomer(customer);
    setFormData({
      company_name: customer.company_name || "",
      tax_id: customer.tax_id || "",
      phone: customer.phone || "",
      province: customer.province || "",
      city: customer.city || "",
      address: customer.address || "",
      country: customer.country || "Ecuador",
      email: customer.email || "",
      is_company: customer.is_company ?? true,
      profile_id: customer.profile_id || ""
    });
    setIsModalOpen(true);
  };

  /* ── Acciones CRUD ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    startTransition(async () => {
      try {
        // Validación de Formato de Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          alert("El formato del correo electrónico no es válido.");
          return;
        }

        // Verificación de email duplicado en Supabase
        const { data: existingClient, error: existError } = await (supabase as any)
          .from("customers")
          .select("id")
          .eq("email", formData.email)
          .maybeSingle();

        if (existError) {
          throw new Error("Error al verificar disponibilidad del correo.");
        }

        if (existingClient && (!editingCustomer || existingClient.id !== editingCustomer.id)) {
          alert("Este correo electrónico ya está registrado por otro cliente.");
          return;
        }

        if (editingCustomer) {
          // UPDATE
          const { data, error } = await (supabase as any)
            .from("customers")
            .update({
              company_name: formData.company_name,
              tax_id: formData.tax_id,
              phone: formData.phone,
              province: formData.province,
              city: formData.city,
              address: formData.address,
              country: formData.country,
              email: formData.email,
              is_company: formData.is_company,
              profile_id: formData.profile_id || null
            })
            .eq("id", editingCustomer.id)
            .select(`*, profiles(full_name, email)`)
            .single();

          if (error) throw error;
          setCustomers(prev => prev.map(c => c.id === data.id ? data : c));
        } else {
          // INSERT
          const { data, error } = await (supabase as any)
            .from("customers")
            .insert([{
              company_name: formData.company_name,
              tax_id: formData.tax_id,
              phone: formData.phone,
              province: formData.province,
              city: formData.city,
              address: formData.address,
              country: formData.country,
              email: formData.email,
              is_company: formData.is_company,
              profile_id: formData.profile_id || null
            }])
            .select(`*, profiles(full_name, email)`)
            .single();

          if (error) throw error;
          setCustomers(prev => [data, ...prev]);
        }

        setIsModalOpen(false);
        resetForm();
        await revalidateAdmin();
        router.refresh();
      } catch (err) {
        console.error("Error saving customer:", err);
        alert("Error al guardar el cliente.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente? Se perderá su historial.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;

      setCustomers(prev => prev.filter(c => c.id !== id));
      await revalidateAdmin();
      router.refresh();
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Error al eliminar el cliente.");
    }
  };

  /* ── Filtrar ── */
  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.email || "").toLowerCase().includes(q) ||
      (c.company_name || "").toLowerCase().includes(q) ||
      (c.tax_id || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.province || "").toLowerCase().includes(q) ||
      (c.city || "").toLowerCase().includes(q) ||
      (c.address || "").toLowerCase().includes(q) ||
      (c.country || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* ── Controles ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
          style={{ background: "hsl(var(--input))", border: "1px solid hsl(var(--border))" }}
        >
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Buscar por nombre, RUC, teléfono o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 min-w-0"
            style={{ color: "hsl(var(--foreground))" }}
          />
        </div>

        <button onClick={openNewModal} className="btn-primary gap-2">
          <Plus size={16} />
          Nuevo Cliente
        </button>
      </div>

      {/* ── Tabla ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid hsl(var(--border))" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 size={40} className="text-muted-foreground mb-4 opacity-20" />
            <h3 className="font-display font-semibold text-lg mb-1">Sin clientes</h3>
            <p className="text-sm text-muted-foreground">No se encontraron clientes con esos parámetros.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Teléfono</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Provincia</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Ciudad</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Dirección</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">País</th>
                  <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer, idx) => (
                  <tr 
                    key={customer.id}
                    className="hover:bg-muted/30 transition-colors"
                    style={{ borderBottom: idx < filtered.length - 1 ? "1px solid hsl(var(--border) / 0.5)" : "none" }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          {customer.is_company ? <Building2 size={16} /> : <User size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{customer.company_name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                            {customer.is_company ? "Empresa" : "Persona Natural"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        {customer.email || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                         <Phone size={12} />
                         {customer.phone || "—"}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                         {customer.province || "—"}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                         {customer.city || "—"}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-1.5 text-xs text-muted-foreground max-w-[150px] truncate">
                         <MapPin size={12} />
                         {customer.address || "—"}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                         {customer.country || "Ecuador"}
                       </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => openEditModal(customer)}
                          className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL DE FORMULARIO ── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="card w-full max-w-md animate-scale-in p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                {editingCustomer ? <Edit2 size={18} /> : <Plus size={18} />}
                {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo de Cliente Toggle */}
              <div className="flex p-1 rounded-lg bg-muted">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_company: true }))}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.is_company ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
                >
                  Empresa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_company: false }))}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${!formData.is_company ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
                >
                  Persona Natural
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre / Razón Social</label>
                  <input
                    required
                    type="text"
                    className="input text-sm"
                    placeholder="Ej. Guambra S.A. o Juan Pérez"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                  <input
                    required
                    type="email"
                    className="input text-sm"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">RUC / DNI</label>
                    <input
                      type="text"
                      className="input text-sm"
                      placeholder="06044..."
                      value={formData.tax_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, tax_id: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Teléfono</label>
                    <input
                      type="text"
                      className="input text-sm"
                      placeholder="09..."
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Provincia</label>
                    <select
                      className="input text-sm appearance-none bg-background shadow-sm w-full"
                      value={formData.province}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, province: e.target.value, city: "" }));
                      }}
                    >
                      <option value="" disabled hidden>Selecciona...</option>
                      {Object.keys(ECUADOR_LOCATIONS).sort().map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ciudad</label>
                    <select
                      className="input text-sm appearance-none bg-background shadow-sm disabled:opacity-50 w-full"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!formData.province}
                    >
                      <option value="" disabled hidden>Selecciona...</option>
                      {formData.province && ECUADOR_LOCATIONS[formData.province]?.sort().map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirección</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-muted-foreground" size={14} />
                    <textarea
                      rows={2}
                      className="input text-sm pl-9 w-full"
                      placeholder="Calle Principal, 123..."
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">País</label>
                  <select
                    className="input text-sm appearance-none bg-background shadow-sm w-full"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  >
                    <option value="Ecuador">Ecuador</option>
                  </select>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User size={12} className="text-primary" />
                    Vincular a Usuario (Opcional)
                  </label>
                  <select
                    className="input text-sm"
                    value={formData.profile_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, profile_id: e.target.value }))}
                  >
                    <option value="">No vincular</option>
                    {availableProfiles.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground italic">
                    Esto permitirá al cliente iniciar sesión y ver sus proyectos/facturas.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary flex-1 bg-primary"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
