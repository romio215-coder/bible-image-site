# 이미지 생성 기록

- 방식: 내장 Imagegen 도구, 신규 생성 1회.
- 최종 프로젝트 경로: `public/images/bible/dawn-lake.webp`.
- 크기: 1024 × 1536, WebP 약 67KB. 생성 원본은 보존하고 웹용 형식으로 압축했습니다.
- 용도: 모든 구절이 재사용할 수 있는 새벽 호수 배경. 카드 본문과 가독성 오버레이는 브라우저 Canvas에서 그립니다.
- 현재 배경 풀: 자연 사진 스타일 1장 + 절차적으로 그린 일러스트 200종 + 색상 배경 3종, 총 204가지 선택지입니다.

## 일러스트 배경 라이브러리

`scripts/generate-backgrounds.mjs`에서 직접 작성한 벡터 풍경을 WebP로 변환합니다. 하늘·바다·산·숲·새벽·별·광야·길·들꽃·빛의 10개 테마마다 20개 변형이며, 지형·나무·별·꽃·빛의 위치와 색상을 고정 난수로 달리 그립니다. 사진 200장이나 개별 AI 생성 이미지 200장을 뜻하지 않습니다.

- 원본: `public/images/bible/illustrations/`, 1080×1620, 200장 총 2,800,764바이트.
- 썸네일: `public/images/bible/thumbnails/`, 120×180, 총 128,332바이트.
- 목록: `src/data/backgrounds.json`. 카드 화면에는 한 번에 12개만 보여주며 원본은 선택 시 요청합니다.
- 재생성: `node scripts/generate-backgrounds.mjs` (Next.js와 함께 설치되는 sharp 사용).
- 장절 추천: `src/lib/card-themes.ts`의 `themeRanges`. 창조·홍해·시편 23편 등 범위 단위의 편집 규칙입니다.

## 폰트

Noto Serif KR, Noto Sans KR, [나눔손글씨 펜](https://github.com/google/fonts/blob/main/ofl/nanumpenscript/METADATA.pb)의 OFL 폰트를 성경 본문과 화면에 사용하는 글자로 축소했습니다. 파생 폰트 이름은 WordLight Serif/Sans/Pen이며, 라이선스 원문은 `public/fonts/OFL-*.txt`에 포함되어 있습니다. 기본 화면용과 추가 성경 글자용으로 나눠 필요한 파일만 요청합니다. 손글씨 폰트 약 299KiB는 해당 글꼴을 선택할 때 불러옵니다.

생성 스크립트는 `scripts/subset-fonts.py`, 스타일은 `src/app/fonts.css`입니다. 재생성 시 `python -m pip install --target .font-tools fonttools brotli` 후 `python scripts/subset-fonts.py`를 실행합니다. 일반 빌드에는 Python이 필요하지 않습니다.

## 이미지 최종 프롬프트

> Use case: photorealistic-natural. Asset type: reusable portrait background for Korean Bible verse cards, no words rendered. A quiet dawn lake, distant layered forested mountains along the bottom quarter, pale mist hovering over still water, muted sage-green and warm soft golden light. Large uncluttered calm midtone sky and mist in the central two thirds to overlay readable white Korean scripture later. Fine natural photographic detail, contemplative peaceful mood. Portrait 1024x1536. No people, no buildings, no text, no logo, no watermark. Save generated asset for the WordLight Bible project.
