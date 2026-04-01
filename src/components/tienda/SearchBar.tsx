"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";

type Props = {
  initialValue?: string;
};

export function SearchBar({ initialValue = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync if the URL param changes externally (e.g. back button) */
  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  const navigate = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("search", query.trim());
      } else {
        params.delete("search");
      }
      // Reset pagination when search changes
      params.delete("page");
      setIsPending(true);
      router.push(`/tienda?${params.toString()}`);
      // Pending state clears when the page re-renders, but we'll fake a timeout
      setTimeout(() => setIsPending(false), 600);
    },
    [router, searchParams]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate(q);
    }, 380);
  };

  const handleClear = () => {
    setValue("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate(value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 1rem",
          borderRadius: "0.875rem",
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "hsl(var(--primary) / 0.6)";
          el.style.boxShadow = "0 0 0 3px hsl(var(--primary) / 0.1)";
        }}
        onBlur={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "hsl(var(--border))";
          el.style.boxShadow = "none";
        }}
      >
        {isPending ? (
          <Loader2
            size={17}
            style={{
              color: "hsl(var(--primary))",
              flexShrink: 0,
              animation: "spin 0.7s linear infinite",
            }}
          />
        ) : (
          <Search
            size={17}
            style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }}
          />
        )}

        <input
          type="search"
          autoComplete="off"
          placeholder="Buscar productos..."
          value={value}
          onChange={handleChange}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "0.9375rem",
            color: "hsl(var(--foreground))",
            minWidth: 0,
          }}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "0.125rem",
              borderRadius: "50%",
              color: "hsl(var(--muted-foreground))",
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Invisible submit for Enter key */}
      <button type="submit" style={{ display: "none" }} />
    </form>
  );
}
