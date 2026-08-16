export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      dispute_messages: {
        Row: {
          body: string
          created_at: string
          dispute_id: string
          id: string
          sender_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          dispute_id: string
          id?: string
          sender_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          dispute_id?: string
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          created_at: string
          id: string
          opened_by: string | null
          order_id: string
          refund_amount: number | null
          resolution: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          type: Database["public"]["Enums"]["dispute_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          opened_by?: string | null
          order_id: string
          refund_amount?: number | null
          resolution?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          type: Database["public"]["Enums"]["dispute_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          opened_by?: string | null
          order_id?: string
          refund_amount?: number | null
          resolution?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          type?: Database["public"]["Enums"]["dispute_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          available: boolean
          category_en: string | null
          category_mm: string | null
          created_at: string
          desc_en: string | null
          desc_mm: string | null
          id: string
          image: string | null
          name_en: string
          name_mm: string
          price: number
          restaurant_id: string
        }
        Insert: {
          available?: boolean
          category_en?: string | null
          category_mm?: string | null
          created_at?: string
          desc_en?: string | null
          desc_mm?: string | null
          id?: string
          image?: string | null
          name_en: string
          name_mm: string
          price: number
          restaurant_id: string
        }
        Update: {
          available?: boolean
          category_en?: string | null
          category_mm?: string | null
          created_at?: string
          desc_en?: string | null
          desc_mm?: string | null
          id?: string
          image?: string | null
          name_en?: string
          name_mm?: string
          price?: number
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          actor_id: string | null
          at: string
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          actor_id?: string | null
          at?: string
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          actor_id?: string | null
          at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          menu_item_id: string | null
          name_en: string
          name_mm: string
          notes: string | null
          order_id: string
          price: number
          qty: number
        }
        Insert: {
          id?: string
          menu_item_id?: string | null
          name_en: string
          name_mm: string
          notes?: string | null
          order_id: string
          price: number
          qty: number
        }
        Update: {
          id?: string
          menu_item_id?: string | null
          name_en?: string
          name_mm?: string
          notes?: string | null
          order_id?: string
          price?: number
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          created_at: string
          customer_id: string | null
          delivery_fee: number
          distance_km: number | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone: string
          pin: Json | null
          proof_photo: string | null
          restaurant_id: string
          rider_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
        }
        Insert: {
          address: string
          created_at?: string
          customer_id?: string | null
          delivery_fee?: number
          distance_km?: number | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          phone: string
          pin?: Json | null
          proof_photo?: string | null
          restaurant_id: string
          rider_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
        }
        Update: {
          address?: string
          created_at?: string
          customer_id?: string | null
          delivery_fee?: number
          distance_km?: number | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          phone?: string
          pin?: Json | null
          proof_photo?: string | null
          restaurant_id?: string
          rider_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_leads: {
        Row: {
          business_name: string
          created_at: string
          cuisine: string | null
          id: string
          location: string | null
          message: string | null
          owner_name: string | null
          phone: string
        }
        Insert: {
          business_name: string
          created_at?: string
          cuisine?: string | null
          id?: string
          location?: string | null
          message?: string | null
          owner_name?: string | null
          phone: string
        }
        Update: {
          business_name?: string
          created_at?: string
          cuisine?: string | null
          id?: string
          location?: string | null
          message?: string | null
          owner_name?: string | null
          phone?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          lang: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          lang?: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          lang?: string
          phone?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address_en: string | null
          address_mm: string | null
          created_at: string
          cuisine_en: string | null
          cuisine_mm: string | null
          delivery_min: number | null
          id: string
          image: string | null
          is_open: boolean
          lat: number | null
          lng: number | null
          name_en: string
          name_mm: string
          owner_id: string | null
          rating: number | null
        }
        Insert: {
          address_en?: string | null
          address_mm?: string | null
          created_at?: string
          cuisine_en?: string | null
          cuisine_mm?: string | null
          delivery_min?: number | null
          id?: string
          image?: string | null
          is_open?: boolean
          lat?: number | null
          lng?: number | null
          name_en: string
          name_mm: string
          owner_id?: string | null
          rating?: number | null
        }
        Update: {
          address_en?: string | null
          address_mm?: string | null
          created_at?: string
          cuisine_en?: string | null
          cuisine_mm?: string | null
          delivery_min?: number | null
          id?: string
          image?: string | null
          is_open?: boolean
          lat?: number | null
          lng?: number | null
          name_en?: string
          name_mm?: string
          owner_id?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      rider_shifts: {
        Row: {
          last_lat: number | null
          last_lng: number | null
          online: boolean
          rider_id: string
          updated_at: string
        }
        Insert: {
          last_lat?: number | null
          last_lng?: number | null
          online?: boolean
          rider_id: string
          updated_at?: string
        }
        Update: {
          last_lat?: number | null
          last_lng?: number | null
          online?: boolean
          rider_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "owner" | "rider" | "admin"
      dispute_status: "open" | "investigating" | "resolved" | "rejected"
      dispute_type:
        | "cancelled"
        | "delayed"
        | "payment_issue"
        | "wrong_item"
        | "missing_item"
        | "other"
      order_status:
        | "placed"
        | "confirmed"
        | "preparing"
        | "ready"
        | "picked_up"
        | "delivered"
        | "cancelled"
      payment_method: "cash" | "kbzpay" | "wavepay"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "owner", "rider", "admin"],
      dispute_status: ["open", "investigating", "resolved", "rejected"],
      dispute_type: [
        "cancelled",
        "delayed",
        "payment_issue",
        "wrong_item",
        "missing_item",
        "other",
      ],
      order_status: [
        "placed",
        "confirmed",
        "preparing",
        "ready",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      payment_method: ["cash", "kbzpay", "wavepay"],
    },
  },
} as const
