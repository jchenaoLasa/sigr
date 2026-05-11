import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

const USERS = [
  { id: 1, name: 'Admin', email: 'admin@sigr.com', password: '1234', role: 'admin' },
  { id: 2, name: 'Carlos Mesero', email: 'mesero@sigr.com', password: '1234', role: 'mesero' },
  { id: 3, name: 'Ana Cliente', email: 'cliente@sigr.com', password: '1234', role: 'cliente' },
];

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Entradas' },
  { id: 2, name: 'Platos Principales' },
  { id: 3, name: 'Postres' },
  { id: 4, name: 'Bebidas' },
];

const INITIAL_MENU = [
  { id: 1, name: 'Ensalada César', categoryId: 1, price: 18000, description: 'Lechuga romana, crutones, queso parmesano', available: true },
  { id: 2, name: 'Sopa del Día', categoryId: 1, price: 12000, description: 'Sopa casera de temporada', available: true },
  { id: 3, name: 'Bandeja Paisa', categoryId: 2, price: 38000, description: 'Arroz, fríjoles, chicharrón, carne, chorizo, huevo', available: true },
  { id: 4, name: 'Pollo a la Plancha', categoryId: 2, price: 32000, description: 'Pechuga a la plancha con papas y ensalada', available: true },
  { id: 5, name: 'Chuleta de Cerdo', categoryId: 2, price: 35000, description: 'Con puré de papa y vegetales salteados', available: true },
  { id: 6, name: 'Torta de Chocolate', categoryId: 3, price: 14000, description: 'Con helado de vainilla', available: true },
  { id: 7, name: 'Flan de Caramelo', categoryId: 3, price: 10000, description: 'Casero con salsa de caramelo', available: true },
  { id: 8, name: 'Limonada de Coco', categoryId: 4, price: 9000, description: 'Refrescante y natural', available: true },
  { id: 9, name: 'Jugo Natural', categoryId: 4, price: 7000, description: 'Mango, lulo, maracuyá o mora', available: true },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [closedSales, setClosedSales] = useState([]);
  const [nextId, setNextId] = useState({ menu: 10, category: 5, order: 1, reservation: 1 });

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return true; }
    return false;
  };

  const logout = () => setUser(null);

  const getNextId = (type) => {
    const id = nextId[type];
    setNextId(prev => ({ ...prev, [type]: prev[type] + 1 }));
    return id;
  };

  // Menu CRUD
  const addMenuItem = (item) => setMenu(prev => [...prev, { ...item, id: getNextId('menu') }]);
  const updateMenuItem = (id, data) => setMenu(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteMenuItem = (id) => setMenu(prev => prev.filter(i => i.id !== id));

  // Category CRUD
  const addCategory = (name) => setCategories(prev => [...prev, { id: getNextId('category'), name }]);
  const updateCategory = (id, name) => setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));

  // Orders
  const addOrder = (order) => setOrders(prev => [...prev, { ...order, id: getNextId('order'), createdAt: new Date().toISOString(), status: 'pendiente' }]);
  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  // Reservations
  const addReservation = (res) => setReservations(prev => [...prev, { ...res, id: getNextId('reservation'), status: 'confirmada' }]);
  const updateReservation = (id, data) => setReservations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  const deleteReservation = (id) => setReservations(prev => prev.filter(r => r.id !== id));

  // Cash register
  const closeCashRegister = (date) => {
    const dayOrders = orders.filter(o => o.status === 'entregado' && o.createdAt.startsWith(date));
    const total = dayOrders.reduce((sum, o) => sum + o.total, 0);
    const record = { date, orders: dayOrders.length, total, closedAt: new Date().toISOString() };
    setClosedSales(prev => [...prev, record]);
    return record;
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      categories, addCategory, updateCategory, deleteCategory,
      menu, addMenuItem, updateMenuItem, deleteMenuItem,
      orders, addOrder, updateOrderStatus,
      reservations, addReservation, updateReservation, deleteReservation,
      closedSales, closeCashRegister,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
