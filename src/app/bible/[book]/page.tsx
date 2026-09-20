import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/lib/bible";
import { PageShell } from "@/components/page-shell";
export function generateStaticParams() {
  return books.map((b) => ({ book: b.book }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const { book } = await params;
  return {
    title: `${books.find((b) => b.book === book)?.name ?? "성경"} 장 선택`,
  };
}
export default async function BookPage({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const { book } = await params;
  const data = books.find((b) => b.book === book);
  if (!data) notFound();
  return (
    <PageShell
      title={data.name}
      intro={`${data.chapters}장 · 읽을 장을 선택하세요.`}
    >
      <div className="book-chapter-list">
        {Array.from({ length: data.chapters }, (_, i) => (
          <Link key={i} href={`/bible/${book}/${i + 1}`} prefetch={false}>
            {i + 1}장
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
