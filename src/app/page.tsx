import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  Sunrise,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { chapterPath } from "@/lib/bible";
import { getChapter } from "@/lib/bible-server";
import { ContinueReading } from "@/components/continue-reading";
import { dailyReference, topics } from "@/lib/collections";
export const revalidate = 60;
export default function Home() {
  const chapters = [getChapter("genesis", 1)!, getChapter("john", 3)!];
  const daily = dailyReference();
  const [b, c, v] = daily.split("/");
  const today = getChapter(b, c)!;
  return (
    <>
      <Header />
      <main id="main-content" className="home-main">
        <section className="home-hero" id="daily">
          <div className="eyebrow">
            <Sunrise size={18} /> 오늘, 말씀과 함께
          </div>
          <h1>
            당신의 하루에,
            <br />
            말씀 한 줄의 빛.
          </h1>
          <p className="hero-intro">잠시 멈추어 읽고, 마음에 담아보세요.</p>
          <div className="daily-verse">
            <span className="verse-rule" />
            <blockquote>
              {today.verses.find((verse) => verse.number === +v)!.text}
            </blockquote>
            <p>
              {today.name} {c}:{v}
            </p>
            <Link className="text-link" href={`/bible/${daily}`}>
              오늘의 말씀카드 보기 →
            </Link>
          </div>
          <ContinueReading />
          <span className="hero-footnote">
            가볍게 펼치고, 천천히 머무르세요.
          </span>
          <div className="hero-side-label">
            WORDLIGHT BIBLE · A MOMENT IN THE WORD
          </div>
        </section>
        <section className="home-reading" aria-labelledby="reading-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">READ & REFLECT</span>
              <h2 id="reading-title">오늘 펼쳐볼 말씀</h2>
            </div>
            <p>처음부터, 또는 마음이 향하는 곳에서.</p>
          </div>
          <div className="reading-cards">
            {chapters.map((chapter, i) => (
              <Link
                className="reading-card"
                href={chapterPath(chapter)}
                key={chapter.book}
              >
                <div className="reading-card-icon">
                  <BookOpen size={25} strokeWidth={1.4} />
                </div>
                <div>
                  <span className="eyebrow">
                    {i === 0 ? "세상의 첫 시작" : "우리를 향한 사랑"}
                  </span>
                  <h3>
                    {chapter.name} {chapter.chapter}장
                  </h3>
                  <p>{chapter.title}</p>
                </div>
                <ArrowRight size={21} />
                <span className="card-number">0{i + 1}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="library-section" id="library">
          <div>
            <span className="eyebrow">THE BIBLE</span>
            <h2>
              한 권씩,
              <br />
              말씀 가까이.
            </h2>
            <p>
              창세기부터 요한계시록까지.
              <br />
              마음이 향하는 곳에서 읽어보세요.
            </p>
            <span className="sample-tag">66권 · 1,189장</span>
          </div>
          <div className="testament-list">
            <Link href="/bible/genesis/1">
              <span className="testament-index">01</span>
              <div>
                <span className="eyebrow">OLD TESTAMENT</span>
                <h3>
                  구약성경 <span>39권</span>
                </h3>
              </div>
              <ChevronRight size={21} />
            </Link>
            <Link href="/bible/matthew/1">
              <span className="testament-index">02</span>
              <div>
                <span className="eyebrow">NEW TESTAMENT</span>
                <h3>
                  신약성경 <span>27권</span>
                </h3>
              </div>
              <ChevronRight size={21} />
            </Link>
          </div>
        </section>
        <section className="home-topics">
          <div className="section-heading">
            <h2>마음에 필요한 말씀</h2>
            <Link href="/topics">모든 주제 →</Link>
          </div>
          <div className="topic-chips">
            {topics.slice(0, 8).map((t) => (
              <Link href={`/topics/${t.slug}`} key={t.slug}>
                {t.name}
              </Link>
            ))}
          </div>
        </section>
        <section className="quiet-note">
          <Sparkles size={20} strokeWidth={1.3} />
          <p>
            마음에 닿은 구절을 눌러보세요.
            <br />
            <span>나만의 말씀카드로 만들고, 묵상을 남겨보세요.</span>
          </p>
          <Link href="/bible/john/3/16">
            말씀 만나기 <ArrowRight size={17} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
