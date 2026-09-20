import { PageShell } from "@/components/page-shell";
import { PersonalLibrary } from "@/components/personal-library";
export const metadata = {
  title: "통독 계획과 읽은 기록",
  robots: { index: false },
};
export default function Page() {
  return (
    <PageShell title="하루 한 장, 쌓여가는 말씀">
      <PersonalLibrary mode="reading-plan" />
    </PageShell>
  );
}
