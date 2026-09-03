/**
 * Golden-path live verification against running server + Ollama.
 * Usage: npx tsx scripts/verify-live.ts
 */
import { DEMO_SCHOOL_TEXT } from "../lib/demos";

const BASE = process.env.VERIFY_BASE || "http://127.0.0.1:3000";

const EMPTY = `안녕하세요.
이번 주 금요일 교내 도서관이 휴관합니다.
열람만 불가하며, 별도 제출이나 신청은 없습니다.
문의: 도서관 02-111-2222
`;

async function analyze(text: string) {
  const res = await fetch(`${BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data as {
    actions: { title: string; evidence: string; due: string | null }[];
    empty_reason: string | null;
    _meta?: { provider: string; model: string };
  };
}

function norm(s: string) {
  return s.replace(/\s+/g, "");
}

async function main() {
  const school = await analyze(DEMO_SCHOOL_TEXT);
  const empty = await analyze(EMPTY);

  const issues: string[] = [];
  if (!(school.actions.length >= 1 && school.actions.length <= 3)) {
    issues.push(`school count=${school.actions.length}`);
  }
  for (const a of school.actions) {
    const ev = a.evidence.replace(/^\s*\d+\s*[.)]\s*/, "");
    if (!norm(DEMO_SCHOOL_TEXT).includes(norm(ev))) {
      issues.push(`evidence not in corpus: ${a.evidence.slice(0, 48)}`);
    }
  }
  if (empty.actions.length !== 0) {
    issues.push(`empty actions=${empty.actions.length}`);
  }

  console.log(
    JSON.stringify(
      {
        school: {
          n: school.actions.length,
          titles: school.actions.map((a) => a.title),
          meta: school._meta,
        },
        empty: { n: empty.actions.length, reason: empty.empty_reason, meta: empty._meta },
        issues,
        verdict: issues.length ? "FAIL" : "PASS",
      },
      null,
      2
    )
  );
  if (issues.length) process.exit(1);
}

main();
