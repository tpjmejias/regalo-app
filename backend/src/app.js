const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const giftsRoutes = require('./routes/gifts');
const usersRoutes = require('./routes/users');
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para manejar preflight requests
app.options('*', cors());

app.use(express.json());

// Configuración de Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "API de Lista de Regalos"
}));

// Rutas
app.use('/api/gifts', giftsRoutes);
app.use('/api/users', usersRoutes);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Algo salió mal!' });
});

module.exports = app;