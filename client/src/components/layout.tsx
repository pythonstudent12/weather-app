import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* App Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={isAuthenticated ? "/weather" : "/"}>
            <h1 className="text-xl font-medium cursor-pointer">Weather App</h1>
          </Link>
          <div>
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-200 py-4">
        <div className="container mx-auto px-4 text-center text-neutral-400 text-sm">
          <p>Weather App - Demo Project</p>
        </div>
      </footer>
    </div>
  );
}
