import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

export default function Auth() {
  const navigate = useNavigate()
  const { signInWithPassword, signUpWithPassword, signInWithGoogle } = useAuth()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signInWithPassword(email, password)
        if (error) throw error
        navigate('/', { replace: true })
      } else {
        const { data, error } = await signUpWithPassword(email, password)
        if (error) throw error
        // If email confirmations are enabled, session may be null.
        if (!data?.session) {
          setInfoMsg('Revisa tu correo para confirmar la cuenta y luego inicia sesión.')
        } else {
          navigate('/', { replace: true })
        }
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Ocurrió un error. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setErrorMsg('')
    setInfoMsg('')
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
      // OAuth redirects away; nothing else to do here.
    } catch (err) {
      setErrorMsg(err?.message || 'No se pudo iniciar sesión con Google.')
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Cuenta</h2>
        <p className="text-sm text-zinc-400">
          {mode === 'login' ? 'Inicia sesión para publicar capturas.' : 'Crea tu cuenta para empezar.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            mode === 'login' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:text-zinc-100'
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            mode === 'register' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:text-zinc-100'
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <label className="block space-y-1">
          <span className="text-xs text-zinc-400">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            placeholder="tu@email.com"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-zinc-400">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            placeholder="Mínimo 6 caracteres"
          />
        </label>

        {errorMsg && <p className="text-sm text-red-300">{errorMsg}</p>}
        {infoMsg && <p className="text-sm text-emerald-300">{infoMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
        >
          {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>

      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="h-px flex-1 bg-zinc-800" />
          o
          <div className="h-px flex-1 bg-zinc-800" />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800 disabled:opacity-60"
        >
          Continuar con Google
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        Al continuar aceptas usar la app. <Link className="underline" to="/">Volver al inicio</Link>
      </p>
    </section>
  )
}
