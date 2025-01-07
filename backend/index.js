const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB7StOzgmXT6M0bz7LoMbb1rr088NtjgXs",
  authDomain: "proyectohci-344bf.firebaseapp.com",
  projectId: "proyectohci-344bf",
  storageBucket: "proyectohci-344bf.firebasestorage.app",
  messagingSenderId: "864558651164",
  appId: "1:864558651164:web:deb475ae3c09b6237b0cd9",
  measurementId: "G-D4HTBZ58WJ"
};

/// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  }),
});

const db = admin.firestore(); // Referencia a Firestore

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.get('/', (req, res) => {
    res.send('¡Bienvenido al backend de proyectoHCI!');
});

app.post('/api/data', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hola, ${name}. Datos recibidos correctamente.` });
});

// Endpoint para guardar datos del usuario en Firestore
app.post('/api/register', async (req, res) => {
  const { name, gender, age, avatar } = req.body;
  try {
      const docRef = await db.collection('users').add({
          name,
          gender,
          age,
          avatar,
      });
      res.json({ message: `Usuario ${name} añadido correctamente con ID ${docRef.id}.` });
  } catch (error) {
      console.error('Error al guardar datos en Firestore:', error.message);
      res.status(500).json({ error: 'Error al guardar datos en Firebase Firestore.' });
  }
});

// Endpoint para obtener usuarios registrados en Firestore
app.get('/api/users', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).json({ error: `Error al obtener usuarios: ${error.message}` });
  }
});

// Endpoint para eliminar un jugador
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const userRef = db.collection('users').doc(userId);

    // Verificar si el usuario existe
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Eliminar el documento
    await userRef.delete();
    res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
});

// Endpoint para actualizar un jugador
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, age, gender, avatar } = req.body;

  if (!name || !age || !gender || !avatar) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const userRef = db.collection('users').doc(userId);

    // Verificar si el usuario existe
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Actualizar el documento
    await userRef.update({ name, age, gender, avatar });
    res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
