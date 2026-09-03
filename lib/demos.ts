import type { AnalyzeResult } from "./schema";

export const DEMO_SCHOOL_TEXT = `제목: 3학년 봄 현장학습 가정통신문

학부모님께,
오는 현장학습을 아래와 같이 실시합니다.

1. 일시: 2026년 9월 18일(금) 오전 9시 학교 집합
2. 장소: 국립과학관
3. 준비물: 실내화, 필기구, 개인 물병
4. 제출: 동의서 및 개인정보 활용 동의서를 9월 12일(토)까지 담임 선생님께 제출
5. 미제출 시 현장학습에 참여할 수 없습니다.
6. 중식: 도시락 지참 (학교 급식 없음)

문의: 교무실 02-000-0000
`;

export const demoSchoolResult: AnalyzeResult = {
  document_kind: "학교_가정통신문",
  actions: [
    {
      title: "동의서·개인정보 동의서 제출하기",
      due: "2026-09-12",
      due_label: "9월 12일(토)까지",
      if_skipped: "현장학습에 참여할 수 없습니다.",
      evidence: "동의서 및 개인정보 활용 동의서를 9월 12일(토)까지 담임 선생님께 제출",
      confidence: "high",
    },
    {
      title: "실내화·필기구·물병 준비하기",
      due: "2026-09-18",
      due_label: "9월 18일 현장학습 당일",
      if_skipped: "당일 활동에 필요한 준비물이 빠질 수 있습니다.",
      evidence: "준비물: 실내화, 필기구, 개인 물병",
      confidence: "high",
    },
    {
      title: "도시락 싸기",
      due: "2026-09-18",
      due_label: "9월 18일",
      if_skipped: "학교에서 급식이 제공되지 않습니다.",
      evidence: "중식: 도시락 지참 (학교 급식 없음)",
      confidence: "high",
    },
  ],
  empty_reason: null,
  warnings: [],
};

export const demos = {
  school: {
    id: "school",
    label: "데모 서류로 해보기",
    text: DEMO_SCHOOL_TEXT,
    result: demoSchoolResult,
  },
} as const;
