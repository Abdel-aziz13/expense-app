import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [aiAssistant, setAiAssistant] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [currency, setCurrency] = useState("FCFA");
  const [email, setEmail] = useState("user@example.com");
  const [twoFA, setTwoFA] = useState(false);

  const handleSave = () => {
    // Ici tu pourrais envoyer les données au backend
    console.log({
      darkMode,
      notifications,
      aiAssistant,
      language,
      currency,
      email,
    });
    alert("Paramètres sauvegardés !");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">
        Paramètres
      </h1>

      {/* Compte & Sécurité */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compte & Sécurité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Activer l'authentification à deux facteurs
            </span>
            <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          </div>
        </CardContent>
      </Card>

      {/* Langue & Devise */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Langue & Devise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FCFA">FCFA</SelectItem>
                <SelectItem value="EUR">Euro</SelectItem>
                <SelectItem value="USD">Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Apparence */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Mode sombre
          </span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Recevoir les notifications
          </span>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </CardContent>
      </Card>

      {/* Assistant IA */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assistant IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Suggestions budgétaires intelligentes (en développement)
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Activer Assistant IA
            </span>
            <Switch checked={aiAssistant} onCheckedChange={setAiAssistant} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default Settings;
