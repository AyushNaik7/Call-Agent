import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneIncoming,
  PhoneMissed,
  Calendar,
  TrendingUp,
  Clock,
  MessageSquare,
} from "lucide-react";
import { formatDuration, formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";
import { getRecentCalls } from "@/lib/actions/calls";
import { getAppointments } from "@/lib/actions/appointments";
import { getMessages } from "@/lib/actions/messages";
import { connection } from "next/server";

export default async function DashboardPage() {
  await connection();
  
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
      change: "+12%",
      trend: "up",
      icon: Phone,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Appointments",
      value: allAppointments.length.toString(),
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      lightColor: "bg-purple-50 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Pending Messages",
      value: unreadMessages.length.toString(),
      change: "-5%",
      trend: "down",
      icon: MessageSquare,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      lightColor: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Messages",
      value: messages.length.toString(),
      change: "+15%",
      trend: "up",
      icon: PhoneIncoming,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor your AI receptionist performance and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className={`h-4 w-4 ${stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400 rotate-180'}`} />
                        <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">vs last week</span>
                      </div>
                    </div>
                    <div className={`${stat.lightColor} rounded-2xl p-4`}>
                      <Icon className={`h-8 w-8 ${stat.iconColor}`} />
                    </div>
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
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-gray-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Calls</CardTitle>
              <Badge variant="info" className="font-normal">
                {calls.length} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {calls.length > 0 ? (
              <div className="space-y-4">
                {calls.map((call: any) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/50">
                        <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {call.customer_name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
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
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(call.created_at), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                  <Phone className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No calls yet</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your recent calls will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-gray-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
              <Badge variant="info" className="font-normal">
                {upcomingAppointments.length} upcoming
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/50">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {appt.customer_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appt.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {format(new Date(appt.date_time), "MMM d")}
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {format(new Date(appt.date_time), "h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                  <Calendar className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No upcoming appointments</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Scheduled appointments will show here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Messages */}
      {unreadMessages.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-900/50 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Pending Messages & Callbacks</CardTitle>
              <Badge variant="warning">{unreadMessages.length} unread</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {unreadMessages.map((msg: any) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50 flex-shrink-0">
                    <Phone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white">
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
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{msg.message}</p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
