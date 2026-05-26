declare global {
  interface RuntimeEnv {
    NEXTJS_ENV?: 'development' | 'production'
    NEXT_PUBLIC_SITE_URL?: string
    NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER?: string
    WHATSAPP_WEBHOOK_VERIFY_TOKEN?: string
    WHATSAPP_ACCESS_TOKEN?: string
    WHATSAPP_GRAPH_API_VERSION?: string
    WHATSAPP_PHONE_NUMBER_ID?: string
    WHATSAPP_ORDER_RECIPIENT_PHONE_NUMBER?: string
    WHATSAPP_ORDER_TEMPLATE_NAME?: string
    WHATSAPP_ORDER_TEMPLATE_LANGUAGE?: string
  }
  namespace NodeJS {
    interface ProcessEnv extends RuntimeEnv {
      NODE_ENV?: 'development' | 'production' | 'test'
    }
  }
}

export {}
