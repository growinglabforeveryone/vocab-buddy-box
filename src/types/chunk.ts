export interface Chunk {
  id: string;
  phrase: string;
  meaning: string;
  exampleSentence: string;
  sourceText?: string;
  createdAt: string;
}

export interface Deck {
  id: string;
  title: string;
  chunks: Chunk[];
  createdAt: string;
}
