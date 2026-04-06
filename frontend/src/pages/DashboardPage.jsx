import { useState, useEffect } from 'react'
import { Link2, BarChart3, TrendingUp, Globe } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../services/api'
import { useAuth } from '../store/authStore'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899']

function StatCard({ icon: Icon, label, value, color = 'emerald' }) {
  const colors = { emerald: 'text-emerald-400 bg-emerald-400/10', blue: 'text-blue-400 bg-blue-400/10', amber: 'text-amber-400 bg-amber-400/10', purple: 'text-purple-400 bg-purple-400/10' }
  const cls = colors[color]
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className={'w-10 h-10 rounded-lg flex items-center justify-center mb-3 ' + cls}>
        <Icon size={20} className={cls.split(' ')[0]}/>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-emerald-400">{payload[0].value} clicks</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/analytics/dashboard').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({length:4}).map((_,i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-28 animate-pulse"/>)}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
      <p className="text-slate-400 text-sm mb-8">Welcome back, {user?.firstName}. Here is your last 30 days.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Link2} label="Total Links" value={data?.totalLinks || 0} color="emerald"/>
        <StatCard icon={TrendingUp} label="Total Clicks" value={data?.totalClicks || 0} color="blue"/>
        <StatCard icon={BarChart3} label="Top Link Clicks" value={data?.topLinks?.[0]?.totalClicks || 0} color="amber"/>
        <StatCard icon={Globe} label="Countries Reached" value={data?.topCountries?.length || 0} color="purple"/>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Clicks over time */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Clicks over time (30 days)</h3>
          {data?.clicksPerDay?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.clicksPerDay}>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#10b981' }}/>
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data yet — share your links to see analytics</div>}
        </div>

        {/* Browsers Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Browsers</h3>
          {data?.browsers?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.browsers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {data.browsers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={(v) => [v + ' clicks']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}/>
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}/>
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data yet</div>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Countries</h3>
          {data?.topCountries?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.topCountries} layout="vertical">
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}/>
                <YAxis type="category" dataKey="country" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={80}/>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}/>
                <Bar dataKey="clicks" fill="#10b981" radius={[0,4,4,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data yet</div>}
        </div>

        {/* Top Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Links</h3>
          {data?.topLinks?.length > 0 ? (
            <div className="space-y-3">
              {data.topLinks.map((link, i) => (
                <div key={link.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs flex items-center justify-center font-bold shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{link.title || link.shortCode}</p>
                    <p className="text-xs text-slate-500">/{link.shortCode}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">{link.totalClicks}</span>
                </div>
              ))}
            </div>
          ) : <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data yet</div>}
        </div>
      </div>
    </div>
  )
}
