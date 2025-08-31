
import { useState } from "react";
import BoardHeader from "./components/boardHeader"; 
import BackgroundPicker from "./components/backgroundPicker"

const BG_OPTIONS = [
  "/backgrounds/basic.webp",
  "/backgrounds/vann.webp",
 
];

export default function App() {
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState("Mitt board");
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  const addColumn = () => {
    console.log("Add column clicked");
  };

  const handleRename = () => {
    const next = prompt("New board title:", boardTitle)?.trim();
    if (next && next !== boardTitle) setBoardTitle(next);
  };

  return (
    <div
      className="fixed inset-0 text-white  bg-cover bg-center "
      style={
        bgUrl
          ? { backgroundImage: `url(${bgUrl})` }
          : { backgroundColor: "white"} // fallback når ingen bakgrunn valgt
      }
    >


      <BoardHeader
        title={boardTitle}
        searchQuery={q}
        onChangeSearch={setQ}
        onClearSearch={() => setQ("")}
        onOpenMenu={() => setMenuOpen((v) => !v)}
        onCloseMenu={() => setMenuOpen(false)}
        menuOpen={menuOpen}
        onRename={handleRename}
        onChangeBackground={() => setPickerOpen(true)}  // 👈 riktig prop-navn
      />

      {/* pt-14 matcher h-14 i headeren */}
      <main className="pt-14 max-w-6xl mx-auto px-4 py-6 relative z-10">
        {/* innholdet ditt */}
      </main>

      <BackgroundPicker
        open={pickerOpen}
        options={BG_OPTIONS}
        onSelect={(url) => setBgUrl(url)}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}