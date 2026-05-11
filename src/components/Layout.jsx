import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Menu, ShoppingCart, CalendarDays, BarChart3, LogOut, Home } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: 'Inicio', roles: ['admin', 'mesero', 'cliente'] },
    { to: '/menu', icon: <Menu size={18} />, label: 'Menú', roles: ['admin', 'mesero', 'cliente'] },
    { to: '/pedidos', icon: <ShoppingCart size={18} />, label: 'Pedidos', roles: ['admin', 'mesero'] },
    { to: '/reservas', icon: <CalendarDays size={18} />, label: 'Reservas', roles: ['admin', 'mesero', 'cliente'] },
    { to: '/caja', icon: <BarChart3 size={18} />, label: 'Caja', roles: ['admin'] },
  ];

  const visible = navItems.filter(n => n.roles.includes(user?.role));

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <UtensilsCrossed size={28} color="#e67e22" />
          <span>SIGR</span>
        </div>
        <nav className="sidebar-nav">
          {visible.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={logout} className="btn-logout">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
