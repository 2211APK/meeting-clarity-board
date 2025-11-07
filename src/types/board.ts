export type CardType = "high_importance" | "todo" | "people" | "questions" | "follow_up";

export interface NoteCard {
  id: string;
  content: string;
  type: CardType;
}

export interface FreeCard extends NoteCard {
  x: number;
  y: number;
  w: number;
  h: number;
}
