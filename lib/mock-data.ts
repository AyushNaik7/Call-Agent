/**
 * Mock data for development and testing
 * This will be replaced with actual database queries in later phases
 */

export type CallStatus = "completed" | "missed" | "voicemail" | "in-progress";
export type CallOutcome = "appointment_booked" | "question_answered" | "callback_requested" | "voicemail" | "missed";
export type AppointmentStatus = "confirmed" | "pending" | "cancelled" | "completed";
export type MessageStatus = "unread" | "read" | "resolved";

export interface Call {
  id: string;
  customerName: string;
  customerPhone: string;
  status: CallStatus;
  outcome: CallOutcome;
  duration: number; // in seconds
  timestamp: Date;
  transcript?: string;
  summary?: string;
  recording?: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  dateTime: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalCalls: number;
  lastCall?: Date;
  tags: string[];
  notes?: string;
}

export interface Message {
  id: string;
  customerName: string;
  customerPhone: string;
  message: string;
  priority: "low" | "medium" | "high";
  status: MessageStatus;
  timestamp: Date;
  callId?: string;
}

export interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  lastUpdated: Date;
  usageCount: number;
}

// Mock Calls
export const mockCalls: Call[] = [
  {
    id: "call-1",
    customerName: "Sarah Johnson",
    customerPhone: "+1234567890",
    status: "completed",
    outcome: "appointment_booked",
    duration: 180,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    summary: "Customer booked a haircut appointment for tomorrow at 2 PM.",
    transcript: "AI: Hello! Thank you for calling Style Studio. How can I help you today?\nCustomer: Hi, I'd like to book a haircut.\nAI: I'd be happy to help you with that. What day works best for you?\nCustomer: Tomorrow afternoon?\nAI: I have availability at 2 PM tomorrow. Does that work?\nCustomer: Perfect!\nAI: Great! I've booked you for a haircut tomorrow at 2 PM. See you then!"
  },
  {
    id: "call-2",
    customerName: "Michael Chen",
    customerPhone: "+1234567891",
    status: "completed",
    outcome: "question_answered",
    duration: 95,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    summary: "Customer asked about business hours. Provided information.",
  },
  {
    id: "call-3",
    customerName: "Emma Williams",
    customerPhone: "+1234567892",
    status: "missed",
    outcome: "missed",
    duration: 0,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "call-4",
    customerName: "James Brown",
    customerPhone: "+1234567893",
    status: "completed",
    outcome: "callback_requested",
    duration: 45,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    summary: "Customer has a complex question about services. Requested callback from owner.",
  },
  {
    id: "call-5",
    customerName: "Lisa Anderson",
    customerPhone: "+1234567894",
    status: "voicemail",
    outcome: "voicemail",
    duration: 30,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    customerName: "Sarah Johnson",
    customerPhone: "+1234567890",
    customerEmail: "sarah.j@email.com",
    service: "Haircut",
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 60,
    status: "confirmed",
    notes: "Prefers shorter styles",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "appt-2",
    customerName: "David Martinez",
    customerPhone: "+1234567895",
    customerEmail: "david.m@email.com",
    service: "Color Treatment",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    duration: 120,
    status: "confirmed",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "appt-3",
    customerName: "Jennifer Lee",
    customerPhone: "+1234567896",
    service: "Styling",
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    duration: 90,
    status: "pending",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "appt-4",
    customerName: "Robert Taylor",
    customerPhone: "+1234567897",
    service: "Haircut",
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 45,
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: "contact-1",
    name: "Sarah Johnson",
    phone: "+1234567890",
    email: "sarah.j@email.com",
    totalCalls: 5,
    lastCall: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ["regular", "vip"],
    notes: "Loyal customer, prefers afternoon appointments",
  },
  {
    id: "contact-2",
    name: "Michael Chen",
    phone: "+1234567891",
    email: "michael.c@email.com",
    totalCalls: 2,
    lastCall: new Date(Date.now() - 4 * 60 * 60 * 1000),
    tags: ["new"],
  },
  {
    id: "contact-3",
    name: "Emma Williams",
    phone: "+1234567892",
    totalCalls: 1,
    lastCall: new Date(Date.now() - 6 * 60 * 60 * 1000),
    tags: ["new"],
  },
  {
    id: "contact-4",
    name: "David Martinez",
    phone: "+1234567895",
    email: "david.m@email.com",
    totalCalls: 8,
    lastCall: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ["regular"],
    notes: "Interested in premium services",
  },
];

// Mock Messages (Callback Requests)
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    customerName: "James Brown",
    customerPhone: "+1234567893",
    message: "Has questions about wedding party packages. Wants to discuss pricing and availability for group bookings.",
    priority: "high",
    status: "unread",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    callId: "call-4",
  },
  {
    id: "msg-2",
    customerName: "Patricia Garcia",
    customerPhone: "+1234567898",
    message: "Interested in becoming a regular client. Asked about membership options.",
    priority: "medium",
    status: "read",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "msg-3",
    customerName: "Christopher Wilson",
    customerPhone: "+1234567899",
    message: "Wants to reschedule appointment but couldn't find available time. Needs owner to call back.",
    priority: "medium",
    status: "resolved",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Mock Knowledge Base
export const mockKnowledge: KnowledgeEntry[] = [
  {
    id: "kb-1",
    question: "What are your business hours?",
    answer: "We're open Monday to Friday from 9 AM to 7 PM, and Saturday from 10 AM to 5 PM. We're closed on Sundays.",
    category: "Hours",
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    usageCount: 45,
  },
  {
    id: "kb-2",
    question: "What services do you offer?",
    answer: "We offer haircuts, styling, color treatments, highlights, balayage, keratin treatments, and special event styling.",
    category: "Services",
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    usageCount: 38,
  },
  {
    id: "kb-3",
    question: "How much does a haircut cost?",
    answer: "Our haircut prices range from $45 to $85 depending on the stylist level and length of hair.",
    category: "Pricing",
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    usageCount: 52,
  },
  {
    id: "kb-4",
    question: "What is your cancellation policy?",
    answer: "We require at least 24 hours notice for cancellations. Late cancellations may be subject to a fee.",
    category: "Policies",
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    usageCount: 23,
  },
  {
    id: "kb-5",
    question: "Do you offer consultations?",
    answer: "Yes, we offer free 15-minute consultations for new clients or for major services like color treatments.",
    category: "Services",
    lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    usageCount: 19,
  },
];

// Analytics Mock Data
export interface AnalyticsData {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  appointmentsBooked: number;
  averageCallDuration: number;
  callsByDay: { date: string; count: number }[];
  outcomeDistribution: { outcome: string; count: number }[];
}

export const mockAnalytics: AnalyticsData = {
  totalCalls: 142,
  answeredCalls: 128,
  missedCalls: 14,
  appointmentsBooked: 45,
  averageCallDuration: 125,
  callsByDay: [
    { date: "Mon", count: 18 },
    { date: "Tue", count: 22 },
    { date: "Wed", count: 25 },
    { date: "Thu", count: 28 },
    { date: "Fri", count: 32 },
    { date: "Sat", count: 15 },
    { date: "Sun", count: 2 },
  ],
  outcomeDistribution: [
    { outcome: "Appointment Booked", count: 45 },
    { outcome: "Question Answered", count: 52 },
    { outcome: "Callback Requested", count: 18 },
    { outcome: "Voicemail", count: 13 },
    { outcome: "Missed", count: 14 },
  ],
};
