
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import GachaPage from "./pages/GachaPage";
import QuestPage from "./pages/QuestPage";
import TokenPage from "./pages/TokenPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TokenGenerator from "./pages/admin/TokenGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* User Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/gacha" element={<GachaPage />} />
          <Route path="/quest" element={<QuestPage />} />
          <Route path="/token" element={<TokenPage />} />
          <Route path="/token/:tokenId" element={<TokenPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tokens" element={<TokenGenerator />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
