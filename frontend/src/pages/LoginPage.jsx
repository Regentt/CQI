import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm]     = useState({ username: '', password: '', email: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await register(form.username, form.password, form.email)
      } else {
        await login(form.username, form.password)
      }

      navigate('/', { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0] ||
        'Something went wrong'

      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-bold">C</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">CQI System</h1>

          <p className="text-sm text-gray-500 mt-1">
            {isRegister ? 'Create a new account' : 'Login to your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={set('username')}
              required
              autoFocus
              placeholder="your_username"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* Email */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Email <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold rounded-lg transition"
          >
            {loading
              ? isRegister
                ? 'Creating account...'
                : 'Logging in...'
              : isRegister
              ? 'Register'
              : 'Login'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-xs text-gray-500 mt-6">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister((v) => !v)
              setError('')
            }}
            className="text-violet-600 font-semibold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
} 