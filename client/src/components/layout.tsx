import { ReactNode, useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { LogOut, Menu, X, Cloud, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close mobile menu when navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* App Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={isAuthenticated ? "/weather" : "/"}>
            <div className="flex items-center cursor-pointer">
              <Cloud className="w-6 h-6 mr-2" />
              <h1 className="text-xl font-medium">Weather App</h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:block">
            {isAuthenticated && (
              <Button
                variant="ghost"
                className="text-white px-4 py-1 rounded flex items-center text-sm hover:bg-white hover:bg-opacity-10 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="block sm:hidden">
            <Button
              variant="ghost"
              className="text-white p-1 rounded hover:bg-white hover:bg-opacity-10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="block sm:hidden bg-primary border-t border-white border-opacity-10 fade-in">
            <div className="container mx-auto py-3">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  className="w-full text-white py-3 flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link href="/">
                  <Button 
                    variant="ghost"
                    className="w-full text-white py-3 flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-200 py-4">
        <div className="container mx-auto px-4 text-center text-neutral-400 text-sm">
          <p>Weather App - Demo Project</p>
          <p className="mt-1">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
