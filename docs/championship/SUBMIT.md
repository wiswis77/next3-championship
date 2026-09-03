# Next3 — 제출·발표 패키지

## 서비스 링크 (현재)

**https://legislative-barely-hours-pickup.trycloudflare.com**

- 로컬 Next + Ollama + Cloudflare tunnel  
- **이 Mac 전원·네트워크 유지 필수** (심사·투표 기간 절전 금지)  
- 재시작: `bash scripts/start-public.sh` 후 로그의 `*.trycloudflare.com` URL 사용  
- Vercel 영구 URL: `vercel login` 후 배포 (에이전트가 이어서 가능)

## 해결한 문제

긴 안내문·가정통신문·고지를 **읽고도 ‘그래서 뭐 하지?’가 안 나오는** 병목.  
병목은 문해력이 아니라 **행동 추출**.

## AI 활용

- 입력(이미지/텍스트) → JSON 행동 ≤3개  
- 요약 금지, **evidence(원문 근거)** 필수, 없으면 drop  
- `due` / `if_skipped` / confidence  
- 로컬: Ollama `qwen2.5:7b`(+비전 모델). 클라우드 키 있으면 OpenAI로 자동 전환  
- 데모 서류는 캐시 JSON으로 심사 중 API 장애 대비  

## 스택

Next.js 15 · TypeScript · Zod · OpenAI-compatible API · Ollama · Cloudflare Tunnel  
과정 문서: `docs/championship/`

## 30초 데모 스크립트

1. 긴 가정통신문(또는 **데모 서류로 해보기**)  
2. `할 일 뽑기` → 할 일만 남음 (요약 문단 없음)  
3. **근거 인용** + **안 하면** 가리키기  
4. 한 줄: *“요약 AI가 아니라 행동 추출기. 선택은 에이전트가 병목·WOW·유려함 기준으로 했다.”*

## 발표 훅 (우승 내러티브)

> 서류는 넣기만. 할 일만 남깁니다.  
> 이 제품은 사람의 취향 쇼핑이 아니라, 에이전트가 탈락·검증·구현 단계를 밟아 만든 결과입니다.
