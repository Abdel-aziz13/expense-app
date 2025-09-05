// context/LanguageContext.jsx
import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const savedLang = localStorage.getItem("lang") || "fr";
  const [lang, setLang] = useState(savedLang);

  const changeLanguage = (newLang) => {
    localStorage.setItem("lang", newLang);
    setLang(newLang); // déclenche re-render partout
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
