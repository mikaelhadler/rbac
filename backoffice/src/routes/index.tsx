import { Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/Login'
import DashboardPage from '../pages/Dashboard'
import UsersPage from '../pages/Users'
import ResidentsPage from '../pages/Residents'
import ComplaintsPage from '../pages/Complaints'
import ProfilePage from '../pages/Me'
import { PrivateRoute } from '../components/PrivateRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/residents"
        element={
          <PrivateRoute>
            <ResidentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <PrivateRoute>
            <ComplaintsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/me"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  )
}
