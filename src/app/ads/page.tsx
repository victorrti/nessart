import { Metadata } from "next";
import AdsLanding from "@/components/AdsLanding";
import { dbGetPlanos, Plano } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Sua Marca com Alma — Nessart Design",
  description: "Identidade visual que faz sua marca ser lembrada. Escolha seu plano e comece hoje.",
  openGraph: {
    title: "Sua Marca com Alma — Nessart Design",
    description: "Identidade visual que faz sua marca ser lembrada.",
    type: "website",
  },
};

export default async function AdsPage() {
  let planos: Plano[] = [];
  try {
    planos = await dbGetPlanos();
  } catch (e) {
    console.error("[ads] erro ao carregar planos:", e);
  }

  return <AdsLanding planos={planos} />;
}
