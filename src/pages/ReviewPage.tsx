import { useState, useMemo } from "react";
import { useChunkStore } from "@/store/chunkStore";
import { motion } from "framer-motion";
import { RotateCcw, ArrowRight, Shuffle } from "lucide-react";

type Mode = "kr-to-en" | "en-to-kr";

export default function ReviewPage() {
  const { savedChunks } = useChunkStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<Mode>("kr-to-en");
  const [shuffled, setShuffled] = useState(false);

  const cards = useMemo(() => {
    if (shuffled) {
      return [...savedChunks].sort(() => Math.random() - 0.5);
    }
    return savedChunks;
  }, [savedChunks, shuffled]);

  const current = cards[currentIndex];

  const next = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % cards.length);
    }, 150);
  };

  const toggleShuffle = () => {
    setShuffled((s) => !s);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (savedChunks.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <p className="font-serif text-xl text-foreground">
            아직 저장된 단어뭉치가 없습니다
          </p>
          <p className="text-sm text-muted-foreground">
            추출 탭에서 텍스트를 분석하고 단어뭉치를 저장하세요
          </p>
        </div>
      </div>
    );
  }

  const frontContent =
    mode === "kr-to-en" ? current.meaning : current.phrase;
  const backPhrase =
    mode === "kr-to-en" ? current.phrase : current.meaning;

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("kr-to-en")}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              mode === "kr-to-en"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            한→영
          </button>
          <button
            onClick={() => setMode("en-to-kr")}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              mode === "en-to-kr"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            영→한
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums text-muted-foreground">
            {currentIndex + 1} / {cards.length}
          </span>
          <button
            onClick={toggleShuffle}
            className={`rounded-lg p-1.5 transition-colors ${
              shuffled
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shuffle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="perspective-1000 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped((f) => !f)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.1 }}
          className="preserve-3d relative"
          style={{ minHeight: "320px" }}
        >
          {/* Front */}
          <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-card p-8 shadow-md">
            <p className="text-sm text-muted-foreground mb-4">
              {mode === "kr-to-en" ? "한국어 뜻" : "English Phrase"}
            </p>
            <p className={`text-center text-2xl font-semibold ${mode === "en-to-kr" ? "" : "font-serif"}`}>
              {frontContent}
            </p>
            <p className="mt-8 text-xs text-muted-foreground/60">
              클릭하여 뒤집기
            </p>
          </div>

          {/* Back */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-card p-8 shadow-md">
            <p className="text-sm text-muted-foreground mb-4">
              {mode === "kr-to-en" ? "English Phrase" : "한국어 뜻"}
            </p>
            <p className={`text-center text-2xl font-semibold ${mode === "kr-to-en" ? "" : "font-serif"}`}>
              {backPhrase}
            </p>
            <div className="mt-6 rounded-lg bg-secondary/50 px-4 py-3">
              <p className="font-serif text-sm leading-relaxed text-muted-foreground italic text-center">
                "{current.exampleSentence}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => {
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
        >
          <RotateCcw className="h-4 w-4" />
          처음부터
        </button>
        <button
          onClick={next}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
        >
          다음
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
