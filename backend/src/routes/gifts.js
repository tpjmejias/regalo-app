const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { cleanPhoneNumber } = require('../utils/phoneUtils');

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
    const cleanedPhone = cleanPhoneNumber(req.params.phone);
    const giftsRef = db.collection('users').doc(cleanedPhone).collection('gifts');
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
    const cleanedPhone = cleanPhoneNumber(phone);
    
    if (!cleanedPhone || !url) {
      return res.status(400).json({ error: 'Teléfono y URL son requeridos' });
    }

    const gift = {
      url,
      url_2: url_2 || null,
      createdAt: new Date()
    };
    
    const userRef = db.collection('users').doc(cleanedPhone);
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
    const cleanedPhone = cleanPhoneNumber(phone);
    
    const giftRef = db.collection('users')
      .doc(cleanedPhone)
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