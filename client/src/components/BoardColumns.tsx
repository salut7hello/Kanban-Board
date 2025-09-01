import Column from "./Column";
import AddColumnCard from "./AddColumnCard";
import type { Card as CardModel, Column as ColumnModel } from "../models/db"; // justér sti ved behov

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
}: BoardColumnsProps) {
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <section aria-label="Kolonner" className="pt-4 pb-6 px-4 overflow-x-auto hide-scrollbar">
      <div className="flex items-start gap-4">
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
  );
}