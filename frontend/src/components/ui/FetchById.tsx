interface FetchByIdProps {
  value: string;
  onChange: (value: string) => void;
  onFetch: () => void;
  placeholder: string;
  result?: React.ReactNode;
}


export default function FetchById({ value, onChange, onFetch, placeholder, result }: FetchByIdProps) {
  return (
    <>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        />
        <button
          onClick={onFetch}
          className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          Fetch
        </button>
      </div>
      {result && (
        <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {result}
        </div>
      )}
    </>
  );
}
