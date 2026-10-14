"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Search, Edit, Trash2 } from "lucide-react";
import { mockKnowledge } from "@/lib/mock-data";
import { format } from "date-fns";

export default function KnowledgePage() {
  const categories = Array.from(
    new Set(mockKnowledge.map((k) => k.category))
  ).sort();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Knowledge Base
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Information the AI uses to answer customer questions
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Knowledge
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex gap-2">
        <Badge variant="info" className="cursor-pointer">
          All ({mockKnowledge.length})
        </Badge>
        {categories.map((category) => (
          <Badge key={category} variant="default" className="cursor-pointer">
            {category} (
            {mockKnowledge.filter((k) => k.category === category).length})
          </Badge>
        ))}
      </div>

      {/* Knowledge Entries */}
      <div className="space-y-4">
        {mockKnowledge.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {entry.question}
                        </h3>
                        <Badge variant="default">{entry.category}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        {entry.answer}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>Used {entry.usageCount} times</span>
                        <span>•</span>
                        <span>
                          Last updated {format(entry.lastUpdated, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (commented for when no knowledge exists) */}
      {/* <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm">No knowledge entries yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Add information to help your AI answer customer questions
            </p>
            <Button size="sm" className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add First Entry
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
