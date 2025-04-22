
import { Button } from "@/components/ui/button";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, User } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/gacha") return "Gacha";
    if (path === "/quest") return "Quests";
    if (path === "/token") return "Redeem Token";
    if (path.startsWith("/token/")) return "Redeem Token";
    if (path === "/adminyangtahu") return "Admin Dashboard";
    if (path.startsWith("/adminyangtahu/")) {
      const section = path.split("/")[2];
      return `Admin - ${section.charAt(0).toUpperCase() + section.slice(1)}`;
    }
    return "Alt Gacha Haven";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          {isAuthenticated && user ? (
            <>
              <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                {user.coins} coins
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/adminyangtahu">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
