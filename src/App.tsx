import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import GuestRoute from './components/auth/GuestRoute'
import AdminRoute from './admin/AdminRoute'
import AdminLayout from './admin/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Leaderboard from './pages/Leaderboard'
import Predict from './pages/Predict'
import Fixtures from './pages/Fixtures'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import Rules from './pages/Rules'
import Announcements from './pages/Announcements'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminMatches from './admin/pages/AdminMatches'
import AdminParticipants from './admin/pages/AdminParticipants'
import AdminPredictions from './admin/pages/AdminPredictions'
import AdminAnnouncements from './admin/pages/AdminAnnouncements'
import AdminAnalytics from './admin/pages/AdminAnalytics'
import AdminActivityLog from './admin/pages/AdminActivityLog'
import AdminSettings from './admin/pages/AdminSettings'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="matches" element={<AdminMatches />} />
                <Route path="participants" element={<AdminParticipants />} />
                <Route path="predictions" element={<AdminPredictions />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="activity" element={<AdminActivityLog />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="fixtures" element={<Fixtures />} />
              <Route path="predict" element={<Predict />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="results" element={<Results />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="rules" element={<Rules />} />
              <Route path="announcements" element={<Announcements />} />
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}
