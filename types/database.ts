export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_at_price: number | null
          cost_price: number | null
          sku: string | null
          barcode: string | null
          category_id: string | null
          image_url: string | null
          image_urls: string[] | null
          stock_quantity: number
          track_inventory: boolean
          is_active: boolean
          is_featured: boolean
          display_order: number
          weight: number | null
          dimensions: Json | null
          tags: string[] | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          category_id?: string | null
          image_url?: string | null
          image_urls?: string[] | null
          stock_quantity?: number
          track_inventory?: boolean
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          weight?: number | null
          dimensions?: Json | null
          tags?: string[] | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          category_id?: string | null
          image_url?: string | null
          image_urls?: string[] | null
          stock_quantity?: number
          track_inventory?: boolean
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          weight?: number | null
          dimensions?: Json | null
          tags?: string[] | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      whatsapp_messages: {
        Row: {
          id: string
          wa_message_id: string | null
          wa_from: string | null
          wa_to: string | null
          profile_name: string | null
          message_type: string | null
          message_text: string | null
          raw: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          wa_message_id?: string | null
          wa_from?: string | null
          wa_to?: string | null
          profile_name?: string | null
          message_type?: string | null
          message_text?: string | null
          raw?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          wa_message_id?: string | null
          wa_from?: string | null
          wa_to?: string | null
          profile_name?: string | null
          message_type?: string | null
          message_text?: string | null
          raw?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type WhatsAppMessage = Database['public']['Tables']['whatsapp_messages']['Row']
export type WhatsAppMessageInsert = Database['public']['Tables']['whatsapp_messages']['Insert']
export type WhatsAppMessageUpdate = Database['public']['Tables']['whatsapp_messages']['Update']

// Extended types with relations
export type ProductWithCategory = Product & {
  category: Category | null
}

export type CategoryWithProducts = Category & {
  products?: Product[]
}



