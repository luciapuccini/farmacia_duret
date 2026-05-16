declare global {
  interface CloudflareEnv {
    CONTENTFUL_SPACE_ID: string
    CONTENTFUL_DELIVERY_TOKEN: string
    CONTENTFUL_ENVIRONMENT?: string
    WHATSAPP_WEBHOOK_VERIFY_TOKEN?: string
    WHATSAPP_ACCESS_TOKEN?: string
    WHATSAPP_PHONE_NUMBER_ID?: string
    WHATSAPP_BUSINESS_ACCOUNT_ID?: string
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER?: string
      WHATSAPP_WEBHOOK_VERIFY_TOKEN?: string
      WHATSAPP_ACCESS_TOKEN?: string
      WHATSAPP_PHONE_NUMBER_ID?: string
      WHATSAPP_BUSINESS_ACCOUNT_ID?: string
    }
  }
}

export {}
