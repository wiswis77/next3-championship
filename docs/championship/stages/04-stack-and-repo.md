---
status: done
date: 2026-09-03
---

# Stage 04 — Stack & repo

## 목표

2주 안 **작동 링크**를 위해 스택을 단순하게 잠근다.

## 결정 사항

### 확정

| 층 | 선택 | 이유 |
|----|------|------|
| 앱 | **Next.js (App Router) + TypeScript** | 웹 제출·Vercel 배포·API 한곳에 |
| UI | React + CSS Modules (또는 최소 global CSS) | 유려함 통제, UI 키트 과다 금지 |
| AI | **OpenAI-compatible Vision** (`gpt-4o` 계열) | 이미지+한국어 서류 추출, 생태계 큼 |
| 검증 | Zod | Stage 02 스키마 강제 |
| 데모 캐시 | `public/demos/*.json` + 샘플 텍스트/이미지 | API 장애 시에도 데모 |
| 배포 | **Vercel** | 링크 제출 최적 |
| 키 | `OPENAI_API_KEY` 서버 전용 | 클라이언트 노출 금지 |

### 보류

- OCR 전용 파이프라인 — 1차는 multimodal 직접. 품질 부족 시 Stage 06에서 보강
- Anthropic/Gemini 스위치 — 인터페이스만 추상화해 두기

## 레포 구조 (목표)

```
app/
  page.tsx              # Input + Result 상태머신
  api/analyze/route.ts  # AI 호출
  layout.tsx
  globals.css
lib/
  schema.ts             # Zod + types
  prompt.ts
  validate.ts           # evidence 매칭 등
  ics.ts
  demos.ts
public/
  demos/
docs/championship/      # 단계 문서 (기존)
```

## 환경 변수

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
```

사용자 확인 필요 시점: **키를 로컬/ Vercel에 넣는 순간** (Stage 05~07).

## 산출물

- 본 문서
- Stage 05에서 위 구조로 스캐폴딩

## 다음 단계

→ Stage 05 MVP Build
