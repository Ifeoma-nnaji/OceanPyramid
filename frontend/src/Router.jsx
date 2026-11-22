import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ListPropertyPage from './pages/ListPropertyPage'
import LandlordDashboard from './pages/LandlordDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminManagementPage from './pages/AdminManagementPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AgentsPage from './pages/AgentsPage'
import ServicePages from './pages/ServicePages'

import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminProtectedRoute from './components/layout/AdminProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function Router() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/mortgage" element={<ServicePages page="mortgage" />} />
          <Route path="/property-management" element={<ServicePages page="management" />} />
          <Route path="/request-property" element={<ServicePages page="request" />} />
          <Route path="/advisory" element={<ServicePages page="advisory" />} />
          <Route path="/commercial-services" element={<ServicePages page="commercial" />} />
          <Route path="/buy-from-abroad" element={<ServicePages page="abroad" />} />

          <Route path="/buy" element={<PropertiesPage type="buy" />} />
          <Route path="/rent" element={<PropertiesPage type="rent" />} />
          <Route path="/short-let" element={<PropertiesPage type="short-let" />} />
          <Route path="/land" element={<PropertiesPage type="land" />} />
          <Route path="/commercial" element={<PropertiesPage type="commercial" />} />
          <Route path="/properties/:slug" element={<PropertyDetailsPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/my-account"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['landlord', 'agent', 'developer']}>
                <LandlordDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/list-property"
            element={
              <ProtectedRoute allowedRoles={['landlord', 'agent', 'developer']}>
                <ListPropertyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/administrators"
            element={
              <AdminProtectedRoute>
                <AdminManagementPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default Router
