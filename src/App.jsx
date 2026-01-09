import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRouter'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import GuidePage from "./pages/GuidePage"
import GuideCreate from "./pages/GuideCreate"
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/guides/:id' element={<GuidePage />} />
          <Route path='/guides/create' element={<ProtectedRoute><GuideCreate /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App