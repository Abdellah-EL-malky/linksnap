import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './store/authStore'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LinksPage from './pages/LinksPage'
import DashboardPage from './pages/DashboardPage'
import LinkAnalyticsPage from './pages/LinkAnalyticsPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login"/>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<HomePage/>}/>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="register" element={<RegisterPage/>}/>
        <Route path="dashboard" element={<PrivateRoute><DashboardPage/></PrivateRoute>}/>
        <Route path="links" element={<PrivateRoute><LinksPage/></PrivateRoute>}/>
        <Route path="shorten" element={<PrivateRoute><LinksPage/></PrivateRoute>}/>
        <Route path="analytics/:id" element={<PrivateRoute><LinkAnalyticsPage/></PrivateRoute>}/>
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }}/>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
  )
}