import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-600">
        © 2024 LinkSnap · Built with Spring Boot & React
      </footer>
    </div>
  )
}
