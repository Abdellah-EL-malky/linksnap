import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../store/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data); toast.success('Account created!'); navigate('/dashboard')
    } catch(e) { toast.error(e.response?.data?.error || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-slate-400 text-sm mb-8">Start shortening links for free</p>
        <form onSubmit={handle} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[['firstName','First Name'],['lastName','Last Name']].map(([k,l]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{l}</label>
                <input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <Link to="/login" className="text-emerald-400 hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}
