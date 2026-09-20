import { PageShell } from "@/components/page-shell";
import { ExploreList } from "@/components/explore-list";
import { events } from "@/lib/explore";
export const metadata = {
  title: "성경 연대표",
  description: "성경 이야기의 흐름을 따라 대표 본문을 순서대로 읽습니다.",
};
export default function Timeline() {
  return (
    <PageShell
      title="성경 이야기의 흐름"
      intro="창조에서 초대교회까지 대표 이야기를 따라갑니다. 연대를 확정한 역사표가 아닌 본문 읽기 순서이며, 모든 사건을 포함하지는 않습니다."
    >
      <ExploreList entries={events} ordered />
    </PageShell>
  );
}
