
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Gift,
  Award,
  Ticket,
  LayoutDashboard,
  User,
  Database,
  Settings,
  PanelRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, active }: SidebarLinkProps) => (
  <Link to={to} className="w-full">
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn("w-full justify-start gap-2", 
        active ? "bg-primary/10 hover:bg-primary/20" : ""
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "text-primary" : "")} />
      {label}
    </Button>
  </Link>
);

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Check if the current path matches the given route
  const isActive = (route: string) => {
    if (route === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(route);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar border-r transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
            AG
          </div>
          <span className="font-bold text-lg">Alt Gacha Haven</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setOpen(false)}
        >
          <PanelRight className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-1">
          {!isAdmin ? (
            <>
              <SidebarLink to="/" icon={Home} label="Dashboard" active={isActive("/")} />
              <SidebarLink to="/gacha" icon={Gift} label="Gacha" active={isActive("/gacha")} />
              <SidebarLink to="/quest" icon={Award} label="Quests" active={isActive("/quest")} />
              <SidebarLink to="/token" icon={Ticket} label="Redeem Token" active={isActive("/token")} />
            </>
          ) : (
            <>
              <SidebarLink to="/adminyangtahu" icon={LayoutDashboard} label="Admin Dashboard" active={isActive("/adminyangtahu")} />
              <SidebarLink to="/adminyangtahu/users" icon={User} label="Users" active={isActive("/adminyangtahu/users")} />
              <SidebarLink to="/adminyangtahu/accounts" icon={Database} label="Alt Accounts" active={isActive("/adminyangtahu/accounts")} />
              <SidebarLink to="/adminyangtahu/tokens" icon={Ticket} label="Token Generator" active={isActive("/adminyangtahu/tokens")} />
              <SidebarLink to="/adminyangtahu/settings" icon={Settings} label="Settings" active={isActive("/adminyangtahu/settings")} />
            </>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
