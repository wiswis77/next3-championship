---
status: pass_tunnel
date: 2026-09-03
---

# Stage 07 — Deploy & submit prep

## 판정

### 공개 URL (지금 사용 가능)

**https://legislative-barely-hours-pickup.trycloudflare.com**

- Cloudflare quick tunnel → 로컬 Next(`:3000`) + Ollama
- 데모 API 스모크: PASS (할 일 3개)
- Vercel: CLI 로그아웃 상태 → 영구 배포는 로그인 후 (또는 `--temporary` claim)

## 중요

이 터널 URL은 **이 Mac이 켜져 있고** `next dev` + `ollama` + `cloudflared`가 살아 있을 때만 동작한다.  
심사·투표 기간에는 노트북 절전 금지.

## 한 일

1. `cloudflared` brew 설치  
2. `cloudflared tunnel --url http://127.0.0.1:3000`  
3. 공개 URL 스모크 200 + demo analyze  

## 다음 (선택)

- Vercel 로그인 후 영구 URL + (가능하면) `OPENAI_API_KEY`  
- 제출문 초안 (문제 / AI / 스택 / 링크)

## 제출용 한 줄

Next3 — 안내문 → 할 일 최대 3개.  
데모·실분석: https://legislative-barely-hours-pickup.trycloudflare.com
