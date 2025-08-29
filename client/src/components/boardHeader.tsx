import React, { useRef } from "react";

interface BoardHeaderProps {
  title: string;
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  onClearSearch: () => void;
  onAddColumn: () => void;
  onOpenMenu: () => void;
  
}

export default function BoardHeader({
  title,
  searchQuery,
  onChangeSearch,
  onClearSearch,
  onAddColumn,
  onOpenMenu,
}: BoardHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header
  aria-label="Board header"
  className="fixed top-0 inset-x-0 z-50 bg-zinc-900/80 text-white backdrop-blur border-b border-zinc-800"
>
  <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
    <div className="flex items-center gap-1 min-w-0">
      <h1 className="text-lg md:text-xl font-semibold truncate">{title}</h1>
      <button
        type="button"
        onClick={onOpenMenu}
        aria-haspopup="menu"
        aria-expanded={false}
        className="ml-1 px-1.5 py-0.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        title="Board menu"
      >
        ▾
      </button>
    </div>

    <form role="search" onSubmit={(e)=>e.preventDefault()} className="ml-auto w-56 md:w-72">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={searchQuery}
          onChange={(e)=>onChangeSearch(e.target.value)}
          placeholder="Søk…"
          aria-label="Search cards"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 placeholder-white/60
                     focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => { onClearSearch(); inputRef.current?.focus() }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            ×
          </button>
        )}
      </div>
    </form>

    <div role="toolbar" aria-label="Board actions" className="hidden sm:flex items-center gap-2">
      <button
        type="button"
        onClick={onAddColumn}
        className="px-3 py-2 rounded-lg bg-white text-zinc-900 text-sm hover:opacity-90"
      >
        + Add new list
      </button>
    </div>
  </div>
</header>
  );
}