-- Allow service role (supabase functions/scripts) to bypass RLS for songs table
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do anything
CREATE POLICY "Service role can do anything" ON songs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
