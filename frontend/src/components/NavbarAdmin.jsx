import { useEffect, useRef, useState } from "react";
import {
  Home,
  PlusCircle,
  BarChart3,
  Wallet,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Users,
  LayoutDashboard,
  FolderKanban,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function NavbarAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Récupération utilisateur
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    await axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );
      });
  };

  // Log quand user change
  //   useEffect(() => {
  //     if (user) {
  //       console.log("User mis à jour :", user);
  //     }
  //   }, [user]);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains("dark");
    html.classList.toggle("dark");
    localStorage.setItem("theme", isCurrentlyDark ? "light" : "dark");
    setIsDark(!isCurrentlyDark);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("fr-CM", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA";

  const navItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin" },
    { icon: Users, label: "Utilisateurs", href: "/admin/utilisateur" },
    { icon: FolderKanban, label: "Catégories", href: "/admin/categorie" },
    { icon: Clock, label: "Historiques", href: "/admin/historiques" },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {/* ExpenseCM */}
                <span className="hidden md:inline">FinTrack237</span>
                <span className="md:hidden">FT237</span>
              </h1>
              <p className="text-green-100 text-xs">
                Suivi des dépenses & Revenus
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full hover:bg-green-500 transition-colors focus:outline-none"
                title="Voir les notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-2 bg-gray-100 border-b">
                    <p className="font-semibold text-gray-700">Notifications</p>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {[
                      {
                        title: "Alerte de dépassement de budget",
                        message: "Catégorie Transport : +15% ce mois",
                      },
                      {
                        title: "Objectif d'épargne atteint !",
                        message:
                          "Félicitations ! Vous avez atteint 50.000 FCFA",
                      },
                      {
                        title: "Nouvelle fonctionnalité disponible",
                        message: "Découvrez l'analyse prédictive de dépenses",
                      },
                    ].map((notif, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 hover:bg-gray-50 border-b cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500">{notif.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-50 cursor-pointer font-medium">
                    Voir toutes les notifications
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700"
              title="Changer de thème"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="bg-green-500 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  {/* <p className="font-medium">{user.name}</p> */}
                  {/* <p className="text-green-100 text-sm">{user.email}</p> */}
                  {/* <p className="text-green-100 text-sm">Yaoundé, Cameroun</p> */}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-52 z-50">
                  <ul className="py-2">
                    <li className="px-4 py-3 border-b border-gray-200">
                      <div className="font-semibold text-sm text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.email}
                      </div>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Mon profil
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-green-500 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-700 border-t border-green-600 px-4 pt-4 pb-6 space-y-4">
            {/* User Info */}
            {/* <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-full">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-green-100 text-sm">Yaoundé, Cameroun</p>
                <p className="text-yellow-300 font-bold">
                  {formatCurrency(user.balance)}
                </p>
              </div>
            </div> */}

            {/* Navigation */}
            {/* <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div> */}

            {/* Actions */}
            {/* <div className="border-t border-green-600 pt-4 space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-600 transition-colors">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                <span className="ml-auto bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link
                to="/settings"
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500 transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div> */}

            <nav className="lg:hidden bg-green-800 dark:bg-gray-900 py-2 px-6 shadow-inner">
              <div className="flex flex-col space-y-2">
                {[
                  { icon: Home, label: "Accueil", href: "/" },
                  { icon: PlusCircle, label: "Ajouter", href: "/ajouter" },
                  { icon: BarChart3, label: "Statistiques", href: "/stats" },
                  { icon: Wallet, label: "Abonnements", href: "/wallet" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:bg-white/20 px-3 py-2 rounded"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom colored bar */}
      <div className="flex h-1">
        <div className="flex-1 bg-green-700"></div>
        <div className="flex-1 bg-red-600"></div>
        <div className="flex-1 bg-yellow-500"></div>
      </div>
    </nav>
  );
}
