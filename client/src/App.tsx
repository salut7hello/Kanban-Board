import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./models/db";
import * as actions from "./data/dataActions";

import BoardHeader from "./components/BoardHeader";
import BoardColumns from "./components/BoardColumns";
import BackgroundPicker from "./components/BackgroundPicker";
import CardDetails from "./components/CardDetails";
import type {Card as CardModel, Column as ColumnModel } from "./models/db";

const BG_OPTIONS = ["/backgrounds/basic.webp", "/backgrounds/vann.webp"];

export default function App() {
  // UI-state
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState<CardModel | null>(null);

  // Sørg for at vi har et board
  useEffect(() => {
    (async () => {
      await actions.getOrCreateBoard("Mitt board");
    })();
  }, []);

  // --- Live lesing fra Dexie ---
  const board = useLiveQuery(async () => {
    return await db.Board.orderBy("id").first();
  }, [], undefined);

  const columns = useLiveQuery<ColumnModel[]>(async () => {
    if (!board) return [];
    return await db.Column.where("boardId").equals(board.id!).toArray();
  }, [board?.id], []);

  const cards = useLiveQuery<CardModel[]>(async () => {
    if (!columns || columns.length === 0) return [];
    const ids = columns.map(c => c.id!);
    return await db.Card.where("columnId").anyOf(ids).toArray();
  }, [columns.map(c => c.id).join(",")], []);

  // header
  const headerTitle = board?.title ?? "Mitt board";
  const handleRename = async () => {
  const next = prompt("New board title:", headerTitle)?.trim();
  if (next && board?.id) {
    await actions.updateBoardTitle(board.id, next);
  }
};

  // skriv column til Db
  const onAddColumn = async (title: string) => {
    if (!board) return;
    await actions.addColumn(board.id!, title, columns.length);
  };
  const onRenameColumn = async (columnId: number, nextTitle: string) => {
    await actions.renameColumn(columnId, nextTitle);
  };
  const onDeleteColumn = async (columnId: number) => {
    await actions.deleteColumnWithCards(columnId);
  };

  // skriv kort til db
  const onAddCard = async (columnId: number, title: string) => {
    const inCol = cards.filter(c => c.columnId === columnId);
    const order = inCol.length ? Math.max(...inCol.map(c => c.order)) + 1 : 0;
    await actions.addCard(columnId, title, order);
  };
  const onToggleCard = async (cardId: number) => {
    const cur = cards.find(c => c.id === cardId);
    if (!cur) return;
    await actions.updateCard(cardId, { done: !cur.done });
  };

  // Modal åpn/lagre/slette
  const onEditCard = (cardId: number) => {
    setEditing(cards.find(c => c.id === cardId) ?? null);
  };
  const onSaveCard = async (cardId: number, patch: Partial<CardModel>) => {
    await actions.updateCard(cardId, patch);
    setEditing(null);
  };
  const onDeleteCard = async (cardId: number) => {
    await actions.deleteCard(cardId);
    setEditing(cur => (cur?.id === cardId ? null : cur));
  };

  // DnD: kort
  const onReorderCards = async (
    cardId: number,
    fromColumnId: number,
    toColumnId: number,
    toIndex: number
  ) => {
    const all = cards.slice();
    const moving = all.find(c => c.id === cardId);
    if (!moving) return;

    const from = all.filter(c => c.columnId === fromColumnId && c.id !== cardId).sort((a,b)=>a.order-b.order);
    const to   = all.filter(c => c.columnId === toColumnId   && c.id !== cardId).sort((a,b)=>a.order-b.order);

    const insertAt = toIndex < 0 || toIndex > to.length ? to.length : toIndex;
    to.splice(insertAt, 0, { ...moving, columnId: toColumnId });

    from.forEach((c,i)=> c.order = i);
    to.forEach((c,i)=> c.order = i);

    await actions.applyCardOrders([
      ...from,
      ...to,
      { ...moving, columnId: toColumnId, order: to.findIndex(k => k.id === moving.id) }
    ]);
  };

  // DnD: kolonner
  const onReorderColumns = async (columnId: number, toIndex: number) => {
    const sorted = columns.slice().sort((a,b)=>a.order-b.order);
    const curIndex = sorted.findIndex(c => c.id === columnId);
    if (curIndex < 0 || curIndex === toIndex) return;
    const [moved] = sorted.splice(curIndex, 1);
    sorted.splice(toIndex, 0, moved);
    sorted.forEach((c,i)=> c.order = i);
    await actions.reorderColumns(sorted);
  };

  // Søk
  const visibleCards = q
    ? cards.filter(c =>
        (c.title + " " + (c.description ?? "")).toLowerCase().includes(q.toLowerCase())
      )
    : cards;

  return (
    <div className="relative min-h-screen text-white">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : { backgroundColor: "#0b0b0e" }}
      />

      <BoardHeader
        title={headerTitle}
        searchQuery={q}
        onChangeSearch={setQ}
        onClearSearch={() => setQ("")}
        onOpenMenu={() => setMenuOpen(v => !v)}
        onCloseMenu={() => setMenuOpen(false)}
        menuOpen={menuOpen}
        onRename={handleRename}
        onChangeBackground={() => setPickerOpen(true)}
      />

      <main className="pt-14 px-4 pb-10 overflow-x-auto relative z-10">
        <BoardColumns
          columns={columns}
          cards={visibleCards}
          onAddColumn={onAddColumn}
          onRenameColumn={onRenameColumn}
          onDeleteColumn={onDeleteColumn}
          onAddCard={onAddCard}
          onToggleCard={onToggleCard}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
          onReorderCards={onReorderCards}
          onReorderColumns={onReorderColumns}
        />
      </main>

      <BackgroundPicker
        open={pickerOpen}
        options={BG_OPTIONS}
        onSelect={url => setBgUrl(url)}
        onClose={() => setPickerOpen(false)}
      />

      {editing && (
        <CardDetails
          open
          card={editing}
          columnName={columns.find(c => c.id === editing.columnId)?.title ?? "Uten liste"}
          onClose={() => setEditing(null)}
          onSave={onSaveCard}
          onDelete={onDeleteCard}
        />
      )}
    </div>
  );
}
