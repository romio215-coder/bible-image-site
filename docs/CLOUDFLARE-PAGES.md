# Cloudflare Pages 자동 배포

- GitHub: https://github.com/romio215-coder/bible-image-site
- Pages 프로젝트: `wordlight-bible`
- 프로덕션 브랜치: `main`
- 빌드 명령: `npm run build`
- 출력 폴더: `.pages`
- 프레임워크 프리셋: 없음 (사용자 지정 빌드)
- Node.js: 24
- 기본 주소: https://wordlight-bible.pages.dev
- 사용자 지정 도메인: 사용자 요청으로 연결하지 않음

기존 서버 렌더링을 유지하는 Pages advanced mode 배포입니다. `vinext`가 만든 서버 모듈은 `.pages/_worker.js/`에만 배치하고, 이미지·폰트·클라이언트 파일은 Pages 정적 자산으로 제공합니다. 검색, 날짜별 말씀, 임의의 장·절 주소를 정적 페이지 수 제한 없이 처리합니다.

`wrangler.jsonc`는 Pages 런타임 설정이며, `wrangler.worker.jsonc`는 Vite 빌드 전용 설정입니다. 둘을 혼용하지 않습니다. `NEXT_PUBLIC_SITE_URL`은 빌드 환경과 런타임 모두 Pages 기본 주소로 설정합니다. 도메인을 바꿀 때는 사용자 승인 후 이 값도 함께 갱신합니다.

## 로컬 검증

```sh
npm ci
npm run lint
npm run test:data
npm run typecheck
npm run build
npm run preview:pages
```

미리보기 주소는 http://127.0.0.1:3001 입니다. 서버 모듈은 공개 정적 URL로 제공하면 안 됩니다. Pages가 `_worker.js`를 함수 번들로 처리하는지 배포 로그를 확인합니다.

기존 Sites 빌드가 필요한 경우 `npm run build:sites`를 사용합니다. 기존 Sites 공개 주소를 삭제하거나 리다이렉트하지 않습니다.
