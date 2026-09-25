# 말씀빛 Bible

Next.js 16.3.5 App Router · React · TypeScript · Tailwind CSS 4 기반 성경 읽기 서비스입니다. 첫 화면 UI에 이어 비회원 핵심 기능을 구현했습니다.

## 실행

Sites 호스팅용 빌드는 `npm run build`, 일반 Next.js/Node용 빌드는 `npm run build:next`입니다. `npm run start`와 기존 UI 테스트는 Next.js 빌드를 사용합니다. Sites 배포는 Vinext와 Cloudflare Workers 호환 출력을 사용하며 원래 Next.js 개발 명령도 유지합니다.

Node.js 20.9 이상이 필요하며 Node.js 24.12.0으로 검증했습니다.

```sh
npm install
npm run dev
```

브라우저에서 http://127.0.0.1:3000 을 엽니다. Windows에서 실행 정책이 npm을 차단하면 `npm.cmd`를 사용하세요.

```sh
npm run test:data
npm run lint
npm run typecheck
npm run build
npm run start
npm run test:ui
```

브라우저 테스트는 설치된 Microsoft Edge를 사용합니다. 개발 서버 대신 프로덕션 빌드를 대상으로 실행하며, 서버가 없으면 자동으로 시작합니다.

## 구현한 기능

- 개역한글 **66권·1,189장·31,101절** 전체 본문, 권/장 목록, 이전·다음 장 이동.
- PC 3단, 태블릿 2단, 모바일 본문 및 하단 패널 레이아웃.
- 특정 절 URL과 자동 스크롤, 여러 절 연속 선택과 범위 공유 링크.
- 브라우저 Canvas 말씀카드: 자연 배경·일러스트 200종·색상 배경, 1:1·4:5·9:16, 명조/고딕/손글씨, 글자 크기.
- 배경 테마 필터, 12개씩 페이지 이동, 성경 장절 범위별 배경 추천.
- 성경 인물 12개 항목, 대표 사건 12개와 이야기 순서표. 실제 본문·말씀카드로 연결합니다.
- 미리보기와 동일한 PNG/WebP 다운로드. 긴 본문 자동 줄바꿈과 크기 조정. 카드에 담을 수 없는 긴 범위는 명확한 오류로 안내.
- Web Share 지원 브라우저에서 카드 파일 공유, 미지원 시 말씀·링크 공유/복사.
- 전체 성경 단어·문장·장절 검색, 구약/신약·책 필터, 결과 페이지 이동.
- 날짜별 오늘의 말씀(한국 시간), 24개 주제의 엄선 구절.
- 즐겨찾기, 묵상 작성·수정·삭제, 읽은 장 토글, 전체·권별 진도.
- 90/180/365일 통독 계획 및 날짜별 분량.
- 마지막 읽던 장, 다크모드, 글자 크기·글꼴·줄 간격·절 번호·본문 폭의 기기 저장.
- 개인 기록 JSON 백업·검증·합치기, 저장 실패 안내 및 손상 데이터 덮어쓰기 방지.
- PWA 설치용 manifest·아이콘, 마지막 읽은 장의 오프라인 전용 읽기 화면.
- 서버 렌더링, 경로별 제목/설명/canonical, 배포 도메인에 따른 robots·sitemap.

## 경로

| 경로 | 기능 |
| --- | --- |
| `/` | 메인, 오늘의 말씀, 계속 읽기 |
| `/bible` | 66권 목록과 계속 읽기 |
| `/bible/john` | 요한복음 장 목록 |
| `/bible/john/3` | 요한복음 3장 |
| `/bible/john/3/16?end=18` | 16–18절 선택 |
| `/search` | 전체 성경 검색 |
| `/daily` | 날짜별 오늘의 말씀 |
| `/topics`, `/topics/love` | 주제 목록, 사랑의 말씀 |
| `/bookmarks`, `/notes` | 저장한 말씀, 묵상 |
| `/reading-plan` | 통독 계획·진도 |
| `/settings` | 기록 백업·가져오기 |
| `/about` | 본문·이미지 출처와 개인정보 저장 안내 |
| `/people`, `/events`, `/timeline` | 대표 인물·사건·성경 이야기 흐름 |

## 이번에 추가/수정한 주요 파일

- `src/data/books.json`, `bible.json`, `source.json`: 전체 본문, 66권 메타데이터, 고정 출처·해시.
- `scripts/import-bible.mjs`, `check-data.mjs`: 원문 가져오기 및 누락·중복·장절 검사.
- `src/lib/bible.ts`, `bible-server.ts`: 가벼운 클라이언트 메타데이터와 서버 전용 전체 본문/검색 분리.
- `src/lib/user-store.ts`: 버전별 저장 구조, 입력 검증, 기기 저장, 탭 간 변경 반영.
- `src/lib/card-canvas.ts`: 카드 테마, 이미지 합성, 줄바꿈, 폰트 로딩, 파일 저장.
- `src/lib/collections.ts`, `site.ts`: 주제·오늘의 말씀과 배포 origin.
- `src/components/bible/*`, `verse-card/verse-card.tsx`: 전체 탐색, 개인 기록, 카드 편집.
- `src/components/personal-library.tsx`, `continue-reading.tsx`, `theme-sync.tsx`, `offline-registration.tsx`, `page-shell.tsx`: 개인 화면과 공통 동작.
- `src/app/`의 위 경로별 페이지 및 `layout.tsx`, `globals.css`, `manifest.ts`, `robots.ts`, `sitemap.ts`.
- `public/images/bible/dawn-lake.webp`, `public/icons/*`, `public/sw.js`, `public/offline.html`.
- `tests/reader.spec.ts`, `package.json`, `.env.example`, `next.config.ts`, `Dockerfile`, `.dockerignore`.
- `supabase/migrations/001_user_records.sql`, `docs/DEPLOYMENT.md`, `docs/ASSETS.md`.

