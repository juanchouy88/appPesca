import { useMemo, useState } from 'react'
import { Trophy, Medal } from 'lucide-react'
import { mockRankingGeneral, mockRankingBySpecies } from '../data/mockData'

export default function Rankings() {
  const [tab, setTab] = useState('general') // 'general' | 'species'
  const speciesOptions = useMemo(() => {
    const set = new Set(mockRankingBySpecies.map((r) => r.species_name))
    return Array.from(set)
  }, [])
  const [selectedSpecies, setSelectedSpecies] = useState(speciesOptions[0] || '')

  const filteredBySpecies = mockRankingBySpecies.filter((r) => r.species_name === selectedSpecies)

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Rankings</h2>
        <p className="text-sm text-zinc-400">Compite por puntos según especies capturadas.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1">
        <button
          onClick={() => setTab('general')}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            tab === 'general' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:text-zinc-100'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setTab('species')}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            tab === 'species' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:text-zinc-100'
          }`}
        >
          Por especie
        </button>
      </div>

      {tab === 'general' ? (
        <div className="space-y-2">
          {mockRankingGeneral.map((row, idx) => (
            <div key={row.user_id} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm text-zinc-200">
                  {idx === 0 ? <Trophy className="h-4 w-4 text-amber-300" /> : idx + 1}
                </div>
                <img src={row.avatar_url} alt={row.display_name} className="h-10 w-10 rounded-full object-cover border border-zinc-700" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{row.display_name}</p>
                  <p className="text-xs text-zinc-500">{row.catches_count} capturas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-300">{row.total_points}</p>
                <p className="text-[11px] text-zinc-500">pts</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block space-y-1">
            <span className="text-xs text-zinc-400">Especie</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            >
              {speciesOptions.map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            {filteredBySpecies.map((row, idx) => (
              <div key={`${row.species_name}-${row.user_id}`} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm text-zinc-200">
                    {idx < 3 ? <Medal className="h-4 w-4 text-sky-300" /> : idx + 1}
                  </div>
                  <img src={row.avatar_url} alt={row.display_name} className="h-10 w-10 rounded-full object-cover border border-zinc-700" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{row.display_name}</p>
                    <p className="text-xs text-zinc-500">{row.catches_count} capturas en {row.species_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-300">{row.points_in_species}</p>
                  <p className="text-[11px] text-zinc-500">pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
