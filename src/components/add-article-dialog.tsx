"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { saveArticle } from "@/lib/articles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddArticleDialog({ open, onOpenChange }: AddArticleDialogProps) {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch {
      toast.error("Invalid URL");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `/api/metadata?url=${encodeURIComponent(finalUrl)}`
      );
      const meta = await res.json();

      let domain: string;
      try {
        domain = new URL(finalUrl).hostname.replace("www.", "");
      } catch {
        domain = finalUrl;
      }

      await saveArticle({
        userId: user.uid,
        url: finalUrl,
        title: meta.title || finalUrl,
        description: meta.description || "",
        image: meta.image || null,
        favicon: meta.favicon || null,
        domain,
      });

      toast.success("Article saved!");
      setUrl("");
      onOpenChange(false);
    } catch {
      toast.error("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save a URL</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !url.trim()}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
