"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart, CartItem } from "@/components/providers/CartProvider";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Omit<CartItem, "quantity"> }) {
  const { addToCart, openDrawer } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    openDrawer(); // Abrir carrito lateral
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-lg transition-all ${
        added
          ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
          : "btn-primary hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {added ? (
        <>
          <Check size={22} />
          ¡Añadido!
        </>
      ) : (
        <>
          <ShoppingCart size={22} />
          Añadir al carrito
        </>
      )}
    </button>
  );
}
