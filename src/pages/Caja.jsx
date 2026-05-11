import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, DollarSign, ShoppingBag, TrendingUp, Lock } from 'lucide-react';

export default function Caja() {
  const { orders, closedSales, closeCashRegister } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastClosed, setLastClosed] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const deliveredOrders = orders.filter(o => o.status === 'entregado' && o.createdAt?.startsWith(selectedDate));
  const pendingOrders = orders.filter(o => o.status !== 'entregado' && o.createdAt?.startsWith(selectedDate));
  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.total, 0);
  const avgTicket = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;

  const alreadyClosed = closedSales.find(s => s.date === selectedDate);

  const handleClose = () => {
    const record = closeCashRegister(selectedDate);
    setLastClosed(record);
    setShowConfirm(false);
  };

  const popularItems = deliveredOrders
    .flatMap(o => o.items)
    .reduce((acc, item) => {
      const ex = acc.find(a => a.name === item.name);
      if (ex) ex.qty += item.qty;
      else acc.push({ name: item.name, qty: item.qty });
      return acc;
    }, [])
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <h2><BarChart3 size={22} /> Caja y Reportes</h2>
        <div className="form-group inline">
          <label>Fecha:</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: '#eafaf1' }}>
          <TrendingUp size={28} color="#27ae60" />
          <div>
            <p className="stat-value">${totalRevenue.toLocaleString()}</p>
            <p className="stat-label">Ingresos del Día</p>
          </div>
        </div>
        <div className="stat-card" style={{ background: '#fff5eb' }}>
          <ShoppingBag size={28} color="#e67e22" />
          <div>
            <p className="stat-value">{deliveredOrders.length}</p>
            <p className="stat-label">Pedidos Entregados</p>
          </div>
        </div>
        <div className="stat-card" style={{ background: '#eaf4fc' }}>
          <DollarSign size={28} color="#2980b9" />
          <div>
            <p className="stat-value">${Math.round(avgTicket).toLocaleString()}</p>
            <p className="stat-label">Ticket Promedio</p>
          </div>
        </div>
        <div className="stat-card" style={{ background: '#fdf2f8' }}>
          <ShoppingBag size={28} color="#8e44ad" />
          <div>
            <p className="stat-value">{pendingOrders.length}</p>
            <p className="stat-label">Pedidos Pendientes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="panel">
          <h3>Detalle de Pedidos Entregados</h3>
          {deliveredOrders.length === 0 ? (
            <p className="empty">No hay pedidos entregados para esta fecha</p>
          ) : (
            <table className="table">
              <thead><tr><th>#</th><th>Mesa</th><th>Items</th><th>Total</th><th>Hora</th></tr></thead>
              <tbody>
                {deliveredOrders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>Mesa {o.table}</td>
                    <td>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                    <td>${o.total.toLocaleString()}</td>
                    <td>{new Date(o.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
                <tr className="table-total">
                  <td colSpan={3}><strong>Total del día</strong></td>
                  <td colSpan={2}><strong>${totalRevenue.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="panel">
          <h3>Platos Más Vendidos</h3>
          {popularItems.length === 0 ? (
            <p className="empty">Sin datos para esta fecha</p>
          ) : (
            <ul className="top-items">
              {popularItems.map((item, i) => (
                <li key={i} className="top-item">
                  <span className="top-rank">#{i + 1}</span>
                  <span className="top-name">{item.name}</span>
                  <span className="top-qty">{item.qty} uds.</span>
                </li>
              ))}
            </ul>
          )}

          <div className="close-register">
            {alreadyClosed ? (
              <div className="closed-notice">
                <Lock size={16} /> Caja cerrada — Total: ${alreadyClosed.total.toLocaleString()}
              </div>
            ) : (
              <>
                {!showConfirm ? (
                  <button onClick={() => setShowConfirm(true)} className="btn-danger">
                    <Lock size={16} /> Cerrar Caja del Día
                  </button>
                ) : (
                  <div className="confirm-box">
                    <p>¿Confirmar cierre de caja del <strong>{selectedDate}</strong>?</p>
                    <p>Total a registrar: <strong>${totalRevenue.toLocaleString()}</strong></p>
                    <div className="confirm-actions">
                      <button onClick={() => setShowConfirm(false)} className="btn-secondary">Cancelar</button>
                      <button onClick={handleClose} className="btn-danger">Confirmar Cierre</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Historial de Cierres de Caja</h3>
        {closedSales.length === 0 ? (
          <p className="empty">No hay cierres registrados</p>
        ) : (
          <table className="table">
            <thead><tr><th>Fecha</th><th>Pedidos</th><th>Total</th><th>Hora de Cierre</th></tr></thead>
            <tbody>
              {closedSales.slice().reverse().map((s, i) => (
                <tr key={i}>
                  <td>{s.date}</td>
                  <td>{s.orders}</td>
                  <td><strong>${s.total.toLocaleString()}</strong></td>
                  <td>{new Date(s.closedAt).toLocaleString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
