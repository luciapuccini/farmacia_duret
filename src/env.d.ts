declare global {
  interface CloudflareEnv {
    TELEGRAM_BOT_TOKEN: string
    TELEGRAM_CHAT_ID: string
    CONTENTFUL_SPACE_ID: string
    CONTENTFUL_DELIVERY_TOKEN: string
    CONTENTFUL_ENVIRONMENT?: string
  }
}

export {}
