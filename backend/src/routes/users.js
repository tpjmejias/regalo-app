const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { cleanPhoneNumber } = require('../utils/phoneUtils');

/**
 * @swagger
 * /api/users/{phone}/icon:
 *   put:
 *     summary: Actualiza el ícono de perfil del usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de teléfono del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iconId
 *             properties:
 *               iconId:
 *                 type: string
 *                 description: ID del ícono seleccionado
 *     responses:
 *       200:
 *         description: Ícono actualizado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:phone/icon', async (req, res) => {
  try {
    const cleanedPhone = cleanPhoneNumber(req.params.phone);
    const { iconId } = req.body;

    if (!cleanedPhone) {
      return res.status(400).json({ error: 'Número de teléfono inválido' });
    }

    if (!iconId) {
      return res.status(400).json({ error: 'Se requiere el ID del ícono' });
    }

    // Actualizar o crear el documento del usuario
    await db.collection('users').doc(cleanedPhone).set({
      iconId,
      updatedAt: new Date()
    }, { merge: true });
    
    res.json({ message: 'Ícono actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el ícono:', error);
    res.status(500).json({ error: 'Error al actualizar el ícono' });
  }
});

/**
 * @swagger
 * /api/users/{phone}/theme:
 *   put:
 *     summary: Actualiza el tema de color del usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de teléfono del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - themeId
 *             properties:
 *               themeId:
 *                 type: string
 *                 description: ID del tema seleccionado
 *     responses:
 *       200:
 *         description: Tema actualizado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:phone/theme', async (req, res) => {
  try {
    const cleanedPhone = cleanPhoneNumber(req.params.phone);
    const { themeId } = req.body;

    console.log('Updating theme for:', { cleanedPhone, themeId }); // Debug log

    if (!cleanedPhone) {
      return res.status(400).json({ error: 'Número de teléfono inválido' });
    }

    if (!themeId) {
      return res.status(400).json({ error: 'Se requiere el ID del tema' });
    }

    // Actualizar o crear el documento del usuario
    const userRef = db.collection('users').doc(cleanedPhone);
    await userRef.set({
      themeId,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log('Theme updated successfully'); // Debug log
    res.json({ message: 'Tema actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el tema:', error);
    res.status(500).json({ error: 'Error al actualizar el tema' });
  }
});

/**
 * @swagger
 * /api/users/{phone}:
 *   get:
 *     summary: Obtiene la información del usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de teléfono del usuario
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 phone:
 *                   type: string
 *                 iconId:
 *                   type: string
 *                 themeId:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:phone', async (req, res) => {
  try {
    const cleanedPhone = cleanPhoneNumber(req.params.phone);
    const userRef = db.collection('users').doc(cleanedPhone);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ phone: cleanedPhone, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 