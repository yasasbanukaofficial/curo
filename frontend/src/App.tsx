function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-slate-900">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
          Curo
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome to Curo
        </h1>
        <p className="mt-3 text-slate-600">
          The frontend is ready. Start building in{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            src/
          </code>
          .
        </p>
      </div>
    </main>
  )
}

export default App
