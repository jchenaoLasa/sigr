import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Box, Button, Card, CardContent, CardActions, Chip, Collapse, Typography,
  Stack, Select, MenuItem, FormControl, InputLabel, Divider, IconButton,
  Paper,
} from '@mui/material';
import { Plus, ShoppingCart, Minus, ChevronRight } from 'lucide-react';

const STATUS_FLOW   = ['pendiente', 'preparando', 'listo', 'entregado'];
const STATUS_LABELS = { pendiente: 'Pendiente', preparando: 'Preparando', listo: 'Listo', entregado: 'Entregado' };
const STATUS_COLOR  = { pendiente: 'warning', preparando: 'info', listo: 'success', entregado: 'default' };

export default function Pedidos() {
  const { menu, categories, orders, addOrder, updateOrderStatus } = useApp();
  const [showNew, setShowNew]         = useState(false);
  const [cart, setCart]               = useState([]);
  const [table, setTable]             = useState('1');
  const [filterStatus, setFilterStatus] = useState('todos');

  const addToCart = (item) =>
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      return ex ? prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...item, qty: 1 }];
    });

  const removeFromCart = (id) =>
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0));

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

  const filtered  = filterStatus === 'todos' ? orders : orders.filter(o => o.status === filterStatus);
  const availMenu = menu.filter(m => m.available);
  const getCatName = (id) => categories.find(c => c.id === id)?.name || '';

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
        <Typography variant="h5" fontWeight={700} color="secondary.main">Gestión de Pedidos</Typography>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setShowNew(v => !v)}>
          {showNew ? 'Cancelar' : 'Nuevo Pedido'}
        </Button>
      </Box>

      {/* New order panel */}
      <Collapse in={showNew}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={3} mb={2} flexWrap="wrap">
              <Typography variant="h6" fontWeight={600}>Nuevo Pedido</Typography>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Mesa</InputLabel>
                <Select label="Mesa" value={table} onChange={e => setTable(e.target.value)}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <MenuItem key={n} value={String(n)}>Mesa {n}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: 2 }}>
              {/* Menu selector */}
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 360, overflowY: 'auto', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1.5}>Seleccionar Platos</Typography>
                {categories.map(cat => {
                  const catItems = availMenu.filter(m => m.categoryId === cat.id);
                  if (catItems.length === 0) return null;
                  return (
                    <Box key={cat.id} mb={2}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5} display="block" mb={0.5}>
                        {cat.name}
                      </Typography>
                      {catItems.map(item => (
                        <Box
                          key={item.id}
                          display="flex" alignItems="center" gap={1} py={0.75} px={1}
                          sx={{ borderRadius: 1, '&:hover': { bgcolor: 'grey.50' } }}
                        >
                          <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
                          <Typography variant="body2" color="primary" fontWeight={600}>${item.price.toLocaleString()}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => addToCart(item)}
                            sx={{ bgcolor: 'primary.main', color: 'white', width: 24, height: 24, '&:hover': { bgcolor: 'primary.dark' } }}
                          >
                            <Plus size={13} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  );
                })}
              </Paper>

              {/* Cart */}
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} display="flex" alignItems="center" gap={0.5} mb={1.5}>
                  <ShoppingCart size={16} /> Carrito
                </Typography>
                {cart.length === 0 ? (
                  <Typography variant="body2" color="text.disabled" textAlign="center" py={2}>Sin items</Typography>
                ) : (
                  <>
                    <Stack spacing={1} mb={2}>
                      {cart.map(item => (
                        <Box key={item.id} display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <IconButton size="small" onClick={() => removeFromCart(item.id)}><Minus size={12} /></IconButton>
                            <Typography variant="body2" fontWeight={600}>{item.qty}</Typography>
                            <IconButton size="small" onClick={() => addToCart(item)}><Plus size={12} /></IconButton>
                          </Box>
                          <Typography variant="body2" color="primary" fontWeight={600} minWidth={64} textAlign="right">
                            ${(item.price * item.qty).toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={700}>Total: ${cartTotal.toLocaleString()}</Typography>
                      <Button variant="contained" size="small" onClick={handleCreateOrder}>Confirmar</Button>
                    </Box>
                  </>
                )}
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Filter chips */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {['todos', ...STATUS_FLOW].map(s => (
          <Chip
            key={s}
            label={s === 'todos' ? 'Todos' : STATUS_LABELS[s]}
            onClick={() => setFilterStatus(s)}
            color={filterStatus === s ? 'primary' : 'default'}
            variant={filterStatus === s ? 'filled' : 'outlined'}
            clickable
          />
        ))}
      </Box>

      {/* Orders grid */}
      {filtered.length === 0 ? (
        <Typography color="text.disabled" textAlign="center" py={6}>No hay pedidos</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
          {filtered.slice().reverse().map(order => (
            <Card key={order.id}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
                  <Typography fontWeight={700}>Pedido #{order.id}</Typography>
                  <Chip label={`Mesa ${order.table}`} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                  <Chip label={STATUS_LABELS[order.status]} size="small" color={STATUS_COLOR[order.status]} sx={{ ml: 'auto' }} />
                </Box>
                <Stack spacing={0.5}>
                  {order.items.map((item, i) => (
                    <Typography key={i} variant="body2" color="text.secondary">
                      {item.qty}× {item.name} — ${(item.price * item.qty).toLocaleString()}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography fontWeight={700}>Total: ${order.total.toLocaleString()}</Typography>
                {order.status !== 'entregado' && (
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ChevronRight size={14} />}
                    onClick={() => nextStatus(order)}
                  >
                    {STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]]}
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
