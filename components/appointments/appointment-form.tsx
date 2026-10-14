"use client";

import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createAppointment, updateAppointment } from "@/lib/actions/appointments";
import { AlertCircle, Loader2 } from "lucide-react";

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: any;
  onSuccess?: () => void;
}

export function AppointmentForm({ open, onOpenChange, appointment, onSuccess }: AppointmentFormProps) {
  const isEditing = !!appointment;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    customer_name: appointment?.customer_name || "",
    customer_phone: appointment?.customer_phone || "",
    customer_email: appointment?.customer_email || "",
    service: appointment?.service || "",
    date_time: appointment?.date_time 
      ? new Date(appointment.date_time).toISOString().slice(0, 16)
      : "",
    duration: appointment?.duration?.toString() || "60",
    notes: appointment?.notes || "",
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.customer_phone)) {
      newErrors.customer_phone = "Invalid phone number format";
    }

    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = "Invalid email format";
    }

    if (!formData.service.trim()) {
      newErrors.service = "Service is required";
    }

    if (!formData.date_time) {
      newErrors.date_time = "Date and time are required";
    } else {
      const selectedDate = new Date(formData.date_time);
      if (selectedDate < new Date()) {
        newErrors.date_time = "Appointment cannot be in the past";
      }
    }

    const duration = parseInt(formData.duration);
    if (!duration || duration < 15 || duration > 480) {
      newErrors.duration = "Duration must be between 15 and 480 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      if (isEditing) {
        await updateAppointment(appointment.id, {
          date_time: formData.date_time,
          notes: formData.notes,
        });
      } else {
        await createAppointment({
          ...formData,
          duration: parseInt(formData.duration),
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <DialogContent>
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 mb-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="customer_name" required>Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                error={errors.customer_name}
                disabled={isEditing || loading}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="customer_phone" required>Phone Number</Label>
              <Input
                id="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                error={errors.customer_phone}
                disabled={isEditing || loading}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="customer_email">Email (Optional)</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                error={errors.customer_email}
                disabled={isEditing || loading}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="service" required>Service</Label>
              <Select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                error={errors.service}
                disabled={isEditing || loading}
              >
                <option value="">Select a service</option>
                <option value="Haircut">Haircut</option>
                <option value="Color Treatment">Color Treatment</option>
                <option value="Styling">Styling</option>
                <option value="Highlights">Highlights</option>
                <option value="Consultation">Consultation</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_time" required>Date & Time</Label>
                <Input
                  id="date_time"
                  type="datetime-local"
                  value={formData.date_time}
                  onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                  error={errors.date_time}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="duration" required>Duration (minutes)</Label>
                <Select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  error={errors.duration}
                  disabled={isEditing || loading}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                disabled={loading}
                placeholder="Any special requests or information..."
              />
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update" : "Create"} Appointment
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
