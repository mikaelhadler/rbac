import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
        {/* <Route
           path="/"
           element={
             <PrivateRoute>
               <MainLayout>
                 <Dashboard />
               </MainLayout>
             </PrivateRoute>
           }
         />*/}
      </Routes>
    </Router>
  );
}
