import { useApp } from '../context/AppContext';
import { ShoppingCart, CalendarDays, UtensilsCrossed, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user, orders, reservations, menu, closedSales } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt?.startsWith(today));
  const todayRevenue = todayOrders.filter(o => o.status === 'entregado').reduce((s, o) => s + o.total, 0);
  const todayReservations = reservations.filter(r => r.date === today);

  const stats = [
    { icon: <ShoppingCart size={28} color="#e67e22" />, label: 'Pedidos Hoy', value: todayOrders.length, bg: '#fff5eb' },
    { icon: <TrendingUp size={28} color="#27ae60" />, label: 'Ingresos Hoy', value: `$${todayRevenue.toLocaleString()}`, bg: '#eafaf1' },
    { icon: <CalendarDays size={28} color="#2980b9" />, label: 'Reservas Hoy', value: todayReservations.length, bg: '#eaf4fc' },
    { icon: <UtensilsCrossed size={28} color="#8e44ad" />, label: 'Platos en Menú', value: menu.filter(m => m.available).length, bg: '#f5eef8' },
  ];

  const statusMap = { pendiente: 'Pendiente', preparando: 'Preparando', listo: 'Listo', entregado: 'Entregado' };
  const statusColor = { pendiente: '#e67e22', preparando: '#2980b9', listo: '#27ae60', entregado: '#7f8c8d' };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Bienvenido, {user?.name}</h2>
        <p className="subtitle">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ background: s.bg }}>
            {s.icon}
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {user?.role !== 'cliente' && (
        <div className="dashboard-panels">
          <div className="panel">
            <h3>Últimos Pedidos</h3>
            {todayOrders.length === 0 ? (
              <p className="empty">Sin pedidos hoy</p>
            ) : (
              <table className="table">
                <thead><tr><th>#</th><th>Mesa</th><th>Total</th><th>Estado</th></tr></thead>
                <tbody>
                  {todayOrders.slice(-5).reverse().map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>Mesa {o.table}</td>
                      <td>${o.total.toLocaleString()}</td>
                      <td><span className="status-badge" style={{ background: statusColor[o.status] }}>{statusMap[o.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <h3>Reservas del Día</h3>
            {todayReservations.length === 0 ? (
              <p className="empty">Sin reservas hoy</p>
            ) : (
              <ul className="reservation-list">
                {todayReservations.map(r => (
                  <li key={r.id} className="res-item">
                    <span className="res-time">{r.time}</span>
                    <span className="res-name">{r.name}</span>
                    <span className="res-guests">{r.guests} personas</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {user?.role === 'cliente' && (
        <div className="panel">
          <h3>Mis Reservas</h3>
          {reservations.filter(r => r.clientName === user.name).length === 0 ? (
            <p className="empty">No tienes reservas activas</p>
          ) : (
            <ul className="reservation-list">
              {reservations.filter(r => r.clientName === user.name).map(r => (
                <li key={r.id} className="res-item">
                  <span className="res-time">{r.date} {r.time}</span>
                  <span className="res-guests">{r.guests} personas</span>
                  <span className="status-badge" style={{ background: '#27ae60' }}>{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
