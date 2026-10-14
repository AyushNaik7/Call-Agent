import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneIncoming,
  PhoneMissed,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatDuration, formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";
import { getRecentCalls } from "@/lib/actions/calls";
import { getAppointments } from "@/lib/actions/appointments";
import { getMessages } from "@/lib/actions/messages";

export default async function DashboardPage() {
  const calls = await getRecentCalls(5);
  const allAppointments = await getAppointments();
  const messages = await getMessages();

  const now = new Date();
  const upcomingAppointments = allAppointments
    .filter((a: any) => new Date(a.date_time) > now && a.status === "confirmed")
    .sort((a: any, b: any) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
    .slice(0, 3);

  const unreadMessages = messages.filter((m: any) => m.status === "unread");

  const stats = [
    {
      title: "Total Calls",
      value: calls.length.toString(),
      change: "-",
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Appointments",
      value: allAppointments.length.toString(),
      change: "-",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Messages",
      value: unreadMessages.length.toString(),
      change: "-",
      icon: PhoneMissed,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Messages",
      value: messages.length.toString(),
      change: "-",
      icon: PhoneIncoming,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor your AI receptionist performance and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Calls */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            {calls.length > 0 ? (
              <div className="space-y-4">
                {calls.map((call: any) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {call.customer_name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPhoneNumber(call.customer_phone)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          call.status === "completed"
                            ? "success"
                            : call.status === "missed"
                            ? "error"
                            : "default"
                        }
                      >
                        {call.outcome?.replace("_", " ") || call.status}
                      </Badge>
                      <p className="mt-1 text-xs text-gray-500">
                        {format(new Date(call.created_at), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <Phone className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">No calls yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {appt.customer_name}
                        </p>
                        <p className="text-sm text-gray-600">{appt.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(appt.date_time), "MMM d")}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        {format(new Date(appt.date_time), "h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">No upcoming appointments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Messages */}
      {unreadMessages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Messages & Callbacks</CardTitle>
              <Badge variant="error">{unreadMessages.length} unread</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unreadMessages.map((msg: any) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {msg.customer_name}
                      </p>
                      <Badge
                        variant={
                          msg.priority === "high"
                            ? "error"
                            : msg.priority === "medium"
                            ? "warning"
                            : "default"
                        }
                      >
                        {msg.priority} priority
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{msg.message}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {formatPhoneNumber(msg.customer_phone)} •{" "}
                      {format(new Date(msg.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
