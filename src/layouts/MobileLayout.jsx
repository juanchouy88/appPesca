import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function MobileLayout() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">App</p>
            <h1 className="text-lg font-semibold text-zinc-100">PescaDatos</h1>
          </div>
          <div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
            MVP
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 pb-28 pt-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
