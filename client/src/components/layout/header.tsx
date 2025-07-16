import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sprout, Menu } from "lucide-react";
// import { useLanguage } from "@/lib/language";

export default function Header() {
  const [location] = useLocation();
  const language = "en";
  const setLanguage = (lang: string) => {};
  const languages = [
    { code: "en", name: "EN", nativeName: "English" },
    { code: "ta", name: "TA", nativeName: "தமிழ்" },
    { code: "kn", name: "KN", nativeName: "ಕನ್ನಡ" },
    { code: "hi", name: "HI", nativeName: "हिंदी" },
    { code: "ml", name: "ML", nativeName: "മലയാളം" },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/chat", label: "Chat Assistant" },
    { path: "/disease-detection", label: "Disease Detection" },
    { path: "/plant-care", label: "Plant Care" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-farm-green p-2 rounded-lg">
              <Sprout className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI FARMTOOL</h1>
              <p className="text-xs text-gray-500">Smart Agricultural Assistant</p>
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
                      ? "text-farm-green"
                      : "text-gray-600 hover:text-farm-green"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
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
                            ? "text-farm-green bg-green-50"
                            : "text-gray-600"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
