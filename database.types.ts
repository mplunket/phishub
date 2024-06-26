export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artist: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string
          created_by: string
          facebook: string | null
          id: number
          instagram: string | null
          name: string
          photo: string | null
          slug: string
          state: string | null
          twitter: string | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          facebook?: string | null
          id?: number
          instagram?: string | null
          name: string
          photo?: string | null
          slug: string
          state?: string | null
          twitter?: string | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          facebook?: string | null
          id?: number
          instagram?: string | null
          name?: string
          photo?: string | null
          slug?: string
          state?: string | null
          twitter?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          bio: string | null
          created_at: string
          id: number
          photo: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: number
          photo?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: number
          photo?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      show: {
        Row: {
          artist_id: number | null
          artist_name: string | null
          city: string | null
          country: string | null
          created_at: string
          created_at_phish_net: string | null
          created_by: string
          exclude_from_stats: boolean | null
          id: number
          permalink: string | null
          setlist_notes: string | null
          showdate: string | null
          showday: number | null
          showmonth: number | null
          showyear: number | null
          state: string | null
          tour_name: string | null
          tourid: number | null
          updated_at_phish_net: string | null
          venue_id: number | null
          venue_name: string | null
        }
        Insert: {
          artist_id?: number | null
          artist_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_at_phish_net?: string | null
          created_by?: string
          exclude_from_stats?: boolean | null
          id?: number
          permalink?: string | null
          setlist_notes?: string | null
          showdate?: string | null
          showday?: number | null
          showmonth?: number | null
          showyear?: number | null
          state?: string | null
          tour_name?: string | null
          tourid?: number | null
          updated_at_phish_net?: string | null
          venue_id?: number | null
          venue_name?: string | null
        }
        Update: {
          artist_id?: number | null
          artist_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_at_phish_net?: string | null
          created_by?: string
          exclude_from_stats?: boolean | null
          id?: number
          permalink?: string | null
          setlist_notes?: string | null
          showdate?: string | null
          showday?: number | null
          showmonth?: number | null
          showyear?: number | null
          state?: string | null
          tour_name?: string | null
          tourid?: number | null
          updated_at_phish_net?: string | null
          venue_id?: number | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "show_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "show_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "show_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venue"
            referencedColumns: ["id"]
          },
        ]
      }
      song: {
        Row: {
          abbr: string | null
          artist_id: number | null
          artist_name: string | null
          created_at: string
          created_by: string
          debut: string | null
          debut_permalink: string | null
          gap: number | null
          id: number
          last_permalink: string | null
          last_played: string | null
          slug: string
          song_name: string
          times_played: number | null
        }
        Insert: {
          abbr?: string | null
          artist_id?: number | null
          artist_name?: string | null
          created_at?: string
          created_by?: string
          debut?: string | null
          debut_permalink?: string | null
          gap?: number | null
          id?: number
          last_permalink?: string | null
          last_played?: string | null
          slug: string
          song_name: string
          times_played?: number | null
        }
        Update: {
          abbr?: string | null
          artist_id?: number | null
          artist_name?: string | null
          created_at?: string
          created_by?: string
          debut?: string | null
          debut_permalink?: string | null
          gap?: number | null
          id?: number
          last_permalink?: string | null
          last_played?: string | null
          slug?: string
          song_name?: string
          times_played?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "song_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tab: {
        Row: {
          content: string | null
          created_at: string
          id: number
          instrument: Database["public"]["Enums"]["instrument"]
          song_id: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          instrument: Database["public"]["Enums"]["instrument"]
          song_id: number
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          instrument?: Database["public"]["Enums"]["instrument"]
          song_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tab_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "song"
            referencedColumns: ["id"]
          },
        ]
      }
      venue: {
        Row: {
          alias: number | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string
          id: number
          short_name: string | null
          state: string | null
          venue_name: string
          venue_notes: string | null
        }
        Insert: {
          alias?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          id?: number
          short_name?: string | null
          state?: string | null
          venue_name: string
          venue_notes?: string | null
        }
        Update: {
          alias?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          id?: number
          short_name?: string | null
          state?: string | null
          venue_name?: string
          venue_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
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
      instrument: "guitar" | "bass" | "keys" | "drums"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
