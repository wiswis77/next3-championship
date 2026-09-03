/**
 * Offline verification for sanitize + demo contract.
 * Run: npx tsx scripts/verify-offline.ts
 */
import { demoSchoolResult, DEMO_SCHOOL_TEXT } from "../lib/demos";
import { sanitizeResult } from "../lib/validate";

const EMPTY_NOTICE = `안녕하세요.
이번 주 금요일 교내 도서관이 휴관합니다.
열람만 불가하며, 별도 제출이나 신청은 없습니다.
문의: 도서관 02-111-2222
`;

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function main() {
  // 1) demo golden self-consistency
  for (const a of demoSchoolResult.actions) {
    assert(
      DEMO_SCHOOL_TEXT.includes(a.evidence),
      `demo evidence missing: ${a.evidence}`
    );
  }
  assert(demoSchoolResult.actions.length === 3, "demo should have 3 actions");

  // 2) hallucinated evidence dropped when corpus exists
  const hallucinated = sanitizeResult(
    {
      document_kind: "test",
      actions: [
        {
          title: "존재하지 않는 일 하기",
          due: "2026-09-12",
          due_label: null,
          if_skipped: null,
          evidence: "이 문구는 원문에 없음",
          confidence: "high",
        },
        {
          title: "동의서 제출하기",
          due: "2026-09-12",
          due_label: "9월 12일까지",
          if_skipped: "참여 불가",
          evidence:
            "동의서 및 개인정보 활용 동의서를 9월 12일(토)까지 담임 선생님께 제출",
          confidence: "high",
        },
      ],
      empty_reason: null,
      warnings: [],
    },
    DEMO_SCHOOL_TEXT
  );
  assert(hallucinated.actions.length === 1, "hallucination should be dropped");
  assert(
    hallucinated.actions[0].title.includes("동의서"),
    "real action kept"
  );

  // 3) empty-ish doc still can return empty via model shape
  const emptyish = sanitizeResult(
    {
      document_kind: "도서관_안내",
      actions: [],
      empty_reason: "제출·신청 등 사용자 행동이 없습니다.",
      warnings: [],
    },
    EMPTY_NOTICE
  );
  assert(emptyish.actions.length === 0, "empty actions");
  assert(Boolean(emptyish.empty_reason), "empty_reason required");

  // 4) invalid due stripped
  const badDue = sanitizeResult(
    {
      document_kind: "t",
      actions: [
        {
          title: "동의서 제출하기",
          due: "다음주 금요일",
          due_label: "다음주",
          if_skipped: null,
          evidence:
            "동의서 및 개인정보 활용 동의서를 9월 12일(토)까지 담임 선생님께 제출",
          confidence: "medium",
        },
      ],
      empty_reason: null,
      warnings: [],
    },
    DEMO_SCHOOL_TEXT
  );
  assert(badDue.actions[0].due === null, "non-ISO due becomes null");

  console.log("OFFLINE_VERIFY_PASS");
}

main();
