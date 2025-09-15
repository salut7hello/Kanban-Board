import { db } from "../models/db";
import type { Board,Card, Column } from "../models/db";

export async function getOrCreateBoard(title = "Mitt board"): Promise<Board> {
  return await db.transaction("rw", db.Board, db.Column, db.Card, async () => {
    //finn eller lag board
    let board = await db.Board.orderBy("id").first();
    if (!board) {
      const id = await db.Board.add({ title, createdAt: new Date() });
      board = { id, title, createdAt: new Date() };
    }

    //  Finn kolonner for dette boardet
    const cols = await db.Column.where("boardId").equals(board.id!).toArray();

    // Hvis ingen kolonner 
    if (cols.length === 0) {
      const todoId  = await db.Column.add({ boardId: board.id!, title: "To do",  order: 0 });
      const doingId = await db.Column.add({ boardId: board.id!, title: "Doing",  order: 1 });
      const doneId  = await db.Column.add({ boardId: board.id!, title: "Done",   order: 2 });


    }
    return board;
  });
}

// Columns
export async function addColumn(boardId: number, title: string, order: number) {
  const id = await db.Column.add({ boardId, title, order });
  return id;
}
export async function renameColumn(columnId: number, title: string) {
  await db.Column.update(columnId, { title });
}
export async function deleteColumnWithCards(columnId: number) {
  await db.transaction("rw", db.Column, db.Card, async () => {
    await db.Card.where("columnId").equals(columnId).delete();
    await db.Column.delete(columnId);
  });
}
export async function reorderColumns(columns: Column[]) {
  await db.transaction("rw", db.Column, async () => {
    await Promise.all(columns.map(c => db.Column.update(c.id!, { order: c.order })));
  });
}

// Cards
export async function addCard(columnId: number, title: string, order: number) {
  const id = await db.Card.add({ columnId, title, order, done: false });
  return id;
}
export async function updateCard(cardId: number, patch: Partial<Card>) {
  await db.Card.update(cardId, patch);
}
export async function deleteCard(cardId: number) {
  await db.Card.delete(cardId);
}
// Reorder cards across columns
export async function applyCardOrders(cards: Card[]) {
  await db.transaction("rw", db.Card, async () => {
    await Promise.all(cards.map(c =>
      db.Card.update(c.id!, { order: c.order, columnId: c.columnId })
    ));
  });
}
export async function updateBoardTitle(boardId: number, title: string): Promise<boolean> {
  const next = title.trim();
  if (!next) return false;                
  const changed = await db.Board.update(boardId, { title: next });
  return changed === 1;                    // Dexie: 1 hvis oppdatert, 0 hvis ikke funnet
}