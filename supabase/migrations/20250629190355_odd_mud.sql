/*
  # Email Signups Table

  1. New Tables
    - `email_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `created_at` (timestamp)
      - `source` (text, default 'landing_page')
      - `status` (text, default 'active')

  2. Security
    - Enable RLS on `email_signups` table
    - Add policy for public insert access (anyone can sign up)
    - Add policy for authenticated users to read all signups (admin access)

  3. Notes
    - Email addresses are unique to prevent duplicates
    - Source field tracks where the signup came from
    - Status field allows for managing active/inactive signups
*/

CREATE TABLE IF NOT EXISTS email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  source text DEFAULT 'landing_page',
  status text DEFAULT 'active'
);

ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert email signups (public access)
CREATE POLICY "Anyone can sign up with email"
  ON email_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all signups (for admin purposes)
CREATE POLICY "Authenticated users can read all signups"
  ON email_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);
CREATE INDEX IF NOT EXISTS idx_email_signups_created_at ON email_signups(created_at DESC);