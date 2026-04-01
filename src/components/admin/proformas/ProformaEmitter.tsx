"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  Send, 
  Save, 
  Loader2, 
  CheckCircle2, 
  UserPlus,
  ArrowLeft,
  Smartphone,
  Mail,
  Building2,
  User,
  ShoppingBag
} from "lucide-react";
import { Customer, Product } from "@/types/database";
import { saveProforma, quickCreateCustomer, ProformaItem } from "@/app/admin/ventas/proformas/proforma-actions";
import { useRouter } from "next/navigation";
import { PDFDownloadButton } from "@/components/admin/shared/PDFDownloadButton";

const IVA_RATE = 0;
const COMPANY_NAME = "GUAMBRA WEB"; // Según solicitud del usuario

interface SelectedItem extends Product {
  quantity: number;
  customPrice: number;
}

interface Props {
  initialCustomers: Customer[];
  initialProducts: Product[];
}

export function ProformaEmitter({ initialCustomers, initialProducts }: Props) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [products] = useState<Product[]>(initialProducts);
  
  // Estado Selección
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  
  // Estado Ítems
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductResults, setShowProductResults] = useState(false);
  
  // Estado UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ id: string; num: string } | null>(null);
  const [isQuickCustomerModalOpen, setIsQuickCustomerModalOpen] = useState(false);

  // Estado Descuento y Validez
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [validityDays, setValidityDays] = useState<number>(15);

  // Cálculos
  const financialTotals = useMemo(() => {
    const subtotal = selectedItems.reduce((acc, item) => acc + (item.quantity * item.customPrice), 0);
    
    let discountTotal = 0;
    if (discountType === 'percentage') {
      discountTotal = subtotal * (discountValue / 100);
    } else {
      discountTotal = discountValue;
    }

    const subtotalConDescuento = Math.max(0, subtotal - discountTotal);
    const tax = subtotalConDescuento * IVA_RATE;
    const total = subtotalConDescuento + tax;

    return { subtotal, discountTotal, tax, total };
  }, [selectedItems, discountType, discountValue]);

  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === selectedCustomerId), 
  [selectedCustomerId, customers]);

  // Handlers
  const addItem = (product: Product) => {
    const exists = selectedItems.find(item => item.id === product.id);
    if (exists) {
      setSelectedItems(selectedItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...product, quantity: 1, customPrice: product.price }]);
    }
    setProductSearch("");
    setShowProductResults(false);
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: "quantity" | "customPrice", value: number) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    if (!selectedCustomerId) return alert("Selecciona un cliente");
    if (selectedItems.length === 0) return alert("Agrega al menos un producto");
    
    setLoading(true);
    const items: ProformaItem[] = selectedItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      precio_unitario: item.customPrice
    }));

    const result = await saveProforma(selectedCustomerId, items, {
      descuento_valor: discountValue,
      descuento_tipo: discountType,
      dias_validez: validityDays
    });
    setLoading(false);

    if (result.success && result.proformaId) {
      setSuccess({ id: result.proformaId, num: result.numero! });
    } else {
      alert(result.error);
    }
  };

  const shareWhatsApp = () => {
    if (!selectedCustomer) return;
    const msg = `Hola ${selectedCustomer.nombre_facturacion}, te envío el resumen de tu proforma de ${COMPANY_NAME}:\n\n` +
      `Items: ${selectedItems.length}\n` +
      `Total a pagar: $${financialTotals.total.toFixed(2)}\n\n` +
      `Estamos a tu disposición.`;
    const phone = selectedCustomer.phone || selectedCustomer.telefono || "";
    const cleanPhone = phone.replace(/\D/g, "");
    const url = `https://api.whatsapp.com/send?phone=593${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Filtros de búsqueda
  const filteredCustomers = customers.filter(c => 
    (c.nombre_facturacion || "").toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.numero_documento || "").toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (success) {
    return (
      <div className="card p-10 flex flex-col items-center justify-center text-center space-y-6 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold">¡Proforma Emitida!</h2>
          <p className="text-muted-foreground text-lg">La proforma <span className="font-bold text-foreground">{success.num}</span> se ha guardado correctamente.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <PDFDownloadButton 
            proformaId={success.id} 
            documentNumber={success.num} 
            variant="full" 
          />
          <button onClick={shareWhatsApp} className="btn-secondary gap-2 px-6 border-success/30 text-success hover:bg-success/5">
            <Smartphone size={18} /> Enviar WhatsApp
          </button>
          <button onClick={() => window.location.reload()} className="btn-primary gap-2 px-8">
            <Plus size={18} /> Nueva Proforma
          </button>
        </div>
        
        <button 
          onClick={() => router.push("/admin/ventas/proformas")}
          className="text-sm text-muted-foreground hover:text-primary transition-colors pt-4 flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-start">
      
      {/* ── SECTOR IZQUIERDO: CLIENTE Y PRODUCTOS ── */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Selección de Cliente */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold flex items-center gap-2">
              <User size={18} className="text-primary" />
              Información del Cliente
            </h3>
            <button 
              onClick={() => setIsQuickCustomerModalOpen(true)}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              <UserPlus size={14} /> Nuevo rápido
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar cliente por nombre o CI/RUC..."
              className="input pl-10 h-11"
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setShowCustomerResults(true);
              }}
              onFocus={() => setShowCustomerResults(true)}
            />
            
            {showCustomerResults && customerSearch.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-card border rounded-b-xl shadow-xl mt-1 max-h-60 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomerId(c.id);
                        setCustomerSearch(c.nombre_facturacion || c.company_name || "");
                        setShowCustomerResults(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b last:border-0 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-sm">{c.nombre_facturacion || c.company_name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.tax_id || c.numero_documento}</p>
                      </div>
                      <Plus size={14} className="text-primary opacity-0 group-hover:opacity-100" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No se encontraron clientes.</div>
                )}
              </div>
            )}
          </div>

          {selectedCustomer && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                {selectedCustomer.is_company ? <Building2 size={20} /> : <User size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground">{selectedCustomer.nombre_facturacion || selectedCustomer.company_name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1 font-mono"><FileText size={12} /> {selectedCustomer.tax_id || selectedCustomer.numero_documento}</span>
                  <span className="flex items-center gap-1"><Mail size={12} /> {selectedCustomer.email}</span>
                  <span className="flex items-center gap-1"><Smartphone size={12} /> {selectedCustomer.phone || selectedCustomer.telefono}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabla de Ítems */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
            <h3 className="font-display font-bold flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" />
              Detalle de Productos / Servicios
            </h3>
            
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Añadir producto..."
                className="input h-9 text-xs pl-8"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductResults(true);
                }}
              />
              <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={14} />
              
              {showProductResults && productSearch.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-20 bg-card border rounded-b-xl shadow-2xl mt-1 max-h-60 overflow-y-auto w-80">
                  {filteredProducts.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => addItem(p)}
                      className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b last:border-0 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-xs">{p.name}</p>
                        <p className="text-[10px] text-primary font-bold">Coste: ${p.price}</p>
                      </div>
                      <Plus size={14} className="text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Detalle</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Cantidad</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">P. Unitario</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Subtotal</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-muted/10 transition-colors animate-fade-in text-sm">
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="number" 
                          className="w-16 text-center bg-muted/30 border-0 rounded-md py-1"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-muted-foreground">$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            className="w-24 text-right bg-muted/30 border-0 rounded-md py-1 font-semibold"
                            value={item.customPrice}
                            onChange={(e) => updateItem(item.id, "customPrice", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ${(item.quantity * item.customPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground opacity-50 italic">
                      No has agregado ítems a la proforma aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── SECTOR DERECHO: TOTALES Y ACCIONES ── */}
      <div className="space-y-6">
        <div className="card p-6 space-y-6 sticky top-6">
          <div className="border-b pb-4">
            <h3 className="font-display font-bold text-lg">{COMPANY_NAME}</h3>
            <p className="text-xs text-muted-foreground">Emisión de Documento No Vinculante</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${financialTotals.subtotal.toFixed(2)}</span>
            </div>

            {/* Configuración de Descuento */}
            <div className="space-y-2 pt-2 border-t border-dashed">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Descuento</span>
                <div className="flex bg-muted rounded-lg p-0.5">
                  <button 
                    onClick={() => setDiscountType('fixed')}
                    className={`px-2 py-1 text-[10px] rounded-md transition-all ${discountType === 'fixed' ? 'bg-white shadow-sm font-bold text-primary' : 'text-muted-foreground'}`}
                  >
                    $
                  </button>
                  <button 
                    onClick={() => setDiscountType('percentage')}
                    className={`px-2 py-1 text-[10px] rounded-md transition-all ${discountType === 'percentage' ? 'bg-white shadow-sm font-bold text-primary' : 'text-muted-foreground'}`}
                  >
                    %
                  </button>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  min={0}
                  className="input h-9 text-right pr-8 text-sm font-bold"
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                  {discountType === 'fixed' ? '$' : '%'}
                </span>
              </div>
              {financialTotals.discountTotal > 0 && (
                <div className="flex justify-between items-center text-xs text-success font-medium">
                  <span>Ahorro para el cliente</span>
                  <span>-${financialTotals.discountTotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Configuración de Validez */}
            <div className="space-y-2 pt-2 border-t border-dashed">
              <label className="text-xs font-bold text-muted-foreground uppercase">Días de Validez</label>
              <select 
                className="input h-9 text-sm"
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value))}
              >
                <option value={5}>5 días</option>
                <option value={10}>10 días</option>
                <option value={15}>15 días</option>
                <option value={30}>30 días</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed">
              <span className="text-muted-foreground">IVA (0%)</span>
              <span className="font-semibold">${financialTotals.tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-display font-bold text-xl uppercase tracking-tighter">Total</span>
              <span className="font-display font-black text-3xl text-primary">${financialTotals.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button 
              onClick={handleSave}
              disabled={loading || selectedItems.length === 0}
              className="btn-primary w-full h-12 gap-2 text-md"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Guardar Proforma
            </button>
          </div>
          
          <p className="text-[10px] text-center text-muted-foreground px-4">
            Al guardar, se asignará un número correlativo y se registrará en el historial de ventas.
          </p>
        </div>
      </div>

      {/* ── MODAL NUEVO CLIENTE RÁPIDO ── */}
      {isQuickCustomerModalOpen && (
        <QuickCustomerModal 
          onClose={() => setIsQuickCustomerModalOpen(false)} 
          onSuccess={(id, name) => {
            setCustomers(prev => [...prev, { id, nombre_facturacion: name, email: "", tax_id: "" } as Customer]);
            setSelectedCustomerId(id);
            setCustomerSearch(name);
            setIsQuickCustomerModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function QuickCustomerModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (id: string, name: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    nombre_facturacion: "",
    email: "",
    numero_documento: "",
    tipo_documento: "CI",
    telefono: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await quickCreateCustomer(data);
    setLoading(false);
    if (result.success && result.customerId) {
      onSuccess(result.customerId, data.nombre_facturacion);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 space-y-6 animate-scale-in">
        <h3 className="text-xl font-display font-bold">Registro Rápido de Cliente</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Nombre / Razón Social</label>
            <input required type="text" className="input text-sm" value={data.nombre_facturacion} onChange={e => setData({...data, nombre_facturacion: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Tipo Doc</label>
              <select className="input text-sm" value={data.tipo_documento} onChange={e => setData({...data, tipo_documento: e.target.value})}>
                <option value="CI">Cédula</option>
                <option value="RUC">RUC</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Número Doc</label>
              <input required type="text" className="input text-sm" value={data.numero_documento} onChange={e => setData({...data, numero_documento: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
            <input required type="email" className="input text-sm" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Teléfono</label>
            <input required type="text" className="input text-sm" value={data.telefono} onChange={e => setData({...data, telefono: e.target.value})} />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
