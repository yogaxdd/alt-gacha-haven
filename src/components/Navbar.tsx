
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCoins, setUserCoins] = useState(0);

  // Mock login function for demonstration
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserCoins(500); // Start with 500 coins
  };

  // Mock logout function for demonstration
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/gacha") return "Gacha";
    if (path === "/quest") return "Quests";
    if (path === "/token") return "Redeem Token";
    if (path === "/admin") return "Admin Dashboard";
    if (path.startsWith("/admin/")) {
      const section = path.split("/")[2];
      return `Admin - ${section.charAt(0).toUpperCase() + section.slice(1)}`;
    }
    return "Alt Gacha Haven";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/75 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
              AG
            </div>
            <span className="font-bold text-lg hidden md:block">Alt Gacha Haven</span>
          </Link>
        </div>
        
        <div className="hidden md:block flex-1 mx-6">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                {userCoins} coins
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleLogin}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
