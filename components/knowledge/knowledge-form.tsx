"use client";

import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createKnowledgeEntry, updateKnowledgeEntry } from "@/lib/actions/knowledge";
import { AlertCircle, Loader2 } from "lucide-react";

interface KnowledgeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: any;
  onSuccess?: () => void;
}

export function KnowledgeForm({ open, onOpenChange, entry, onSuccess }: KnowledgeFormProps) {
  const isEditing = !!entry;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    question: entry?.question || "",
    answer: entry?.answer || "",
    category: entry?.category || "",
    enabled: entry?.enabled ?? true,
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
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
      const knowledgeData = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category || null,
        enabled: formData.enabled,
      };

      if (isEditing) {
        await updateKnowledgeEntry(entry.id, knowledgeData);
      } else {
        await createKnowledgeEntry(knowledgeData);
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
            {isEditing ? "Edit Knowledge Entry" : "New Knowledge Entry"}
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
              <Label htmlFor="question" required>Question</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                error={errors.question}
                disabled={loading}
                placeholder="What are your business hours?"
              />
            </div>

            <div>
              <Label htmlFor="answer" required>Answer</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                error={errors.answer}
                rows={4}
                disabled={loading}
                placeholder="We are open Monday through Friday, 9am to 6pm..."
              />
            </div>

            <div>
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={loading}
                placeholder="Hours, Pricing, Services, etc."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="enabled" className="mb-0 cursor-pointer">
                Enable this knowledge entry
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              Disabled entries won't be used by the AI to answer questions
            </p>
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
            {isEditing ? "Update" : "Create"} Entry
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
