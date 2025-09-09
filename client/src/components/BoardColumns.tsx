import SortableColumn from "./SortableColumn";
import AddColumnCard from "./AddColumnCard";
import type { Card as CardModel, Column as ColumnModel } from "../models/db";
import {
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

interface BoardColumnsProps {
  columns: ColumnModel[];
  cards: CardModel[];

  onAddColumn: (title: string) => void;
  onRenameColumn: (columnId: number, nextTitle: string) => void;
  onDeleteColumn: (columnId: number) => void;

  onAddCard: (columnId: number, title: string) => void;
  onToggleCard?: (cardId: number) => void;
  onEditCard?: (cardId: number) => void;
  onDeleteCard?: (cardId: number) => void;

  // kort flyttes
  onReorderCards?: (
    cardId: number,
    fromColumnId: number,
    toColumnId: number,
    toIndex: number
  ) => void;

  // kolonner flyttes
  onReorderColumns?: (columnId: number, toIndex: number) => void;
}

export default function BoardColumns({
  columns,
  cards,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onAddCard,
  onToggleCard,
  onEditCard,
  onDeleteCard,
  onReorderCards,
  onReorderColumns,
}: BoardColumnsProps) {
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  const columnIds = sortedColumns.map((c) => c.id!);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    // ── 1) Kolonne flyttes ───────────────────────────────────────────────
    if (active.data.current?.type === "column") {
      const activeId = active.id as number;

      // over.id kan være tallet (kolonne-id) eller ha data med columnId
      const overId: number | undefined =
        typeof over.id === "number"
          ? (over.id as number)
          : (over.data.current?.columnId as number | undefined);

      if (!overId || activeId === overId) return;

      const toIndex = columnIds.indexOf(overId);
      if (toIndex !== -1) onReorderColumns?.(activeId, toIndex);
      return;
    }

    // ── 2) Kort flyttes ──────────────────────────────────────────────────
    if (active.data.current?.type === "card") {
      const activeId = active.id as number;
      const fromColId = active.data.current?.columnId as number | undefined;

      const overType = over.data.current?.type as "card" | "column" | undefined;

      let toColId: number | undefined;
      let toIndex = -1;

      if (overType === "card") {
        toColId = over.data.current!.columnId as number;
        toIndex = over.data.current!.index as number;
      } else if (overType === "column") {
        // slippes på kolonneflaten → legg på slutten
        toColId = over.data.current!.columnId as number;
        toIndex = -1;
      }

      if (fromColId != null && toColId != null) {
        // ingen reell endring
        if (fromColId === toColId && over.id === active.id) return;

        onReorderCards?.(activeId, fromColId, toColId, toIndex);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <section className="pt-4 pb-6 px-4 overflow-x-auto hide-scrollbar" aria-label="Kolonner">
        <div className="flex items-start gap-4 w-max">
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {sortedColumns.map((col) => (
              <SortableColumn
                key={col.id}
                column={col}
                cards={cards
                  .filter((c) => c.columnId === col.id)
                  .sort((a, b) => a.order - b.order)}
                onRenameColumn={onRenameColumn}
                onDeleteColumn={onDeleteColumn}
                onAddCard={onAddCard}
                onToggleCard={onToggleCard}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
              />
            ))}
          </SortableContext>

          <AddColumnCard onAdd={onAddColumn} />
        </div>
      </section>
    </DndContext>
  );
}
