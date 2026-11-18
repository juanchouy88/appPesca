import { useEffect, useState } from 'react'
import CatchCard from '../components/CatchCard'
import { supabase } from '../lib/supabaseClient'

export default function Feed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true)
      setErrorMsg('')

      const { data, error } = await supabase
        .from('catches')
        .select('id, caption, caught_at, created_at, photo_path, profiles(display_name, username, avatar_url), species(name, base_points)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        setErrorMsg(error.message || 'No se pudo cargar el feed.')
        setItems([])
        setLoading(false)
        return
      }

      const mapped = (data || []).map((row) => {
        const photoUrl = row.photo_path
          ? supabase.storage.from('catches').getPublicUrl(row.photo_path).data.publicUrl
          : ''
        return {
          id: row.id,
          caption: row.caption,
          caught_at: row.caught_at,
          created_at: row.created_at,
          photo_url: photoUrl,
          user: {
            name: row.profiles?.display_name || row.profiles?.username || 'Angler',
            avatar: row.profiles?.avatar_url || null,
          },
          species: {
            name: row.species?.name || 'Especie',
            base_points: row.species?.base_points ?? null,
          },
        }
      })

      setItems(mapped)
      setLoading(false)
    }

    loadFeed()
  }, [])

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Feed</h2>
        <p className="text-sm text-zinc-400">Capturas recientes de la comunidad.</p>
      </div>

      {loading && <p className="text-sm text-zinc-400">Cargando...</p>}
      {errorMsg && <p className="text-sm text-red-300">{errorMsg}</p>}

      {!loading && !errorMsg && items.length === 0 && (
        <p className="text-sm text-zinc-400">No hay capturas todavía.</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <CatchCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
