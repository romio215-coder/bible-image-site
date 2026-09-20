import registry from "@/data/books.json";

export type Verse = { number: number; text: string };
export type Chapter = {
  book: string;
  name: string;
  english: string;
  testament: string;
  chapter: number;
  chapters: number;
  title: string;
  sourceUrl: string;
  verses: Verse[];
};
export type Book = {
  book: string;
  name: string;
  english: string;
  code: string;
  chapters: number;
  testament: string;
};
export const books: Book[] = registry;
export const translation = "성경전서 개역한글판";
export const allChapters = books.flatMap((book) =>
  Array.from({ length: book.chapters }, (_, i) => ({
    book: book.book,
    name: book.name,
    chapter: i + 1,
  })),
);
export function chapterPath(chapter: { book: string; chapter: number }) {
  return `/bible/${chapter.book}/${chapter.chapter}`;
}
export function versePath(
  chapter: { book: string; chapter: number },
  verse: number,
) {
  return `${chapterPath(chapter)}/${verse}`;
}
export function neighborChapter(
  book: string,
  chapter: number,
  direction: number,
) {
  const index = allChapters.findIndex(
    (c) => c.book === book && c.chapter === chapter,
  );
  return allChapters[index + direction];
}
export const bookGroups = [
  {
    name: "모세오경",
    books: ["창세기", "출애굽기", "레위기", "민수기", "신명기"],
  },
  {
    name: "역사서",
    books: [
      "여호수아",
      "사사기",
      "룻기",
      "사무엘상",
      "사무엘하",
      "열왕기상",
      "열왕기하",
      "역대상",
      "역대하",
      "에스라",
      "느헤미야",
      "에스더",
    ],
  },
  { name: "시가서", books: ["욥기", "시편", "잠언", "전도서", "아가"] },
  {
    name: "선지서",
    books: [
      "이사야",
      "예레미야",
      "예레미야애가",
      "에스겔",
      "다니엘",
      "호세아",
      "요엘",
      "아모스",
      "오바댜",
      "요나",
      "미가",
      "나훔",
      "하박국",
      "스바냐",
      "학개",
      "스가랴",
      "말라기",
    ],
  },
  {
    name: "복음서 · 사도행전",
    books: ["마태복음", "마가복음", "누가복음", "요한복음", "사도행전"],
  },
  {
    name: "서신서 · 예언서",
    books: [
      "로마서",
      "고린도전서",
      "고린도후서",
      "갈라디아서",
      "에베소서",
      "빌립보서",
      "골로새서",
      "데살로니가전서",
      "데살로니가후서",
      "디모데전서",
      "디모데후서",
      "디도서",
      "빌레몬서",
      "히브리서",
      "야고보서",
      "베드로전서",
      "베드로후서",
      "요한일서",
      "요한이서",
      "요한삼서",
      "유다서",
      "요한계시록",
    ],
  },
];
