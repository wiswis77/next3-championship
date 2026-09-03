import OpenAI from "openai";

export type LlmTarget = {
  client: OpenAI;
  model: string;
  provider: "openai" | "ollama";
};

/**
 * OpenAI 키가 있으면 클라우드, 없으면 로컬 Ollama.
 * 텍스트만이면 qwen2.5:7b, 이미지면 qwen2.5vl:3b (환경변수로 덮어쓰기 가능).
 */
export function resolveLlm(hasImage: boolean): LlmTarget {
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    return {
      client: new OpenAI({
        apiKey: openaiKey,
        baseURL: process.env.OPENAI_BASE_URL || undefined,
      }),
      model: process.env.OPENAI_MODEL || "gpt-4o",
      provider: "openai",
    };
  }

  const ollamaBase =
    process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1";
  const textModel = process.env.OLLAMA_TEXT_MODEL || "qwen2.5:7b";
  const visionModel = process.env.OLLAMA_MODEL || "qwen2.5vl:3b";

  return {
    client: new OpenAI({
      apiKey: process.env.OLLAMA_API_KEY || "ollama",
      baseURL: ollamaBase,
    }),
    model: hasImage ? visionModel : textModel,
    provider: "ollama",
  };
}

export function parseModelJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim());
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("JSON 파싱 실패");
  }
}
