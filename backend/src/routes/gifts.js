const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/gifts:
 *   get:
 *     summary: Obtener lista de regalos
 *     security:
 *       - bearerAuth: []
 *     tags: [Gifts]
 *     responses:
 *       200:
 *         description: Lista de regalos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gift'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, async (req, res) => {
  try {
    const giftsRef = db.collection('gifts');
    const snapshot = await giftsRef.where('userId', '==', req.user.uid).get();
    
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
 *     summary: Crear un nuevo regalo
 *     security:
 *       - bearerAuth: []
 *     tags: [Gifts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gift'
 *     responses:
 *       201:
 *         description: Regalo creado exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/', auth, async (req, res) => {
  try {
    const giftData = {
      ...req.body,
      userId: req.user.uid,
      createdAt: new Date()
    };
    
    const docRef = await db.collection('gifts').add(giftData);
    res.status(201).json({ id: docRef.id, ...giftData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 