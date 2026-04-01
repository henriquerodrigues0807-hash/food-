import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { StoreProvider } from "./context/StoreContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SimulationPage from "./pages/SimulationPage";
import LogicTests from "./pages/LogicTests";
import BusinessLogicSimulation from "./modules/simulation/SimulationPage";
import EngineTests from "./pages/EngineTests";

// Driver Module Imports
import { DriverProvider } from "./modules/driver/context";
import DriverLayout from "./modules/driver/components/DriverLayout";
import DriverDashboard from "./modules/driver/pages/Dashboard";
import DriverAvailable from "./modules/driver/pages/AvailableDeliveries";
import DriverActive from "./modules/driver/pages/ActiveDelivery";
import DriverHistory from "./modules/driver/pages/History";
import DriverWallet from "./modules/driver/pages/Wallet";
import DriverProfile from "./modules/driver/pages/Profile";
import DriverOnboarding from "./modules/driver/pages/Onboarding";
import DriverPrivateRoute from "./modules/driver/components/DriverPrivateRoute";

// Customer Module Imports
import CustomerHome from "./modules/customer/pages/CustomerHome";
import StoreMenuPage from "./modules/customer/pages/StoreMenuPage";
import CheckoutPage from "./modules/customer/pages/CheckoutPage";
import OrderTrackingPage from "./modules/customer/pages/OrderTrackingPage";

// Seller Module Imports
import SellerDashboard from "./modules/seller/pages/SellerDashboard";
import OrdersPage from "./modules/seller/pages/OrdersPage";
import MenuManagementPage from "./modules/seller/pages/MenuManagementPage";
import FinancialPage from "./modules/seller/pages/FinancialPage";
import StoreSettingsPage from "./modules/seller/pages/StoreSettingsPage";

// Admin Module Imports
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import StoresManagement from "./modules/admin/pages/StoresManagement";
import UsersManagement from "./modules/admin/pages/UsersManagement";
import DriversManagement from "./modules/admin/pages/DriversManagement";
import PlatformFinancial from "./modules/admin/pages/PlatformFinancial";

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <DriverProvider>
            <Toaster position="top-center" richColors />
            <BrowserRouter>
              <Routes>
                {/* Simulation Route */}
                <Route path="/simulacao" element={<SimulationPage />} />
                <Route path="/simulacao-negocio" element={<BusinessLogicSimulation />} />
                <Route path="/testes" element={<LogicTests />} />
                <Route path="/testes-motores" element={<EngineTests />} />

                {/* Multi-Store Home */}
                <Route path="/" element={<CustomerHome />} />
                <Route path="/perfil" element={<Profile />} />

                {/* Store Routes */}
                <Route path="/store/:slug" element={<StoreMenuPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />

                {/* Seller Module Routes */}
                <Route path="/seller">
                  <Route path="dashboard" element={<SellerDashboard />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="menu" element={<MenuManagementPage />} />
                  <Route path="financial" element={<FinancialPage />} />
                  <Route path="settings" element={<StoreSettingsPage />} />
                </Route>

                {/* Admin Module Routes */}
                <Route path="/admin">
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="stores" element={<StoresManagement />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="drivers" element={<DriversManagement />} />
                  <Route path="financial" element={<PlatformFinancial />} />
                </Route>

                {/* Role-Based Protected Routes */}
                <Route
                  path="/:slug/cliente"
                  element={
                    <PrivateRoute role="cliente">
                      <Menu />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/:slug/vendedor"
                  element={
                    <PrivateRoute role="vendedor">
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

                {/* New Driver Module Routes */}
                <Route path="/delivery/:slug/onboarding" element={<DriverOnboarding />} />
                
                <Route
                  path="/delivery/:slug"
                  element={
                    <DriverPrivateRoute>
                      <DriverLayout />
                    </DriverPrivateRoute>
                  }
                >
                  <Route index element={<DriverDashboard />} />
                  <Route path="available" element={<DriverAvailable />} />
                  <Route path="active" element={<DriverActive />} />
                  <Route path="history" element={<DriverHistory />} />
                  <Route path="wallet" element={<DriverWallet />} />
                  <Route path="profile" element={<DriverProfile />} />
                </Route>

                {/* Legacy Driver Routes Redirect */}
                <Route path="/:slug/entregador" element={<Navigate to="/delivery/:slug" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </DriverProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
