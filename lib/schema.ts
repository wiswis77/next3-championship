import { z } from "zod";

export const ConfidenceSchema = z.enum(["high", "medium", "low"]);

export const ActionItemSchema = z.object({
  title: z.string().min(1).max(80),
  due: z.string().nullable(),
  due_label: z.string().nullable(),
  if_skipped: z.string().nullable(),
  evidence: z.string().min(1),
  confidence: ConfidenceSchema,
});

export const AnalyzeResultSchema = z.object({
  document_kind: z.string().min(1),
  actions: z.array(ActionItemSchema).max(3),
  empty_reason: z.string().nullable(),
  warnings: z.array(z.string()).default([]),
});

export type Confidence = z.infer<typeof ConfidenceSchema>;
export type ActionItem = z.infer<typeof ActionItemSchema>;
export type AnalyzeResult = z.infer<typeof AnalyzeResultSchema>;

export type AnalyzeRequest = {
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  demoId?: string;
};
