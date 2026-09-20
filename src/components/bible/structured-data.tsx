import { publicOrigin } from "@/lib/site";
import { chapterPath, type Chapter } from "@/lib/bible";
export function BibleStructuredData({ chapter }: { chapter: Chapter }) {
  const origin = publicOrigin();
  if (!origin) return null;
  const name = `${chapter.name} ${chapter.chapter}장`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name,
        inLanguage: "ko",
        url: `${origin}${chapterPath(chapter)}`,
        isBasedOn: chapter.sourceUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "성경 읽기",
            item: `${origin}/bible`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: chapter.name,
            item: `${origin}/bible/${chapter.book}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: `${origin}${chapterPath(chapter)}`,
          },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
