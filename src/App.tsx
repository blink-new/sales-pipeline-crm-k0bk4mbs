import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import Dashboard from './pages/Dashboard'
import Pipeline from './pages/Pipeline'
import Contacts from './pages/Contacts'
import Analytics from './pages/Analytics'
import Activities from './pages/Activities'
import Settings from './pages/Settings'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Context
import { AuthProvider } from './context/AuthContext'
import { CrmProvider } from './context/CrmContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Router>
      <AuthProvider>
        <CrmProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="activities" element={<Activities />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CrmProvider>
      </AuthProvider>
    </Router>
  )
}

export default App