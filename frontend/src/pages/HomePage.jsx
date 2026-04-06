import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Link2, BarChart3, Zap, Globe, Copy, Check } from 'lucide-react'
import { useAuth } from '../store/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShorten = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/register'); return }
    if (!url.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/links', { originalUrl: url })
      setResult(data)
      setUrl('')
    } catch(e) { toast.error(e.response?.data?.error || 'Failed to shorten') }
    finally { setLoading(false) }
  }

  const copy = () => {
    navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  return (
    <div>
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mb-6">
            <Zap size={12}/> URL Shortener + Analytics
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Shorten links.<br/><span className="text-emerald-400">Track everything.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Create short links and get detailed analytics — clicks, countries, browsers and devices in one dashboard.
          </p>

          <form onSubmit={handleShorten} className="flex gap-2 max-w-xl mx-auto">
            <input type="url" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://your-long-url.com/paste-here"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" />
            <button type="submit" disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors whitespace-nowrap">
              {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </form>

          {result && (
            <div className="mt-4 flex items-center gap-3 bg-slate-900 border border-emerald-500/30 rounded-xl px-4 py-3 max-w-xl mx-auto">
              <Link2 size={16} className="text-emerald-400 shrink-0"/>
              <span className="flex-1 text-emerald-400 font-mono text-sm truncate">{result.shortUrl}</span>
              <button onClick={copy} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
              </button>
            </div>
          )}

          {!user && <p className="mt-4 text-sm text-slate-500">No account needed to try — <Link to="/register" className="text-emerald-400 hover:underline">sign up free</Link> to save your links</p>}
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Instant Shortening', desc: 'Generate short links in milliseconds with custom codes.' },
            { icon: BarChart3, title: 'Detailed Analytics', desc: 'Track clicks, countries, browsers and device types.' },
            { icon: Globe, title: 'Geo Tracking', desc: 'See where in the world your audience comes from.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-emerald-400"/>
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
