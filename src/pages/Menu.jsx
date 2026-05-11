import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Box, Button, Card, CardContent, CardActions, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Stack, Tabs, Tab, Table, TableHead,
  TableBody, TableRow, TableCell, TextField, FormControlLabel, Checkbox,
  Select, MenuItem, FormControl, InputLabel, Typography, Tooltip,
} from '@mui/material';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

export default function MenuPage() {
  const {
    user, menu, categories,
    addMenuItem, updateMenuItem, deleteMenuItem,
    addCategory, updateCategory, deleteCategory,
  } = useApp();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab]     = useState(0);
  const [filterCat, setFilterCat]     = useState(0);
  const [showModal, setShowModal]     = useState(false);
  const [editItem, setEditItem]       = useState(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat]         = useState(null);
  const [form, setForm]   = useState({ name: '', categoryId: categories[0]?.id || 1, price: '', description: '', available: true });
  const [catName, setCatName] = useState('');

  const openAdd  = () => { setEditItem(null); setForm({ name: '', categoryId: categories[0]?.id || 1, price: '', description: '', available: true }); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };
  const handleSave = () => {
    if (!form.name || !form.price) return;
    const data = { ...form, price: Number(form.price) };
    editItem ? updateMenuItem(editItem.id, data) : addMenuItem(data);
    setShowModal(false);
  };

  const openAddCat  = () => { setEditCat(null); setCatName(''); setShowCatModal(true); };
  const openEditCat = (cat) => { setEditCat(cat); setCatName(cat.name); setShowCatModal(true); };
  const handleSaveCat = () => {
    if (!catName.trim()) return;
    editCat ? updateCategory(editCat.id, catName) : addCategory(catName);
    setShowCatModal(false);
  };

  const filtered    = filterCat === 0 ? menu : menu.filter(m => m.categoryId === filterCat);
  const getCatName  = (id) => categories.find(c => c.id === id)?.name || '';

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} color="secondary.main">Menú Digital</Typography>
        {isAdmin && (
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
          >
            <Tab label="Platos" />
            <Tab label="Categorías" icon={<Tag size={14} />} iconPosition="start" />
          </Tabs>
        )}
      </Box>

      {/* ── Platos tab ── */}
      {activeTab === 0 && (
        <>
          <Box display="flex" gap={1} mb={3} flexWrap="wrap" alignItems="center">
            <Chip
              label="Todos"
              onClick={() => setFilterCat(0)}
              color={filterCat === 0 ? 'primary' : 'default'}
              variant={filterCat === 0 ? 'filled' : 'outlined'}
              clickable
            />
            {categories.map(c => (
              <Chip
                key={c.id}
                label={c.name}
                onClick={() => setFilterCat(c.id)}
                color={filterCat === c.id ? 'primary' : 'default'}
                variant={filterCat === c.id ? 'filled' : 'outlined'}
                clickable
              />
            ))}
            {isAdmin && (
              <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAdd} sx={{ ml: 'auto' }}>
                Nuevo Plato
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
            {filtered.map(item => (
              <Card key={item.id} sx={{ opacity: item.available ? 1 : 0.55, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box display="flex" gap={0.5} mb={1.5} flexWrap="wrap">
                    <Chip label={getCatName(item.categoryId)} size="small" color="warning" variant="outlined" sx={{ fontSize: 11 }} />
                    {!item.available && <Chip label="No disponible" size="small" color="error" variant="outlined" sx={{ fontSize: 11 }} />}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>{item.description}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight={700}>${item.price.toLocaleString()}</Typography>
                  {isAdmin && (
                    <Box>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(item)} color="info"><Pencil size={15} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => deleteMenuItem(item.id)} color="error"><Trash2 size={15} /></IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}

      {/* ── Categorías tab ── */}
      {activeTab === 1 && isAdmin && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>Categorías</Typography>
              <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddCat}>Nueva</Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Platos</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map(c => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{menu.filter(m => m.categoryId === c.id).length}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEditCat(c)} color="info"><Pencil size={15} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => deleteCategory(c.id)} color="error"><Trash2 size={15} /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── Plato Dialog ── */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Editar Plato' : 'Nuevo Plato'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <FormControl size="small" fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                label="Categoría"
                value={form.categoryId}
                onChange={e => setForm(p => ({ ...p, categoryId: Number(e.target.value) }))}
              >
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Precio" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
            <TextField label="Descripción" multiline rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            <FormControlLabel
              control={<Checkbox checked={form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} color="primary" />}
              label="Disponible"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* ── Categoría Dialog ── */}
      <Dialog open={showCatModal} onClose={() => setShowCatModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editCat ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        <DialogContent>
          <TextField sx={{ mt: 1 }} label="Nombre" value={catName} onChange={e => setCatName(e.target.value)} autoFocus />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowCatModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveCat}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
