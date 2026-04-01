import { createClient } from "@/lib/supabase/server";
import { Plus, FileText, Download, Smartphone, Search } from "lucide-react";
import Link from "next/link";
import { Proforma, Customer } from "@/types/database";
import { PDFDownloadButton } from "@/components/admin/shared/PDFDownloadButton";

export default async function ProformasPage() {
  const supabase = await createClient();

  // Obtener proformas con datos del cliente
  const { data: proformas } = await supabase
    .from("proformas")
    .select(`
      *,
      customers (
        nombre_facturacion,
        company_name,
        tax_id,
        numero_documento
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Historial de Proformas</h1>
          <p className="text-sm text-muted-foreground">Gestiona y consulta los presupuestos emitidos.</p>
        </div>
        <Link href="/admin/ventas/proformas/nueva" className="btn-primary gap-2">
          <Plus size={18} /> Emitir Proforma
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="table-wrapper border-0 rounded-none">
          <table className="table w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Número</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {proformas && proformas.length > 0 ? (
                proformas.map((prof: any) => (
                  <tr key={prof.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-primary" />
                        <span className="font-mono text-xs font-bold">{prof.numero_proforma}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{prof.customers?.nombre_facturacion || prof.customers?.company_name || 'Desconocido'}</p>
                      <p className="text-[10px] text-muted-foreground">{prof.customers?.tax_id || prof.customers?.numero_documento || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(prof.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-display font-bold text-primary">
                      ${Number(prof.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <PDFDownloadButton 
                          proformaId={prof.id} 
                          documentNumber={prof.numero_proforma} 
                        />
                        <button disabled className="p-2 text-muted-foreground/30" title="Editar (Próximamente)">
                          <FileText size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground opacity-50">
                    No se han emitido proformas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
