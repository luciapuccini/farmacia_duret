declare global {
  interface CloudflareEnv {
    CONTENTFUL_SPACE_ID: string
    CONTENTFUL_DELIVERY_TOKEN: string
    CONTENTFUL_ENVIRONMENT?: string
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_TELEGRAM_USERNAME?: string
    }
  }
}

export {}
