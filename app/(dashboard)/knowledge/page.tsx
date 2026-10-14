"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { getKnowledgeEntries, deleteKnowledgeEntry } from "@/lib/actions/knowledge";
import { format } from "date-fns";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadKnowledge = async () => {
    setLoading(true);
    const data = await getKnowledgeEntries();
    setKnowledge(data);
    setLoading(false);
  };

  useEffect(() => {
    loadKnowledge();
  }, []);

  const handleSuccess = () => {
    loadKnowledge();
    setFormOpen(false);
    setSelectedEntry(null);
  };

  const handleEdit = (entry: any) => {
    setSelectedEntry(entry);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedEntry(null);
    setFormOpen(true);
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to delete this knowledge entry?\n\n"${question}"\n\nThis action cannot be undone.`)) return;
    
    setDeletingId(id);
    try {
      await deleteKnowledgeEntry(id);
      await loadKnowledge();
    } catch (error) {
      alert("Failed to delete knowledge entry");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = Array.from(
    new Set(knowledge.filter((k: any) => k.category).map((k: any) => k.category))
  ).sort();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
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
          <Button size="sm" className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Knowledge
          </Button>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex gap-2">
            <Badge variant="info" className="cursor-pointer">
              All ({knowledge.length})
            </Badge>
            {categories.map((category) => (
              <Badge key={category} variant="default" className="cursor-pointer">
                {category} (
                {knowledge.filter((k: any) => k.category === category).length})
              </Badge>
            ))}
          </div>
        )}

        {/* Knowledge Entries or Empty State */}
        {knowledge.length > 0 ? (
          <div className="space-y-4">
            {knowledge.map((entry: any) => (
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
                            {entry.category && (
                              <Badge variant="default">{entry.category}</Badge>
                            )}
                            {!entry.enabled && (
                              <Badge variant="default">Disabled</Badge>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-700">
                            {entry.answer}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                            <span>Used {entry.usage_count} times</span>
                            <span>•</span>
                            <span>
                              Last updated {format(new Date(entry.updated_at), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(entry.id, entry.question)}
                        disabled={deletingId === entry.id}
                      >
                        {deletingId === entry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">No knowledge entries yet</p>
                <p className="mt-1 text-xs text-gray-400">
                  Add information to help your AI answer customer questions
                </p>
                <Button size="sm" className="mt-4 gap-2" onClick={handleCreate}>
                  <Plus className="h-4 w-4" />
                  Add First Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <KnowledgeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={selectedEntry}
        onSuccess={handleSuccess}
      />
    </>
  );
}
