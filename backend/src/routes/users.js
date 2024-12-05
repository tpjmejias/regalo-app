const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Referencia a la colección de usuarios
const usersRef = admin.firestore().collection('users');

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
    const { phone } = req.params;
    const { iconId } = req.body;

    if (!iconId) {
      return res.status(400).json({ error: 'Se requiere el ID del ícono' });
    }

    // Actualizar o crear el documento del usuario
    await usersRef.doc(phone).set({
      iconId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
    const { phone } = req.params;
    const { themeId } = req.body;

    if (!themeId) {
      return res.status(400).json({ error: 'Se requiere el ID del tema' });
    }

    // Actualizar o crear el documento del usuario
    await usersRef.doc(phone).set({
      themeId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
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
    const { phone } = req.params;

    // Obtener el documento del usuario
    const userDoc = await usersRef.doc(phone).get();
    
    if (!userDoc.exists) {
      return res.json({
        phone,
        iconId: 'gift', // Valor por defecto
        themeId: 'pink-violet' // Valor por defecto
      });
    }

    const userData = userDoc.data();
    res.json({
      phone,
      iconId: userData.iconId || 'gift',
      themeId: userData.themeId || 'pink-violet'
    });
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
});

module.exports = router; 