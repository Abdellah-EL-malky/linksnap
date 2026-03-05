import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../store/authStore'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'

const DEMO_USER = { email: 'demo@linksnap.com', password: 'demo1234', firstName: 'Demo', avatarColor: '#10b981' }

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data); toast.success('Welcome back, ' + data.firstName + '!'); navigate('/dashboard')
    } catch(e) { toast.error(e.response?.data?.error || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const loginAsDemo = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email: DEMO_USER.email, password: DEMO_USER.password })
      login(data); toast.success('Welcome back, ' + data.firstName + '!'); navigate('/dashboard')
    } catch(e) { toast.error('Demo account unavailable') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-8">Sign in to your LinkSnap account</p>

        {/* Demo button */}
        <div className="mb-6">
          <p className="text-xs text-slate-500 mb-2">Quick access</p>
          <button onClick={loginAsDemo} disabled={loading}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 rounded-xl transition-all text-left">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ backgroundColor: DEMO_USER.avatarColor }}>
              D
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">Demo User</p>
              <p className="text-xs text-slate-500">{DEMO_USER.email}</p>
            </div>
            <ArrowRight size={14} className="text-slate-500" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-600">or sign in manually</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          No account? <Link to="/register" className="text-emerald-400 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}