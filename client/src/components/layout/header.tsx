import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sprout, Menu, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";
import VoiceAssistant from "@/components/voice/voice-assistant";

export default function Header() {
  const [location] = useLocation();
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation(language);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/chat", label: t("chat") },
    { path: "/disease-detection", label: t("disease_detection") },
    { path: "/plant-care", label: t("plant_care") },
  ];

  const moreItems = [
    { path: "/crop-calendar", label: "Crop Calendar" },
    { path: "/weather-info", label: "Weather Info" },
    { path: "/market-prices", label: "Market Prices" },
    { path: "/learning-hub", label: "Learning Hub" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Sprout className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t("ai_farmtool")}</h1>
              <p className="text-xs text-gray-500">{t("welcome_subtitle")}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`font-medium ${
                    isActive(item.path)
                      ? "text-green-600"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium text-gray-600 hover:text-green-600">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {moreItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link href={item.path}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Language Selector and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          isActive(item.path)
                            ? "text-green-600 bg-green-50"
                            : "text-gray-600"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-gray-500 mb-2 px-2">More Features</p>
                    {moreItems.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
