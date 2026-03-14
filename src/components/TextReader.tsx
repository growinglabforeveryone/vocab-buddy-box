import { Chunk } from "@/types/chunk";

interface TextReaderProps {
  text: string;
  chunks: Chunk[];
  hoveredChunkId: string | null;
  onChunkClick?: (id: string) => void;
}

export default function TextReader({
  text,
  chunks,
  hoveredChunkId,
}: TextReaderProps) {
  if (!text) return null;

  const dimmed = hoveredChunkId !== null;

  // Build highlighted text
  let result = text;
  const highlights: { phrase: string; id: string }[] = chunks
    .map((c) => ({ phrase: c.phrase, id: c.id }))
    .sort((a, b) => b.phrase.length - a.phrase.length);

  // Simple approach: wrap phrases in spans
  let parts: { text: string; chunkId?: string }[] = [{ text: result }];

  for (const hl of highlights) {
    const newParts: typeof parts = [];
    for (const part of parts) {
      if (part.chunkId) {
        newParts.push(part);
        continue;
      }
      const regex = new RegExp(
        `(${hl.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      const splits = part.text.split(regex);
      for (const s of splits) {
        if (regex.test(s)) {
          newParts.push({ text: s, chunkId: hl.id });
        } else {
          newParts.push({ text: s });
        }
        regex.lastIndex = 0;
      }
    }
    parts = newParts;
  }

  return (
    <div className="font-serif text-lg leading-relaxed">
      {parts.map((part, i) => {
        if (part.chunkId) {
          const isHovered = hoveredChunkId === part.chunkId;
          return (
            <span key={i} className="relative cursor-pointer group inline">
              <span
                className={`absolute inset-x-0 -bottom-0.5 h-2 transition-colors duration-200 ${
                  isHovered ? "bg-accent/70" : "bg-accent/40"
                }`}
              />
              <span
                className={`relative font-medium transition-opacity duration-200 ${
                  dimmed && !isHovered ? "opacity-40" : "opacity-100"
                }`}
              >
                {part.text}
              </span>
            </span>
          );
        }
        return (
          <span
            key={i}
            className={`transition-opacity duration-200 ${
              dimmed ? "opacity-40" : "opacity-100"
            }`}
          >
            {part.text}
          </span>
        );
      })}
    </div>
  );
}
