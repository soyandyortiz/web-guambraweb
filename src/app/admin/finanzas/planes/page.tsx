import { getSubscriptionPlans } from "@/app/actions/subscription-plans";
import { PlanesTable } from "@/components/admin/finanzas/PlanesTable";

export const dynamic = "force-dynamic";

export default async function PlanesAdminPage() {
  const initialPlans = await getSubscriptionPlans();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-display font-bold">Planes de Suscripción</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona los planes disponibles para tus clientes y proyectos.
        </p>
      </div>

      <PlanesTable initialData={initialPlans} />
    </div>
  );
}
