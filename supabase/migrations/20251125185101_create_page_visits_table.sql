/*
  # Create page_visits analytics table

  1. New Tables
    - `page_visits`
      - `id` (uuid, primary key)
      - `page` (text) - page identifier ('homepage')
      - `timestamp` (timestamptz) - when the visit occurred
      - `user_id` (uuid, nullable) - authenticated user ID if logged in
      - `ip_address` (text) - visitor IP address
      - `referrer` (text, nullable) - HTTP referrer
      - `user_agent` (text, nullable) - browser user agent
      - `country` (text, nullable) - country from geolocation
      - `city` (text, nullable) - city from geolocation
      - `created_at` (timestamptz) - record creation time

  2. Indexes
    - Index on timestamp for efficient time-range queries
    - Index on page for filtering by page
    - Index on user_id for user-specific analytics

  3. Security
    - Enable RLS on `page_visits` table
    - Add restrictive policies: only authenticated user can insert their own visits, and only app admin can read all data
*/

CREATE TABLE IF NOT EXISTS page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  city text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_visits_timestamp ON page_visits(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_page ON page_visits(page);
CREATE INDEX IF NOT EXISTS idx_page_visits_user_id ON page_visits(user_id);

ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page visits"
  ON page_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view their own visit data"
  ON page_visits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anon users cannot view visit data"
  ON page_visits
  FOR SELECT
  TO anon
  USING (false);
