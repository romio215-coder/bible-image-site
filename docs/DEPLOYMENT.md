# 계정 및 배포 연결 준비

## Sites 호스팅

후추 스튜디오와 같은 Sites 호스팅을 선택했습니다. 성경사이트만의 `.openai/hosting.json`으로 별도 등록하며 GitHub origin은 `bible-image-site`를 유지합니다. `npm run build`로 Worker와 공개 에셋을 생성합니다. Windows 한글 경로에서 발생하는 번들러 파일 복사 문제는 임시 영문 경로로 소스를 복사해 처리합니다. 일반 Node/Docker 배포는 `npm run build:next`를 사용합니다.

사용자 요청에 따라 현재 서비스는 **비회원 모드**입니다. Supabase 프로젝트와 호스팅은 생성하지 않았으며 실제 데이터 동기화나 외부 배포는 수행하지 않았습니다.

## 배포

1. Node.js 20.9 이상을 제공하는 Next.js 호스팅을 선택합니다. Node.js 24 사용을 권장합니다.
2. `.env.example`을 참고해 `NEXT_PUBLIC_SITE_URL`에 실제 서비스의 HTTPS origin을 입력합니다. `/경로` 없이 지정합니다.
3. `npm ci`, `npm run test:data`, `npm run lint`, `npm run typecheck`, `npm run build`를 실행합니다.
4. 일반 Node.js 호스팅에서는 `npm run start -- --hostname 0.0.0.0`로 외부 연결을 허용합니다. 프록시에서 HTTPS를 적용합니다.
5. Docker 호스팅에는 제공한 Dockerfile을 사용할 수 있습니다. 빌드 인자로 실제 사이트 주소를 전달합니다.

```sh
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.example -t wordlight-bible .
docker run --rm -p 3000:3000 wordlight-bible
```

`your-domain.example`은 설명용이며 실제 주소로 바꿔야 합니다. Dockerfile은 standalone 빌드와 비루트 사용자 실행을 준비한 것이며, 현재 환경에서 Docker 실행 자체를 검증하지는 않았습니다. Vercel 등 Next.js 지원 호스팅에서는 Docker가 필요하지 않습니다.

환경변수 미설정 상태에서는 robots가 색인을 차단하고 sitemap은 비어 있습니다. 주소를 설정하고 다시 빌드하면 장별 canonical, robots, 1,189장 sitemap을 실제 도메인으로 생성합니다. 앱 주소는 요청의 임의 Host 헤더로 구성하지 않습니다. 공개 전 서비스 운영자 정보와 연락처, 이용약관을 운영 정책에 맞게 추가해야 합니다.

## Supabase

1. 사용자 소유 Supabase 프로젝트를 준비합니다.
2. SQL 편집기에서 `supabase/migrations/001_user_records.sql`을 한 번 적용합니다.
3. Auth의 Site URL과 Redirect URLs를 실제 HTTPS 도메인으로 제한합니다.
4. `.env.example`의 공개 URL·publishable key를 설정합니다. `service_role` 비밀 키를 브라우저나 `NEXT_PUBLIC_` 변수에 넣지 않습니다.
5. **아직 구현하지 않은 후속 연결:** SDK Auth 클라이언트, 로그인/로그아웃, 세션 복구, 동기화 어댑터와 충돌 안내. 환경변수만 입력해도 자동으로 로그인/동기화되는 상태는 아닙니다.
6. `user_records`는 `(user_id, kind, record_key)`를 기본키로 하며 RLS로 본인 자료만 읽고 변경할 수 있게 준비했습니다. 익명 역할에는 접근을 부여하지 않습니다.
7. 동기화 연결 시 삭제를 복원하지 않도록 `deleted` tombstone을 사용하고 서버 `updated_at`을 기준으로 충돌을 처리합니다. 기존 기기 자료를 업로드하기 전 사용자에게 합칠 대상 계정을 명확히 표시합니다.
8. 배포 전 두 계정으로 상대 계정 자료에 접근할 수 없는지 실제 Supabase 통합 테스트를 수행해야 합니다. 이 SQL은 아직 원격에서 실행되지 않았습니다.

## 오프라인 / 캐시

- 프로덕션 모드에서 Service Worker를 등록합니다. 개발 모드에서는 등록하지 않습니다.
- 온라인에서 새 페이지는 서버에서 가져오고, 연결 실패 시 독립된 오프라인 읽기 화면을 제공합니다.
- 마지막 장 하나만 localStorage에 보관합니다. 전체 본문·개인 메모를 Service Worker의 HTTP 캐시에 보관하지 않습니다.
- 로컬 테스트 중 서비스워커를 해제하려면 개발자도구의 Application → Service Workers에서 해제합니다.
- 외부 배포 후 PWA 설치·Web Share API는 HTTPS와 브라우저 지원이 필요합니다.

## 원문 갱신

`src/data/source.json`의 고정 커밋·SHA256를 기준으로 원문을 추적할 수 있습니다. 새 버전 데이터는 별도로 출처와 장·절 차이를 검토한 뒤 `scripts/import-bible.mjs`로 가져옵니다. `npm run test:data`로 누락·중복·장 수를 검사합니다. 출처의 절 수가 바뀌면 예상치를 무조건 바꾸지 말고 원인부터 확인합니다.
