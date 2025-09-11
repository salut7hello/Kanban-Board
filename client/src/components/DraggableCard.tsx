
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardItem from "./CardItem";
import type { Card as CardModel } from "../models/db";

type Props = {
  card: CardModel;
  columnId: number;   // den kolonnen kortet ligger i nå
  index: number;      // posisjon i kolonnen
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function DraggableCard({ card, columnId, index, ...actions }: Props) {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({
      id: card.id!,               
      data: { type: "card", columnId, index }, 
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardItem card={card} {...actions} />
    </div>
  );
}
