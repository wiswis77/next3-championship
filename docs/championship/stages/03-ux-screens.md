---
status: done
date: 2026-09-03
confirmed_by: user
---

# Stage 03 — UX screens & demo

## 목표

30초 데모가 **한 호흡**으로 끝나게 화면·카피·데모 시나리오를 잠근다.  
유려함 = 화면 수 최소화 + 결과의 여백.

## 결정 사항

### 확정

- 화면은 **2장 + 얇은 상태**만: `Input` / `Result` (+ loading / error)
- 채팅 UI 없음
- 결과에서 **문서 요약 블록 없음**
- 브랜드 가제 **Next3** 유지 (나중에 교체 가능)
- 사용자 확인: 2026-09-03 `OK`

## 정보 구조

### Screen A — Input

- 상단: 이름 `Next3` (작게) + 한 줄 *서류는 넣기만. 할 일만 남깁니다.*
- 본체: **사진 선택 / 촬영** 또는 **텍스트 붙여넣기**
- CTA: `할 일 뽑기`
- 보조: `데모 서류로 해보기`

### Screen B — Result

- 할 일 N개, 얇은 row: title / due / if_skipped / evidence / 확인 필요 / `.ics`
- N=0 empty 문구
- `다른 서류` → Input

### States

- Loading: `할 일을 고르는 중`
- Error: `다시 시도` + 데모 유도

## 30초 데모

긴 서류 → 뽑기 → 근거+안 하면 → 캘린더 또는 “뽑기가 본체”

## 다음 단계

→ Stage 04 (완료) → Stage 05 구현
