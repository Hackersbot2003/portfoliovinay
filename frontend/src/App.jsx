import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortfolioPage from './pages/PortfolioPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function Protected({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1a1714',
            border: '1px solid #ede9e0',
            fontSize: '12px',
            borderRadius: 0,
            boxShadow: '4px 4px 0 #e8b84b',
            fontFamily: '"DM Sans", sans-serif',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#ffffff' } },
          error:   { iconTheme: { primary: '#e85d3a', secondary: '#ffffff' } },
        }} />
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<Protected><AdminDashboard /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
