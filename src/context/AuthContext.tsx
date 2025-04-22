
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  email: string;
  name?: string;
  coins: number;
  isAdmin: boolean;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCoins: (newAmount: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => false,
  logout: () => {},
  updateCoins: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Admin hardcoded credentials
      if (email === "admin@yogakokxd.com" && password === "admin123") {
        const adminUser = {
          id: "admin-id",
          email: "admin@yogakokxd.com",
          name: "Admin",
          coins: 9999,
          isAdmin: true
        };
        
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        setLoading(false);
        return true;
      }
      
      // Regular user - in a real app, validate against backend
      if (email && password.length >= 6) {
        // Mock successful login
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name: email.split("@")[0],
          coins: 500, // Starting coins
          isAdmin: false
        };
        
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateCoins = (newAmount: number) => {
    if (user) {
      const updatedUser = { ...user, coins: newAmount };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        loading,
        login,
        logout,
        updateCoins,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
