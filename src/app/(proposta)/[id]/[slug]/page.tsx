import { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import { dbGetClienteById, dbGetPlanosParaCliente, Plano } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: { id: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cliente = await dbGetClienteById(Number(params.id));
  if (!cliente) return {};
  return {
    title: `${cliente.nome} — Sua Marca com Alma | Nessart Design`,
    description: `${cliente.nome}, esta proposta foi criada especialmente para você.`,
  };
}

export default async function PropostaPage({ params }: Props) {
  const cliente = await dbGetClienteById(Number(params.id));
  if (!cliente || !cliente.ativa) notFound();

  let planos: Plano[] = [];
  try {
    planos = await dbGetPlanosParaCliente(cliente.id);
  } catch (e) {
    console.error("[proposta] erro ao carregar planos:", e);
  }

  return <LandingPage nomeCliente={cliente.nome} planos={planos} />;
}
