import { Facebook, Github, Heart, Mail, Twitter, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import { Button } from "../components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-600 dark:bg-gray-700 dark:text-green-400">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-200">
                FinTrack237
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Suivi des dépenses & Revenus
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Link to={"/"} className="flex items-center justify-center">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Link to={"https://www.facebook.com/FinTrack237"} target="_blank">
                <Facebook className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Link to={"https://twitter.com/FinTrack237"} target="_blank">
                <Twitter className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Link to={"mailto:contact@fintrack237.com"} target="_blank">
                <Mail className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center md:text-right">
              © {currentYear} FinTrack237
            </p>
            <p className="flex items-center justify-center md:justify-end gap-1 text-xs text-gray-600 dark:text-gray-400">
              Fait avec <Heart className="h-3 w-3 text-red-500" /> par{" "}
              <a
                href="#"
                target="_blank"
                className="font-medium underline underline-offset-2"
              >
                A.Aziz
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
