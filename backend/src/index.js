const app = require('./app');
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
}); 