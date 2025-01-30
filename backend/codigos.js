const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Permite solo este origen
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos
  next();
});


app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON
app.use(express.static('public')); // Servir archivos estáticos (HTML, JS)

// Variable para almacenar los datos recibidos
let receivedData = { cardID: 'Desconocido' }; // Inicializa con un valor por defecto

// Ruta para manejar solicitudes GET en la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API. Usa POST para enviar datos.'); // Respuesta para GET
});

// Ruta para recibir el UID del ESP32
app.post('/', (req, res) => {
  console.log('Datos recibidos:', req.body);
  receivedData.cardID = req.body.cardID || 'Desconocido'; // Almacena el cardID recibido

  res.status(200).send('UID recibido'); // Responde al ESP32
});

// Ruta para obtener datos
app.get('/data', (req, res) => {
  res.json(receivedData); // Devuelve los datos recibidos
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});