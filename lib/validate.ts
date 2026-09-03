import {
  AnalyzeResult,
  AnalyzeResultSchema,
  ActionItem,
} from "./schema";

function normalize(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

function stripLeadingIndex(s: string): string {
  return s.replace(/^\s*\d+\s*[.)]\s*/, "").trim();
}

function evidenceFound(evidence: string, corpus: string): boolean {
  if (!evidence.trim() || !corpus.trim()) return false;
  const candidates = [evidence.trim(), stripLeadingIndex(evidence)];
  for (const ev of candidates) {
    if (!ev) continue;
    if (corpus.includes(ev)) return true;
    const e = normalize(ev);
    const c = normalize(corpus);
    if (e.length < 4) continue;
    if (c.includes(e)) return true;
    const chunk = Math.max(6, Math.floor(e.length * 0.7));
    for (let i = 0; i <= e.length - chunk; i++) {
      if (c.includes(e.slice(i, i + chunk))) return true;
    }
  }
  return false;
}

function looksLikeIsoDate(due: string | null): string | null {
  if (!due) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(due) ? due : null;
}

function looksActionableTitle(title: string): boolean {
  const t = title.trim();
  if (t.length < 4) return false;
  if (/(알림|안내|공지|일정 설정|휴관)$/.test(t) || /알림|안내문|공지사항/.test(t)) {
    return false;
  }
  if (/(하기|제출|준비|가져|신청|회신|결제|등록|작성|챙기|싸기)$/.test(t)) {
    return true;
  }
  return /(제출|준비|신청|결제|등록|작성|챙기|가져|싸기|동의)/.test(t);
}

function cleanIfSkipped(v: string | null): string | null {
  if (!v) return null;
  const t = v.trim();
  if (!t || t === "없음" || t === "없다" || t === "-" || t === "N/A") return null;
  return t.slice(0, 80);
}

export function sanitizeResult(
  raw: unknown,
  corpusText: string
): AnalyzeResult {
  const parsed = AnalyzeResultSchema.parse(raw);

  // Explicit no-action notices
  if (
    corpusText &&
    /별도\s*(제출|신청|행동).*(없|불필요)/.test(corpusText) &&
    !/(동의서|준비물|제출:|신청:)/.test(corpusText)
  ) {
    return {
      document_kind: parsed.document_kind || "unknown",
      actions: [],
      empty_reason:
        parsed.empty_reason?.trim() ||
        "제출·신청 등 당장 해야 할 행동이 없는 안내입니다.",
      warnings: parsed.warnings ?? [],
    };
  }

  const actions: ActionItem[] = [];

  for (const a of parsed.actions) {
    if (actions.length >= 3) break;
    const title = a.title.trim();
    if (!title || !looksActionableTitle(title)) continue;

    const evidence = a.evidence.trim();
    if (!evidence) continue;

    let confidence = a.confidence;
    const found = corpusText.trim()
      ? evidenceFound(evidence, corpusText)
      : true;

    if (!found) {
      if (corpusText.trim()) continue;
      confidence = confidence === "high" ? "medium" : confidence;
    }

    actions.push({
      title: title.slice(0, 80),
      due: looksLikeIsoDate(a.due),
      due_label: a.due_label?.trim() || null,
      if_skipped: cleanIfSkipped(a.if_skipped),
      evidence: evidence.slice(0, 200),
      confidence,
    });
  }

  let empty_reason = parsed.empty_reason;
  if (actions.length === 0) {
    empty_reason =
      empty_reason?.trim() ||
      "당장 사용자가 해야 할 구체적인 행동을 찾지 못했습니다.";
  } else {
    empty_reason = null;
  }

  return {
    document_kind: parsed.document_kind || "unknown",
    actions,
    empty_reason,
    warnings: parsed.warnings ?? [],
  };
}
