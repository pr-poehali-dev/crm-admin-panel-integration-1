
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthGuard from "./components/auth/AuthGuard";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import Index from "./pages/Index";
import UsersPage from "./pages/users";
import OrdersPage from "./pages/orders";

// User Management
import CreateUser from "./pages/users/CreateUser";
import EditUser from "./pages/users/EditUser";

// Order Management
import CreateOrder from "./pages/orders/CreateOrder";
import EditOrder from "./pages/orders/EditOrder";

// Other Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          
          {/* User Management */}
          <Route path="/users" element={<AuthGuard><UsersPage /></AuthGuard>} />
          <Route path="/users/create" element={<AuthGuard><CreateUser /></AuthGuard>} />
          <Route path="/users/edit/:id" element={<AuthGuard><EditUser /></AuthGuard>} />
          
          {/* Order Management */}
          <Route path="/orders" element={<AuthGuard><OrdersPage /></AuthGuard>} />
          <Route path="/orders/create" element={<AuthGuard><CreateOrder /></AuthGuard>} />
          <Route path="/orders/edit/:id" element={<AuthGuard><EditOrder /></AuthGuard>} />
          
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
