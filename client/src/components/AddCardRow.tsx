import { useEffect, useRef, useState } from "react";

interface AddCardRowProps {
  onSubmit: (title: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function AddCardRow({
  onSubmit,
  onCancel,
  placeholder = "tittel",
  autoFocus = true,
  className = "",
}: AddCardRowProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    onSubmit(t);
    setTitle("");
  };

  return (
    <div className={`rounded-lg bg-white/10 p-2 ring-1 ring-white/10 ${className}`}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        aria-label="Ny tittel"
        className="w-full rounded bg-black/30 px-3 py-2 outline-none ring-1 ring-white/20 focus:ring-white/40"
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onCancel?.();
        }}
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!title.trim()}
          className="rounded-lg bg-black/30 text-white px-3 py-1 text-sm disabled:opacity-40"
        >
          Legg til
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1 text-sm hover:bg-white/10"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}