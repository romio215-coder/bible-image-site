import Link from "next/link";
import { getChapter } from "@/lib/bible-server";
import { type ExploreEntry } from "@/lib/explore";
export function ExploreList({
  entries,
  ordered = false,
}: {
  entries: ExploreEntry[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <List className={`explore-list ${ordered ? "explore-timeline" : ""}`}>
      {entries.map((entry, index) => {
        const chapter = getChapter(entry.book, entry.chapter);
        const verse = chapter?.verses.find((v) => v.number === entry.verse);
        if (!chapter || !verse)
          throw new Error(
            `Invalid exploration reference: ${entry.book}/${entry.chapter}/${entry.verse}`,
          );
        return (
          <li key={entry.name}>
            {ordered && (
              <span className="eyebrow">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <h2>{entry.name}</h2>
            <p>{entry.summary}</p>
            <blockquote>{verse.text}</blockquote>
            <Link
              href={`/bible/${entry.book}/${entry.chapter}/${entry.verse}`}
              prefetch={false}
            >
              {chapter.name} {entry.chapter}:{entry.verse} · 본문과 말씀카드 →
            </Link>
          </li>
        );
      })}
    </List>
  );
}
