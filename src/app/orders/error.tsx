"use client";

export default function OrdersError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-8">
      <h1 className="text-2xl font-semibold text-destructive">Algo salió mal</h1>
      <p className="text-muted-foreground">No se pudieron cargar los pedidos. Intentá de nuevo más tarde.</p>
    </div>
  );
}
