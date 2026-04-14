import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import { Article, ArticleInput, FilterTab } from "./types";

const COLLECTION = "articles";

export function subscribeToArticles(
  userId: string,
  tab: FilterTab,
  callback: (articles: Article[]) => void
) {
  const constraints: QueryConstraint[] = [
    where("userId", "==", userId),
    orderBy("savedAt", "desc"),
  ];

  if (tab === "unread") {
    constraints.push(where("isRead", "==", false));
    constraints.push(where("isArchived", "==", false));
  } else if (tab === "favorites") {
    constraints.push(where("isFavorite", "==", true));
  } else if (tab === "archive") {
    constraints.push(where("isArchived", "==", true));
  } else {
    constraints.push(where("isArchived", "==", false));
  }

  const q = query(collection(getFirebaseDb()!, COLLECTION), ...constraints);
  return onSnapshot(q, (snap) => {
    const articles = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Article);
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
