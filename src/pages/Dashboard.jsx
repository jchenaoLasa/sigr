import { useApp } from '../context/AppContext';
import { ShoppingCart, CalendarDays, UtensilsCrossed, TrendingUp } from 'lucide-react';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, List, ListItem, ListItemText, Divider,
} from '@mui/material';

const STATUS_MAP    = { pendiente: 'Pendiente', preparando: 'Preparando', listo: 'Listo', entregado: 'Entregado' };
const STATUS_COLOR  = { pendiente: 'warning', preparando: 'info', listo: 'success', entregado: 'default' };
const RES_COLOR     = { confirmada: 'success', cancelada: 'error', completada: 'default' };

export default function Dashboard() {
  const { user, orders, reservations, menu } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders       = orders.filter(o => o.createdAt?.startsWith(today));
  const todayRevenue      = todayOrders.filter(o => o.status === 'entregado').reduce((s, o) => s + o.total, 0);
  const todayReservations = reservations.filter(r => r.date === today);

  const stats = [
    { icon: <ShoppingCart size={28} />, label: 'Pedidos Hoy',   value: todayOrders.length,                      color: '#e67e22', bg: '#fff5eb' },
    { icon: <TrendingUp size={28} />,   label: 'Ingresos Hoy',  value: `$${todayRevenue.toLocaleString()}`,      color: '#27ae60', bg: '#eafaf1' },
    { icon: <CalendarDays size={28} />, label: 'Reservas Hoy',  value: todayReservations.length,                 color: '#2980b9', bg: '#eaf4fc' },
    { icon: <UtensilsCrossed size={28} />, label: 'Platos en Menú', value: menu.filter(m => m.available).length, color: '#8e44ad', bg: '#f5eef8' },
  ];

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} color="secondary.main">
          Bienvenido, {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
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

      {/* Admin / mesero panels */}
      {user?.role !== 'cliente' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Últimos Pedidos</Typography>
              {todayOrders.length === 0 ? (
                <Typography color="text.disabled" textAlign="center" py={3}>Sin pedidos hoy</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Mesa</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todayOrders.slice(-5).reverse().map(o => (
                      <TableRow key={o.id} hover>
                        <TableCell>#{o.id}</TableCell>
                        <TableCell>Mesa {o.table}</TableCell>
                        <TableCell>${o.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip label={STATUS_MAP[o.status]} color={STATUS_COLOR[o.status]} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Reservas del Día</Typography>
              {todayReservations.length === 0 ? (
                <Typography color="text.disabled" textAlign="center" py={3}>Sin reservas hoy</Typography>
              ) : (
                <List dense disablePadding>
                  {todayReservations.map((r, i) => (
                    <Box key={r.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemText
                          primary={r.name}
                          secondary={`${r.guests} personas`}
                        />
                        <Chip label={r.time} color="primary" size="small" variant="outlined" />
                      </ListItem>
                      {i < todayReservations.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Cliente panel */}
      {user?.role === 'cliente' && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>Mis Reservas</Typography>
            {reservations.filter(r => r.clientName === user.name).length === 0 ? (
              <Typography color="text.disabled" textAlign="center" py={3}>No tienes reservas activas</Typography>
            ) : (
              <List dense disablePadding>
                {reservations.filter(r => r.clientName === user.name).map((r, i, arr) => (
                  <Box key={r.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${r.date} · ${r.time}`}
                        secondary={`${r.guests} personas`}
                      />
                      <Chip
                        label={r.status}
                        color={RES_COLOR[r.status] || 'default'}
                        size="small"
                      />
                    </ListItem>
                    {i < arr.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
