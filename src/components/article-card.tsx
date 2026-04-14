"use client";

import { Article } from "@/lib/types";
import {
  toggleFavorite,
  toggleArchive,
  markAsRead,
  deleteArticle,
} from "@/lib/articles";
import { formatDistanceToNow } from "date-fns";
import {
  Star,
  Archive,
  Trash2,
  ExternalLink,
  ArchiveRestore,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const handleOpen = () => {
    if (!article.isRead) markAsRead(article.id);
    window.open(article.url, "_blank");
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(article.id, article.isFavorite);
    toast.success(article.isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleArchive(article.id, article.isArchived);
    toast.success(article.isArchived ? "Restored from archive" : "Archived");
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteArticle(article.id);
    toast.success("Deleted");
  };

  const timeAgo = article.savedAt?.toDate
    ? formatDistanceToNow(article.savedAt.toDate(), { addSuffix: true })
    : "";

  return (
    <div
      className="group flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleOpen}
    >
      {article.image && (
        <div className="hidden sm:block w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-medium leading-snug line-clamp-2 ${
              article.isRead ? "text-muted-foreground" : ""
            }`}
          >
            {article.title}
          </h3>
          <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
        </div>

        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {article.favicon && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={article.favicon} alt="" className="w-4 h-4 rounded" />
          )}
          <span>{article.domain}</span>
          <span>&middot;</span>
          <span>{timeAgo}</span>
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleFavorite}
            title={article.isFavorite ? "Unfavorite" : "Favorite"}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                article.isFavorite
                  ? "text-amber-500 fill-amber-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleArchive}
            title={article.isArchived ? "Restore" : "Archive"}
          >
            {article.isArchived ? (
              <ArchiveRestore className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Archive className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
