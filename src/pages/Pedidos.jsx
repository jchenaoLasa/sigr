import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ShoppingCart, X, Minus, Check, ChevronRight } from 'lucide-react';

const STATUS_FLOW = ['pendiente', 'preparando', 'listo', 'entregado'];
const STATUS_LABELS = { pendiente: 'Pendiente', preparando: 'Preparando', listo: 'Listo', entregado: 'Entregado' };
const STATUS_COLORS = { pendiente: '#e67e22', preparando: '#2980b9', listo: '#27ae60', entregado: '#7f8c8d' };

export default function Pedidos() {
  const { menu, categories, orders, addOrder, updateOrderStatus } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState('1');
  const [filterStatus, setFilterStatus] = useState('todos');

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      return ex ? prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0));

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const handleCreateOrder = () => {
    if (cart.length === 0) return;
    addOrder({ table, items: cart, total: cartTotal });
    setCart([]);
    setTable('1');
    setShowNew(false);
  };

  const nextStatus = (order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < STATUS_FLOW.length - 1) updateOrderStatus(order.id, STATUS_FLOW[idx + 1]);
  };

  const filtered = filterStatus === 'todos' ? orders : orders.filter(o => o.status === filterStatus);
  const availMenu = menu.filter(m => m.available);
  const getCatName = (id) => categories.find(c => c.id === id)?.name || '';

  return (
    <div className="page">
      <div className="page-header">
        <h2>Gestión de Pedidos</h2>
        <button className="btn-primary" onClick={() => setShowNew(!showNew)}>
          <Plus size={16} /> Nuevo Pedido
        </button>
      </div>

      {showNew && (
        <div className="new-order-panel">
          <div className="new-order-header">
            <h3>Nuevo Pedido</h3>
            <div className="form-group inline">
              <label>Mesa:</label>
              <select value={table} onChange={e => setTable(e.target.value)}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Mesa {n}</option>)}
              </select>
            </div>
          </div>
          <div className="order-builder">
            <div className="menu-selector">
              <h4>Seleccionar Platos</h4>
              {categories.map(cat => {
                const catItems = availMenu.filter(m => m.categoryId === cat.id);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat.id} className="cat-section">
                    <p className="cat-label">{cat.name}</p>
                    {catItems.map(item => (
                      <div key={item.id} className="menu-row">
                        <span className="menu-row-name">{item.name}</span>
                        <span className="menu-row-price">${item.price.toLocaleString()}</span>
                        <button onClick={() => addToCart(item)} className="btn-add"><Plus size={14} /></button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="cart-panel">
              <h4><ShoppingCart size={16} /> Carrito</h4>
              {cart.length === 0 ? <p className="empty">Sin items</p> : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <span className="cart-name">{item.name}</span>
                      <div className="cart-controls">
                        <button onClick={() => removeFromCart(item.id)} className="btn-icon"><Minus size={13} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="btn-icon"><Plus size={13} /></button>
                      </div>
                      <span className="cart-subtotal">${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="cart-total">
                    <strong>Total: ${cartTotal.toLocaleString()}</strong>
                    <button onClick={handleCreateOrder} className="btn-primary"><Check size={16} /> Confirmar</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        {['todos', ...STATUS_FLOW].map(s => (
          <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
            {s === 'todos' ? 'Todos' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="orders-grid">
        {filtered.length === 0 ? (
          <p className="empty">No hay pedidos</p>
        ) : (
          filtered.slice().reverse().map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-num">Pedido #{order.id}</span>
                <span className="order-table">Mesa {order.table}</span>
                <span className="status-badge" style={{ background: STATUS_COLORS[order.status] }}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <ul className="order-items-list">
                {order.items.map((item, i) => (
                  <li key={i}>{item.qty}x {item.name} — ${(item.price * item.qty).toLocaleString()}</li>
                ))}
              </ul>
              <div className="order-card-footer">
                <strong>Total: ${order.total.toLocaleString()}</strong>
                {order.status !== 'entregado' && (
                  <button onClick={() => nextStatus(order)} className="btn-primary btn-sm">
                    {STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]]} <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
