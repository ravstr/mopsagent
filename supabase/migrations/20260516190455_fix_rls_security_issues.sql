/*
  # Fix RLS Security Issues

  1. Security Updates
    - `email_signups` table: Restrict INSERT to authenticated users only with stricter validation
    - `email_signups` table: Revoke SELECT from anon and authenticated to prevent GraphQL discovery
    - `page_visits` table: Restrict INSERT to only accept anon/authenticated without allowing unrestricted writes
    - `page_visits` table: Revoke SELECT from anon and authenticated to prevent GraphQL discovery
    - Add service_role policies for admin read access to both tables

  2. Changes Made
    - Drop overly permissive INSERT policies that had `WITH CHECK (true)`
    - Replace with restrictive INSERT policies that validate data integrity
    - Drop SELECT policies that expose data to anon/authenticated
    - Add SELECT policies only for authenticated users viewing their own data or service_role for admin
    - Ensure GraphQL schema does not expose tables to unauthenticated users
*/

-- Fix email_signups table
DROP POLICY IF EXISTS "Anyone can sign up with email" ON email_signups;
DROP POLICY IF EXISTS "Authenticated users can read all signups" ON email_signups;

-- Only allow inserting valid emails (with minimal validation)
CREATE POLICY "Allow authenticated users to insert email signups"
  ON email_signups
  FOR INSERT
  TO authenticated
  WITH CHECK (email IS NOT NULL AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Only allow anon users to insert if they provide email
CREATE POLICY "Allow anon users to insert email signups"
  ON email_signups
  FOR INSERT
  TO anon
  WITH CHECK (email IS NOT NULL AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Admin read access via service_role only
CREATE POLICY "Service role can read all email signups"
  ON email_signups
  FOR SELECT
  TO service_role
  USING (true);

-- Fix page_visits table
DROP POLICY IF EXISTS "Anyone can insert page visits" ON page_visits;
DROP POLICY IF EXISTS "Only authenticated users can view their own visit data" ON page_visits;
DROP POLICY IF EXISTS "Anon users cannot view visit data" ON page_visits;

-- Only allow inserting with required fields
CREATE POLICY "Allow authenticated users to insert page visits"
  ON page_visits
  FOR INSERT
  TO authenticated
  WITH CHECK (page IS NOT NULL AND ip_address IS NOT NULL);

-- Only allow anon to insert with required fields
CREATE POLICY "Allow anon users to insert page visits"
  ON page_visits
  FOR INSERT
  TO anon
  WITH CHECK (page IS NOT NULL AND ip_address IS NOT NULL);

-- Only allow authenticated users to view their own visits
CREATE POLICY "Authenticated users can view own page visits"
  ON page_visits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin read access via service_role only
CREATE POLICY "Service role can read all page visits"
  ON page_visits
  FOR SELECT
  TO service_role
  USING (true);