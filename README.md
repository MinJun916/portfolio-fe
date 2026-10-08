# MinJun Shin · Portfolio

개인 포트폴리오 사이트입니다. 메인 페이지와 프로젝트 상세(무빙, 공부의 숲, 독스루)를 포함합니다.

## 구성

- **메인** — Hero, About, Tech Stack, Experience, Projects, Footer
- **프로젝트 목록** (`/projects`) — 프로젝트 카드 그리드
- **프로젝트 상세** (`/projects/moving`, `/projects/studyforest`, `/projects/docthrough`) — 개요, 기여, 트러블슈팅, 회고, 팀원 피어 리뷰, 기술 스택, 목차(TOC)

## 기술 스택

- **Framework** — Next.js 16 (App Router)
- **UI** — React 19, Tailwind CSS 4, shadcn/ui, Ant Design Icons
- **기타** — TypeScript, tech-stack-icons, Sonner (toast)

## 로컬 실행

이 프로젝트는 **pnpm**을 패키지 매니저로 사용합니다.

```bash
# 의존성 설치
pnpm install

# 개발 서버 (http://localhost:3000)
pnpm dev
```

## 관리자

`/admin/login`에서 백엔드에 등록된 관리자 계정으로 로그인합니다. 토큰은 `localStorage`에 저장하며, `/admin` 하위 화면은 관리자 조회 API로 인증한 후 표시합니다. 401 응답 또는 다른 탭의 로그아웃 시 토큰과 관리자 캐시를 지웁니다.

`.env.local`에 백엔드의 API 주소를 설정하세요. 주소에는 `/api/v1`까지 포함합니다.

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

프론트는 기본 3000번 포트를 사용합니다. 백엔드는 별도 포트(예: `PORT=3001`)로 실행하고 `CORS_ORIGINS`에 프론트의 정확한 origin을 허용해야 합니다. 관리자 계정 생성과 DB 초기화는 백엔드의 기존 절차를 따릅니다.

관리 화면: 사이트 문구, 프로젝트(케이스 스터디·변경 기록 포함), 경력·활동, 기술 그룹, 비밀번호. 콘텐츠 생성·수정·영구 삭제·공개 설정·표시 순서 변경을 지원하며 버전 충돌 시 작성 내용을 보존합니다. 이미지는 업로드 대신 기존 경로나 URL을 입력합니다. Query Devtools는 개발 모드에서 표시합니다.

현재 공개 포트폴리오 화면은 기존 정적 데이터를 사용합니다. 관리자에서 저장한 값은 백엔드 콘텐츠 API에 반영됩니다.

## 스크립트

| 명령어        | 설명               |
| ------------- | ------------------ |
| `pnpm dev`    | 개발 서버 실행     |
| `pnpm build`  | 프로덕션 빌드      |
| `pnpm start`  | 빌드 결과물 실행   |
| `pnpm lint`   | ESLint 실행        |
| `pnpm format` | Prettier 포맷 적용 |

## 프로젝트 구조 (요약)

```
src/
├── app/              # 라우트·레이아웃
├── components/       # 공통·홈·프로젝트 컴포넌트
├── views/            # 페이지별 뷰 (moving, studyforest, docthrough)
└── lib/              # 유틸, summary 데이터
```

배포는 Vercel 등 Next.js 호환 플랫폼에서 빌드 후 배포하면 됩니다.

---

© 2026 MinJun Shin. All rights reserved.
