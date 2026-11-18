import { NavLink } from 'react-router-dom'
import { Home, Map, Plus, Trophy, User } from 'lucide-react'

const itemClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
    isActive ? 'text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
  }`

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 py-2">
        <NavLink to="/" className={itemClass} end>
          <Home className="h-5 w-5" />
          Feed
        </NavLink>

        <NavLink to="/explorar" className={itemClass}>
          <Map className="h-5 w-5" />
          Explorar
        </NavLink>

        <NavLink to="/crear" className="flex items-center justify-center" aria-label="Crear captura">
          <span className="-mt-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 ring-4 ring-zinc-950">
            <Plus className="h-7 w-7" />
          </span>
        </NavLink>

        <NavLink to="/rankings" className={itemClass}>
          <Trophy className="h-5 w-5" />
          Rankings
        </NavLink>

        <NavLink to="/perfil" className={itemClass}>
          <User className="h-5 w-5" />
          Perfil
        </NavLink>
      </div>
    </nav>
  )
}
