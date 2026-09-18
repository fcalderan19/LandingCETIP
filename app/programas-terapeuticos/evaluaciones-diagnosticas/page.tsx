import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";

export const metadata: Metadata = { title: "CETIP" };

export default function Page() {
  return <PageRenderer slug="programas-terapeuticos/evaluaciones-diagnosticas" />;
}
