import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/medicamentos/venta-bajo-receta',
        destination: '/reservas',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
