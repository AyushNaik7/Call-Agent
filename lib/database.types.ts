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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          business_type: string | null
          timezone: string
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          business_type?: string | null
          timezone?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          business_type?: string | null
          timezone?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_members: {
        Row: {
          id: string
          business_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
      }
      business_settings: {
        Row: {
          id: string
          business_id: string
          ai_greeting: string | null
          ai_tone: string | null
          voice_type: string | null
          booking_enabled: boolean
          cancellation_enabled: boolean
          min_advance_hours: number
          max_advance_days: number
          buffer_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          ai_greeting?: string | null
          ai_tone?: string | null
          voice_type?: string | null
          booking_enabled?: boolean
          cancellation_enabled?: boolean
          min_advance_hours?: number
          max_advance_days?: number
          buffer_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          ai_greeting?: string | null
          ai_tone?: string | null
          voice_type?: string | null
          booking_enabled?: boolean
          cancellation_enabled?: boolean
          min_advance_hours?: number
          max_advance_days?: number
          buffer_minutes?: number
          created_at?: string
          updated_at?: string
        }
      }
      business_hours: {
        Row: {
          id: string
          business_id: string
          day_of_week: number
          is_open: boolean
          open_time: string | null
          close_time: string | null
        }
        Insert: {
          id?: string
          business_id: string
          day_of_week: number
          is_open?: boolean
          open_time?: string | null
          close_time?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          day_of_week?: number
          is_open?: boolean
          open_time?: string | null
          close_time?: string | null
        }
      }
    }
  }
}
