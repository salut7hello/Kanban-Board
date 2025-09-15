import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Column from "./Column";
import type { Column as ColumnModel, Card as CardModel } from "../models/db";

type Props = {
  column: ColumnModel;
  cards: CardModel[];
  onRenameColumn: (columnId: number, nextTitle: string) => void;
  onDeleteColumn: (columnId: number) => void;
  onAddCard: (columnId: number, title: string) => void;
  onToggleCard?: (cardId: number) => void;
  onEditCard?: (cardId: number) => void;
  onDeleteCard?: (cardId: number) => void;
};

export default function SortableColumn(props: Props) {
  const { column } = props;

  const {
    setNodeRef,
    setActivatorNodeRef,   
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: column.id!,                   
    data: { type: "column", columnId: column.id },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
  
    <div ref={setNodeRef} style={style}>
      <Column
        {...props}
        // hele headeren 
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}