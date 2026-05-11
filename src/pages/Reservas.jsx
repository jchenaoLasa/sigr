import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Box, Button, Card, CardContent, CardActions, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Stack, TextField, Select, MenuItem,
  FormControl, Typography, Tooltip, List, ListItem, Divider,
} from '@mui/material';
import { Plus, Pencil, Trash2, CalendarDays, Users, Clock } from 'lucide-react';

const EMPTY_FORM  = { name: '', phone: '', email: '', date: '', time: '', guests: 2, notes: '' };
const STATUS_COLOR = { confirmada: 'success', cancelada: 'error', completada: 'default' };

export default function Reservas() {
  const { user, reservations, addReservation, updateReservation, deleteReservation } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [filterDate, setFilterDate] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'mesero';

  const openAdd  = () => { setEditItem(null); setForm({ ...EMPTY_FORM, name: user?.role === 'cliente' ? user.name : '' }); setShowModal(true); };
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
  const sorted   = filtered.slice().sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarDays size={24} color="#1a252f" />
          <Typography variant="h5" fontWeight={700} color="secondary.main">Reservas</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAdd}>Nueva Reserva</Button>
      </Box>

      {/* Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: '12px !important' }}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <TextField
              type="date"
              label="Filtrar por fecha"
              size="small"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              sx={{ minWidth: 200 }}
              InputLabelProps={{ shrink: true }}
            />
            {filterDate && (
              <Button variant="outlined" size="small" onClick={() => setFilterDate('')}>Limpiar</Button>
            )}
            <Chip label={`${sorted.length} reserva(s)`} color="info" size="small" sx={{ ml: 'auto' }} />
          </Box>
        </CardContent>
      </Card>

      {/* Content */}
      {sorted.length === 0 ? (
        <Box textAlign="center" py={8} color="text.disabled">
          <CalendarDays size={56} />
          <Typography mt={2}>No hay reservas {filterDate ? 'para esta fecha' : 'registradas'}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {sorted.map(r => (
            <Card key={r.id}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{r.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.phone}{r.email ? ` · ${r.email}` : ''}
                    </Typography>
                  </Box>
                  <Chip label={r.status} size="small" color={STATUS_COLOR[r.status] || 'success'} />
                </Box>

                <Stack direction="row" spacing={2} flexWrap="wrap" mb={1}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarDays size={13} color="#7f8c8d" />
                    <Typography variant="body2" color="text.secondary">{r.date}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Clock size={13} color="#7f8c8d" />
                    <Typography variant="body2" color="text.secondary">{r.time}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Users size={13} color="#7f8c8d" />
                    <Typography variant="body2" color="text.secondary">{r.guests} personas</Typography>
                  </Box>
                </Stack>

                {r.notes && (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">"{r.notes}"</Typography>
                )}
              </CardContent>

              {(isAdmin || user?.name === r.clientName) && (
                <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                  {isAdmin && (
                    <FormControl size="small" sx={{ flex: 1 }}>
                      <Select
                        value={r.status}
                        onChange={e => updateReservation(r.id, { status: e.target.value })}
                        size="small"
                      >
                        <MenuItem value="confirmada">Confirmada</MenuItem>
                        <MenuItem value="completada">Completada</MenuItem>
                        <MenuItem value="cancelada">Cancelada</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => openEdit(r)} color="info"><Pencil size={15} /></IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" onClick={() => deleteReservation(r.id)} color="error"><Trash2 size={15} /></IconButton>
                  </Tooltip>
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Editar Reserva' : 'Nueva Reserva'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del cliente *"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              disabled={user?.role === 'cliente'}
              sx={{ gridColumn: '1 / -1' }}
            />
            <TextField
              label="Teléfono"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
            <TextField
              label="Fecha *"
              type="date"
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hora *"
              type="time"
              value={form.time}
              onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="N° de personas *"
              type="number"
              inputProps={{ min: 1, max: 20 }}
              value={form.guests}
              onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}
            />
            <TextField
              label="Notas especiales"
              multiline
              rows={2}
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
