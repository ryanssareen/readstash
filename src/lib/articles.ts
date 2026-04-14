import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import { Article, ArticleInput, FilterTab } from "./types";

const COLLECTION = "articles";

export function subscribeToArticles(
  userId: string,
  tab: FilterTab,
  callback: (articles: Article[]) => void
) {
  const q = query(
    collection(getFirebaseDb()!, COLLECTION),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snap) => {
    let articles = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Article);

    // Client-side filtering to avoid composite index requirements
    if (tab === "unread") {
      articles = articles.filter((a) => !a.isRead && !a.isArchived);
    } else if (tab === "favorites") {
      articles = articles.filter((a) => a.isFavorite);
    } else if (tab === "archive") {
      articles = articles.filter((a) => a.isArchived);
    } else {
      articles = articles.filter((a) => !a.isArchived);
    }

    // Sort by savedAt descending
    articles.sort((a, b) => {
      const aTime = a.savedAt?.toMillis?.() ?? 0;
      const bTime = b.savedAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    });

    callback(articles);
  });
}

export async function saveArticle(data: Omit<ArticleInput, "savedAt" | "readAt" | "isRead" | "isArchived" | "isFavorite" | "tags">) {
  return addDoc(collection(getFirebaseDb()!, COLLECTION), {
    ...data,
    savedAt: Timestamp.now(),
    readAt: null,
    isRead: false,
    isArchived: false,
    isFavorite: false,
    tags: [],
  });
}

export async function toggleFavorite(id: string, current: boolean) {
  return updateDoc(doc(getFirebaseDb()!, COLLECTION, id), { isFavorite: !current });
}

export async function toggleArchive(id: string, current: boolean) {
  return updateDoc(doc(getFirebaseDb()!, COLLECTION, id), { isArchived: !current });
}

export async function markAsRead(id: string) {
  return updateDoc(doc(getFirebaseDb()!, COLLECTION, id), {
    isRead: true,
    readAt: Timestamp.now(),
  });
}

export async function deleteArticle(id: string) {
  return deleteDoc(doc(getFirebaseDb()!, COLLECTION, id));
}

export async function updateTags(id: string, tags: string[]) {
  return updateDoc(doc(getFirebaseDb()!, COLLECTION, id), { tags });
}
