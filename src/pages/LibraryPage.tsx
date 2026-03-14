import { useChunkStore } from "@/store/chunkStore";
import { Trash2, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LibraryPage() {
  const { savedChunks, removeSavedChunk } = useChunkStore();
  const [search, setSearch] = useState("");

  const filtered = savedChunks.filter(
    (c) =>
      c.phrase.toLowerCase().includes(search.toLowerCase()) ||
      c.meaning.includes(search)
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 space-y-4">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          라이브러리
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="표현 또는 뜻 검색..."
            className="w-full rounded-xl border bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-muted-foreground">
            {savedChunks.length === 0
              ? "저장된 단어뭉치가 없습니다"
              : "검색 결과가 없습니다"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((chunk) => (
              <motion.div
                key={chunk.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="font-medium text-foreground truncate">
                      {chunk.phrase}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {chunk.meaning}
                    </p>
                  </div>
                  <p className="mt-1 font-serif text-sm text-muted-foreground/70 italic truncate">
                    "{chunk.exampleSentence}"
                  </p>
                </div>
                <button
                  onClick={() => removeSavedChunk(chunk.id)}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
