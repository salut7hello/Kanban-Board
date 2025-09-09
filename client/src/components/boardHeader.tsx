import { useRef } from "react";
import BoardMenu from "./BoardMenu"
import type { BoardMenuProps } from "./BoardMenu";

type BoardMenuActions = Pick<BoardMenuProps, "onRename" | "onChangeBackground">;
interface BoardHeaderProps extends BoardMenuActions {
  title: string;
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  onClearSearch: () => void;
  onOpenMenu: () => void;    
  onCloseMenu: () => void;   
  menuOpen: boolean;          
}

export default function BoardHeader({
  title,
  searchQuery,
  onChangeSearch,
  onClearSearch,
  onOpenMenu,
  onCloseMenu,
  menuOpen,
  onRename,
  onChangeBackground,
}: BoardHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header
      aria-label="Board header"
      className="fixed top-0 inset-x-0 z-50 bg-zinc-900/80 text-white backdrop-blur border-b border-zinc-800"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Tittel + chevron + meny */}
        <div className="relative flex items-center gap-1 min-w-0">
          <h1 className="text-lg md:text-xl font-semibold truncate">{title}</h1>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            title="Board menu"
            className="ml-1 px-1.5 py-0.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            ▾
          </button>

          <BoardMenu
            open={menuOpen}
            onClose={onCloseMenu}
            onRename={onRename}
            onChangeBackground={onChangeBackground}
          />
        </div>

        {/* Søk */}
        <form role="search" onSubmit={(e) => e.preventDefault()} className="ml-auto w-56 md:w-72">
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Søk…"
              aria-label="Search cards"
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onClearSearch();
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </form>

      
      </div>
    </header>
  );
}