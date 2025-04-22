
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import GachaPage from "./pages/GachaPage";
import QuestPage from "./pages/QuestPage";
import TokenPage from "./pages/TokenPage";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TokenGenerator from "./pages/admin/TokenGenerator";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected User Routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/gacha" element={<ProtectedRoute><GachaPage /></ProtectedRoute>} />
      <Route path="/quest" element={<ProtectedRoute><QuestPage /></ProtectedRoute>} />
      <Route path="/token" element={<ProtectedRoute><TokenPage /></ProtectedRoute>} />
      <Route path="/token/:tokenId" element={<ProtectedRoute><TokenPage /></ProtectedRoute>} />
      
      {/* Admin Routes - hidden path */}
      <Route path="/adminyangtahu" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/adminyangtahu/tokens" element={<AdminRoute><TokenGenerator /></AdminRoute>} />
      
      {/* Redirect routes */}
      <Route path="/admin" element={<Navigate to="/adminyangtahu" replace />} />
      <Route path="/admin/*" element={<Navigate to="/adminyangtahu" replace />} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
