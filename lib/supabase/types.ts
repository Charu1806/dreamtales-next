export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      child_personas: {
        Row: {
          age: number
          created_at: string
          fears: string | null
          fondness: string | null
          id: string
          language: string
          name: string
          photo_url: string | null
          story_preference: string
          storyline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          created_at?: string
          fears?: string | null
          fondness?: string | null
          id?: string
          language?: string
          name: string
          photo_url?: string | null
          story_preference?: string
          storyline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          created_at?: string
          fears?: string | null
          fondness?: string | null
          id?: string
          language?: string
          name?: string
          photo_url?: string | null
          story_preference?: string
          storyline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          created_at: string
          id: string
          pages_json: Json | null
          persona_id: string
          story_text: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pages_json?: Json | null
          persona_id: string
          story_text?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pages_json?: Json | null
          persona_id?: string
          story_text?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "child_personas"
            referencedColumns: ["id"]
          },
        ]
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
