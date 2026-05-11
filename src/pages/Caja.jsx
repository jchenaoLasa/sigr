import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Box, Button, Card, CardContent, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, TableFooter, Stack, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Divider, Chip,
} from '@mui/material';
import { BarChart3, DollarSign, ShoppingBag, TrendingUp, Lock } from 'lucide-react';

export default function Caja() {
  const { orders, closedSales, closeCashRegister } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showConfirm, setShowConfirm]   = useState(false);

  const deliveredOrders = orders.filter(o => o.status === 'entregado' && o.createdAt?.startsWith(selectedDate));
  const pendingOrders   = orders.filter(o => o.status !== 'entregado'  && o.createdAt?.startsWith(selectedDate));
  const totalRevenue    = deliveredOrders.reduce((s, o) => s + o.total, 0);
  const avgTicket       = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;

  const alreadyClosed = closedSales.find(s => s.date === selectedDate);

  const handleClose = () => {
    closeCashRegister(selectedDate);
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

  const stats = [
    { icon: <TrendingUp size={28} />,  label: 'Ingresos del Día',    value: `$${totalRevenue.toLocaleString()}`,          color: '#27ae60', bg: '#eafaf1' },
    { icon: <ShoppingBag size={28} />, label: 'Pedidos Entregados',  value: deliveredOrders.length,                       color: '#e67e22', bg: '#fff5eb' },
    { icon: <DollarSign size={28} />,  label: 'Ticket Promedio',     value: `$${Math.round(avgTicket).toLocaleString()}`, color: '#2980b9', bg: '#eaf4fc' },
    { icon: <ShoppingBag size={28} />, label: 'Pedidos Pendientes',  value: pendingOrders.length,                         color: '#8e44ad', bg: '#f5eef8' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <BarChart3 size={24} color="#1a252f" />
          <Typography variant="h5" fontWeight={700} color="secondary.main">Caja y Reportes</Typography>
        </Box>
        <TextField
          type="date"
          label="Fecha"
          size="small"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 180 }}
        />
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        {stats.map((s, i) => (
          <Card key={i} sx={{ background: s.bg, border: 'none' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '20px !important' }}>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="secondary.main">{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Panels */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Delivered orders */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>Detalle de Pedidos Entregados</Typography>
            {deliveredOrders.length === 0 ? (
              <Typography color="text.disabled" textAlign="center" py={3}>No hay pedidos entregados para esta fecha</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Mesa</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Hora</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveredOrders.map(o => (
                    <TableRow key={o.id} hover>
                      <TableCell>#{o.id}</TableCell>
                      <TableCell>Mesa {o.table}</TableCell>
                      <TableCell>{o.items.reduce((s, i) => s + i.qty, 0)} items</TableCell>
                      <TableCell>${o.total.toLocaleString()}</TableCell>
                      <TableCell>{new Date(o.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ '& td': { fontWeight: 700, bgcolor: 'grey.50', borderTop: '2px solid #e8eaed' } }}>
                    <TableCell colSpan={3}>Total del día</TableCell>
                    <TableCell colSpan={2}>${totalRevenue.toLocaleString()}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top items + close */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>Platos Más Vendidos</Typography>
            {popularItems.length === 0 ? (
              <Typography color="text.disabled" textAlign="center" py={3}>Sin datos para esta fecha</Typography>
            ) : (
              <Stack spacing={1} mb={3}>
                {popularItems.map((item, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={1.5} py={0.75}>
                    <Chip label={`#${i + 1}`} size="small" color="primary" sx={{ minWidth: 36, fontWeight: 700 }} />
                    <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{item.qty} uds.</Typography>
                  </Box>
                ))}
              </Stack>
            )}

            <Divider sx={{ mb: 2 }} />

            {alreadyClosed ? (
              <Alert severity="success" icon={<Lock size={16} />} sx={{ borderRadius: 2 }}>
                Caja cerrada — Total: <strong>${alreadyClosed.total.toLocaleString()}</strong>
              </Alert>
            ) : (
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<Lock size={16} />}
                onClick={() => setShowConfirm(true)}
              >
                Cerrar Caja del Día
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* History */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>Historial de Cierres de Caja</Typography>
          {closedSales.length === 0 ? (
            <Typography color="text.disabled" textAlign="center" py={3}>No hay cierres registrados</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Pedidos</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Hora de Cierre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {closedSales.slice().reverse().map((s, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{s.date}</TableCell>
                    <TableCell>{s.orders}</TableCell>
                    <TableCell><Typography fontWeight={700}>${s.total.toLocaleString()}</Typography></TableCell>
                    <TableCell>{new Date(s.closedAt).toLocaleString('es-CO')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Cierre de Caja</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
            ¿Confirmar cierre de caja del <strong>{selectedDate}</strong>?<br />
            Total a registrar: <strong>${totalRevenue.toLocaleString()}</strong>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowConfirm(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleClose}>Confirmar Cierre</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
