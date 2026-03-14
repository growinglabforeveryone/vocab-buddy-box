import { Chunk } from "@/types/chunk";

const MOCK_DELAY = 800;

export function extractChunksMock(text: string): Promise<Chunk[]> {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 10);

  const mockPhrases: { phrase: string; meaning: string }[] = [
    { phrase: "rise to the occasion", meaning: "어려운 상황에서 잘 대처하다" },
    { phrase: "with the closure of", meaning: "~의 폐쇄와 함께" },
    { phrase: "compete on price", meaning: "가격으로 경쟁하다" },
    { phrase: "leading the charge", meaning: "앞장서서 이끌다" },
    { phrase: "in the wake of", meaning: "~의 여파로" },
    { phrase: "ramp up production", meaning: "생산을 확대하다" },
    { phrase: "bear the brunt of", meaning: "~의 타격을 가장 크게 받다" },
    { phrase: "at the expense of", meaning: "~을 희생하여" },
    { phrase: "gain traction", meaning: "관심을 끌기 시작하다" },
    { phrase: "fall short of expectations", meaning: "기대에 미치지 못하다" },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      const count = Math.min(Math.max(3, Math.floor(text.length / 120)), 8);
      const selected = mockPhrases.slice(0, count);

      const chunks: Chunk[] = selected.map((p, i) => ({
        id: crypto.randomUUID(),
        phrase: p.phrase,
        meaning: p.meaning,
        exampleSentence:
          sentences[i % sentences.length] ||
          `The company had to ${p.phrase} in order to survive the downturn.`,
        sourceText: text.slice(0, 200),
        createdAt: new Date().toISOString(),
      }));

      resolve(chunks);
    }, MOCK_DELAY);
  });
}
