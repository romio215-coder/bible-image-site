import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChapter } from "@/lib/bible-server";
import { Header } from "@/components/header";
import { BibleReader } from "@/components/bible/bible-reader";
type Props = {
  params: Promise<{ book: string; chapter: string; verse: string }>;
  searchParams: Promise<{ end?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book, chapter, verse } = await params;
  const data = getChapter(book, chapter);
  const text = data?.verses.find((v) => String(v.number) === verse)?.text;
  return {
    title:
      data && text
        ? `${data.name} ${chapter}:${verse}`
        : "말씀을 찾을 수 없습니다",
    description: text,
    alternates: { canonical: `/bible/${book}/${chapter}/${verse}` },
    openGraph: {
      title: data
        ? `${data.name} ${chapter}:${verse} | 말씀빛 Bible`
        : "말씀빛 Bible",
      description: text,
    },
  };
}
export default async function VersePage({ params, searchParams }: Props) {
  const { book, chapter, verse } = await params;
  const data = getChapter(book, chapter);
  if (!data || !data.verses.some((v) => String(v.number) === verse)) notFound();
  const { end } = await searchParams;
  const endVerse =
    end && data.verses.some((v) => String(v.number) === end) && +end >= +verse
      ? +end
      : +verse;
  return (
    <>
      <Header reader />
      <BibleReader
        key={`${book}-${chapter}-${verse}-${endVerse}`}
        chapter={data}
        initialVerse={Number(verse)}
        initialEnd={endVerse}
      />
    </>
  );
}
