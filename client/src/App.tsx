
import { useState } from "react";
import BoardHeader from "./components/boardHeader" ;

export default function App() {
  const [q, setQ] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <BoardHeader
        title="Mitt board"
        searchQuery={q}
        onChangeSearch={setQ}
        onClearSearch={() => setQ("")}
        onAddColumn={() => {}}
        onOpenMenu={() => {}}
      />
      {/* pt-14 matcher h-14 på headeren */}
      <main  className="pt-14 max-w-6xl mx-auto px-4 py-6">
        {/* innholdet ditt */}
      </main>
    </div>
  );
}