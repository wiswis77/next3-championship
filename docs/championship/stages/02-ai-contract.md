---
status: done
date: 2026-09-03
---

# Stage 02 — AI contract (입출력 계약)

## 목표

모델이 **요약을 늘어놓지 못하게** 막고,  
할 일·기한·근거·미이행 결과만 **검증 가능한 JSON**으로 강제한다.  
유려함 = 틀린 확정 금지 = 이 계약에서 만든다.

## 결정 사항

### 확정

- 출력은 **JSON only** (마크다운 본문 금지)
- `actions` 최대 **3**
- 각 action에 `evidence`(원문 부분 문자열) 필수. 없으면 서버/클라이언트가 **drop**
- `due`는 ISO 날짜(`YYYY-MM-DD`) 또는 `null`
- `if_skipped`는 짧고 구체적 (없으면 `null` 허용 — 서류에 결과가 안 적힌 경우)
- `confidence`: `high` | `medium` | `low` — `low`면 UI에서 **확인 필요**
- 문서가 할 일 없는 공지(단순 안내)면 `actions: []` + `empty_reason`
- 시스템 프롬프트에 **금지**: 장문 요약, 일반 조언, 서류에 없는 절차 창작, 이모지 남발

### 보류 → Stage 04

- 실제 모델 벤더(OpenAI / Anthropic / Google 등)와 키
- 이미지 직접 multimodal vs OCR 후 텍스트 LLM (구현 때 정확도 보고 선택, 계약 스키마는 동일)

## 입력

```ts
type AnalyzeInput = {
  // 둘 중 하나 이상 필수
  imageBase64?: string;      // image/jpeg|png|webp
  imageMimeType?: string;
  text?: string;             // 붙여넣기 또는 OCR 결과
  locale?: "ko";             // MVP 고정
  nowISO: string;            // 기한 해석용 (오늘 기준)
};
```

## 출력 스키마 (권위)

```ts
type Confidence = "high" | "medium" | "low";

type ActionItem = {
  title: string;             // 동사로 시작, 한 줄, <= 40자 권장
  due: string | null;        // YYYY-MM-DD or null
  due_label: string | null;  // 원문에 가까운 표시용 ("3월 15일까지") 
  if_skipped: string | null; // 안 하면 생기는 일, <= 60자
  evidence: string;          // 원문 인용, 반드시 입력 텍스트/OCR에 존재
  confidence: Confidence;
};

type AnalyzeResult = {
  document_kind: string;     // 예: "학교_가정통신문" | "관리비_고지" | "unknown"
  actions: ActionItem[];     // length 0..3
  empty_reason: string | null; // actions 비었을 때만
  warnings: string[];        // OCR 불선명 등, UI는 작게만
};
```

## 시스템 프롬프트 요지 (구현 시 전문은 코드에)

1. 당신은 요약기가 아니라 **행동 추출기**다.  
2. 사용자가 **직접 해야 하는 일**만 고른다. (단순 정보 공지는 할 일 아님)  
3. 중요도·마감 임박·누락 시 피해 순으로 최대 3개.  
4. `evidence`는 입력에 **그대로 있는 구절**. 없으면 그 할 일을 만들지 말 것.  
5. 기한이 애매하면 `due: null`, `confidence`를 낮추고 `due_label`에 원문 표현.  
6. `if_skipped`는 서류가 암시하는 결과만. 협박성 과장 금지.  
7. JSON 외 출력 금지.

## 서버/클라이언트 검증 규칙 (코드로 강제)

1. JSON parse 실패 → 에러 UI (재시도)
2. `actions.length > 3` → 앞에서 3개만
3. `evidence`가 입력 `text`(또는 OCR 텍스트)에 **포함되지 않으면** drop  
   - 이미지-only이고 OCR 텍스트가 약하면: evidence 정규화(공백 축소) 후 부분 매칭, 그래도 실패 시 `confidence: low` + warning 또는 drop
4. `title` 공백 / 너무 긴 요약형 문장 → truncate 또는 drop
5. `due`가 날짜 형식 아니면 `null`로 강등
6. 최종 0개면 `empty_reason` 필수 (없으면 기본 문구)

## `.ics` 매핑 (AI 밖)

- `due != null`인 action만 VEVENT 생성
- `DTSTART` = due 당일, `SUMMARY` = title  
- 알람 트리거: **ICS 내부 VALARM** (예: 하루 전) — OS 캘린더가 처리. **우리 서버 푸시 아님**

## 평가용 골든 샘플 (Stage 06에서 파일화)

| 샘플 | 기대 |
|------|------|
| 가정통신문 (준비물+제출일) | 할 일 2~3, due 있음, evidence 일치 |
| 단순 안내 (행사 소개만) | actions [] + empty_reason |
| 기한 모호 문구 | due null, confidence medium/low |

## 산출물

- 본 AI 계약 문서
- (Stage 05) `lib/schema.ts` + prompt + validator로 코드화

## 사용자 확인 포인트

**기본 없음.** 스키마는 우승용 기본값으로 잠금.  
바꾸고 싶으면 예: `수정: actions 최대 5` / `ics 알람 빼`

## 다음 단계

→ Stage 03 UX 화면·카피·30초 데모 시나리오 (`03-ux-screens.md`)
