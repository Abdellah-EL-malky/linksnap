import { Link, useNavigate } from 'react-router-dom'
import { Link2, BarChart3, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Link2 size={20} className="text-emerald-400" />
          <span className="text-white">Link<span className="text-emerald-400">Snap</span></span>
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><BarChart3 size={15}/> Dashboard</Link>
            <Link to="/links" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"><Link2 size={15}/> My Links</Link>
            <Link to="/shorten" className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-1.5 rounded-lg font-medium transition-colors"><Plus size={14}/> New Link</Link>
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><LogOut size={17}/></button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">Login</Link>
            <Link to="/register" className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
