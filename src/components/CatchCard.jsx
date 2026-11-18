import { MapPin, CalendarDays, Fish } from 'lucide-react'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

export default function CatchCard({ item }) {
  const name = item.user?.name ?? item.user?.display_name ?? 'Angler'
  const avatar = item.user?.avatar ?? item.user?.avatar_url
  const speciesName = item.species?.name ?? item.species_name ?? 'Especie'
  const points = item.species?.base_points ?? item.points ?? null

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={avatar || 'https://i.pravatar.cc/100?img=5'}
            alt={name}
            className="h-10 w-10 rounded-full object-cover border border-zinc-700"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-100">{name}</p>
            <p className="flex items-center gap-1 text-xs text-zinc-400">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(item.caught_at || item.created_at)}
            </p>
          </div>
        </div>

        {points != null && (
          <div className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            +{points} pts
          </div>
        )}
      </div>

      <div className="aspect-[4/5] w-full bg-zinc-950">
        <img
          src={item.photo_url}
          alt={`Captura de ${speciesName}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-200">
            <Fish className="h-4 w-4 text-sky-300" />
            {speciesName}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3.5 w-3.5" />
            Spot
          </span>
        </div>

        {item.caption && (
          <p className="text-sm leading-relaxed text-zinc-300">{item.caption}</p>
        )}
      </div>
    </article>
  )
}
