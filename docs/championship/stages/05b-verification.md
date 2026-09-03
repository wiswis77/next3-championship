---
status: pass_with_notes
date: 2026-09-03
---

# Stage 05b — Verification (실분석·화면)

## 판정

### **PASS (조건부) → Stage 06 진행 가능**

OpenAI 클라우드 키 없이 **로컬 Ollama를 에이전트가 설치·모델 pull·연동**해 실분석을 통과시킴.

| 항목 | 결과 |
|------|------|
| A. 데모 UI/API | PASS |
| B. 실분석 (가정통신문) | PASS — `qwen2.5:7b`, 할 일 추출·근거·기한 |
| B. 실분석 (할 일 없는 안내) | PASS — `actions: []` |
| C. 빌드/오프라인 sanitize | PASS |
| 유려함 | 데모 화면 PASS — 06에서 미세 폴리시 |

## 에이전트가 한 일 (키 요구 대신)

1. `brew install ollama` + 서비스 시작  
2. `qwen2.5vl:3b` (비전), `qwen2.5:7b` (텍스트) pull  
3. `.env.local` 로컬 우선 설정  
4. `lib/llm.ts` — OpenAI 키 없으면 Ollama 자동  
5. 프롬프트·sanitize 강화 후 재검증  

## 실분석 요약

**가정통신문:** 동의서 제출(기한 9/12) + 준비물 — provider ollama/qwen2.5:7b  
**도서관 휴관 안내:** actions [] + empty_reason  

### 06 백로그 (품질·유려)

- 번호 환각(`3. 제출` vs `4. 제출`) — 매칭은 되지만 표시 정제
- 도시락 항목 누락 시 있음 — 샘플 세트 늘
- 결과 row 타이포/색 대비 다듬기
- 이미지 경로(qwen2.5vl) 별도 골든 테스트

## 다음

→ **Stage 06** eval & polish
