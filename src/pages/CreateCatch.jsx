import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { supabase } from '../lib/supabaseClient'

async function compressImage(file, opts = {}) {
  const maxW = opts.maxWidth || 1600
  const quality = opts.quality ?? 0.8
  const img = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = URL.createObjectURL(file)
  })

  const scale = Math.min(1, maxW / img.width)
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, w, h)
  URL.revokeObjectURL(img.src)

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality)
  })
  return blob
}

export default function CreateCatch() {
  const { user, loading } = useAuth()

  const [speciesList, setSpeciesList] = useState([])
  const [loadingSpecies, setLoadingSpecies] = useState(true)

  const [speciesId, setSpeciesId] = useState('')
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const loadSpecies = async () => {
      setLoadingSpecies(true)
      const { data, error } = await supabase
        .from('species')
        .select('id,name,base_points')
        .eq('is_active', true)
        .order('name')

      if (!error && data) {
        setSpeciesList(data)
      }
      setLoadingSpecies(false)
    }
    loadSpecies()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const canSubmit = useMemo(() => {
    return !!user && !!file && !!speciesId && !submitting
  }, [user, file, speciesId, submitting])

  const onPickFile = (e) => {
    setErrorMsg('')
    setSuccessMsg('')
    const f = e.target.files?.[0] || null
    setFile(f)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(f ? URL.createObjectURL(f) : '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setErrorMsg('')
    setSuccessMsg('')

    if (!file) {
      setErrorMsg('Selecciona una foto.')
      return
    }
    if (!speciesId) {
      setErrorMsg('Selecciona una especie.')
      return
    }

    setSubmitting(true)
    try {
      const compressed = await compressImage(file, { maxWidth: 1600, quality: 0.8 })
      if (!compressed) throw new Error('No se pudo procesar la imagen.')

      const fileName = `${crypto.randomUUID()}.jpg`
      const path = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('catches')
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: false })

      if (uploadError) throw uploadError

      const { error: insertError } = await supabase.from('catches').insert({
        user_id: user.id,
        species_id: speciesId,
        photo_path: path,
        caption: caption.trim() || null,
        caught_at: new Date().toISOString(),
        status: 'pending',
      })

      if (insertError) throw insertError

      setSuccessMsg('Captura enviada. Quedará visible cuando sea aprobada.')
      setFile(null)
      setCaption('')
      setSpeciesId('')
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
    } catch (err) {
      setErrorMsg(err?.message || 'No se pudo publicar la captura.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Nueva captura</h2>
        <p className="text-sm text-zinc-400">Cargando...</p>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Nueva captura</h2>
        <p className="text-sm text-zinc-400">Necesitas iniciar sesión para publicar una captura.</p>
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
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Nueva captura</h2>
        <p className="text-sm text-zinc-400">Saca la foto, elige la especie y publica.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <label className="block space-y-1">
          <span className="text-xs text-zinc-400">Foto</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPickFile}
            className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-100"
          />
        </label>

        {previewUrl && (
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <img src={previewUrl} alt="Vista previa" className="h-64 w-full object-cover" />
          </div>
        )}

        <label className="block space-y-1">
          <span className="text-xs text-zinc-400">Especie</span>
          <select
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            disabled={loadingSpecies}
          >
            <option value="">{loadingSpecies ? 'Cargando...' : 'Selecciona una especie'}</option>
            {speciesList.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.name} (+{sp.base_points} pts)
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-zinc-400">Nota (opcional)</span>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            placeholder="Cómo estuvo la jornada..."
          />
        </label>

        {errorMsg && <p className="text-sm text-red-300">{errorMsg}</p>}
        {successMsg && <p className="text-sm text-emerald-300">{successMsg}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
        >
          {submitting ? 'Publicando...' : 'Publicar captura'}
        </button>
      </form>
    </section>
  )
}
