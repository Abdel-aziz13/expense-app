import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/user" /> : children || <Outlet />;
}
