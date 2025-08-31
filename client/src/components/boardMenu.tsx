import { useEffect, useRef } from "react";

export type BoardMenuProps = {
  open: boolean;
  onClose: () => void;
  onRename: () => void;
  onChangeBackground: () => void;
};

export default function BoardMenu({ open, onClose, onRename, onChangeBackground }: BoardMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!panelRef.current?.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    firstBtnRef.current?.focus();
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Board menu"
      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-700/60 bg-zinc-900 text-white shadow-xl"
    >
      <button ref={firstBtnRef} role="menuitem" className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg" onClick={() => { onRename(); onClose(); }}>
        Rename board…
      </button>
      <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg" onClick={() => { onChangeBackground(); onClose(); }}>
        Change background…
      </button>
    </div>
  );
}