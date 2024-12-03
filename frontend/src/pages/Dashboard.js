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
import { auth, db } from '../config/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      } else {
        loadGifts(user.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadGifts = async (userId) => {
    try {
      setLoading(true);
      const giftsRef = collection(db, 'gifts');
      const q = query(giftsRef, where('userId', '==', userId));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const giftsList = [];
        snapshot.forEach((doc) => {
          giftsList.push({ id: doc.id, ...doc.data() });
        });
        setGifts(giftsList);
        setLoading(false);
      }, (error) => {
        console.error("Error loading gifts:", error);
        setError(error.message);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up gifts listener:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser.uid;
      const giftData = {
        ...formData,
        userId,
        createdAt: new Date(),
        isPublic
      };

      if (editingGift) {
        await updateDoc(doc(db, 'gifts', editingGift.id), giftData);
      } else {
        await addDoc(collection(db, 'gifts'), giftData);
      }

      setOpenDialog(false);
      setFormData({ name: '', description: '', url: '', image: '' });
      setEditingGift(null);
    } catch (error) {
      console.error('Error al guardar regalo:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (giftId) => {
    try {
      await deleteDoc(doc(db, 'gifts', giftId));
    } catch (error) {
      console.error('Error al eliminar regalo:', error);
      setError(error.message);
    }
  };

  const handleEdit = (gift) => {
    setEditingGift(gift);
    setFormData({
      name: gift.name,
      description: gift.description,
      url: gift.url,
      image: gift.image
    });
    setOpenDialog(true);
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