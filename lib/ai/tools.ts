/**
 * AI Tools - Function definitions and implementations
 * 
 * These tools allow the AI to interact with our business services:
 * - Query knowledge base
 * - Check appointment availability
 * - Create/update/cancel appointments
 * - Look up and create contacts
 * - Record callback requests
 */

import { AITool } from "./provider-openrouter";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../actions/appointments";
import { getContacts, createContact } from "../actions/contacts";
import { getKnowledgeEntries } from "../actions/knowledge";
import { createMessage } from "../actions/messages";
import { format, parseISO, isAfter, isBefore, addMinutes } from "date-fns";

/**
 * Tool execution context - contains business ID for authorization
 */
export interface ToolContext {
  businessId: string;
}

/**
 * Tool execution result
 */
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Define all available AI tools
 */
export const AI_TOOLS: AITool[] = [
  {
    name: "search_knowledge_base",
    description:
      "Search the business knowledge base for information about services, pricing, policies, hours, and frequently asked questions. Use this to answer customer questions about the business.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query or question to look up in the knowledge base",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "check_availability",
    description:
      "Check appointment availability for a specific date and time range. Returns available time slots.",
    parameters: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "The date to check availability for (YYYY-MM-DD format)",
        },
        service: {
          type: "string",
          description: "The service name to check availability for",
        },
      },
      required: ["date"],
    },
  },
  {
    name: "create_appointment",
    description:
      "Create a new appointment for a customer. All required information must be collected before calling this function.",
    parameters: {
      type: "object",
      properties: {
        customer_name: {
          type: "string",
          description: "Full name of the customer",
        },
        customer_phone: {
          type: "string",
          description: "Customer phone number with country code",
        },
        customer_email: {
          type: "string",
          description: "Customer email address (optional)",
        },
        service: {
          type: "string",
          description: "Name of the service being booked",
        },
        date_time: {
          type: "string",
          description: "Appointment date and time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)",
        },
        duration: {
          type: "number",
          description: "Appointment duration in minutes",
        },
        notes: {
          type: "string",
          description: "Any special notes or requests from the customer",
        },
      },
      required: ["customer_name", "customer_phone", "service", "date_time", "duration"],
    },
  },
  {
    name: "reschedule_appointment",
    description:
      "Reschedule an existing appointment to a new date and time. Requires the customer's phone number to look up the appointment.",
    parameters: {
      type: "object",
      properties: {
        customer_phone: {
          type: "string",
          description: "Customer phone number to identify the appointment",
        },
        new_date_time: {
          type: "string",
          description: "New appointment date and time in ISO 8601 format",
        },
      },
      required: ["customer_phone", "new_date_time"],
    },
  },
  {
    name: "cancel_appointment",
    description:
      "Cancel an existing appointment. Requires the customer's phone number to look up the appointment.",
    parameters: {
      type: "object",
      properties: {
        customer_phone: {
          type: "string",
          description: "Customer phone number to identify the appointment",
        },
      },
      required: ["customer_phone"],
    },
  },
  {
    name: "lookup_customer",
    description:
      "Look up an existing customer by phone number to retrieve their contact information and history.",
    parameters: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description: "Customer phone number to look up",
        },
      },
      required: ["phone"],
    },
  },
  {
    name: "record_callback_request",
    description:
      "Record a customer request for a callback. Use when the customer wants to be contacted later or when human assistance is needed.",
    parameters: {
      type: "object",
      properties: {
        customer_name: {
          type: "string",
          description: "Customer's name",
        },
        customer_phone: {
          type: "string",
          description: "Customer's phone number",
        },
        message: {
          type: "string",
          description: "The message or reason for the callback",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Priority level of the callback request",
        },
      },
      required: ["customer_name", "customer_phone", "message"],
    },
  },
];

/**
 * Execute an AI tool with the given arguments
 */
export async function executeAITool(
  toolName: string,
  args: Record<string, any>,
  context: ToolContext
): Promise<ToolResult> {
  try {
    console.log(`[AI Tools] Executing ${toolName} with args:`, JSON.stringify(args, null, 2));
    console.log(`[AI Tools] Context:`, context);

    switch (toolName) {
      case "search_knowledge_base":
        return await searchKnowledgeBase(args.query, context);

      case "check_availability":
        return await checkAvailability(args.date, args.service, context);

      case "create_appointment":
        return await createAppointmentTool(args, context);

      case "reschedule_appointment":
        return await rescheduleAppointmentTool(args, context);

      case "cancel_appointment":
        return await cancelAppointmentTool(args, context);

      case "lookup_customer":
        return await lookupCustomer(args.phone, context);

      case "record_callback_request":
        return await recordCallbackRequest(args, context);

      default:
        console.error(`[AI Tools] Unknown tool: ${toolName}`);
        return {
          success: false,
          error: `Unknown tool: ${toolName}`,
        };
    }
  } catch (error: any) {
    console.error(`[AI Tools] Error executing ${toolName}:`, error);
    console.error(`[AI Tools] Error stack:`, error.stack);
    return {
      success: false,
      error: error.message || "Tool execution failed",
    };
  }
}

/**
 * Search knowledge base
 */
