const express = require('express');
const router = express.Router();
const { auth } = require('../config/firebase');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión con número de teléfono
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Token JWT generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Error de autenticación
 */
router.post('/login', async (req, res) => {
  try {
    const { phone, verificationCode } = req.body;
    
    // Verificar el código OTP con Firebase
    const credential = await auth.signInWithPhoneNumber(phone, verificationCode);
    const user = credential.user;
    
    // Generar token JWT
    const token = await user.getIdToken();
    
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router; 