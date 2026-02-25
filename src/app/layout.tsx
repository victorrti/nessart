import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sua Marca com Alma | Nessart Design",
  description:
    "Criação de identidade visual com estratégia, empatia e criatividade. Sua essência traduzida em cada detalhe.",
  openGraph: {
    title: "Sua Marca com Alma | Nessart Design",
    description: "Identidade visual que representa quem você realmente é.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-[#0a0404] text-cream-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
