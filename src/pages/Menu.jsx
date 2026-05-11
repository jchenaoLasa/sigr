import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';

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

export default function MenuPage() {
  const { user, menu, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, updateCategory, deleteCategory } = useApp();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState('menu');
  const [filterCat, setFilterCat] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat] = useState(null);

  const [form, setForm] = useState({ name: '', categoryId: categories[0]?.id || 1, price: '', description: '', available: true });
  const [catName, setCatName] = useState('');

  const openAdd = () => { setEditItem(null); setForm({ name: '', categoryId: categories[0]?.id || 1, price: '', description: '', available: true }); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };
  const handleSave = () => {
    if (!form.name || !form.price) return;
    const data = { ...form, price: Number(form.price) };
    editItem ? updateMenuItem(editItem.id, data) : addMenuItem(data);
    setShowModal(false);
  };

  const openAddCat = () => { setEditCat(null); setCatName(''); setShowCatModal(true); };
  const openEditCat = (cat) => { setEditCat(cat); setCatName(cat.name); setShowCatModal(true); };
  const handleSaveCat = () => {
    if (!catName.trim()) return;
    editCat ? updateCategory(editCat.id, catName) : addCategory(catName);
    setShowCatModal(false);
  };

  const filtered = filterCat === 0 ? menu : menu.filter(m => m.categoryId === filterCat);
  const getCatName = (id) => categories.find(c => c.id === id)?.name || '';

  return (
    <div className="page">
      <div className="page-header">
        <h2>Menú Digital</h2>
        {isAdmin && (
          <div className="header-actions">
            <button onClick={() => setActiveTab('categorias')} className={`btn-tab ${activeTab === 'categorias' ? 'active' : ''}`}>
              <Tag size={16} /> Categorías
            </button>
            <button onClick={() => setActiveTab('menu')} className={`btn-tab ${activeTab === 'menu' ? 'active' : ''}`}>
              Platos
            </button>
          </div>
        )}
      </div>

      {activeTab === 'menu' && (
        <>
          <div className="filter-bar">
            <button className={`filter-btn ${filterCat === 0 ? 'active' : ''}`} onClick={() => setFilterCat(0)}>Todos</button>
            {categories.map(c => (
              <button key={c.id} className={`filter-btn ${filterCat === c.id ? 'active' : ''}`} onClick={() => setFilterCat(c.id)}>{c.name}</button>
            ))}
            {isAdmin && <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Nuevo Plato</button>}
          </div>

          <div className="menu-grid">
            {filtered.map(item => (
              <div key={item.id} className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
                <div className="menu-card-header">
                  <span className="category-tag">{getCatName(item.categoryId)}</span>
                  {!item.available && <span className="unavailable-tag">No disponible</span>}
                </div>
                <h4>{item.name}</h4>
                <p className="menu-desc">{item.description}</p>
                <div className="menu-card-footer">
                  <span className="price">${item.price.toLocaleString()}</span>
                  {isAdmin && (
                    <div className="card-actions">
                      <button onClick={() => openEdit(item)} className="btn-icon edit"><Pencil size={15} /></button>
                      <button onClick={() => deleteMenuItem(item.id)} className="btn-icon delete"><Trash2 size={15} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'categorias' && isAdmin && (
        <div className="panel">
          <div className="panel-header">
            <h3>Categorías</h3>
            <button className="btn-primary" onClick={openAddCat}><Plus size={16} /> Nueva</button>
          </div>
          <table className="table">
            <thead><tr><th>#</th><th>Nombre</th><th>Platos</th><th>Acciones</th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{menu.filter(m => m.categoryId === c.id).length}</td>
                  <td>
                    <button onClick={() => openEditCat(c)} className="btn-icon edit"><Pencil size={15} /></button>
                    <button onClick={() => deleteCategory(c.id)} className="btn-icon delete"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editItem ? 'Editar Plato' : 'Nuevo Plato'} onClose={() => setShowModal(false)}>
          <div className="modal-body">
            <div className="form-group">
              <label>Nombre</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: Number(e.target.value) }))}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div className="form-group checkbox">
              <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} />
              <label htmlFor="avail">Disponible</label>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} className="btn-primary"><Check size={16} /> Guardar</button>
          </div>
        </Modal>
      )}

      {showCatModal && (
        <Modal title={editCat ? 'Editar Categoría' : 'Nueva Categoría'} onClose={() => setShowCatModal(false)}>
          <div className="modal-body">
            <div className="form-group">
              <label>Nombre</label>
              <input value={catName} onChange={e => setCatName(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={() => setShowCatModal(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSaveCat} className="btn-primary"><Check size={16} /> Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
