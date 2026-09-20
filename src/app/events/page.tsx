import { PageShell } from "@/components/page-shell";
import { ExploreList } from "@/components/explore-list";
import { events } from "@/lib/explore";
export const metadata = {
  title: "성경 사건",
  description:
    "창조에서 초대교회까지 대표 사건 12개를 성경 본문에서 살펴보세요.",
};
export default function Events() {
  return (
    <PageShell
      title="말씀 속 중요한 순간"
      intro="사건의 요약과 실제 구절을 함께 보고 본문으로 이어가세요."
    >
      <ExploreList entries={events} />
    </PageShell>
  );
}
