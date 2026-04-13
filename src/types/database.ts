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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assets_it: {
        Row: {
          domain_name: string | null
          hosting_provider: string | null
          id: string
          project_id: string | null
          renewal_date: string | null
          tech_stack: Json | null
        }
        Insert: {
          domain_name?: string | null
          hosting_provider?: string | null
          id?: string
          project_id?: string | null
          renewal_date?: string | null
          tech_stack?: Json | null
        }
        Update: {
          domain_name?: string | null
          hosting_provider?: string | null
          id?: string
          project_id?: string | null
          renewal_date?: string | null
          tech_stack?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_it_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      bio_blocks: {
        Row: {
          bg_color: string | null
          clicks: number
          content: string | null
          created_at: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          subtitle: string | null
          text_color: string | null
          title: string | null
          type: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          bg_color?: string | null
          clicks?: number
          content?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          text_color?: string | null
          title?: string | null
          type: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          bg_color?: string | null
          clicks?: number
          content?: string | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          text_color?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      bio_links: {
        Row: {
          bg_color: string | null
          clicks: number | null
          created_at: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          text_color: string | null
          title: string
          url: string
        }
        Insert: {
          bg_color?: string | null
          clicks?: number | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          text_color?: string | null
          title: string
          url: string
        }
        Update: {
          bg_color?: string | null
          clicks?: number | null
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          text_color?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      bio_page_visits: {
        Row: {
          id: string
          referrer: string | null
          user_agent: string | null
          visited_at: string | null
        }
        Insert: {
          id?: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string | null
        }
        Update: {
          id?: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string | null
        }
        Relationships: []
      }
      bio_portfolio: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          project_type: string | null
          sort_order: number | null
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          project_type?: string | null
          sort_order?: number | null
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          project_type?: string | null
          sort_order?: number | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      bio_profile: {
        Row: {
          avatar_url: string | null
          cover_color: string | null
          description: string | null
          id: number
          name: string
          social_facebook: string | null
          social_instagram: string | null
          social_tiktok: string | null
          social_x: string | null
          social_youtube: string | null
          social_website: string | null
          tagline: string | null
          template: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cover_color?: string | null
          description?: string | null
          id?: number
          name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          social_x?: string | null
          social_youtube?: string | null
          social_website?: string | null
          tagline?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cover_color?: string | null
          description?: string | null
          id?: number
          name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_tiktok?: string | null
          social_x?: string | null
          social_youtube?: string | null
          social_website?: string | null
          tagline?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_percent: number | null
          id: string
          is_active: boolean | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          valid_until?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          is_company: boolean | null
          nombre_facturacion: string | null
          numero_documento: string | null
          phone: string | null
          profile_id: string | null
          province: string | null
          tax_id: string | null
          telefono: string | null
          tipo_documento: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          is_company?: boolean | null
          nombre_facturacion?: string | null
          numero_documento?: string | null
          phone?: string | null
          profile_id?: string | null
          province?: string | null
          tax_id?: string | null
          telefono?: string | null
          tipo_documento?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          is_company?: boolean | null
          nombre_facturacion?: string | null
          numero_documento?: string | null
          phone?: string | null
          profile_id?: string | null
          province?: string | null
          tax_id?: string | null
          telefono?: string | null
          tipo_documento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          whatsapp?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          delivery_date: string | null
          id: string
          is_completed: boolean | null
          project_id: string | null
          title: string
        }
        Insert: {
          delivery_date?: string | null
          id?: string
          is_completed?: boolean | null
          project_id?: string | null
          title: string
        }
        Update: {
          delivery_date?: string | null
          id?: string
          is_completed?: boolean | null
          project_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number | null
          unit_price: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string
          customer_id: string | null
          discount_amount: number | null
          id: string
          metadata: Json | null
          metodo_pago_manual: string | null
          order_type: string | null
          payment_id: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          total_amount: number
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          metadata?: Json | null
          metodo_pago_manual?: string | null
          order_type?: string | null
          payment_id?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_amount: number
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          metadata?: Json | null
          metodo_pago_manual?: string | null
          order_type?: string | null
          payment_id?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          position: number | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          position?: number | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          position?: number | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          features: Json | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          name: string
          price: number
          technologies: Json | null
          versions: Json | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          name: string
          price: number
          technologies?: Json | null
          versions?: Json | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          name?: string
          price?: number
          technologies?: Json | null
          versions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      proforma_detalles: {
        Row: {
          cantidad: number
          created_at: string
          id: string
          precio_unitario: number
          product_id: string
          proforma_id: string
          subtotal: number
        }
        Insert: {
          cantidad: number
          created_at?: string
          id?: string
          precio_unitario: number
          product_id: string
          proforma_id: string
          subtotal: number
        }
        Update: {
          cantidad?: number
          created_at?: string
          id?: string
          precio_unitario?: number
          product_id?: string
          proforma_id?: string
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "proforma_detalles_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proforma_detalles_proforma_id_fkey"
            columns: ["proforma_id"]
            isOneToOne: false
            referencedRelation: "proformas"
            referencedColumns: ["id"]
          },
        ]
      }
      proformas: {
        Row: {
          created_at: string
          customer_id: string
          descuento_tipo: string | null
          descuento_total: number | null
          descuento_valor: number | null
          dias_validez: number | null
          fecha: string
          fecha_vencimiento: string | null
          id: string
          impuesto: number
          numero_proforma: string
          subtotal: number
          total: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          descuento_tipo?: string | null
          descuento_total?: number | null
          descuento_valor?: number | null
          dias_validez?: number | null
          fecha?: string
          fecha_vencimiento?: string | null
          id?: string
          impuesto?: number
          numero_proforma: string
          subtotal?: number
          total?: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          descuento_tipo?: string | null
          descuento_total?: number | null
          descuento_valor?: number | null
          dias_validez?: number | null
          fecha?: string
          fecha_vencimiento?: string | null
          id?: string
          impuesto?: number
          numero_proforma?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "proformas_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assignments: {
        Row: {
          assigned_at: string
          id: string
          profile_id: string | null
          project_id: string | null
        }
        Insert: {
          assigned_at?: string
          id?: string
          profile_id?: string | null
          project_id?: string | null
        }
        Update: {
          assigned_at?: string
          id?: string
          profile_id?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          customer_id: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          repo_url: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          repo_url?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          repo_url?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string | null
          id: string
          is_active: boolean | null
          is_auto_renew: boolean | null
          last_payment_id: string | null
          monthly_fee: number
          next_billing_date: string
          plan_name: string
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_renew?: boolean | null
          last_payment_id?: string | null
          monthly_fee: number
          next_billing_date: string
          plan_name: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          is_auto_renew?: boolean | null
          last_payment_id?: string | null
          monthly_fee?: number
          next_billing_date?: string
          plan_name?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks_kanban: {
        Row: {
          assigned_to: string | null
          column_name: Database["public"]["Enums"]["kanban_column"] | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["kanban_priority"] | null
          project_id: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          column_name?: Database["public"]["Enums"]["kanban_column"] | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["kanban_priority"] | null
          project_id?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          column_name?: Database["public"]["Enums"]["kanban_column"] | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["kanban_priority"] | null
          project_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_kanban_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_kanban_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          customer_id: string | null
          description: string
          id: string
          project_id: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          description: string
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          description?: string
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_suspend_expired_subscriptions: {
        Args: never
        Returns: undefined
      }
      check_expired_subscriptions: { Args: never; Returns: undefined }
      increment_bio_block_clicks: {
        Args: { block_id: string }
        Returns: undefined
      }
    }
    Enums: {
      kanban_column: "To Do" | "Doing" | "Done"
      kanban_priority: "low" | "medium" | "high"
      order_status:
        | "pending"
        | "paid"
        | "cancelled"
        | "pending_payment"
        | "pendiente_pago"
      project_status:
        | "design"
        | "development"
        | "qa"
        | "live"
        | "suspended"
        | "unsupervised"
      ticket_status: "open" | "in_progress" | "resolved"
      user_role: "admin" | "dev" | "client"
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
      kanban_column: ["To Do", "Doing", "Done"],
      kanban_priority: ["low", "medium", "high"],
      order_status: [
        "pending",
        "paid",
        "cancelled",
        "pending_payment",
        "pendiente_pago",
      ],
      project_status: [
        "design",
        "development",
        "qa",
        "live",
        "suspended",
        "unsupervised",
      ],
      ticket_status: ["open", "in_progress", "resolved"],
      user_role: ["admin", "dev", "client"],
    },
  },
} as const

// Convenience type aliases
export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Proforma = Database["public"]["Tables"]["proformas"]["Row"]
