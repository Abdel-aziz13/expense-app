import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function SidebarProfile() {
  const token = localStorage.getItem("token");

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.user;
    },
    onError: (err) => console.error("Erreur profil :", err),
  });

  const links = [
    { to: "/user/profile", label: "Informations personnelles" },
    { to: "/user/profile/securite", label: "Sécurité" },
    { to: "/user/profile/notifications", label: "Notifications" },
    { to: "/user/profile/preference", label: "Préférences" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center">Chargement...</p>
      </div>
    );
  }

  // Extraire les initiales du nom
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="md:w-1/4 bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="bg-blue-600 text-white text-xl font-bold w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
          {profile?.photo ? (
            <img
              src={`http://localhost:8000/storage/${profile.photo}`}
              alt="Avatar"
              className="w-16 h-16 rounded-full border object-cover"
            />
          ) : (
            getInitials(profile?.name)
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-700">
            {profile?.name || "Utilisateur"}
          </h3>
          <p className="text-gray-500 text-sm">
            {profile?.email || "email@example.com"}
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default SidebarProfile;
