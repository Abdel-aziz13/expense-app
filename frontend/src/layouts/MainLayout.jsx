// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import NavbarAdmin from "@/components/NavbarAdmin";
// import NavbarUser from "@/components/NavbarUser";
// import Footer from "@/components/Footer";

// const MainLayout = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedRole = localStorage.getItem("role");

//     if (!token) {
//       navigate("/login");
//     } else {
//       setRole(storedRole);
//     }
//   }, [navigate]);

//   return (
//     // flex flex-col h-screen
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Navbar dynamique selon le rôle */}
//       <div className="fixed top-0 w-full z-50">
//         {role === "admin" ? <NavbarAdmin /> : <NavbarUser />}
//       </div>

//       <main className="flex-1">
//         <div className="container mx-auto px-4 py-8 pt-[74px] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//           <Outlet />
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default MainLayout;

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavbarUser from "@/components/NavbarUser";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";

const MainLayout = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role || "user");
    } catch {
      localStorage.removeItem("token");
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar dynamique selon le rôle */}
      <div className="fixed top-0 w-full z-50">
        {role === "admin" ? (
          <NavbarAdmin currentUser={currentUser} onLogout={onLogout} />
        ) : (
          <NavbarUser currentUser={currentUser} onLogout={onLogout} />
        )}
      </div>

      {/* Contenu principal avec scroll et padding top pour la navbar */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 pt-[74px] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