async function searchKnowledgeBase(
  query: string,
  context: ToolContext
): Promise<ToolResult> {
  const entries = await getKnowledgeEntries();
  
  // Simple keyword matching - could be enhanced with vector search later
  const queryLower = query.toLowerCase();
  const relevantEntries = entries.filter((entry: any) => {
    const questionMatch = entry.question.toLowerCase().includes(queryLower);
    const answerMatch = entry.answer.toLowerCase().includes(queryLower);
    const categoryMatch = entry.category?.toLowerCase().includes(queryLower);
    return (questionMatch || answerMatch || categoryMatch) && entry.enabled;
  });

  if (relevantEntries.length === 0) {
    return {
      success: true,
      data: {
        found: false,
        message: "No relevant information found in the knowledge base.",
      },
    };
  }

  return {
    success: true,
    data: {
      found: true,
      entries: relevantEntries.map((e: any) => ({
        question: e.question,
        answer: e.answer,
        category: e.category,
      })),
    },
  };
}

/**
 * Check availability for appointments
 */
async function checkAvailability(
  date: string,
  service: string | undefined,
  context: ToolContext
): Promise<ToolResult> {
  const appointments = await getAppointments();
  
  // Filter appointments for the requested date
  const requestedDate = parseISO(date);
  const dayAppointments = appointments.filter((appt: any) => {
    const apptDate = parseISO(appt.date_time);
    return (
      format(apptDate, "yyyy-MM-dd") === format(requestedDate, "yyyy-MM-dd") &&
      appt.status !== "cancelled"
    );
  });

  // Business hours (9 AM to 6 PM) - this should come from business settings
  const availableSlots = [];
  let currentTime = new Date(`${date}T09:00:00`);
  const endTime = new Date(`${date}T18:00:00`);

  while (isBefore(currentTime, endTime)) {
    const slotEnd = addMinutes(currentTime, 60); // 1 hour slots
    
    // Check if this slot conflicts with any existing appointment
    const hasConflict = dayAppointments.some((appt: any) => {
      const apptStart = parseISO(appt.date_time);
      const apptEnd = addMinutes(apptStart, appt.duration);
      
      return (
        (isBefore(currentTime, apptEnd) && isAfter(slotEnd, apptStart)) ||
        currentTime.getTime() === apptStart.getTime()
      );
    });

    if (!hasConflict) {
      availableSlots.push(format(currentTime, "h:mm a"));
    }

    currentTime = slotEnd;
  }

  return {
    success: true,
    data: {
      date,
      service,
      availableSlots,
      bookedCount: dayAppointments.length,
    },
  };
}

/**
 * Create appointment
 */
async function createAppointmentTool(
  args: any,
  context: ToolContext
): Promise<ToolResult> {
  try {
    await createAppointment({
      customer_name: args.customer_name,
      customer_phone: args.customer_phone,
      customer_email: args.customer_email || null,
      service: args.service,
      date_time: args.date_time,
      duration: args.duration,
      notes: args.notes || null,
    });

    return {
      success: true,
      data: {
        message: `Appointment created successfully for ${args.customer_name} on ${format(
          parseISO(args.date_time),
          "MMMM d, yyyy 'at' h:mm a"
        )}`,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create appointment",
    };
  }
}

/**
 * Reschedule appointment
 */
async function rescheduleAppointmentTool(
  args: any,
  context: ToolContext
): Promise<ToolResult> {
  const appointments = await getAppointments();
  
  // Find the most recent upcoming appointment for this customer
  const customerAppointments = appointments.filter(
    (appt: any) =>
      appt.customer_phone.includes(args.customer_phone.slice(-4)) &&
      appt.status !== "cancelled" &&
      isAfter(parseISO(appt.date_time), new Date())
  );

  if (customerAppointments.length === 0) {
    return {
      success: false,
      error: "No upcoming appointment found for this phone number",
    };
  }

  const appointment = customerAppointments[0];
  
  try {
    await updateAppointment(appointment.id, {
      date_time: args.new_date_time,
    });

    return {
      success: true,
      data: {
        message: `Appointment rescheduled to ${format(
          parseISO(args.new_date_time),
          "MMMM d, yyyy 'at' h:mm a"
        )}`,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to reschedule appointment",
    };
  }
}

/**
 * Cancel appointment
 */
async function cancelAppointmentTool(
  args: any,
  context: ToolContext
): Promise<ToolResult> {
  const appointments = await getAppointments();
  
  // Find the most recent upcoming appointment for this customer
  const customerAppointments = appointments.filter(
    (appt: any) =>
      appt.customer_phone.includes(args.customer_phone.slice(-4)) &&
      appt.status !== "cancelled" &&
      isAfter(parseISO(appt.date_time), new Date())
  );

  if (customerAppointments.length === 0) {
    return {
      success: false,
      error: "No upcoming appointment found for this phone number",
    };
  }

  const appointment = customerAppointments[0];
  
  try {
    await updateAppointment(appointment.id, {
      status: "cancelled",
    });

    return {
      success: true,
      data: {
        message: "Appointment cancelled successfully",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to cancel appointment",
    };
  }
}

/**
 * Look up customer
 */
async function lookupCustomer(
  phone: string,
  context: ToolContext
): Promise<ToolResult> {
  const contacts = await getContacts();
  
  const customer = contacts.find((c: any) =>
    c.phone.includes(phone.slice(-4))
  );

  if (!customer) {
    return {
      success: true,
      data: {
        found: false,
        message: "Customer not found in system",
      },
    };
  }

  return {
    success: true,
    data: {
      found: true,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        notes: customer.notes,
      },
    },
  };
}

/**
 * Record callback request
 */
async function recordCallbackRequest(
  args: any,
  context: ToolContext
): Promise<ToolResult> {
  try {
    await createMessage({
      customer_name: args.customer_name,
      customer_phone: args.customer_phone,
      message: args.message,
      priority: args.priority || "medium",
    });

    return {
      success: true,
      data: {
        message: "Callback request recorded successfully. Someone will contact you soon.",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to record callback request",
    };
  }
}
