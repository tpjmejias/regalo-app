const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Lista de Regalos',
      version: '1.0.0',
      description: 'API para gestionar listas de regalos',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./src/index.js'], // archivos que contienen anotaciones
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware de autenticación
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Rutas
/**
 * @swagger
 * /api/wishlist/{phone}:
 *   get:
 *     summary: Obtiene la lista de regalos de un usuario por número de teléfono
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         description: Número de teléfono del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de regalos encontrada
 *       404:
 *         description: Usuario no encontrado
 */
app.get('/api/wishlist/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const userRef = await db.collection('users').where('phone', '==', phone).get();
    
    if (userRef.empty) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userData = userRef.docs[0].data();
    if (!userData.isPublic) {
      return res.status(403).json({ message: 'Esta lista no es pública' });
    }

    const wishlistRef = await db.collection('wishlist')
      .where('userId', '==', userRef.docs[0].id)
      .get();

    const wishlist = wishlistRef.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Agrega un nuevo regalo a la lista
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Regalo agregado exitosamente
 *       401:
 *         description: No autorizado
 */
app.post('/api/wishlist', authenticateUser, async (req, res) => {
  try {
    const { name, description, url, image } = req.body;
    const userId = req.user.uid;

    const docRef = await db.collection('wishlist').add({
      name,
      description,
      url,
      image,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/{id}:
 *   put:
 *     summary: Actualiza un regalo existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del regalo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Regalo actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Regalo no encontrado
 */
app.put('/api/wishlist/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const giftRef = db.collection('wishlist').doc(id);
    const gift = await giftRef.get();

    if (!gift.exists) {
      return res.status(404).json({ error: 'Regalo no encontrado' });
    }

    if (gift.data().userId !== userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await giftRef.update(req.body);
    res.json({ message: 'Regalo actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Elimina un regalo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del regalo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Regalo eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Regalo no encontrado
 */
app.delete('/api/wishlist/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const giftRef = db.collection('wishlist').doc(id);
    const gift = await giftRef.get();

    if (!gift.exists) {
      return res.status(404).json({ error: 'Regalo no encontrado' });
    }

    if (gift.data().userId !== userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await giftRef.delete();
    res.json({ message: 'Regalo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/user/privacy:
 *   put:
 *     summary: Actualiza la privacidad de la lista de regalos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Privacidad actualizada exitosamente
 *       401:
 *         description: No autorizado
 */
app.put('/api/user/privacy', authenticateUser, async (req, res) => {
  try {
    const { isPublic } = req.body;
    const userId = req.user.uid;
    
    await db.collection('users').doc(userId).update({
      isPublic: isPublic
    });

    res.json({ message: 'Privacidad actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`)); 