# Next3 — 제출·발표 패키지

## 서비스 링크

### 1) 상시 데모 (심사·투표용 철벽) — 권장 제출 링크
**https://wiswis77.github.io/next3-championship/**

- GitHub Pages 정적 데모 (서버/노트북 꺼져도 동작)
- WOW 플로우: 데모 서류 → 할 일 3개 + 근거 + 안 하면

### 2) 실분석 (로컬 AI + 터널)
**https://legislative-barely-hours-pickup.trycloudflare.com**

- Next + Ollama 실분석
- **Mac 켜짐 필수**. 재시작: `bash scripts/start-public.sh`

### 코드
https://github.com/wiswis77/next3-championship

> Vercel 영구 Next 배포는 계정 로그인(브라우저 비밀번호)이 필요해 CLI만으로는 불가.  
> 제출은 **Pages 상시 데모**를 메인으로, 터널은 “실 AI” 보조로 쓰면 됨.

## 해결한 문제

긴 안내문·가정통신문·고지를 읽고도 **‘그래서 뭐 하지?’** 가 안 나오는 병목.  
문해력이 아니라 **행동 추출**.

## AI 활용

- 입력 → JSON 할 일 ≤3, 요약 금지, evidence 필수
- due / if_skipped / confidence
- 로컬 Ollama 자동 (에이전트가 설치·검증) / OpenAI 키 있으면 클라우드
- 데모 캐시로 심사 중 장애 대비

## 스택

Next.js 15 · TypeScript · Zod · Ollama · Cloudflare Tunnel · GitHub Pages  
과정: `docs/championship/`

## 30초 데모

1. Pages 링크 연다 → **데모 서류로 해보기**  
2. 할 일만 남음 (요약 없음)  
3. 근거 + 안 하면  
4. *“요약 AI가 아니라 행동 추출기. 선택은 에이전트가 했다.”*

## 발표 훅

> 서류는 넣기만. 할 일만 남깁니다.  
> 사람의 취향 쇼핑이 아니라, 에이전트가 병목·WOW·유려함으로 고르고 검증한 결과입니다.
