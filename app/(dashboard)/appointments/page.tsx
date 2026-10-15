"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Sparkles, Mail, Phone, Loader2, User } from "lucide-react";
import { getAppointments, deleteAppointment, updateAppointment } from "@/lib/actions/appointments";
import { formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";
import { AppointmentForm } from "@/components/appointments/appointment-form";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSuccess = () => {
    loadAppointments();
    setFormOpen(false);
    setSelectedAppointment(null);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedAppointment(null);
    setFormOpen(true);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    setCancellingId(id);
    try {
      await updateAppointment(id, { status: "cancelled" });
      await loadAppointments();
    } catch (error) {
      alert("Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.date_time) > now && a.status !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.date_time) <= now || a.status === "cancelled"
  );

  const todayCount = upcomingAppointments.filter((a) => {
    const apptDate = new Date(a.date_time);
    return apptDate.toDateString() === now.toDateString();
  }).length;

  const weekCount = upcomingAppointments.filter((a) => {
    const apptDate = new Date(a.date_time);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return apptDate < weekFromNow;
  }).length;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Appointments</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage bookings and schedule
            </p>
          </div>
          <Button 
            size="lg" 
            className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
            onClick={handleCreate}
          >
            <Plus className="h-5 w-5" />
            New Appointment
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass border-white/20 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Upcoming
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                      {upcomingAppointments.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Today
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                      {todayCount}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/20 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      This Week
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                      {weekCount}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card className="glass border-white/20 dark:border-white/10 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Upcoming Appointments</CardTitle>
              <Badge variant="info" className="px-3 py-1 text-sm">
                {upcomingAppointments.length} scheduled
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="group relative overflow-hidden rounded-2xl glass border border-white/10 p-6 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
                        <p className="text-xs font-semibold text-white/80 uppercase">
                          {format(new Date(appt.date_time), "MMM")}
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {format(new Date(appt.date_time), "d")}
                        </p>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {appt.customer_name}
                              </h3>
                              <Badge
                                variant={
                                  appt.status === "confirmed"
                                    ? "success"
                                    : appt.status === "pending"
                                    ? "warning"
                                    : "default"
                                }
                                className="px-3 py-1"
                              >
                                {appt.status}
                              </Badge>
                            </div>
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                              {appt.service}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">{format(new Date(appt.date_time), "h:mm a")}</span>
                                <span className="text-gray-400">•</span>
                                <span>{appt.duration} min</span>
                              </div>
                              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
                                <Phone className="h-4 w-4" />
                                {formatPhoneNumber(appt.customer_phone)}
                              </div>
                              {appt.customer_email && (
                                <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
                                  <Mail className="h-4 w-4" />
                                  {appt.customer_email}
                                </div>
                              )}
                            </div>
                            {appt.notes && (
                              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 glass px-4 py-2 rounded-lg">
                                💡 {appt.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(appt)}
                              className="glass border-white/20"
                            >
                              Reschedule
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCancel(appt.id)}
                              disabled={cancellingId === appt.id}
                              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              {cancellingId === appt.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Cancel"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 mb-6">
                  <Calendar className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No upcoming appointments</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Schedule your first appointment to get started</p>
                <Button 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                  onClick={handleCreate}
                >
                  <Plus className="h-5 w-5" />
                  Schedule First Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <Card className="glass border-white/20 dark:border-white/10 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-2xl">Past Appointments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {pastAppointments.slice(0, 10).map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between p-4 rounded-xl glass border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-400 to-gray-600">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {appt.customer_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appt.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {format(new Date(appt.date_time), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(appt.date_time), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AppointmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        appointment={selectedAppointment}
        onSuccess={handleSuccess}
      />
    </>
  );
}
