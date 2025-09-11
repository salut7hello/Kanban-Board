import { useRef, useState } from "react";
import BoardHeader from "./components/BoardHeader";
import BoardColumns from "./components/BoardColumns";
import BackgroundPicker from "./components/BackgroundPicker";
import CardDetails from "./components/CardDetails";
import type { Column as ColumnModel, Card as CardModel } from "./models/db";

const BG_OPTIONS = ["/backgrounds/basic.webp", "/backgrounds/vann.webp"];

export default function App() {
  // Header 
  const [boardTitle, setBoardTitle] = useState("Mitt board");
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  // Kortdetaljer-modal
  const [editing, setEditing] = useState<CardModel | null>(null);


  const BOARD_ID = 1;
  const [columns, setColumns] = useState<ColumnModel[]>([
    { id: 1, boardId: BOARD_ID, title: "To do", order: 0 },
    { id: 2, boardId: BOARD_ID, title: "Doing", order: 1 },
    { id: 3, boardId: BOARD_ID, title: "Done", order: 2 },
  ]);
  const [cards, setCards] = useState<CardModel[]>([]);
  const nextId = useRef<number>(100);
  const genId = () => ++nextId.current;

  // Header
  const handleRename = () => {
    const next = prompt("New board title:", boardTitle)?.trim();
    if (next && next !== boardTitle) setBoardTitle(next);
  };

  // Kolonner
  const onAddColumn = (title: string) => {
    const order = columns.length ? Math.max(...columns.map(c => c.order)) + 1 : 0;
    setColumns(cols => [...cols, { id: genId(), boardId: BOARD_ID, title, order }]);
  };
  const onRenameColumn = (columnId: number, nextTitle: string) => {
    setColumns(cols => cols.map(c => (c.id === columnId ? { ...c, title: nextTitle } : c)));
  };
  const onDeleteColumn = (columnId: number) => {
    setColumns(cols => cols.filter(c => c.id !== columnId));
    setCards(cs => cs.filter(c => c.columnId !== columnId));
  };

  // Kort
  const onAddCard = (columnId: number, title: string) => {
    const inCol = cards.filter(c => c.columnId === columnId);
    const order = inCol.length ? Math.max(...inCol.map(c => c.order)) + 1 : 0;
    setCards(cs => [...cs, { id: genId(), columnId, title, order, done: false }]);
  };
  const onToggleCard = (cardId: number) => {
    setCards(cs => cs.map(c => (c.id === cardId ? { ...c, done: !c.done } : c)));
  };

  // Åpne modal for redigering
  const onEditCard = (cardId: number) => {
    setEditing(cards.find(c => c.id === cardId) ?? null);
  };

  // Lagre endringer fra modal
  const onSaveCard = (cardId: number, patch: Partial<CardModel>) => {
    setCards(cs => cs.map(c => (c.id === cardId ? { ...c, ...patch } : c)));
  };

  
  const onDeleteCard = (cardId: number) => {
    setCards(cs => cs.filter(c => c.id !== cardId));
    // Lukk modalen hvis vi slettet det som var åpent
    setEditing(cur => (cur?.id === cardId ? null : cur));
  };
  //Search
  const visibleCards = q
  ? cards.filter(c =>
      c.title.toLowerCase().includes(q.toLowerCase())
    )
  : cards;
  // DnD: kort
  const onReorderCards = (
    cardId: number,
    fromColumnId: number,
    toColumnId: number,
    toIndex: number
  ) => {
    setCards(prev => {
      const next = [...prev];
      const moving = next.find(c => c.id === cardId);
      if (!moving) return prev;

      const from = next
        .filter(c => c.columnId === fromColumnId && c.id !== cardId)
        .sort((a, b) => a.order - b.order);

      const to = next
        .filter(c => c.columnId === toColumnId && c.id !== cardId)
        .sort((a, b) => a.order - b.order);

      const insertAt = toIndex < 0 || toIndex > to.length ? to.length : toIndex;
      to.splice(insertAt, 0, { ...moving, columnId: toColumnId });

      from.forEach((c, i) => (c.order = i));
      to.forEach((c, i) => (c.order = i));

      for (const c of next) {
        if (c.id === cardId) {
          c.columnId = toColumnId;
          const idx = to.findIndex(k => k.id === c.id);
          if (idx >= 0) c.order = idx;
        } else if (c.columnId === fromColumnId) {
          const idx = from.findIndex(k => k.id === c.id);
          if (idx >= 0) c.order = idx;
        } else if (c.columnId === toColumnId) {
          const idx = to.findIndex(k => k.id === c.id);
          if (idx >= 0) c.order = idx;
        }
      }
      return next;
    });
  };

  // DnD: kolonner
  const onReorderColumns = (columnId: number, toIndex: number) => {
    setColumns(prev => {
      const cols = [...prev].sort((a, b) => a.order - b.order);
      const curIndex = cols.findIndex(c => c.id === columnId);
      if (curIndex < 0 || curIndex === toIndex) return prev;

      const [moved] = cols.splice(curIndex, 1);
      cols.splice(toIndex, 0, moved);
      cols.forEach((c, i) => { c.order = i; });
      return [...cols];
    });
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* Fullscreen bakgrunn */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : { backgroundColor: "#0b0b0e" }}
      />

      <BoardHeader
        title={boardTitle}
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
          onEditCard={onEditCard}         // <- åpner modal
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

      {/* Kortdetaljer-modal */}
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
