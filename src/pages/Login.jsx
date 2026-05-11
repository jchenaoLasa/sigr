import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, Divider, Stack, Chip,
} from '@mui/material';
import { UtensilsCrossed } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(email, password)) setError('Credenciales incorrectas. Intente de nuevo.');
  };

  const quickLogin = (role) => {
    const creds = {
      admin:   ['admin@sigr.com',   '1234'],
      mesero:  ['mesero@sigr.com',  '1234'],
      cliente: ['cliente@sigr.com', '1234'],
    };
    login(creds[role][0], creds[role][1]);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 4, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'inline-flex', p: 1.5, bgcolor: '#fff5eb', borderRadius: 3, mb: 1.5 }}>
              <UtensilsCrossed size={40} color="#e67e22" />
            </Box>
            <Typography variant="h4" fontWeight={800} color="secondary.main">SIGR</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Sistema Integral de Gestión de Restaurante
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2} mb={2}>
              <TextField
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@sigr.com"
                required
              />
              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            )}

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5, fontSize: 15 }}>
              Ingresar
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">Acceso rápido (demo)</Typography>
          </Divider>

          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip label="Admin"   onClick={() => quickLogin('admin')}   color="error"   clickable size="small" />
            <Chip label="Mesero"  onClick={() => quickLogin('mesero')}  color="info"    clickable size="small" />
            <Chip label="Cliente" onClick={() => quickLogin('cliente')} color="success" clickable size="small" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
