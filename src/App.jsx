import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Pedidos from './pages/Pedidos';
import Reservas from './pages/Reservas';
import Caja from './pages/Caja';

function PrivateRoute({ children, roles }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
      <Route path="/pedidos" element={<PrivateRoute roles={['admin', 'mesero']}><Pedidos /></PrivateRoute>} />
      <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
      <Route path="/caja" element={<PrivateRoute roles={['admin']}><Caja /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
