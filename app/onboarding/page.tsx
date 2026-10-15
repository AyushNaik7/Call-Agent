"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Building2, Clock, Phone, Mail, AlertCircle, CheckCircle } from "lucide-react";

const BUSINESS_TYPES = [
  "Salon & Spa",
  "Medical Practice",
  "Dental Office",
  "Law Firm",
  "Retail Store",
  "Restaurant",
  "Fitness Center",
  "Consulting",
  "Other",
];

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time (MST)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
];

const DEFAULT_HOURS = [
  { day: 0, name: "Sunday", is_open: false, open_time: "09:00", close_time: "17:00" },
  { day: 1, name: "Monday", is_open: true, open_time: "09:00", close_time: "17:00" },
  { day: 2, name: "Tuesday", is_open: true, open_time: "09:00", close_time: "17:00" },
  { day: 3, name: "Wednesday", is_open: true, open_time: "09:00", close_time: "17:00" },
  { day: 4, name: "Thursday", is_open: true, open_time: "09:00", close_time: "17:00" },
  { day: 5, name: "Friday", is_open: true, open_time: "09:00", close_time: "17:00" },
  { day: 6, name: "Saturday", is_open: false, open_time: "10:00", close_time: "15:00" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState(DEFAULT_HOURS);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleHourToggle = (index: number) => {
    setHours(hours.map((h, i) => 
      i === index ? { ...h, is_open: !h.is_open } : h
    ));
  };

  const handleHourChange = (index: number, field: 'open_time' | 'close_time', value: string) => {
    setHours(hours.map((h, i) => 
      i === index ? { ...h, [field]: value } : h
    ));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      // Create business
      const { data: business, error: businessError } = await supabase
        .from("businesses")
        .insert({
          name: businessName,
          business_type: businessType,
          timezone,
          phone,
          email,
          address,
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Add user as owner
      const { error: memberError } = await supabase
        .from("business_members")
        .insert({
          business_id: business.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) throw memberError;

      // Create business hours
      const { error: hoursError } = await supabase
        .from("business_hours")
        .insert(
          hours.map((h) => ({
            business_id: business.id,
            day_of_week: h.day,
            is_open: h.is_open,
            open_time: h.is_open ? h.open_time : null,
            close_time: h.is_open ? h.close_time : null,
          }))
        );

      if (hoursError) throw hoursError;

      // Create default business settings
      const { error: settingsError } = await supabase
        .from("business_settings")
        .insert({
          business_id: business.id,
          ai_greeting: `Hello! Thank you for calling ${businessName}. I'm the AI assistant. How can I help you today?`,
        });

      if (settingsError) throw settingsError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred during onboarding");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              All set!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your business has been created. Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-rose-200 dark:bg-rose-900">
            <Bot className="h-7 w-7 text-rose-900 dark:text-rose-100" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Set up your business
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Let's get your AI receptionist configured
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className={`h-2 w-24 rounded-full ${step >= 1 ? "bg-rose-600 dark:bg-rose-700" : "bg-gray-200 dark:bg-neutral-800"}`} />
          <div className={`h-2 w-24 rounded-full ${step >= 2 ? "bg-rose-600 dark:bg-rose-700" : "bg-gray-200 dark:bg-neutral-800"}`} />
          <div className={`h-2 w-24 rounded-full ${step >= 3 ? "bg-rose-600 dark:bg-rose-700" : "bg-gray-200 dark:bg-neutral-800"}`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Business Information"}
              {step === 2 && "Contact Details"}
              {step === 3 && "Business Hours"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your business"}
              {step === 2 && "How can customers reach you?"}
              {step === 3 && "When are you open?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Name <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 py-2 pl-10 pr-3 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                      placeholder="Style Studio"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                  >
                    <option value="">Select a type</option>
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timezone <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      required
                      className="block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 py-2 pl-10 pr-3 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Phone
                  </label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 py-2 pl-10 pr-3 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 py-2 pl-10 pr-3 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                      placeholder="hello@yourbusiness.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                    placeholder="123 Main Street, City, ST 12345"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Business Hours */}
            {step === 3 && (
              <div className="space-y-3">
                {hours.map((hour, index) => (
                  <div
                    key={hour.day}
                    className="flex items-center gap-4 border-b border-gray-200 dark:border-neutral-800 pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hour.is_open}
                        onChange={() => handleHourToggle(index)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-neutral-700 text-rose-600 dark:text-rose-500 focus:ring-rose-500"
                      />
                      <span className="w-24 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {hour.name}
                      </span>
                    </div>
                    {hour.is_open ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={hour.open_time}
                          onChange={(e) => handleHourChange(index, 'open_time', e.target.value)}
                          className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                        />
                        <span className="text-gray-500 dark:text-gray-400">to</span>
                        <input
                          type="time"
                          value={hour.close_time}
                          onChange={(e) => handleHourChange(index, 'close_time', e.target.value)}
                          className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:border-rose-400 dark:focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1 || loading}
              >
                Back
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !businessName) ||
                    loading
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!businessName || loading}
                >
                  {loading ? "Creating..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
