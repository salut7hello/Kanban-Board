import { useEffect, useState } from "react";
import type { Card as CardModel } from "../models/db";

type Props = {
  open: boolean;
  card: CardModel | null;
  columnName: string;
  onClose: () => void;
  onSave: (cardId: number, patch: Partial<CardModel>) => void;
  onDelete: (cardId: number) => void;
};

function toInputDate(d: Date | string | undefined) {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CardDetails({
  open,
  card,
  columnName,
  onClose,
  onSave,
  onDelete,
}: Props) {
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const [dueDateStr, setDueDateStr] = useState("");

  // Sync lokalt skjema når et nytt kort åpnes
  useEffect(() => {
    if (open && card) {
      setTitle(card.title);
      setDescription(card.description ?? "");
      setDone(!!card.done);
      setDueDateStr(toInputDate(card.dueDate));
    }
  }, [open, card?.id]); 

  
  if (!open || !card) return null;

  const handleSave = () => {
    const patch: Partial<CardModel> = {
      title: title.trim() || card.title,
      description: description.trim() || undefined,
      done,
      dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
    };
    onSave(card.id!, patch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop som lukker ved klikk */}
      <button
        aria-hidden
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kortdetaljer"
        className="relative mx-auto mt-16 w-[640px] max-w-[calc(100%-2rem)] rounded-2xl bg-zinc-900 text-white ring-1 ring-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/15 text-[11px] uppercase tracking-wide shrink-0">
              {columnName}
            </span>
            
          </div>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 hover:bg-white/10"
            aria-label="Lukk"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Tittel</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-black/40 px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Beskrivelse</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-lg bg-black/40 px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-white/30 resize-y"
              placeholder="Skriv en mer detaljert beskrivelse…"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-white/80">
              Forfallsdato
              <input
                type="date"
                value={dueDateStr}
                onChange={(e) => setDueDateStr(e.target.value)}
                className="ml-2 rounded bg-black/40 px-2 py-1 outline-none ring-1 ring-white/15 focus:ring-white/30"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => setDone(e.target.checked)}
                className="h-4 w-4 accent-emerald-500"
              />
              Ferdig
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
          <button
            onClick={() => {
              onDelete(card.id!);
              onClose();
            }}
            className="rounded-lg px-3 py-2 text-sm bg-green-600 hover:bg-black-500"
          >
            Slett kort
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm hover:bg-white/10"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg px-3 py-2 text-sm bg-white text-white hover:opacity-90"
            >
              Lagre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

