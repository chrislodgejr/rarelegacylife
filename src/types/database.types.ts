export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Generated Supabase types should replace this placeholder after the first
// project is linked:
// npx supabase gen types typescript --project-id "$PROJECT_ID" > src/types/database.types.ts
export type Database = Record<string, never>;
