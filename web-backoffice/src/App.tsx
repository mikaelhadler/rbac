import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "@/components/layout/main-layout"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import Users from "@/pages/Users"
import Residents from "@/pages/Residents"
import Complaints from "@/pages/Complaints"
import Me from "@/pages/Me"
import { PrivateRoute } from "@/components/PrivateRoute"
import Roles from "./pages/Roles"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/residents"
          element={
            <PrivateRoute>
              <MainLayout>
                <Residents />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <MainLayout>
                <Complaints />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <MainLayout>
                <Roles />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/me"
          element={
            <PrivateRoute>
              <MainLayout>
                <Me />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
