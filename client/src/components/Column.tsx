import { useState } from "react";
import AddCardRow from "./AddCardRow";
import DraggableCard from "./DraggableCard";
import type { Card as CardModel } from "../models/db";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

type ColumnModel = {
  id: number;
  title: string;
  order: number;
};

interface ColumnProps {
  column: ColumnModel;
  cards: CardModel[];

  // fra SortableColumn
  dragHandleRef?: (el: HTMLElement | null) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;

  // kolonne-handlinger
  onRenameColumn: (columnId: number, nextTitle: string) => void;
  onDeleteColumn: (columnId: number) => void;

  // kort-handlinger
  onAddCard: (columnId: number, title: string) => void;
  onToggleCard?: (cardId: number) => void;
  onEditCard?: (cardId: number) => void;
  onDeleteCard?: (cardId: number) => void;
}

export default function Column({
  column,
  cards,
  dragHandleRef,
  dragHandleProps,
  onRenameColumn,
  onDeleteColumn,
  onAddCard,
  onToggleCard,
  onEditCard,
  onDeleteCard,
}: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hele kolonnen er droppable (slipp kort nederst i lista)
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${column.id}`,
    data: { type: "column", columnId: column.id },
  });

  const sortedCards = [...cards].sort((a, b) => a.order - b.order);
  const itemIds = sortedCards.map((c) => c.id!);

  const doRename = () => {
    const next = prompt("Rename list:", column.title)?.trim();
    if (next && next !== column.title) onRenameColumn(column.id, next);
    setMenuOpen(false);
  };

  const doDelete = () => {
    if (confirm(`Slette listen «${column.title}» og alle kort i den?`)) {
      onDeleteColumn(column.id);
    }
    setMenuOpen(false);
  };

  return (
  <section
    aria-label={column.title}
    ref={setNodeRef}
    className="w-72 shrink-0 rounded-2xl bg-black/70 text-white shadow-lg ring-1 ring-white/10"
    style={{ outline: isOver ? "2px dashed rgba(255,255,255,.25)" : "none" }}
  >
    {/* Kolonne-header (hele headeren er drag-handle) */}
    <div
      className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing"
      ref={dragHandleRef as never}
      {...dragHandleProps}
    >
      {/* Tittel */}
      <h3 className="font-semibold truncate select-none">{column.title}</h3>

      {/* Menyknapp - stopp drag når den klikkes/trykkes */}
      <div className="relative">
        <button
          type="button"
          aria-label="Kolonnemeny"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="px-2 py-1 rounded hover:bg-white/10 cursor-default"
          onClick={() => setMenuOpen(v => !v)}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          ⋯
        </button>
          {menuOpen && (
            <>
              {/* klikk utenfor for å lukke */}
              <button
                aria-hidden
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div
                role="menu"
                className="absolute right-0 mt-2 z-50 w-44 rounded-xl bg-zinc-900 text-sm ring-1 ring-white/10 shadow-lg overflow-hidden"
              >
                <button
                  role="menuitem"
                  className="block w-full text-left px-3 py-2 hover:bg-white/10"
                  onClick={doRename}
                >
                  Rename list…
                </button>
                <button
                  role="menuitem"
                  className="block w-full text-left px-3 py-2 hover:bg-white/10 text-red-300"
                  onClick={doDelete}
                >
                  Delete list…
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* liste (sortable) */}
      <div className="px-3 pb-3">
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {sortedCards.length === 0 ? (
            <div className="text-sm text-white/60 py-2">Ingen kort ennå</div>
          ) : (
            <ul className="space-y-2">
              {sortedCards.map((c, i) => (
                <li key={c.id}>
                  <DraggableCard
                    card={c}
                    columnId={column.id}
                    index={i}
                    onToggle={() => onToggleCard?.(c.id!)}
                    onEdit={() => onEditCard?.(c.id!)}
                    onDelete={() => onDeleteCard?.(c.id!)}
                  />
                </li>
              ))}
            </ul>
          )}
        </SortableContext>

        {/* Legg til kort */}
        {!adding ? (
          <button
            type="button"
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
            onClick={() => setAdding(true)}
          >
            + Legg til et kort
          </button>
        ) : (
          <AddCardRow
            onSubmit={(title) => {
              onAddCard(column.id, title );
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
            className="mt-2"
          />
        )}
      </div>
    </section>
  );
}

