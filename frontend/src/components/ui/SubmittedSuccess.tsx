interface SubmittedSuccessProps {
  title: string;
  description: string;
  onAddAnother: () => void;
}

export default function SubmittedSuccess({ title, description, onAddAnother }: SubmittedSuccessProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-slate-900">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
        <button
          onClick={onAddAnother}
          className="mt-6 cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          Add Another
        </button>
      </div>
    </main>
  );
}
