/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Garante que variáveis de servidor ficam disponíveis nas API routes
  serverRuntimeConfig: {
    ASAAS_API_KEY:     process.env.ASAAS_API_KEY,
    ASAAS_ENV:         process.env.ASAAS_ENV,
    PAYMENT_PROVIDER:  process.env.PAYMENT_PROVIDER,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    ADMIN_SECRET:      process.env.ADMIN_SECRET,
    NGROK_AUTH_TOKEN:  process.env.NGROK_AUTH_TOKEN,
  },
}

module.exports = nextConfig
