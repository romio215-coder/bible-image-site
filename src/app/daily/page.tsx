import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { dailyReference, koreaDate } from "@/lib/collections";
import { getChapter } from "@/lib/bible-server";
export const metadata = { title: "오늘의 말씀" };
export default async function Daily({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: requested } = await searchParams;
  const today = koreaDate();
  const date =
    requested &&
    /^\d{4}-\d{2}-\d{2}$/.test(requested) &&
    !isNaN(Date.parse(requested)) &&
    new Date(`${requested}T00:00:00Z`).toISOString().startsWith(requested)
      ? requested
      : today;
  const ref = dailyReference(date);
  const [book, c, v] = ref.split("/");
  const chapter = getChapter(book, c)!;
  return (
    <PageShell
      title="오늘, 말씀과 함께"
      intro="한국 시간 기준으로 매일 한 구절을 만납니다."
    >
      <form className="daily-date">
        <label>
          날짜 선택
          <input type="date" name="date" defaultValue={date} required />
        </label>
        <button className="button secondary">말씀 보기</button>
      </form>
      <section className="daily-feature">
        <span className="eyebrow">{date}</span>
        <blockquote>
          {chapter.verses.find((verse) => verse.number === +v)!.text}
        </blockquote>
        <p>
          {chapter.name} {c}:{v}
        </p>
        <Link className="button primary" href={`/bible/${ref}`}>
          본문 읽기 · 말씀카드
        </Link>
      </section>
    </PageShell>
  );
}
