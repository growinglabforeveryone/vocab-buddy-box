import { Chunk } from "@/types/chunk";
import { create } from "zustand";

interface ChunkStore {
  chunks: Chunk[];
  savedChunks: Chunk[];
  sourceText: string;
  setSourceText: (text: string) => void;
  setChunks: (chunks: Chunk[]) => void;
  updateChunk: (id: string, updates: Partial<Chunk>) => void;
  removeChunk: (id: string) => void;
  addChunk: (chunk: Chunk) => void;
  commitChunks: () => void;
  removeSavedChunk: (id: string) => void;
}

export const useChunkStore = create<ChunkStore>((set, get) => ({
  chunks: [],
  savedChunks: [],
  sourceText: "",
  setSourceText: (text) => set({ sourceText: text }),
  setChunks: (chunks) => set({ chunks }),
  updateChunk: (id, updates) =>
    set((s) => ({
      chunks: s.chunks.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeChunk: (id) =>
    set((s) => ({ chunks: s.chunks.filter((c) => c.id !== id) })),
  addChunk: (chunk) => set((s) => ({ chunks: [...s.chunks, chunk] })),
  commitChunks: () =>
    set((s) => {
      const newSaved = [...s.savedChunks];
      for (const c of s.chunks) {
        if (!newSaved.find((sc) => sc.id === c.id)) {
          newSaved.push(c);
        }
      }
      return { savedChunks: newSaved, chunks: [], sourceText: "" };
    }),
  removeSavedChunk: (id) =>
    set((s) => ({ savedChunks: s.savedChunks.filter((c) => c.id !== id) })),
}));
