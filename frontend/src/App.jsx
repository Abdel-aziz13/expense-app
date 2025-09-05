import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import AjouterDepense from "./pages/AjouterDepense";
import AssistantIA from "./pages/AssistantIA";
import Historique from "./pages/Historique";
import Budgets from "./pages/Budgets";
import Utilisateurs from "./pages/Utilisateurs";
import Categories from "./pages/Categories";
import BudgetForm from "./components/BudgetForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./pages/Settings";
import Profil from "./pages/Profil";
import Informations from "./pages/profile/Informations";
import Notifications from "./pages/profile/Notifications";
import Securite from "./pages/profile/Securite";
import Preferences from "./pages/profile/Preferences";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import NotFound from "./pages/NotFound";
import VerifyCodePage from "./pages/auth/VerifyCodePage";
import Auth from "./pages/auth/Auth";
import NavbarAdmin from "./components/NavbarAdmin";

// Route protégée
// function PrivateRoute({ children, allowedRole }) {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token) return <Navigate to="/login" />;
//   if (allowedRole && role !== allowedRole) {
//     return <Navigate to={role === "admin" ? "/admin" : "/"} />;
//   }
//   return children;
// }

export default function App() {
  const location = useLocation();
  // const [isInitialized, setIsInitialized] = useState(false);
  // const [userData, setUserData] = useState({
  //   token: null,
  //   role: null,
  //   name: null,
  // });

  // useEffect(() => {
  // Fonction pour charger vraiment les données du localStorage
  // const initializeApp = () => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");
  //   const name = localStorage.getItem("name");

  //   setUserData({ token, role, name });
  //   setIsInitialized(true);
  // };

  // Petite pause pour le SplashScreen (optionnel)
  //   const timer = setTimeout(() => {
  //     initializeApp();
  //   }, 2000); // 1.5 sec pour voir le SplashScreen

  //   return () => clearTimeout(timer);
  // }, []);

  // if (!isInitialized) {
  //   return (
  // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
  //   <div className="text-center">
  //     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //     <p className="text-muted-foreground">
  //       Initialisation de l&apos;application...
  //     </p>
  //     <p className="text-sm text-muted-foreground mt-2">
  //       Chargement des données utilisateur
  //     </p>
  //   </div>
  // </div>
  //   );
  // }

  // Redirection automatique selon le token
  // const redirectPath = userData.token
  //   ? userData.role === "admin"
  //     ? "/admin"
  //     : "/"
  //   : "/login";

  // return (
  //   <>
  //     <ToastContainer position="top-right" autoClose={3000} />
  //     <Router>
  //       <Routes>
  //         <Route
  //           path="/login"
  //           element={
  //             userData.token ? <Navigate to={redirectPath} /> : <Login />
  //           }
  //         />
  //         <Route
  //           path="/register"
  //           element={
  //             userData.token ? <Navigate to={redirectPath} /> : <Register />
  //           }
  //         />
  //         <Route path="/forgot-password" element={<ForgotPassword />} />
  //         <Route path="/reset-password" element={<ResetPassword />} />

  //         <Route element={<MainLayout />}>
  //           <Route
  //             path="/"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <Home />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/user/profile"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <Profil />
  //               </PrivateRoute>
  //             }
  //           >
  //             <Route index element={<Informations />} />
  //             <Route path="securite" element={<Securite />} />
  //             <Route path="notifications" element={<Notifications />} />
  //             <Route path="preference" element={<Preferences />} />
  //           </Route>
  //           <Route
  //             path="/user/settings"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <Settings />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/user/ajouter"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <AjouterDepense />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/user/budgets"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <Budgets />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/user/budgets/ajouter"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <BudgetForm />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/user/ia"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <AssistantIA />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/user/historiques"
  //             element={
  //               <PrivateRoute allowedRole="user">
  //                 <Historique />
  //               </PrivateRoute>
  //             }
  //           />
  //         </Route>

  //         {/* Dashboard Admin */}
  //         <Route element={<MainLayout />}>
  //           <Route
  //             path="/admin"
  //             element={
  //               <PrivateRoute allowedRole="admin">
  //                 <DashboardAdmin />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/admin/utilisateur"
  //             element={
  //               <PrivateRoute allowedRole="admin">
  //                 <Utilisateurs />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/admin/categorie"
  //             element={
  //               <PrivateRoute allowedRole="admin">
  //                 <Categories />
  //               </PrivateRoute>
  //             }
  //           />
  //           <Route
  //             path="/admin/historiques"
  //             element={
  //               <PrivateRoute allowedRole="admin">
  //                 <Historique />
  //               </PrivateRoute>
  //             }
  //           />
  //         </Route>

  //         {/* 404 */}
  //         <Route path="*" element={<Page404 />} />
  //       </Routes>
  //     </Router>
  //   </>
  // );

  return (
    <Routes>
      {/* Pages publiques */}
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="verify-code" element={<VerifyCodePage />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Pages utilisateur connecté */}
      <Route
        path="/user/*"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="ajouter" element={<AjouterDepense />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="budgets/ajouter" element={<BudgetForm />} />
        <Route path="ia" element={<AssistantIA />} />
        <Route path="historiques" element={<Historique />} />
      </Route>

      {/* Pages Admin */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute requiredRole="admin">
            <NavbarAdmin />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="ajouter" element={<Utilisateurs />} />
        <Route path="categories" element={<Budgets />} />
      </Route>

      {/* Page 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
