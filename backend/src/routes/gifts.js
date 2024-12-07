const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

/**
 * @swagger
 * /api/gifts/latest:
 *   get:
 *     tags: [Regalos]
 *     summary: Obtener últimos 10 regalos
 *     description: Obtiene los últimos 10 regalos agregados en la plataforma, ordenados por fecha de creación
 *     responses:
 *       200:
 *         description: Lista de últimos regalos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID único del regalo
 *                   userId:
 *                     type: string
 *                     description: Número de teléfono del usuario (sin formato)
 *                   url:
 *                     type: string
 *                     description: URL principal del regalo
 *                   url_2:
 *                     type: string
 *                     description: URL alternativa del regalo
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación del regalo
 *       500:
 *         description: Error del servidor
 */
router.get('/latest', async (req, res) => {
  try {
    const gifts = [];
    const usersRef = db.collection('users');
    const usersSnapshot = await usersRef.get();

    for (const userDoc of usersSnapshot.docs) {
      const giftsSnapshot = await userDoc.ref
        .collection('gifts')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      giftsSnapshot.forEach(doc => {
        gifts.push({ 
          id: doc.id, 
          userId: userDoc.id,
          ...doc.data() 
        });
      });
    }
    
    // Ordenar todos los regalos por fecha y tomar los últimos 10
    gifts.sort((a, b) => b.createdAt - a.createdAt);
    res.json(gifts.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gifts/popular:
 *   get:
 *     tags: [Regalos]
 *     summary: Obtener regalos populares
 *     description: Obtiene los regalos más populares basados en el dominio de la URL
 *     responses:
 *       200:
 *         description: Lista de regalos populares obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   domain:
 *                     type: string
 *                   count:
 *                     type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/popular', async (req, res) => {
  try {
    const domainCounts = {};
    const usersRef = db.collection('users');
    const usersSnapshot = await usersRef.get();

    for (const userDoc of usersSnapshot.docs) {
      const giftsSnapshot = await userDoc.ref.collection('gifts').get();
      
      giftsSnapshot.forEach(doc => {
        const gift = doc.data();
        try {
          const domain = new URL(gift.url).hostname.replace('www.', '');
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        } catch (error) {
          console.error('Error parsing URL:', gift.url);
        }
      });
    }
    
    const popular = Object.entries(domainCounts)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    res.json(popular);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gifts/{phone}:
 *   get:
 *     tags: [Regalos]
 *     summary: Obtener lista de regalos de un usuario
 *     description: Obtiene todos los regalos asociados a un número de teléfono, ordenados por fecha de creación
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de teléfono del usuario
 *         example: "+525512345678"
 *     responses:
 *       200:
 *         description: Lista de regalos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID único del regalo
 *                   url:
 *                     type: string
 *                     description: URL principal del regalo
 *                   url_2:
 *                     type: string
 *                     description: URL alternativa del regalo
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación del regalo
 *       500:
 *         description: Error del servidor
 */
router.get('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const userId = phone.replace(/\D/g, '');
    
    const giftsRef = db.collection('users').doc(userId).collection('gifts');
    const snapshot = await giftsRef.orderBy('createdAt', 'desc').get();
    
    const gifts = [];
    snapshot.forEach(doc => {
      gifts.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gifts:
 *   post:
 *     tags: [Regalos]
 *     summary: Crear nuevo regalo
 *     description: Crea un nuevo regalo en la lista de regalos del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - url
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del usuario
 *                 example: "+525512345678"
 *               url:
 *                 type: string
 *                 description: URL principal del regalo
 *                 example: "https://www.amazon.com/product"
 *               url_2:
 *                 type: string
 *                 description: URL alternativa del regalo
 *                 example: "https://www.mercadolibre.com/product"
 *                 required: false
 *     responses:
 *       201:
 *         description: Regalo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID único del regalo
 *                 url:
 *                   type: string
 *                   description: URL principal del regalo
 *                 url_2:
 *                   type: string
 *                   description: URL alternativa del regalo
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación del regalo
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { phone, url, url_2 } = req.body;
    
    if (!phone || !url) {
      return res.status(400).json({ error: 'Teléfono y URL son requeridos' });
    }

    const userId = phone.replace(/\D/g, '');
    
    const gift = {
      url,
      url_2: url_2 || null,
      createdAt: new Date()
    };
    
    const userRef = db.collection('users').doc(userId);
    const giftsRef = userRef.collection('gifts');
    const docRef = await giftsRef.add(gift);
    
    res.status(201).json({ id: docRef.id, ...gift });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/gifts/{phone}/{giftId}:
 *   delete:
 *     tags: [Regalos]
 *     summary: Eliminar un regalo
 *     description: Elimina un regalo específico
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de teléfono del usuario
 *         example: "+525512345678"
 *       - in: path
 *         name: giftId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del regalo a eliminar
 *     responses:
 *       200:
 *         description: Regalo eliminado exitosamente
 *       404:
 *         description: Regalo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:phone/:giftId', async (req, res) => {
  try {
    const { phone, giftId } = req.params;
    const userId = phone.replace(/\D/g, '');
    
    const giftRef = db.collection('users')
      .doc(userId)
      .collection('gifts')
      .doc(giftId);
    
    const gift = await giftRef.get();
    
    if (!gift.exists) {
      return res.status(404).json({ error: 'Regalo no encontrado' });
    }
    
    await giftRef.delete();
    res.json({ message: 'Regalo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;