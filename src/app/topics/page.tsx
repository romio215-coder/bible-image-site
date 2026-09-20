import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { topics } from "@/lib/collections";
export const metadata = { title: "주제별 말씀" };
export default function Topics() {
  return (
    <PageShell
      title="지금, 마음에 필요한 말씀"
      intro="한 구절을 읽고, 앞뒤 본문을 함께 살펴보세요."
    >
      <div className="topic-grid">
        {topics.map((t) => (
          <Link href={`/topics/${t.slug}`} key={t.slug}>
            {t.name}
            <span>{t.refs.length}개의 말씀 →</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
