const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

/**
 * @swagger
 * tags:
 *   name: Regalos
 *   description: Operaciones con lista de regalos
 */

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
 *       500:
 *         description: Error del servidor
 * 
 *   put:
 *     tags: [Regalos]
 *     summary: Actualizar visibilidad de la lista
 *     description: Actualiza si la lista de regalos es pública o privada
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de teléfono del usuario
 *         example: "+525512345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isPublic
 *             properties:
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Visibilidad actualizada exitosamente
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

router.put('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const { isPublic } = req.body;
    const userId = phone.replace(/\D/g, '');

    const giftsRef = db.collection('gifts');
    const snapshot = await giftsRef.where('userId', '==', userId).get();
    
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { isPublic });
    });
    
    await batch.commit();
    res.json({ message: 'Visibilidad actualizada exitosamente' });
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
 *               - name
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+525512345678"
 *               name:
 *                 type: string
 *                 example: "PlayStation 5"
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               image:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Regalo creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { phone, ...giftData } = req.body;
    
    if (!phone || !giftData.name) {
      return res.status(400).json({ error: 'Teléfono y nombre son requeridos' });
    }

    const userId = phone.replace(/\D/g, '');
    
    const gift = {
      ...giftData,
      userId,
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
 *   put:
 *     tags: [Regalos]
 *     summary: Actualizar un regalo
 *     description: Modifica los datos de un regalo específico
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
 *         description: ID del regalo
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
 *       404:
 *         description: Regalo no encontrado
 *       500:
 *         description: Error del servidor
 * 
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
 *         description: ID del regalo
 *     responses:
 *       200:
 *         description: Regalo eliminado exitosamente
 *       404:
 *         description: Regalo no encontrado
 *       500:
 *         description: Error del servidor
 */

router.put('/:phone/:giftId', async (req, res) => {
  try {
    const { phone, giftId } = req.params;
    const userId = phone.replace(/\D/g, '');
    
    const giftRef = db.collection('gifts').doc(giftId);
    const gift = await giftRef.get();
    
    if (!gift.exists || gift.data().userId !== userId) {
      return res.status(404).json({ error: 'Regalo no encontrado' });
    }
    
    await giftRef.update(req.body);
    
    const updatedGift = await giftRef.get();
    res.json({ id: giftId, ...updatedGift.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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