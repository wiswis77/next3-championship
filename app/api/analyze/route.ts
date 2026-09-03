import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { demos } from "@/lib/demos";
import { parseModelJson, resolveLlm } from "@/lib/llm";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { AnalyzeResultSchema } from "@/lib/schema";
import { sanitizeResult } from "@/lib/validate";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const demoId = body.demoId as string | undefined;
    const text = typeof body.text === "string" ? body.text : undefined;
    const imageBase64 =
      typeof body.imageBase64 === "string" ? body.imageBase64 : undefined;
    const imageMimeType =
      typeof body.imageMimeType === "string"
        ? body.imageMimeType
        : "image/jpeg";

    if (demoId && demoId in demos) {
      const demo = demos[demoId as keyof typeof demos];
      return NextResponse.json(demo.result);
    }

    if (!text?.trim() && !imageBase64) {
      return NextResponse.json(
        { error: "텍스트 또는 이미지가 필요합니다." },
        { status: 400 }
      );
    }

    const hasImage = Boolean(imageBase64);
    const { client, model, provider } = resolveLlm(hasImage);

    if (provider === "ollama") {
      try {
        const base = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1").replace(
          /\/v1\/?$/,
          ""
        );
        const probe = await fetch(`${base}/api/tags`, {
          signal: AbortSignal.timeout(2000),
        });
        if (!probe.ok) throw new Error("ollama probe failed");
      } catch {
        return NextResponse.json(
          {
            error:
              "로컬 AI(Ollama)에 연결할 수 없습니다. ‘데모 서류로 해보기’는 가능합니다.",
            code: "OLLAMA_DOWN",
          },
          { status: 503 }
        );
      }
    }

    const nowISO = new Date().toISOString();
    const userText = buildUserPrompt({ nowISO, text });

    const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
      { type: "text", text: userText },
    ];

    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${imageMimeType};base64,${imageBase64}`,
        },
      });
    }

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.1,
      ...(provider === "openai"
        ? { response_format: { type: "json_object" as const } }
        : {}),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "모델 응답이 비었습니다.", provider, model },
        { status: 502 }
      );
    }

    let json: unknown;
    try {
      json = parseModelJson(raw);
    } catch {
      return NextResponse.json(
        { error: "JSON 파싱 실패", raw, provider, model },
        { status: 502 }
      );
    }

    if (json && typeof json === "object" && !("warnings" in json)) {
      (json as { warnings: string[] }).warnings = [];
    }

    AnalyzeResultSchema.parse(json);
    const corpus = text?.trim() || "";
    const result = sanitizeResult(json, corpus);

    return NextResponse.json({ ...result, _meta: { provider, model } });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
