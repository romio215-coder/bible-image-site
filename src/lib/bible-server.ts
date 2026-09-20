import "server-only";
import corpus from "@/data/bible.json";
import { books, type Chapter, type Verse } from "./bible";
const data = corpus as Record<string, Record<string, Verse[]>>;
export function getChapter(
  book: string,
  chapter: string | number,
): Chapter | undefined {
  const meta = books.find((b) => b.book === book);
  if (
    !meta ||
    !/^\d+$/.test(String(chapter)) ||
    String(Number(chapter)) !== String(chapter)
  )
    return;
  const verses = data[book]?.[chapter];
  if (!verses) return;
  return {
    ...meta,
    chapter: Number(chapter),
    title:
      book === "genesis" && Number(chapter) === 1
        ? "천지 창조"
        : book === "john" && Number(chapter) === 3
          ? "거듭남과 영원한 생명"
          : "말씀을 읽고 마음에 담으세요",
    sourceUrl: "https://github.com/crizin/bible-db",
    verses,
  };
}
export type SearchResult = {
  book: string;
  name: string;
  chapter: number;
  number: number;
  text: string;
};
export function searchBible(
  query: string,
  bookFilter = "",
  testament = "",
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const reference = q
    .replace(/\s/g, "")
    .match(/^(.+?)(\d+)(?:장)?(?::|절)?(\d+)?$/);
  const referenceBook =
    reference &&
    books.find((b) =>
      [b.name, b.book, b.code.toLowerCase()].includes(reference[1]),
    );
  const results: SearchResult[] = [];
  for (const book of books) {
    if (
      (bookFilter && book.book !== bookFilter) ||
      (testament && book.testament !== testament)
    )
      continue;
    for (const [c, verses] of Object.entries(data[book.book])) {
      for (const verse of verses) {
        const matched = referenceBook
          ? book.book === referenceBook.book &&
            +c === Number(reference![2]) &&
            (!reference![3] || verse.number === Number(reference![3]))
          : verse.text.toLowerCase().includes(q);
        if (matched)
          results.push({
            book: book.book,
            name: book.name,
            chapter: +c,
            ...verse,
          });
      }
    }
  }
  return results;
}
