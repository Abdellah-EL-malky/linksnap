import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../services/api'

export default function LinkAnalyticsPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/analytics/links/' + id),
      api.get('/links/' + id)
    ]).then(([analytics, linkData]) => {
      setData(analytics.data)
      setLink(linkData.data)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/links" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16}/> Back to Links
      </Link>
      <h1 className="text-xl font-bold text-white mb-1">{link?.title || link?.shortCode}</h1>
      <p className="text-slate-500 text-sm font-mono mb-6">{link?.shortUrl}</p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-emerald-400"/>
          <span className="text-2xl font-bold text-white">{data?.totalClicks || 0}</span>
        </div>
        <p className="text-sm text-slate-500">Total clicks</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Clicks over time (30 days)</h3>
        {data?.clicksPerDay?.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.clicksPerDay}>
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}/>
              <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        ) : <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No clicks yet — share your link!</div>}
      </div>
    </div>
  )
}
