const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

/**
 * @swagger
 * /api/gifts/{phone}:
 *   get:
 *     tags: [Regalos]
 *     summary: Obtener lista de regalos
 *     description: Obtiene todos los regalos asociados a un número de teléfono
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
 *                   userId:
 *                     type: string
 *                   url:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error del servidor
 */
router.get('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const userId = phone.replace(/\D/g, '');
    
    const giftsRef = db.collection('gifts');
    const snapshot = await giftsRef.where('userId', '==', userId).get();
    
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
 *     description: Crea un nuevo regalo asociado a un número de teléfono
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
 *                 example: "+525512345678"
 *               url:
 *                 type: string
 *                 example: "https://www.amazon.com/product"
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
 *                 userId:
 *                   type: string
 *                 url:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { phone, url } = req.body;
    
    if (!phone || !url) {
      return res.status(400).json({ error: 'Teléfono y URL son requeridos' });
    }

    const userId = phone.replace(/\D/g, '');
    
    const gift = {
      userId,
      url,
      createdAt: new Date()
    };
    
    const docRef = await db.collection('gifts').add(gift);
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
    
    const giftRef = db.collection('gifts').doc(giftId);
    const gift = await giftRef.get();
    
    if (!gift.exists || gift.data().userId !== userId) {
      return res.status(404).json({ error: 'Regalo no encontrado' });
    }
    
    await giftRef.delete();
    res.json({ message: 'Regalo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;