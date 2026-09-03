"use client";

import { useMemo, useState } from "react";
import { demos } from "@/lib/demos";
import { downloadIcs } from "@/lib/ics";
import type { AnalyzeResult } from "@/lib/schema";

type Phase = "input" | "loading" | "result" | "error";

function fileToBase64(file: File): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve({
        base64: comma >= 0 ? result.slice(comma + 1) : result,
        mime: file.type || "image/jpeg",
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => Boolean(text.trim() || file),
    [text, file]
  );

  function resetToInput() {
    setPhase("input");
    setResult(null);
    setError(null);
  }

  function onFile(f: File | null) {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function analyze(payload: Record<string, unknown>) {
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "분석에 실패했습니다.");
      }
      setResult(data as AnalyzeResult);
      setPhase("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      setPhase("error");
    }
  }

  async function onExtract() {
    if (!canSubmit) return;
    const payload: Record<string, unknown> = {};
    if (text.trim()) payload.text = text.trim();
    if (file) {
      const { base64, mime } = await fileToBase64(file);
      payload.imageBase64 = base64;
      payload.imageMimeType = mime;
    }
    await analyze(payload);
  }

  async function onDemo() {
    setText(demos.school.text);
    onFile(null);
    await analyze({ demoId: "school" });
  }

  return (
    <main className="shell">
      <header>
        <p className="brand">Next3</p>
        <p className="tagline">서류는 넣기만. 할 일만 남깁니다.</p>
      </header>

      {(phase === "input" || phase === "error") && (
        <section className="panel">
          <div className="drop">
            <strong>사진 선택 / 촬영</strong>
            <p>가정통신문, 고지서, 안내문 캡처</p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="preview" src={preview} alt="선택한 서류" />
            )}
            {file && <p className="file-name">{file.name}</p>}
          </div>

          <div className="or">또는 텍스트</div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="안내문 내용을 붙여넣으세요"
          />

          {phase === "error" && error && (
            <div className="error-box">{error}</div>
          )}

          <div className="actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canSubmit}
              onClick={onExtract}
            >
              할 일 뽑기
            </button>
            <button type="button" className="btn btn-ghost" onClick={onDemo}>
              데모 서류로 해보기
            </button>
          </div>
        </section>
      )}

      {phase === "loading" && (
        <div className="status">
          <strong>할 일을 고르는 중</strong>
          <span>잠시만요</span>
        </div>
      )}

      {phase === "result" && result && (
        <section className="panel">
          <div className="meta">
            <h2>
              {result.actions.length === 0
                ? "할 일 없음"
                : `할 일 ${result.actions.length}개`}
            </h2>
            <button type="button" className="btn btn-ghost" onClick={resetToInput}>
              다른 서류
            </button>
          </div>

          {result.actions.length === 0 ? (
            <div className="empty">
              <p>이 서류에서 당장 할 일을 찾지 못했어요</p>
              {result.empty_reason && (
                <p style={{ marginTop: "0.5rem" }}>{result.empty_reason}</p>
              )}
            </div>
          ) : (
            <ul className="list">
              {result.actions.map((a, i) => (
                <li className="row" key={`${a.title}-${i}`}>
                  <p className="row-title">{a.title}</p>
                  <p className="row-due">
                    {a.due_label || (a.due ? a.due : "기한 없음")}
                  </p>
                  {a.if_skipped && (
                    <p className="row-skip">
                      <em>안 하면</em> · {a.if_skipped}
                    </p>
                  )}
                  <p className="row-evidence">
                    “{a.evidence.replace(/^\s*\d+\s*[.)]\s*/, "")}”
                  </p>
                  {a.confidence === "low" && (
                    <span className="chip">확인 필요</span>
                  )}
                  {a.due && (
                    <div className="row-tools">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => downloadIcs(a)}
                      >
                        캘린더에 넣기
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
