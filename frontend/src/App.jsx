import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardUser from "./pages/DashboardUser";
import DashboardAdmin from "./pages/DashboardAdmin";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import AjouterDepense from "./pages/AjouterDepense";
import AssistantIA from "./pages/AssistantIA";
import Historique from "./pages/Historique";
import Budgets from "./pages/Budgets";
import Page404 from "./pages/Page404";
import Utilisateurs from "./pages/Utilisateurs";
import Categories from "./pages/Categories";

// Route protégée
function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/user"} />;
  }
  return children;
}

export default function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard User */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <PrivateRoute allowedRole="user">
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/ajouter"
              element={
                <PrivateRoute allowedRole="user">
                  <AjouterDepense />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/budgets"
              element={
                <PrivateRoute allowedRole="user">
                  <Budgets />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/ia"
              element={
                <PrivateRoute allowedRole="user">
                  <AssistantIA />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/historiques"
              element={
                <PrivateRoute allowedRole="user">
                  <Historique />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Dashboard Admin */}
          <Route element={<MainLayout />}>
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRole="admin">
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/utilisateur"
              element={
                <PrivateRoute allowedRole="admin">
                  <Utilisateurs />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/categorie"
              element={
                <PrivateRoute allowedRole="admin">
                  <Categories />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/historiques"
              element={
                <PrivateRoute allowedRole="admin">
                  <Historique />
                </PrivateRoute>
              }
            />
          </Route>

          {/* 404 */}
          {/* <Route path="*" element={<Page404 />} /> */}
        </Routes>
      </Router>
    </>
  );
}
