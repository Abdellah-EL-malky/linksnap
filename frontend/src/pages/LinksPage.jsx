import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Trash2, BarChart3, Check, ExternalLink, Plus, Link2 } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function LinksPage() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [form, setForm] = useState({ originalUrl: '', title: '', customCode: '' })
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
  setLoading(true)
  api.get('/links').then(r => setLinks(r.data)).finally(() => setLoading(false))
}
  useEffect(() => {
  load()
  const interval = setInterval(load, 5000) // refresh toutes les 5 secondes
  return () => clearInterval(interval)
}, [])

  const copy = (link) => {
    navigator.clipboard.writeText(link.shortUrl)
    setCopiedId(link.id); setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied!')
  }

  const del = async (id) => {
    if (!confirm('Delete this link?')) return
    try { await api.delete('/links/' + id); setLinks(links.filter(l => l.id !== id)); toast.success('Deleted') }
    catch { toast.error('Failed to delete') }
  }

  const create = async (e) => {
    e.preventDefault(); setCreating(true)
    try {
      await api.post('/links', form)
      setForm({ originalUrl: '', title: '', customCode: '' })
      setShowForm(false); load(); toast.success('Link created!')
    } catch(e) { toast.error(e.response?.data?.error || 'Failed') }
    finally { setCreating(false) }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">My Links</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16}/> New Link
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-white">Create New Link</h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Destination URL *</label>
            <input type="url" value={form.originalUrl} onChange={e => setForm({...form, originalUrl: e.target.value})} required placeholder="https://example.com/very-long-url"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Title (optional)</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="My campaign link"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Custom code (optional)</label>
              <input value={form.customCode} onChange={e => setForm({...form, customCode: e.target.value})} placeholder="my-link"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={creating}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              {creating ? 'Creating...' : 'Create Link'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-slate-700 text-slate-400 hover:text-white px-5 py-2 rounded-lg text-sm transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({length: 4}).map((_,i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-20 animate-pulse"/>)}</div>
      ) : links.length === 0 ? (
        <div className="text-center py-16">
          <Link2 size={48} className="text-slate-700 mx-auto mb-4"/>
          <p className="text-slate-400">No links yet — create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map(link => (
            <div key={link.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{link.title || link.originalUrl}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-emerald-400 font-mono text-xs">{link.shortUrl}</span>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-500 text-xs">{link.totalClicks} clicks</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a href={link.originalUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-slate-300 transition-colors"><ExternalLink size={15}/></a>
                <button onClick={() => copy(link)} className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                  {copiedId === link.id ? <Check size={15} className="text-emerald-400"/> : <Copy size={15}/>}
                </button>
                <Link to={'/analytics/' + link.id} className="p-2 text-slate-500 hover:text-emerald-400 transition-colors"><BarChart3 size={15}/></Link>
                <button onClick={() => del(link.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={15}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
