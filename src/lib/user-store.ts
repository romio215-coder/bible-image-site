"use client";
import { useSyncExternalStore } from "react";
import { allChapters, books } from "./bible";
export type SavedVerse = {
  id: string;
  book: string;
  name: string;
  chapter: number;
  verse: number;
  endVerse: number;
  text: string;
  updatedAt: string;
};
export type Note = SavedVerse & { note: string };
export type Settings = {
  dark: boolean;
  fontSize: number;
  serif: boolean;
  lineHeight: number;
  showNumbers: boolean;
  wide: boolean;
};
export type UserData = {
  version: 1;
  bookmarks: SavedVerse[];
  notes: Note[];
  read: Record<string, string>;
  last: { book: string; chapter: number } | null;
  settings: Settings;
  plan: { start: string; days: number } | null;
};
const KEY = "wordlight:user:v1";
const defaults: UserData = {
  version: 1,
  bookmarks: [],
  notes: [],
  read: {},
  last: null,
  settings: {
    dark: false,
    fontSize: 20,
    serif: true,
    lineHeight: 2.05,
    showNumbers: true,
    wide: false,
  },
  plan: null,
};
let cache = defaults;
let lastRaw: string | null | undefined;
const listeners = new Set<() => void>();
function validPosition(
  value: unknown,
): value is { book: string; chapter: number } {
  if (!value || typeof value !== "object") return false;
  const v = value as { book: string; chapter: number };
  const b = books.find((b) => b.book === v.book);
  return (
    !!b &&
    Number.isInteger(v.chapter) &&
    v.chapter >= 1 &&
    v.chapter <= b.chapters
  );
}
function saved(value: unknown): value is SavedVerse {
  if (!validPosition(value)) return false;
  const v = value as SavedVerse;
  return (
    typeof v.id === "string" &&
    v.id === `${v.book}/${v.chapter}/${v.verse}-${v.endVerse}` &&
    typeof v.name === "string" &&
    typeof v.text === "string" &&
    v.text.length < 30000 &&
    Number.isInteger(v.verse) &&
    v.verse > 0 &&
    Number.isInteger(v.endVerse) &&
    v.endVerse >= v.verse &&
    v.endVerse <= 176 &&
    typeof v.updatedAt === "string"
  );
}
export function validateData(value: unknown): UserData {
  if (!value || typeof value !== "object" || (value as UserData).version !== 1)
    throw new Error("지원하지 않는 백업 형식입니다.");
  const v = value as UserData;
  if (
    !Array.isArray(v.bookmarks) ||
    !v.bookmarks.every(saved) ||
    !Array.isArray(v.notes) ||
    !v.notes.every(
      (n) => saved(n) && typeof n.note === "string" && n.note.length <= 10000,
    )
  )
    throw new Error("말씀 또는 묵상 형식이 올바르지 않습니다.");
  if (!v.read || typeof v.read !== "object" || Array.isArray(v.read))
    throw new Error("읽기 기록 형식이 올바르지 않습니다.");
  const validKeys = new Set(allChapters.map((c) => `${c.book}/${c.chapter}`));
  const read = Object.fromEntries(
    Object.entries(v.read).filter(
      ([key, date]) =>
        validKeys.has(key) &&
        typeof date === "string" &&
        !isNaN(Date.parse(date)),
    ),
  );
  const s = v.settings;
  const settings: Settings = {
    dark: s?.dark === true,
    serif: s?.serif !== false,
    fontSize: [18, 20, 22, 24, 26, 28].includes(s?.fontSize) ? s.fontSize : 20,
    lineHeight: [1.8, 2.05, 2.4].includes(s?.lineHeight) ? s.lineHeight : 2.05,
    showNumbers: s?.showNumbers !== false,
    wide: s?.wide === true,
  };
  const plan =
    v.plan &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.plan.start) &&
    !isNaN(Date.parse(v.plan.start)) &&
    [90, 180, 365].includes(v.plan.days)
      ? v.plan
      : null;
  return {
    version: 1,
    bookmarks: v.bookmarks,
    notes: v.notes,
    read,
    settings,
    last: validPosition(v.last) ? v.last : null,
    plan,
  };
}
function getSnapshot() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw !== lastRaw) {
      lastRaw = raw;
      cache = raw ? validateData(JSON.parse(raw)) : defaults;
    }
  } catch {
    /* Reading remains available when browser storage is inaccessible. */
  }
  return cache;
}
function subscribe(fn: () => void) {
  listeners.add(fn);
  const handler = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) fn();
  };
  window.addEventListener("storage", handler);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", handler);
  };
}
export function useUserData() {
  return useSyncExternalStore(subscribe, getSnapshot, () => defaults);
}
export function updateUserData(update: (current: UserData) => UserData) {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) validateData(JSON.parse(raw));
  } catch {
    throw new Error(
      "저장 기록을 읽을 수 없습니다. 설정에서 원본을 백업한 뒤 브라우저 저장 설정을 확인해주세요.",
    );
  }
  const next = validateData(update(getSnapshot()));
  try {
    const raw = JSON.stringify(next);
    localStorage.setItem(KEY, raw);
    lastRaw = raw;
    cache = next;
  } catch {
    throw new Error(
      "기기에 저장하지 못했습니다. 저장 공간과 브라우저 개인정보 설정을 확인해주세요.",
    );
  }
  listeners.forEach((fn) => fn());
}
export function setSettings(value: Partial<Settings>) {
  updateUserData((s) => ({ ...s, settings: { ...s.settings, ...value } }));
}
export function toggleBookmark(verse: SavedVerse) {
  updateUserData((s) => ({
    ...s,
    bookmarks: s.bookmarks.some((v) => v.id === verse.id)
      ? s.bookmarks.filter((v) => v.id !== verse.id)
      : [verse, ...s.bookmarks],
  }));
}
export function saveNote(verse: SavedVerse, note: string) {
  updateUserData((s) => ({
    ...s,
    notes: note.trim()
      ? [
          { ...verse, note: note.trim(), updatedAt: new Date().toISOString() },
          ...s.notes.filter((n) => n.id !== verse.id),
        ]
      : s.notes.filter((n) => n.id !== verse.id),
  }));
}
export function toggleRead(book: string, chapter: number) {
  updateUserData((s) => {
    const read = { ...s.read };
    const key = `${book}/${chapter}`;
    if (read[key]) delete read[key];
    else read[key] = new Date().toISOString();
    return { ...s, read };
  });
}
export function exportData() {
  return localStorage.getItem(KEY) ?? JSON.stringify(getSnapshot(), null, 2);
}
