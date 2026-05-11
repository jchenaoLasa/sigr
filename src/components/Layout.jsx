import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Chip, Divider, IconButton, Tooltip,
} from '@mui/material';
import { UtensilsCrossed, Home, Menu, ShoppingCart, CalendarDays, BarChart3, LogOut } from 'lucide-react';

const DRAWER_WIDTH = 240;

const ROLE_COLOR = { admin: 'error', mesero: 'info', cliente: 'success' };

export default function Layout({ children }) {
  const { user, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/',        icon: <Home size={20} />,        label: 'Inicio',   roles: ['admin', 'mesero', 'cliente'] },
    { to: '/menu',    icon: <Menu size={20} />,        label: 'Menú',     roles: ['admin', 'mesero', 'cliente'] },
    { to: '/pedidos', icon: <ShoppingCart size={20} />, label: 'Pedidos',  roles: ['admin', 'mesero'] },
    { to: '/reservas',icon: <CalendarDays size={20} />, label: 'Reservas', roles: ['admin', 'mesero', 'cliente'] },
    { to: '/caja',    icon: <BarChart3 size={20} />,   label: 'Caja',     roles: ['admin'] },
  ];

  const visible = navItems.filter(n => n.roles.includes(user?.role));

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <UtensilsCrossed size={26} color="#e67e22" />
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, letterSpacing: 1 }}>
          SIGR
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ flex: 1, py: 1.5, px: 1 }}>
        {visible.map(item => {
          const active = location.pathname === item.to;
          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.to}
                sx={{
                  borderRadius: 2,
                  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                  backgroundColor: active ? '#e67e22' : 'transparent',
                  '&:hover': {
                    backgroundColor: active ? '#d35400' : 'rgba(255,255,255,0.08)',
                    color: '#fff',
                  },
                  py: 1.2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#e67e22', fontSize: 13, fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </Typography>
            <Chip
              label={user?.role}
              size="small"
              color={ROLE_COLOR[user?.role] || 'default'}
              sx={{ height: 18, fontSize: 10, mt: 0.25 }}
            />
          </Box>
        </Box>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', mb: 1 }}>
          v1.0.0
        </Typography>
        <Tooltip title="Cerrar sesión">
          <Box
            onClick={logout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
              borderRadius: 2,
              color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.15)',
              py: 0.9,
              px: 1.5,
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': { bgcolor: 'rgba(231,76,60,0.18)', borderColor: '#e74c3c', color: '#e74c3c' },
            }}
          >
            <LogOut size={15} />
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Salir</Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#1a252f',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', p: { xs: 2, md: 4 } }}
      >
        {children}
      </Box>
    </Box>
  );
}
