import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { RegisterBuildingManager } from "@/pages/RegisterBuildingManager"
import { CompleteProfile } from "@/pages/CompleteProfile"
import Login from "./pages/Login"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterBuildingManager />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
