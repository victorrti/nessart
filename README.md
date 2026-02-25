# 🌹 Nessart Design — Landing Page Personalizada

Sistema de landing page de alta conversão com:
- **URL personalizada** por cliente (`/ana-clara`, `/maria-fernanda`, etc.)
- **Checkout integrado** com Asaas ou Stripe
- **URL pública** via ngrok para enviar direto pelo WhatsApp
- **Painel admin** para gerar links

---

## 🚀 Setup em 5 passos

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# Escolha o provedor de pagamento
PAYMENT_PROVIDER=asaas        # ou stripe

# Asaas (recomendado para Brasil)
ASAAS_API_KEY=sua_chave_aqui
ASAAS_ENV=sandbox             # sandbox para testes, production para produção

# Stripe (alternativo)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ngrok — crie conta em ngrok.com e pegue o token
NGROK_AUTH_TOKEN=seu_token_aqui

# Senha do painel admin
ADMIN_SECRET=crie_uma_senha_forte

# WhatsApp para o botão da landing page
NEXT_PUBLIC_WHATSAPP=5521999999999
```

### 3. Iniciar o servidor
```bash
npm run dev
```

Acesse: **http://localhost:3000/admin**

### 4. Ativar ngrok (URL pública)
No painel admin em `/admin`, clique em **"Iniciar ngrok tunnel"**.

Ou via terminal separado:
```bash
npm run tunnel
```

### 5. Gerar links e enviar para clientes

No painel:
1. Digite a senha admin
2. Digite o nome da cliente
3. Clique "Gerar link personalizado"
4. Clique "Copiar mensagem WhatsApp" e envie!

---

## 🌐 Como funciona

| URL | O que faz |
|-----|-----------|
| `/admin` | Painel para gerar links |
| `/ana-clara` | Landing personalizada para "Ana Clara" |
| `/maria-fernanda-souza` | Landing para "Maria Fernanda Souza" |
| `/api/generate-link` | API para gerar slugs |
| `/api/checkout` | API de pagamento |
| `/api/webhook` | Recebe confirmações de pagamento |
| `/api/tunnel` | Gerencia o ngrok |
| `/sucesso` | Página pós-pagamento |

---

## 💳 Provedores de pagamento

### Asaas (recomendado 🇧🇷)
1. Acesse [asaas.com](https://asaas.com) e crie uma conta
2. Vá em **Configurações > Integrações > API**
3. Copie a chave e cole em `ASAAS_API_KEY`
4. Use `ASAAS_ENV=sandbox` para testes

### Stripe
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Copie a chave secreta para `STRIPE_SECRET_KEY`
3. Para webhooks: `stripe listen --forward-to localhost:3000/api/webhook`

---

## 🔔 Webhooks (confirmação de pagamento)

**Asaas:** Configure em Conta > Integrações > Webhooks:
- URL: `https://sua-url-ngrok.ngrok.io/api/webhook`

**Stripe:** Use a Stripe CLI ou configure no dashboard.

---

## 📁 Estrutura

```
src/
├── app/
│   ├── [cliente]/page.tsx     # Landing dinâmica por cliente
│   ├── admin/page.tsx         # Painel de geração de links
│   ├── sucesso/page.tsx       # Página pós-pagamento
│   └── api/
│       ├── checkout/          # Processar pagamento
│       ├── generate-link/     # Gerar URL personalizada
│       ├── tunnel/            # Gerenciar ngrok
│       └── webhook/           # Receber eventos de pagamento
├── components/
│   ├── LandingPage.tsx        # Landing completa com todas as seções
│   └── CheckoutModal.tsx      # Modal de dados + pagamento
└── lib/
    └── payment.ts             # Abstração Asaas/Stripe
```

---

## 🎨 Personalização

Para adicionar a foto real no lugar do placeholder, edite `LandingPage.tsx`:

```tsx
// Substitua o div de placeholder por:
import Image from "next/image";
<Image src="/foto-nessart.jpg" alt="Nessart" fill className="object-cover" />
```

Coloque a foto em `public/foto-nessart.jpg`.

---

*Desenvolvido com 💜 para Nessart Design*
