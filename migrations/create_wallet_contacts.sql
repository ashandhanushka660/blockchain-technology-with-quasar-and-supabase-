-- Migration: Create wallet_contacts table
-- Description: This table stores saved wallet addresses (contacts) for users
-- Run this migration in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS wallet_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can't add the same wallet address twice
  UNIQUE(user_id, wallet_address)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wallet_contacts_user_id ON wallet_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_contacts_favorites ON wallet_contacts(user_id, is_favorite) WHERE is_favorite = TRUE;

-- Enable Row Level Security
ALTER TABLE wallet_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only see their own contacts
CREATE POLICY "Users can view their own contacts"
  ON wallet_contacts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own contacts
CREATE POLICY "Users can insert their own contacts"
  ON wallet_contacts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own contacts
CREATE POLICY "Users can update their own contacts"
  ON wallet_contacts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own contacts
CREATE POLICY "Users can delete their own contacts"
  ON wallet_contacts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_wallet_contacts_timestamp
  BEFORE UPDATE ON wallet_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_contacts_updated_at();

-- Grant permissions
GRANT ALL ON wallet_contacts TO authenticated;
GRANT ALL ON wallet_contacts TO service_role;
