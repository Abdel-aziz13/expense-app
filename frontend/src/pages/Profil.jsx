import SidebarProfile from "../components/SidebarProfile";
import { Outlet } from "react-router-dom";

function Profil() {
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto space-y-8" id="profile-page">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Mon profil</h2>
        <p className="text-gray-500">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <SidebarProfile />

        {/* Contenu dynamique */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Profil;
