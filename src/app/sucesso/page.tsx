import Link from "next/link";

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-[#f0ebe0] flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-lg">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="font-display text-wine-800 text-5xl font-light mb-4">
          Que alegria!
        </h1>
        <p className="font-body text-[#3a1a1a]/70 text-lg leading-relaxed mb-8">
          Seu pagamento foi confirmado com sucesso. Em breve você receberá o briefing por
          e-mail para iniciarmos sua jornada de identidade visual.
        </p>
        <p className="font-body text-wine-600/70 text-sm mb-10">
          📬 Fique de olho na sua caixa de entrada e no WhatsApp!
        </p>
        <p className="font-display text-wine-500/60 italic text-2xl">— Nessart Design</p>
      </div>
    </div>
  );
}
