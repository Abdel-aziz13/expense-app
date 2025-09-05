import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
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
  History,
  Target,
  Brain,
  CreditCard,
} from "lucide-react";
import { echo } from "@/echo";
import Traduction from "@/lib/Traduction";
import { useLanguage } from "@/context/LanguageContext";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";

export default function NavbarUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [budgetNotifications, setBudgetNotifications] = useState([]);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const location = useLocation();
  const { lang, changeLanguage } = useLanguage();

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.get("/auth/profile");
      return res.data;
    },
    retry: false,
  });

  // Dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // Click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      )
        setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set language from user
  useEffect(() => {
    if (user?.language) {
      changeLanguage(user.language);
      localStorage.setItem("lang", user.language);
    }
  }, [user, changeLanguage]);

  const handleLogout = async () => {
    try {
      // Appel au backend pour invalider le token
      await apiClient.post("/auth/logout");

      // Supprimer le token côté client
      localStorage.removeItem("token");

      // Message de succès
      toast.success("Utilisateur déconnecté avec succès !");

      // Redirection vers la page de login
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);

      // Message d'erreur si problème
      toast.error("Impossible de se déconnecter, veuillez réessayer !");
    }
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const darkMode = html.classList.contains("dark");
    html.classList.toggle("dark");
    localStorage.setItem("theme", darkMode ? "light" : "dark");
    setIsDark(!darkMode);
  };

  const navItems = [
    {
      icon: BarChart3,
      name: Traduction[lang].dashboard,
      href: "/user/dashboard",
    },
    { icon: CreditCard, name: Traduction[lang].add, href: "/user/ajouter" },
    { icon: Target, name: Traduction[lang].budgets, href: "/user/budgets" },
    { icon: Brain, name: Traduction[lang].assistant, href: "/user/ia" },
    {
      icon: History,
      name: Traduction[lang].history,
      href: "/user/historiques",
    },
  ];

  // Fetch notifications + Echo
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get(`/user/notifications`);
        setBudgetNotifications(
          res.data.map((n) => ({
            id: n.id,
            message: n.message,
            date: new Date(n.created_at),
            is_read: n.is_read,
          }))
        );
      } catch (err) {
        console.error("Erreur fetch notifications:", err);
      }
    };

    fetchNotifications();

    const channel = echo.private(`budget.notifications.${user.id}`);
    channel.listen(".BudgetNotification", (e) => {
      setBudgetNotifications((prev) => [
        {
          id: e.id,
          message: e.message,
          date: new Date(e.timestamp),
          is_read: false,
        },
        ...prev,
      ]);
    });

    return () => {
      channel.stopListening(".BudgetNotification");
    };
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await apiClient.post(`/user/notifications/${id}/read`);
      setBudgetNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Erreur marquer comme lu :", err);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-2 rounded-lg shadow-md">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  <span className="hidden md:inline">FinTrack237</span>
                  <span className="md:hidden">FT237</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Suivi des dépenses & Revenus
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`${
                    isActive
                      ? "bg-green-100 text-green-700 border-b-2 border-green-500 dark:bg-green-900 dark:text-green-300"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-gray-800"
                  } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors"
                title="Voir les notifications"
              >
                <Bell className="h-5 w-5" />
                {budgetNotifications.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {budgetNotifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden text-black dark:text-white">
                  <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-700 dark:text-gray-200">
                      Notifications
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {budgetNotifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                        Aucune notification
                      </div>
                    ) : (
                      budgetNotifications.map((notif) => (
                        <div
                          key={`${notif.id}-${notif.date.getTime()}`}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                            !notif.is_read
                              ? "bg-green-50 dark:bg-green-900"
                              : ""
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <p className="text-sm font-medium">{notif.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-300">
                            {notif.date.toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer font-medium">
                    Voir toutes les notifications
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img
                  src={`http://localhost:8000/storage/${
                    user?.photo || "avatars/default.jpg"
                  }`}
                  alt={user?.name || "Utilisateur"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg w-52 z-50">
                  <ul className="py-2">
                    <li className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-medium text-sm truncate">
                        {user?.name || "Utilisateur"}
                      </div>
                      <div className="text-xs truncate text-gray-500 dark:text-gray-300">
                        {user?.email || ""}
                      </div>
                    </li>
                    <li>
                      <Link
                        to="/user/profile"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <User className="h-4 w-4 mr-2" />{" "}
                        {Traduction[lang].profile}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user/settings"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Settings className="h-4 w-4 mr-2" />{" "}
                        {Traduction[lang].settings}
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-600/30"
                      >
                        <LogOut className="h-4 w-4 mr-2" />{" "}
                        {Traduction[lang].logout}
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
              className="p-2 hover:bg-green-500 dark:hover:bg-green-600 rounded-lg transition-colors"
              aria-label="Toggle menu"
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
          <div className="md:hidden bg-green-700 dark:bg-gray-900 border-t border-green-600 dark:border-gray-700 px-4 pt-4 pb-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-600 dark:hover:bg-green-500 text-green-100 dark:text-gray-200"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Colored Bar */}
      <div className="flex h-1">
        <div className="flex-1 bg-green-700 dark:bg-green-800"></div>
        <div className="flex-1 bg-red-600 dark:bg-red-700"></div>
        <div className="flex-1 bg-yellow-500 dark:bg-yellow-600"></div>
      </div>
    </nav>
  );
}
