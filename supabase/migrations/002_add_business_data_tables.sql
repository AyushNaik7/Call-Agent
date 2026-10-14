-- Phase 3: Core business data tables

-- Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, phone)
);

-- Calls table
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'missed', 'voicemail', 'in-progress')),
  outcome TEXT CHECK (outcome IN ('appointment_booked', 'question_answered', 'callback_requested', 'voicemail', 'missed')),
  duration INTEGER DEFAULT 0, -- seconds
  transcript TEXT,
  summary TEXT,
  recording_url TEXT,
  twilio_call_sid TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
  notes TEXT,
  call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (Callback requests)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base entries
CREATE TABLE knowledge_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  usage_count INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  price_range TEXT,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_contacts_business_id ON contacts(business_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_calls_business_id ON calls(business_id);
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_calls_contact_id ON calls(contact_id);
CREATE INDEX idx_appointments_business_id ON appointments(business_id);
CREATE INDEX idx_appointments_date_time ON appointments(date_time);
CREATE INDEX idx_appointments_contact_id ON appointments(contact_id);
CREATE INDEX idx_messages_business_id ON messages(business_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_knowledge_business_id ON knowledge_entries(business_id);
CREATE INDEX idx_services_business_id ON services(business_id);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified for development)
-- Contacts
CREATE POLICY "view_contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "insert_contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "update_contacts" ON contacts FOR UPDATE USING (true);
CREATE POLICY "delete_contacts" ON contacts FOR DELETE USING (true);

-- Calls
CREATE POLICY "view_calls" ON calls FOR SELECT USING (true);
CREATE POLICY "insert_calls" ON calls FOR INSERT WITH CHECK (true);
CREATE POLICY "update_calls" ON calls FOR UPDATE USING (true);

-- Appointments
CREATE POLICY "view_appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "insert_appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "update_appointments" ON appointments FOR UPDATE USING (true);
CREATE POLICY "delete_appointments" ON appointments FOR DELETE USING (true);

-- Messages
CREATE POLICY "view_messages" ON messages FOR SELECT USING (true);
CREATE POLICY "insert_messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "update_messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "delete_messages" ON messages FOR DELETE USING (true);

-- Knowledge Entries
CREATE POLICY "view_knowledge" ON knowledge_entries FOR SELECT USING (true);
CREATE POLICY "insert_knowledge" ON knowledge_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "update_knowledge" ON knowledge_entries FOR UPDATE USING (true);
CREATE POLICY "delete_knowledge" ON knowledge_entries FOR DELETE USING (true);

-- Services
CREATE POLICY "view_services" ON services FOR SELECT USING (true);
CREATE POLICY "insert_services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "update_services" ON services FOR UPDATE USING (true);
CREATE POLICY "delete_services" ON services FOR DELETE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_updated_at
  BEFORE UPDATE ON knowledge_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
