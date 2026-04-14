"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { subscribeToArticles } from "@/lib/articles";
import { Article, FilterTab } from "@/lib/types";
import { Navbar } from "@/components/navbar";
import { ArticleCard } from "@/components/article-card";
import { AddArticleDialog } from "@/components/add-article-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Inbox, Star, Archive, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToArticles(user.uid, tab, (data) => {
      setArticles(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, authLoading, tab, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const filtered = search
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.description.toLowerCase().includes(search.toLowerCase()) ||
          a.domain.toLowerCase().includes(search.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : articles;

  const counts = {
    all: articles.length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar search={search} onSearchChange={setSearch} onAddClick={() => setAddOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as FilterTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="gap-1.5">
              <Inbox className="w-3.5 h-3.5" />
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              Unread
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1.5">
              <Star className="w-3.5 h-3.5" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="archive" className="gap-1.5">
              <Archive className="w-3.5 h-3.5" />
              Archive
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">
              {search
                ? "No articles match your search."
                : tab === "all"
                  ? "No articles saved yet. Click \"Add URL\" or use the browser extension!"
                  : `No ${tab} articles.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <AddArticleDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
