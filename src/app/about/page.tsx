import { PageShell } from "@/components/page-shell";
import source from "@/data/source.json";
export const metadata = { title: "출처와 이용 안내" };
export default function About() {
  return (
    <PageShell title="출처와 이용 안내">
      <div className="prose-content">
        <h2>성경 본문</h2>
        <p>
          성경전서 개역한글판 · 대한성서공회 (1961). {source.books}권,{" "}
          {source.chapters.toLocaleString()}장, {source.verses.toLocaleString()}
          절을 제공합니다. 절 구분은 배포본을 따르며 다른 번역본의 31,102절과
          차이가 있습니다.
        </p>
        <p>
          데이터는 holybible.or.kr 본문을 수집한 crizin/bible-db 배포본을
          사용합니다. 해당 배포처는 개역한글 본문을 저작재산권 보호기간이 만료된
          Public Domain으로 명시합니다. 본문의 단어와 맞춤법을 임의로 수정하지
          않았습니다.
        </p>
        <p>
          <a href={source.licenseUrl} target="_blank" rel="noreferrer">
            데이터 출처·이용 조건 확인 ↗
          </a>
        </p>
        <p>
          초기 화면의 eBible 한국어 성경 1910 샘플은 사용하지 않습니다. 해당
          배포본에서 확인된 누락을 피해 전체 데이터를 개역한글로 교체했습니다.
        </p>
        <h2>말씀카드와 이미지</h2>
        <p>
          새벽 호수 배경은 이 프로젝트를 위해 AI로 생성한 이미지입니다.
          하늘·바다·산 등 10개 테마의 일러스트 배경 200종과 색상 배경도
          제공합니다. 구절별 이미지를 서버에 저장하지 않고, 사용자의
          브라우저에서 배경과 본문을 합성합니다. 긴 구절은 카드 안에 들어가도록
          글자 크기를 자동으로 조정합니다.
        </p>
        <p>
          명조·고딕은 Noto 계열, 손글씨는 나눔손글씨 펜을 사용합니다. 모두 SIL
          Open Font License에 따라 필요한 글자로 축소한 폰트이며, 라이선스
          원문을 사이트 폰트 파일과 함께 제공합니다.
        </p>
        <h2>개인정보와 기록</h2>
        <p>
          회원가입 없이 이용합니다. 즐겨찾기, 묵상, 읽은 장, 설정은 이
          브라우저의 localStorage에 저장됩니다. 서버에 전송하거나 다른 기기와
          자동 동기화하지 않습니다. 브라우저 데이터 삭제 시 기록이 지워질 수
          있으므로 설정 화면에서 백업해주세요.
        </p>
        <h2>오프라인 읽기</h2>
        <p>
          홈 화면에 설치할 수 있으며, 마지막으로 읽은 장은 오프라인에서도 볼 수
          있습니다. 전체 검색과 새로운 장 열기는 인터넷 연결이 필요합니다.
        </p>
      </div>
    </PageShell>
  );
}
