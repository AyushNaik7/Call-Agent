"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Save, TestTube, Phone, Zap } from "lucide-react";

export default function AIConfigPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            AI Configuration
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure how your AI receptionist behaves and responds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-green-600" />
            AI Active
          </Badge>
        </div>
      </div>

      {/* AI Personality */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-gray-600" />
            <CardTitle>AI Personality & Voice</CardTitle>
          </div>
          <CardDescription>
            Customize how the AI introduces itself and interacts with customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Greeting Message
            </label>
            <textarea
              defaultValue="Hello! Thank you for calling Style Studio. I'm the AI assistant. How can I help you today?"
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              AI Tone
            </label>
            <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Professional and Friendly</option>
              <option>Casual and Warm</option>
              <option>Formal and Business-like</option>
              <option>Enthusiastic and Energetic</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Voice Type
              </label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Female - Natural</option>
                <option>Male - Natural</option>
                <option>Female - Professional</option>
                <option>Male - Professional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Speaking Speed
              </label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Normal</option>
                <option>Slightly Slower</option>
                <option>Slightly Faster</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-gray-600" />
            <CardTitle>AI Capabilities</CardTitle>
          </div>
          <CardDescription>
            Enable or disable specific AI functions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Book Appointments</p>
              <p className="text-sm text-gray-600">
                Allow AI to schedule new appointments
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
                Reschedule Appointments
              </p>
              <p className="text-sm text-gray-600">
                Allow AI to modify existing appointments
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
              <p className="font-medium text-gray-900">Cancel Appointments</p>
              <p className="text-sm text-gray-600">
                Allow AI to cancel appointments
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
              <p className="font-medium text-gray-900">Answer Questions</p>
              <p className="text-sm text-gray-600">
                Use knowledge base to answer customer questions
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
              <p className="font-medium text-gray-900">Collect Contact Info</p>
              <p className="text-sm text-gray-600">
                Gather customer details for follow-up
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
              <p className="font-medium text-gray-900">Request Callbacks</p>
              <p className="text-sm text-gray-600">
                Offer to have a human call back
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

      {/* Booking Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Rules & Constraints</CardTitle>
          <CardDescription>
            Set rules for appointment scheduling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum advance booking
              </label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>2 hours</option>
                <option>4 hours</option>
                <option>1 day</option>
                <option>2 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum advance booking
              </label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>3 months</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Buffer time between appointments
              </label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>No buffer</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max appointments per day
              </label>
              <input
                type="number"
                defaultValue="8"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-gray-600" />
            <CardTitle>Test Your AI</CardTitle>
          </div>
          <CardDescription>
            Try out your AI receptionist configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Test how your AI responds with your current settings before going
            live. This will open a browser-based voice chat interface.
          </p>
          <Button className="gap-2">
            <Phone className="h-4 w-4" />
            Start Test Call
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg">
          Reset to Defaults
        </Button>
        <Button size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
