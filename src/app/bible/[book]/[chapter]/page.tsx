import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getChapter } from "@/lib/bible-server";
import { Header } from "@/components/header";
import { BibleReader } from "@/components/bible/bible-reader";
import { BibleStructuredData } from "@/components/bible/structured-data";
type Props = { params: Promise<{ book: string; chapter: string }> };
export function generateStaticParams() {
  return [
    { book: "genesis", chapter: "1" },
    { book: "john", chapter: "3" },
  ];
}
export const revalidate = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book, chapter } = await params;
  const data = getChapter(book, chapter);
  return {
    title: data
      ? `${data.name} ${data.chapter}장 — 성경 읽기`
      : "말씀을 찾을 수 없습니다",
    description: data
      ? `${data.name} ${data.chapter}장 개역한글 본문을 읽고 말씀카드를 만드세요.`
      : undefined,
    alternates: { canonical: `/bible/${book}/${chapter}` },
  };
}
export default async function ChapterPage({ params }: Props) {
  const { book, chapter } = await params;
  const data = getChapter(book, chapter);
  if (!data) notFound();
  return (
    <>
      <Header reader />
      <BibleStructuredData chapter={data} />
      <BibleReader key={`${book}-${chapter}`} chapter={data} />
    </>
  );
}
