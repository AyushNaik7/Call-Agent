"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Phone, Clock, DollarSign, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Business Settings
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure your business information and AI receptionist behavior
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Basic information about your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              defaultValue="Style Studio"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+1 (234) 567-8900"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                defaultValue="hello@stylestudio.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              defaultValue="123 Main Street, City, ST 12345"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <CardTitle>Business Hours</CardTitle>
          </div>
          <CardDescription>
            Set your operating hours for appointment scheduling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { day: "Monday", hours: "9:00 AM - 7:00 PM", enabled: true },
            { day: "Tuesday", hours: "9:00 AM - 7:00 PM", enabled: true },
            { day: "Wednesday", hours: "9:00 AM - 7:00 PM", enabled: true },
            { day: "Thursday", hours: "9:00 AM - 7:00 PM", enabled: true },
            { day: "Friday", hours: "9:00 AM - 7:00 PM", enabled: true },
            { day: "Saturday", hours: "10:00 AM - 5:00 PM", enabled: true },
            { day: "Sunday", hours: "Closed", enabled: false },
          ].map((schedule) => (
            <div
              key={schedule.day}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={schedule.enabled}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900">
                  {schedule.day}
                </span>
              </div>
              <input
                type="text"
                defaultValue={schedule.hours}
                disabled={!schedule.enabled}
                className="w-48 rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:bg-gray-50 disabled:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-600" />
            <CardTitle>Services & Pricing</CardTitle>
          </div>
          <CardDescription>
            Services offered and their durations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Haircut", duration: "60 min", price: "$45-85" },
              { name: "Color Treatment", duration: "120 min", price: "$120-200" },
              { name: "Styling", duration: "90 min", price: "$80-150" },
              { name: "Highlights", duration: "150 min", price: "$150-250" },
            ].map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border border-gray-200 p-3"
              >
                <input
                  type="text"
                  defaultValue={service.name}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  defaultValue={service.duration}
                  className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  defaultValue={service.price}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            Add Service
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                New appointment notifications
              </p>
              <p className="text-sm text-gray-600">
                Get notified when a new appointment is booked
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                Callback request alerts
              </p>
              <p className="text-sm text-gray-600">
                Get notified when customers request callbacks
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Missed call alerts</p>
              <p className="text-sm text-gray-600">
                Get notified about missed calls
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Daily summary email</p>
              <p className="text-sm text-gray-600">
                Receive daily activity summary
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
