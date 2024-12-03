import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

function Home() {
  const [phone, setPhone] = useState('');
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState('');

  const searchWishlist = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No se encontraron resultados.');
        setWishlist(null);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      if (!userData.isPublic) {
        setError('Esta lista no es pública.');
        setWishlist(null);
        return;
      }

      const wishlistRef = collection(db, 'wishlist');
      const wishlistQuery = query(wishlistRef, where('userId', '==', querySnapshot.docs[0].id));
      const wishlistSnapshot = await getDocs(wishlistQuery);
      
      setWishlist(wishlistSnapshot.docs.map(doc => doc.data()));
      setError('');
    } catch (error) {
      setError('Error al buscar la lista de regalos.');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Buscador de Listas de Regalos
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Número de teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
          />
          <Button variant="contained" onClick={searchWishlist}>
            Buscar
          </Button>
        </Box>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        {wishlist && wishlist.map((item, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              {item.image && (
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{ maxWidth: 200, mt: 2 }}
                />
              )}
              <Button
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Ver Regalo
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default Home;