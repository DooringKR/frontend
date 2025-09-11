import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 안전성을 위한 클라이언트 (선택사항)
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}
