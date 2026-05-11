import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pencil, Trash2, X, Check, CalendarDays } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const EMPTY_FORM = { name: '', phone: '', email: '', date: '', time: '', guests: 2, notes: '' };

export default function Reservas() {
  const { user, reservations, addReservation, updateReservation, deleteReservation } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterDate, setFilterDate] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'mesero';

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, name: user?.role === 'cliente' ? user.name : '' });
    setShowModal(true);
  };
  const openEdit = (r) => { setEditItem(r); setForm({ ...r }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.date || !form.time || !form.guests) return;
    const data = { ...form, guests: Number(form.guests), clientName: form.name };
    editItem ? updateReservation(editItem.id, data) : addReservation(data);
    setShowModal(false);
  };

  const myReservations = user?.role === 'cliente'
    ? reservations.filter(r => r.clientName === user.name)
    : reservations;

  const filtered = filterDate ? myReservations.filter(r => r.date === filterDate) : myReservations;

  const STATUS_COLORS = { confirmada: '#27ae60', cancelada: '#e74c3c', completada: '#7f8c8d' };

  return (
    <div className="page">
      <div className="page-header">
        <h2><CalendarDays size={22} /> Reservas</h2>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Nueva Reserva</button>
      </div>

      <div className="filter-bar">
        <div className="form-group inline">
          <label>Filtrar por fecha:</label>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        {filterDate && <button className="btn-secondary" onClick={() => setFilterDate('')}>Limpiar</button>}
        <span className="count-badge">{filtered.length} reserva(s)</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={48} color="#bdc3c7" />
          <p>No hay reservas {filterDate ? 'para esta fecha' : 'registradas'}</p>
        </div>
      ) : (
        <div className="reservations-grid">
          {filtered.slice().sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(r => (
            <div key={r.id} className="reservation-card">
              <div className="res-card-header">
                <div>
                  <p className="res-card-name">{r.name}</p>
                  <p className="res-card-contact">{r.phone} {r.email ? `· ${r.email}` : ''}</p>
                </div>
                <span className="status-badge" style={{ background: STATUS_COLORS[r.status] || '#27ae60' }}>
                  {r.status}
                </span>
              </div>
              <div className="res-card-details">
                <span>📅 {r.date}</span>
                <span>🕐 {r.time}</span>
                <span>👥 {r.guests} personas</span>
              </div>
              {r.notes && <p className="res-notes">"{r.notes}"</p>}
              {(isAdmin || user?.name === r.clientName) && (
                <div className="res-card-actions">
                  {isAdmin && (
                    <select value={r.status} onChange={e => updateReservation(r.id, { status: e.target.value })} className="status-select">
                      <option value="confirmada">Confirmada</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  )}
                  <button onClick={() => openEdit(r)} className="btn-icon edit"><Pencil size={15} /></button>
                  <button onClick={() => deleteReservation(r.id)} className="btn-icon delete"><Trash2 size={15} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? 'Editar Reserva' : 'Nueva Reserva'} onClose={() => setShowModal(false)}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del cliente *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} disabled={user?.role === 'cliente'} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Hora *</label>
                <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>N° de personas *</label>
                <input type="number" min="1" max="20" value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Notas especiales</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} />
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} className="btn-primary"><Check size={16} /> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
