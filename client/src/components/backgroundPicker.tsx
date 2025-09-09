
type Props = {
  open: boolean;
  options: string[];              // [/backgrounds/pictures]
  onSelect: (url: string) => void;
  onClose: () => void;
};

export default function BackgroundPicker({ open, options, onSelect, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mx-auto mt-24 w-[520px] max-w-[90vw] rounded-xl bg-zinc-900 text-white p-4 shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Choose background</h3>
        <div className="grid grid-cols-3 gap-3">
          {options.map((url) => (
            <button
              key={url}
              className="aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-white/10 hover:ring-white/40"
              onClick={() => { onSelect(url); onClose(); }}
              title={url.split('/').pop()}
            >
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
