---
status: in_progress
date: 2026-09-03
---

# Stage 05 — MVP build

## 목표

Next3 웹 MVP: Input → Analyze → Result + demo fallback + `.ics`

## 진행 로그

- Next.js 스캐폴딩, `lib/*`, `/api/analyze`, UI, 데모 서류
- `npm run build` 성공

## 완료 조건

- [x] `npm run build` 성공
- [x] 데모 서류 버튼 (키 없어도 UI 데모)
- [x] Result row + 확인 필요 + ics
- [x] 모바일 폭 1컬럼 UI
- [ ] 텍스트/이미지 실분석 (사용자 `OPENAI_API_KEY` 필요)
- [ ] 로컬에서 데모 플로우 육안 확인

## 사용자 확인 (키)

프로젝트 루트에 `.env.local` 생성:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```

그다음 `npm run dev` → http://localhost:3000 → **데모 서류로 해보기**

## 다음

키 넣고 동작 확인되면 Stage 06 (골든 샘플·폴리시) → 07 배포
