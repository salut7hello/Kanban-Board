import { useEffect, useRef, useState } from "react";

interface AddColumnCardProps {
  onAdd: (title: string) => void;
  className?: string;
}

export default function AddColumnCard({ onAdd, className = "" }: AddColumnCardProps) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    onAdd(t);
    setTitle("");
    setAdding(false);
  };

  if (!adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className={`w-72 shrink-0 rounded-2xl bg-white/15 text-white ring-1 ring-white/10 hover:bg-white/20 px-4 py-3 text-left ${className}`}
      >
        + Legg til en ny liste
      </button>
    );
  }

  return (
    <div className={`w-72 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/10 p-3 ${className}`}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Listetittel…"
        aria-label="Listetittel"
        className="w-full rounded bg-black/30 px-3 py-2 outline-none ring-1 ring-white/20 focus:ring-white/40"
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") {
            setTitle("");
            setAdding(false);
          }
        }}
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!title.trim()}
          className="rounded-lg bg-white text-white px-3 py-1 text-sm disabled:opacity-40"
        >
          Legg til
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setAdding(false);
          }}
          className="rounded-lg px-3 py-1 text-sm hover:bg-white/10"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}