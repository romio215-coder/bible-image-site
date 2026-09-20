import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { topics } from "@/lib/collections";
import { getChapter } from "@/lib/bible-server";
export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  return {
    title: `${topics.find((t) => t.slug === topic)?.name ?? "주제별"} 말씀`,
  };
}
export default async function Topic({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const data = topics.find((t) => t.slug === topic);
  if (!data) notFound();
  return (
    <PageShell
      title={`${data.name}의 말씀`}
      intro="말씀을 선택하면 본문을 읽고 카드로 만들 수 있습니다."
    >
      <Link href="/topics" className="text-link">
        ← 모든 주제
      </Link>
      <div className="verse-results">
        {data.refs.map((ref) => {
          const [b, c, v] = ref.split("/");
          const chapter = getChapter(b, c)!;
          return (
            <Link href={`/bible/${ref}`} key={ref}>
              <strong>
                {chapter.name} {c}:{v}
              </strong>
              <p>{chapter.verses.find((verse) => verse.number === +v)!.text}</p>
              <span>본문과 말씀카드 보기 →</span>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
