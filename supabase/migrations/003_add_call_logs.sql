-- Migration: Add call logs table for Twilio phone calls
-- This stores all incoming/outgoing calls and their details

-- Call logs table
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Twilio identifiers
  call_sid TEXT UNIQUE NOT NULL,
  parent_call_sid TEXT,
  
  -- Call details
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'initiated',
  
  -- Timing
  started_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration INTEGER, -- in seconds
  
  -- Recording
  recording_url TEXT,
  recording_duration INTEGER,
  transcription TEXT,
  
  -- AI interaction
  ai_handled BOOLEAN DEFAULT false,
  tools_used TEXT[], -- Array of tool names used during call
  conversation_summary TEXT,
  
  -- Outcome
  appointment_created BOOLEAN DEFAULT false,
  callback_requested BOOLEAN DEFAULT false,
  transferred_to_human BOOLEAN DEFAULT false,
  
  -- Metadata
  caller_name TEXT,
  caller_email TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_call_logs_business ON call_logs(business_id);
CREATE INDEX idx_call_logs_call_sid ON call_logs(call_sid);
CREATE INDEX idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX idx_call_logs_status ON call_logs(status);
CREATE INDEX idx_call_logs_from_number ON call_logs(from_number);

-- RLS policies
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Users can view calls for their business
CREATE POLICY "Users can view call logs for their business"
  ON call_logs
  FOR SELECT
  USING (
    business_id IN (
      SELECT business_id 
      FROM business_members 
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert call logs for their business
CREATE POLICY "Users can insert call logs for their business"
  ON call_logs
  FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT business_id 
      FROM business_members 
      WHERE user_id = auth.uid()
    )
  );

-- Users can update call logs for their business
CREATE POLICY "Users can update call logs for their business"
  ON call_logs
  FOR UPDATE
  USING (
    business_id IN (
      SELECT business_id 
      FROM business_members 
      WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_call_log_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_call_logs_updated_at
  BEFORE UPDATE ON call_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_call_log_updated_at();

-- Add call_logs table to database types
COMMENT ON TABLE call_logs IS 'Stores all phone call logs from Twilio integration';
