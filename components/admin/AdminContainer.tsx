import type { ReactNode } from "react";

/**
 * Container con padding y max-width para las páginas del admin que no son
 * full-bleed (todas menos el editor de páginas).
 */
export default function AdminContainer({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">{children}</div>
  );
}
