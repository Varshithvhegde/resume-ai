// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface UserProfile {
  email: string // Primary key
  full_name: string
  phone: string
  location: string
  linkedin: string
  github: string
  created_at?: string
  updated_at?: string
}

export interface Experience {
  id?: string
  user_email: string
  role: string
  company: string
  duration: string
  bullets: string[]
  order_index: number
  created_at?: string
}

export interface Education {
  id?: string
  user_email: string
  degree: string
  institution: string
  duration: string
  order_index: number
  created_at?: string
}

export interface Project {
  id?: string
  user_email: string
  name: string
  description: string
  order_index: number
  created_at?: string
}

export interface Skill {
  id?: string
  user_email: string
  skills: string[]
  created_at?: string
  updated_at?: string
}