import type { Card as CardModel } from "../models/db";

type CardItemProps = {
  card: CardModel;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function CardItem({ card, onToggle, onEdit, onDelete }: CardItemProps) {
  const { title, description, done, dueDate } = card;

  const due =
    dueDate instanceof Date ? dueDate : (dueDate ? new Date(dueDate) : undefined);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dueClass = "bg-white/10 text-white/80 border-white/10";
  if (due) {
    const isOverdue = due < today && !done;
    const in2Days = due >= today && due.getTime() - today.getTime() <= 2 * 24 * 60 * 60 * 1000;
    if (done) dueClass = "bg-emerald-500/20 text-emerald-200 border-emerald-400/20";
    else if (isOverdue) dueClass = "bg-red-500/20 text-red-200 border-red-400/30";
    else if (in2Days) dueClass = "bg-amber-500/20 text-amber-100 border-amber-400/30";
  }

  return (
    <article
      className={`group rounded-lg px-3 py-2 ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition ${
        done ? "opacity-70" : ""
      }`}
      aria-label={`Card: ${title}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={!!done}
          aria-label={done ? "Mark as not done" : "Mark as done"}
          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
            done ? "bg-emerald-500 border-emerald-500" : "border-white/30 hover:bg-white/10"
          }`}
          title="Toggle done"
        >
          {done ? "✓" : ""}
        </button>

        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-medium truncate ${done ? "line-through" : ""}`}>
            {title}
          </h4>

          <div className="mt-1 flex items-center gap-2">
            {due && (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] ${dueClass}`}
                title="Due date"
              >
                {due.toLocaleDateString()}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-white/70 truncate">{description}</span>
            )}
          </div>
        </div>

        <div className="ml-auto hidden gap-1 group-hover:flex">
          <button type="button" onClick={onEdit} className="rounded px-2 py-1 text-xs hover:bg-white/10" aria-label="Edit card">
            Edit
          </button>
          <button type="button" onClick={onDelete} className="rounded px-2 py-1 text-xs hover:bg-white/10" aria-label="Delete card">
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}