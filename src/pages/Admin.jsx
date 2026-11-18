import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(null)
  const [pending, setPending] = useState([])
  const [loadingPending, setLoadingPending] = useState(true)
  const [actionId, setActionId] = useState(null)

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) {
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()
      setIsAdmin(!!data?.is_admin)
    }
    checkAdmin()
  }, [user?.id])

  useEffect(() => {
    const loadPending = async () => {
      if (!isAdmin) {
        setPending([])
        setLoadingPending(false)
        return
      }
      setLoadingPending(true)
      const { data, error } = await supabase
        .from('catches')
        .select('id, caption, created_at, photo_path, status, profiles(display_name, username), species(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (!error && data) {
        setPending(data)
      } else {
        setPending([])
      }
      setLoadingPending(false)
    }
    loadPending()
  }, [isAdmin])

  const setStatus = async (id, status) => {
    setActionId(id)
    try {
      const { error } = await supabase.from('catches').update({ status }).eq('id', id)
      if (error) throw error
      setPending((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err?.message || 'No se pudo actualizar.')
    } finally {
      setActionId(null)
    }
  }

  if (loading || isAdmin === null) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Admin</h2>
        <p className="text-sm text-zinc-400">Cargando...</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Admin</h2>
        <p className="text-sm text-zinc-400">Inicia sesión.</p>
        <Link to="/auth" className="inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950">
          Ir a iniciar sesión
        </Link>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Admin</h2>
        <p className="text-sm text-zinc-400">No tienes permisos de administrador.</p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Moderación</h2>
        <p className="text-sm text-zinc-400">Capturas pendientes de aprobación.</p>
      </div>

      {loadingPending && <p className="text-sm text-zinc-400">Cargando...</p>}
      {!loadingPending && pending.length === 0 && <p className="text-sm text-zinc-400">No hay capturas pendientes.</p>}

      <div className="space-y-3">
        {pending.map((c) => {
          const photoUrl = c.photo_path
            ? supabase.storage.from('catches').getPublicUrl(c.photo_path).data.publicUrl
            : ''
          const userName = c.profiles?.display_name || c.profiles?.username || 'Angler'
          return (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
              {photoUrl && <img src={photoUrl} alt="Captura" className="h-56 w-full object-cover" />}
              <div className="space-y-2 p-4">
                <p className="text-sm text-zinc-300"><span className="text-zinc-500">Usuario:</span> {userName}</p>
                <p className="text-sm text-zinc-300"><span className="text-zinc-500">Especie:</span> {c.species?.name || '—'}</p>
                {c.caption && <p className="text-sm text-zinc-400">{c.caption}</p>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStatus(c.id, 'approved')}
                    disabled={actionId === c.id}
                    className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(c.id, 'rejected')}
                    disabled={actionId === c.id}
                    className="flex-1 rounded-xl border border-red-500/40 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
