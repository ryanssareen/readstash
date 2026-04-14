"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { saveArticle } from "@/lib/articles";
import { Button } from "@/components/ui/button";
import { Bookmark, Check, Loader2, LogIn } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

function SavePageContent() {
  const { user, loading: authLoading, signIn } = useAuth();
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "saving" | "saved" | "duplicate" | "auth">("loading");

  const url = params.get("url") ?? "";
  const title = params.get("title") ?? url;
  const description = params.get("description") ?? "";
  const image = params.get("image") || null;
  const domain = params.get("domain") ?? "";
  const favicon = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;

  const doSave = useCallback(async (uid: string) => {
    const db = getFirebaseDb();
    if (!db) return;
    const existing = await getDocs(
      query(
        collection(db, "articles"),
        where("userId", "==", uid),
        where("url", "==", url),
        limit(1)
      )
    );

    if (!existing.empty) {
      setStatus("duplicate");
      setTimeout(() => window.close(), 1500);
      return;
    }

    setStatus("saving");
    await saveArticle({ userId: uid, url, title, description, image, favicon, domain });
    setStatus("saved");
    setTimeout(() => window.close(), 1500);
  }, [url, title, description, image, favicon, domain]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setStatus("auth");
      return;
    }
    doSave(user.uid);
  }, [user, authLoading, doSave]);

  const handleSignIn = async () => {
    await signIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm bg-background rounded-2xl border shadow-lg p-8 text-center space-y-5">
        <div className="flex items-center justify-center gap-2 font-bold text-lg">
          <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
          ReadStash
        </div>

        {status === "loading" && (
          <div className="space-y-3 py-4">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        )}

        {status === "auth" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Sign in to save this article</p>
              {title && (
                <p className="text-xs text-muted-foreground line-clamp-2">{title}</p>
              )}
            </div>
            <Button onClick={handleSignIn} className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
          </div>
        )}

        {status === "saving" && (
          <div className="space-y-3 py-4">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-sm text-muted-foreground">Saving...</p>
          </div>
        )}

        {(status === "saved" || status === "duplicate") && (
          <div className="space-y-3 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium">
              {status === "duplicate" ? "Already saved!" : "Saved!"}
            </p>
            {title && (
              <p className="text-xs text-muted-foreground line-clamp-2">{title}</p>
            )}
            <p className="text-xs text-muted-foreground">This tab will close automatically...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SavePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SavePageContent />
    </Suspense>
  );
}
