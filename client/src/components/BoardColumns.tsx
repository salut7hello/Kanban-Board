
import Column from "./Column";
import AddColumnCard from "./AddColumnCard";
import type { Card as CardModel, Column as ColumnModel } from "../models/db";
import {
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

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

  /** Kalles når et kort flyttes/slippes et nytt sted */
  onReorderCards?: (
    cardId: number,
    fromColumnId: number,
    toColumnId: number,
    toIndex: number
  ) => void;
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
}: BoardColumnsProps) {
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  // PointerSensor funker for både mus og touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // velg én av disse constraint-typene:
      activationConstraint: { distance: 8 }, // start drag etter 8px bevegelse
      // activationConstraint: { delay: 150, tolerance: 5 }, // eller hold i 150ms
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id as number; // card-id vi satte i useSortable
    const fromColId = active.data.current?.columnId as number | undefined;

    // over kan være et annet kort ELLER selve kolonneflaten
    const overType = over.data.current?.type as "card" | "column" | undefined;

    let toColId: number;
    let toIndex: number;

    if (overType === "card") {
      toColId = over.data.current!.columnId as number;
      toIndex = over.data.current!.index as number;
    } else if (overType === "column") {
      toColId = over.data.current!.columnId as number;
      toIndex = -1; // slipp nederst i kolonnen
    } else {
      return;
    }

    if (fromColId == null) return;
    // ingen reell endring
    if (fromColId === toColId && over.id === active.id) return;

    onReorderCards?.(activeId, fromColId, toColId, toIndex);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <section
        aria-label="Kolonner"
        className="pt-4 pb-6 px-4 overflow-x-auto hide-scrollbar"
      >
        <div className="flex items-start gap-4 w-max">
          {sortedColumns.map((col) => {
            const colCards = cards
              .filter((c) => c.columnId === col.id)
              .sort((a, b) => a.order - b.order);

            return (
              <Column
                key={col.id}
                column={col}
                cards={colCards}
                onRenameColumn={onRenameColumn}
                onDeleteColumn={onDeleteColumn}
                onAddCard={onAddCard}
                onToggleCard={onToggleCard}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
              />
            );
          })}

          <AddColumnCard onAdd={onAddColumn} />
        </div>
      </section>
    </DndContext>
  );
}
