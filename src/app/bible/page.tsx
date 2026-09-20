import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ContinueReading } from "@/components/continue-reading";
import { books } from "@/lib/bible";
export const metadata = { title: "성경 읽기" };
export default function Bible() {
  return (
    <PageShell
      title="말씀을 펼쳐보세요"
      intro="이어서 읽거나, 읽고 싶은 책을 선택하세요."
    >
      <ContinueReading />
      {["old", "new"].map((testament) => (
        <section key={testament}>
          <h2 className="section-subtitle">
            {testament === "old" ? "구약성경 · 39권" : "신약성경 · 27권"}
          </h2>
          <div className="book-progress">
            {books
              .filter((b) => b.testament === testament)
              .map((b) => (
                <Link href={`/bible/${b.book}`} key={b.book}>
                  <span>{b.name}</span>
                  <span>{b.chapters}장 →</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
