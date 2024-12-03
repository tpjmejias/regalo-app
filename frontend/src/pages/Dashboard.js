import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { auth } from '../config/firebaseConfig';
import { giftService } from '../services/giftService';

function Dashboard() {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      } else {
        const userPhone = localStorage.getItem('userPhone');
        setPhone(userPhone);
        if (userPhone) {
          loadGifts(userPhone);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadGifts = async (userPhone) => {
    try {
      setLoading(true);
      const giftsList = await giftService.getGifts(userPhone);
      setGifts(giftsList);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newGift = await giftService.createGift({
        phone,
        ...formData
      });
      setGifts(prev => [...prev, newGift]);
      setOpenDialog(false);
      setFormData({ name: '', description: '', url: '', image: '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (giftId) => {
    try {
      setLoading(true);
      await giftService.deleteGift(phone, giftId);
      setGifts(prev => prev.filter(gift => gift.id !== giftId));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (gift) => {
    try {
      setLoading(true);
      const updatedGift = await giftService.updateGift(phone, gift.id, formData);
      setGifts(prev => prev.map(g => g.id === gift.id ? updatedGift : g));
      setOpenDialog(false);
      setFormData({ name: '', description: '', url: '', image: '' });
      setEditingGift(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityChange = async (isPublic) => {
    try {
      setLoading(true);
      await giftService.updateListVisibility(phone, isPublic);
      setGifts(prev => prev.map(gift => ({ ...gift, isPublic })));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Mi Lista de Regalos
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setEditingGift(null);
              setFormData({ name: '', description: '', url: '', image: '' });
              setOpenDialog(true);
            }}
          >
            Agregar Regalo
          </Button>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label="Lista Pública"
        />

        {gifts.map((gift) => (
          <Card key={gift.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{gift.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {gift.description}
              </Typography>
              {gift.image && (
                <Box
                  component="img"
                  src={gift.image}
                  alt={gift.name}
                  sx={{ maxWidth: 200, mt: 2 }}
                />
              )}
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleEdit(gift)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(gift.id)}>
                <DeleteIcon />
              </IconButton>
              <Button
                href={gift.url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                Ver Regalo
              </Button>
            </CardActions>
          </Card>
        ))}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {editingGift ? 'Editar Regalo' : 'Agregar Regalo'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nombre del regalo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="URL de la imagen"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingGift ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Dashboard; 