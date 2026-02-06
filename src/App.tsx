import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from './admin/pages/LoginPage';
import SignUpPage from './admin/pages/SignUpPage';
import DashboardPage from './admin/pages/DashboardPage';
import CategoriesPage from './admin/pages/CategoriesPage';
import ProductsPage from './admin/pages/ProductsPage';
import SettingsPage from './admin/pages/SettingsPage';
import { AdminLayout, ProtectedRoute, AuthProvider } from './admin/AdminLayout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Rota do Cardápio */}
          <Route path="/" element={<Index />} />
          
          {/* Rotas do Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/signup" element={<SignUpPage />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout><DashboardPage /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <AdminLayout><CategoriesPage /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <AdminLayout><ProductsPage /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminLayout><SettingsPage /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Redirecionamento amigável para o admin se digitar sem barra */}
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
