import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Profile() {
  const { user, loading, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [myCatches, setMyCatches] = useState([])
  const [loadingCatches, setLoadingCatches] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setProfile(null)
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url, is_admin')
        .eq('id', user.id)
        .maybeSingle()

      if (!error && data) {
        setProfile(data)
        setDisplayName(data.display_name || '')
        setUsername(data.username || '')
        setIsAdmin(!!data.is_admin)
      } else {
        setProfile(null)
        setDisplayName('')
        setUsername('')
        setIsAdmin(false)
      }
    }
    loadProfile()
  }, [user?.id])

  useEffect(() => {
    const loadMyCatches = async () => {
      if (!user?.id) {
        setMyCatches([])
        setLoadingCatches(false)
        return
      }
      setLoadingCatches(true)
      const { data, error } = await supabase
        .from('catches')
        .select('id, caption, caught_at, created_at, photo_path, status, species(name, base_points)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setMyCatches(data)
      } else {
        setMyCatches([])
      }
      setLoadingCatches(false)
    }
    loadMyCatches()
  }, [user?.id])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    setSaving(true)
    setMsg('')
    try {
      const payload = {
        id: user.id,
        display_name: displayName || null,
        username: username || null,
      }
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })
      if (error) throw error
      setMsg('Perfil actualizado.')
    } catch (err) {
      setMsg(err?.message || 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handleDeleteCatch = async (catchItem) => {
    if (!user?.id) return
    const ok = window.confirm('¿Eliminar esta captura? Esta acción no se puede deshacer.')
    if (!ok) return

    setDeletingId(catchItem.id)
    try {
      const { error: delError } = await supabase
        .from('catches')
        .delete()
        .eq('id', catchItem.id)
        .eq('user_id', user.id)
      if (delError) throw delError

      // Try to remove image from storage (best effort)
      if (catchItem.photo_path) {
        await supabase.storage.from('catches').remove([catchItem.photo_path])
      }

      setMyCatches((prev) => prev.filter((c) => c.id !== catchItem.id))
    } catch (err) {
      alert(err?.message || 'No se pudo eliminar.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Perfil</h2>
        <p className="text-sm text-zinc-400">Cargando...</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Perfil</h2>
        <p className="text-sm text-zinc-400">Inicia sesión para ver y editar tu perfil.</p>
        <Link
          to="/auth"
          className="inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
        >
          Ir a iniciar sesión
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Perfil</h2>
        <p className="text-sm text-zinc-400">{user.email}</p>
        {isAdmin && (
          <Link
            to="/admin"
            className="inline-flex rounded-xl border border-emerald-500/40 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10"
          >
            Moderar capturas (Admin)
          </Link>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <label className="block space-y-1">
          <span className="text-xs text-zinc-400">Nombre visible</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            placeholder="Tu nombre"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-zinc-400">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            placeholder="ej: leo_angler"
          />
        </label>

        {msg && <p className="text-sm text-zinc-300">{msg}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Mis capturas</h3>
          <p className="text-sm text-zinc-400">Tus publicaciones recientes.</p>
        </div>

        {loadingCatches && <p className="text-sm text-zinc-400">Cargando capturas...</p>}

        {!loadingCatches && myCatches.length === 0 && (
          <p className="text-sm text-zinc-400">Todavía no publicaste capturas.</p>
        )}

        <div className="space-y-3">
          {myCatches.map((c) => {
            const photoUrl = c.photo_path
              ? supabase.storage.from('catches').getPublicUrl(c.photo_path).data.publicUrl
              : ''
            return (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
                {photoUrl && (
                  <img src={photoUrl} alt="Captura" className="h-56 w-full object-cover" />
                )}
                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-100">{c.species?.name || 'Especie'}</p>
                    <p className="text-xs text-zinc-500">
                      {c.caught_at ? new Date(c.caught_at).toLocaleDateString('es-AR') : ''}
                    </p>
                  </div>
                  {c.status && c.status !== 'approved' && (
                    <p className="text-xs text-amber-300">Estado: {c.status === 'pending' ? 'En revisión' : 'Rechazada'}</p>
                  )}
                  {c.caption && <p className="text-sm text-zinc-300">{c.caption}</p>}
                  <button
                    type="button"
                    onClick={() => handleDeleteCatch(c)}
                    disabled={deletingId === c.id}
                    className="rounded-xl border border-red-500/40 px-3 py-2 text-xs font-medium text-red-200 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    {deletingId === c.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
      >
        Cerrar sesión
      </button>
    </section>
  )
}
