import { Timestamp } from "firebase/firestore";

export interface Article {
  id: string;
  userId: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
  savedAt: Timestamp;
  readAt: Timestamp | null;
  isRead: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  tags: string[];
}

export type ArticleInput = Omit<Article, "id">;

export type FilterTab = "all" | "unread" | "favorites" | "archive";
