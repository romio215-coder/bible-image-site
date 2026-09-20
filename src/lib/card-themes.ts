import backgrounds from "@/data/backgrounds.json";

export type CardTheme = {
  id: string;
  label: string;
  category: string;
  colors: string[];
  image?: string;
  thumbnail?: string;
  text: string;
};
export const backgroundCategories = [
  ["recommended", "추천"],
  ["all", "전체"],
  ["sky", "하늘"],
  ["sea", "바다"],
  ["mountain", "산"],
  ["forest", "숲"],
  ["dawn", "새벽"],
  ["stars", "별"],
  ["desert", "광야"],
  ["path", "길"],
  ["flowers", "들꽃"],
  ["light", "빛"],
  ["solid", "색상"],
];
export const cardThemes: CardTheme[] = [
  {
    id: "nature",
    label: "새벽 호수",
    category: "dawn",
    colors: ["#3c5046", "#82937b"],
    image: "/images/bible/dawn-lake.webp",
    thumbnail: "/images/bible/dawn-lake.webp",
    text: "#fffdf5",
  },
  {
    id: "olive",
    label: "올리브",
    category: "solid",
    colors: ["#4f6251", "#88917b"],
    text: "#fffef2",
  },
  {
    id: "dawn",
    label: "새벽",
    category: "solid",
    colors: ["#545d73", "#98867e"],
    text: "#fff9ed",
  },
  {
    id: "paper",
    label: "종이",
    category: "solid",
    colors: ["#ebe1cb", "#faf5e9"],
    text: "#514b3c",
  },
  ...backgrounds,
];
// Ordered, editorial range mappings. Add ranges without modifying individual verses.
export const themeRanges = [
  { book: "genesis", from: [1, 1], to: [2, 3], category: "sky" },
  { book: "exodus", from: [14, 1], to: [14, 31], category: "sea" },
  { book: "psalms", from: [23, 1], to: [23, 6], category: "forest" },
  { book: "psalms", from: [119, 105], to: [119, 105], category: "light" },
  { book: "matthew", from: [6, 25], to: [6, 34], category: "flowers" },
  { book: "john", from: [1, 1], to: [1, 9], category: "light" },
] as const;
export function recommendedCategory(
  book: string,
  chapter: number,
  verse: number,
) {
  const position = chapter * 1000 + verse;
  return (
    themeRanges.find(
      (range) =>
        range.book === book &&
        position >= range.from[0] * 1000 + range.from[1] &&
        position <= range.to[0] * 1000 + range.to[1],
    )?.category ?? "dawn"
  );
}
export function recommendedThemes(
  book: string,
  chapter: number,
  verse: number,
) {
  const category = recommendedCategory(book, chapter, verse);
  return [
    ...cardThemes.slice(0, 4),
    ...backgrounds.filter((item) => item.category === category).slice(0, 8),
  ];
}
