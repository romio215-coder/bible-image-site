import { PageShell } from "@/components/page-shell";
import { ExploreList } from "@/components/explore-list";
import { people } from "@/lib/explore";
export const metadata = {
  title: "성경 인물",
  description: "성경의 대표 인물 이야기 12개와 관련 본문을 함께 읽어보세요.",
};
export default function People() {
  return (
    <PageShell
      title="말씀 속 사람들"
      intro="대표 인물의 한 장면에서 시작해, 앞뒤 본문을 함께 읽어보세요."
    >
      <ExploreList entries={people} />
    </PageShell>
  );
}
