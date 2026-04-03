/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Évite /_next/image sur Vercel (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED hors forfait / crédits).
    // Les images sont servies telles quelles ; remotePatterns reste utile pour next/image + URLs Supabase.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