초기 샘플 JSON과 `import-samples.mjs`는 보존되어 있지만 앱에서 사용하지 않습니다. 전체 본문을 클라이언트 번들에 넣지 않고 서버에서 요청한 장 또는 검색 결과만 전달합니다. 자주 쓰는 화면을 정적으로 만들며 나머지 장은 처음 요청할 때 생성해 캐시합니다.

## 데이터 출처와 검증

**성경전서 개역한글판 · 대한성서공회 (1961).** [crizin/bible-db](https://github.com/crizin/bible-db)의 holybible 배포본을 사용합니다. [배포처 NOTICE](https://github.com/crizin/bible-db/blob/4bcb50b3ead59d20b4a6b847f5c79ab4cdba6a2c/NOTICE)는 해당 본문을 Public Domain으로 명시하며 출처 표기와 본문 보존을 요구합니다. 개역개정·새번역을 포함하지 않습니다.

원문 고정 버전: `4bcb50b3ead59d20b4a6b847f5c79ab4cdba6a2c`. SHA256 및 가져온 시점은 `src/data/source.json`에 기록했습니다. 본문 단어·맞춤법을 수정하거나 AI로 보충하지 않았습니다.

첫 단계에서 사용한 eBible 1910 배포본은 **1,188장·30,991절**로 베드로전서 5장 등 누락이 확인되어 사용하지 않습니다. 현재 데이터는 1,189장이 모두 있으며 베드로전서 5장 14절, 시편 119편 176절, 요한계시록 마지막 절도 별도 확인했습니다. **31,101절**은 현재 배포본의 절 구분이며 요구서의 약 31,102절과 한 절 차이가 있습니다. 실제 판본 차이를 숨기거나 가짜 절을 추가하지 않았습니다.

## 이미지

[생성 방식·최종 프롬프트 기록](docs/ASSETS.md)에 정리했습니다. 내장 Imagegen으로 생성한 자연 배경 한 장, 직접 작성한 벡터 풍경 기반 WebP 일러스트 200종(10개 테마 × 20개 변형), 세 가지 색상 테마를 제공합니다. 일러스트 원본 200장 전체가 약 2.8MB이며, 선택 목록에는 작은 썸네일만 사용합니다. 생성된 말씀카드는 서버에 저장하지 않습니다.

## 검증 범위

GitHub Actions의 `.github/workflows/ci.yml`은 main 푸시와 PR에서 데이터 검사·ESLint·타입 검사·빌드를 실행합니다. 공개 배포 작업은 포함하지 않습니다.

- 데이터: 66권·1,189장·31,101절, 장/절 연속성·중복·빈 본문 검사.
- TypeScript, ESLint, 프로덕션 빌드.
- Playwright PC/모바일: 전체 읽기·장 이동, 서버 HTML, 404, 검색·필터, 24개 주제, 저장·묵상·새로고침 복원, PNG의 1080px 크기·WebP 형식, 범위 카드·백업 복원, 실제 네트워크 차단 후 오프라인 읽기.
- 320px·768px·1024px 가로 넘침 검사 및 화면 캡처.
- 최종 PC/모바일 자동 테스트 14개 통과: 인물·사건·연대표의 본문 연결, 배경 추천·필터·페이지 이동, 손글씨 로딩과 다운로드 이미지 변화까지 확인했습니다.
- 배경 라이브러리 확장 전인 2026-09-20 로컬 프로덕션 읽기 화면의 Lighthouse 모바일 측정: 성능 96, 접근성 100, 권장사항 100. LCP 2.6초, TBT 30ms, CLS 0.002. 실제 배포 환경의 점수는 달라질 수 있습니다.
- 로컬 SEO 점수 66은 도메인 미설정 시 의도적으로 색인을 차단한 결과입니다. 공개 도메인 설정 후 별도 검증이 필요합니다.
- 캡처/실행 결과는 `test-results/`에 생성되며 Git에서 제외됩니다.

## 아직 외부 연결이 필요한 부분

사용자와 합의한 대로 현재는 **비회원 기능과 연결 준비**까지입니다.

구체적인 연결 조건과 현재 콘텐츠 범위는 [남은 작업](docs/REMAINING.md)에 정리했습니다.

- Supabase 계정, 로그인 및 실제 기기 간 자동 동기화: 미연결. RLS SQL·환경변수 예시·연결 절차만 준비했습니다.
- 외부 호스팅·도메인·공개 배포: 수행하지 않았습니다. [배포 안내](docs/DEPLOYMENT.md)를 참고하세요.
- 실제 iPhone Safari 기기 테스트는 수행하지 않았습니다. 모바일 자동 테스트는 Edge의 iPhone 화면 크기 에뮬레이션입니다.
- 기기 저장은 브라우저 데이터 삭제 시 사라집니다. 백업 기능을 이용하세요. 메모와 기록은 서버에 전송되지 않습니다.
- PWA 오프라인 범위는 마지막 읽은 **한 장**입니다. 전체 검색과 새 장 읽기는 연결이 필요합니다.
- `NEXT_PUBLIC_SITE_URL` 미설정 로컬 환경은 색인이 차단됩니다. 실제 도메인을 설정하고 다시 빌드해야 공개 SEO 설정이 활성화됩니다.
