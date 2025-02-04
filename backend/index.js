const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { spawn } = require('child_process');
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

//ML
app.post('/api/data', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hola, ${name}. Datos recibidos correctamente.` });
});

app.get('/api/test-ml', (req, res) => {
  const pythonPath = "C:\\Users\\DELL\\anaconda3\\envs\\ml_env\\python.exe";

  const pythonProcess = spawn(pythonPath, ["test_ml.py"]);

  
  let output = '';
  pythonProcess.stdout.on('data', (data) => output += data);
  pythonProcess.stderr.on('data', (data) => console.error(data.toString()));
  pythonProcess.on('close', () => res.send(output));
});

app.get('/api/predictions/:playerName', async (req, res) => {
  const playerName = req.params.playerName;

  const pythonProcess = spawn('C:\\Users\\DELL\\anaconda3\\envs\\ml_env\\python.exe', ['test_ml.py', playerName]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString(); // Concatenar la salida
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error('Error en test_ml.py (stderr):', data.toString()); // Mostrar errores del script
  });

  pythonProcess.on('close', (code) => {
    console.log('Salida del script Python:', output); // Log para inspeccionar la salida
    console.log('Código de salida:', code); // Ver si hay errores de ejecución

    try {
      const parsedOutput = JSON.parse(output.trim()); // Intentar parsear el JSON
      res.json(parsedOutput); // Enviar JSON al cliente
    } catch (err) {
      console.error('Error al parsear JSON:', err.message);
      res.status(500).json({
        error: 'Error procesando las predicciones',
        details: output.trim() // Enviar salida cruda para depurar
      });
    }
  });
});




//ML

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

// Nuevo endpoint para inicializar tiempos por defecto
app.post('/api/init-tiempos/:playerName', async (req, res) => {
  const { playerName } = req.params;
  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    await tiemposRef.set({
      nivel1: {
        numeros: 10,
        vocales: 10,
        figuras: 10,
        animales: 10,
        colores: 10
      },
      nivel2: {
        'animales-numeros': 10,
        'animales-vocales': 10,
        'colores-formas': 10
      },
      nivel3: {
        patitos: 10,
        cerditos: 10
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Tiempos inicializados correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al inicializar tiempos' });
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

/*
// Endpoint para guardar el progreso del jugador
app.put('/api/progress/:name', async (req, res) => {
  const playerName = req.params.name; // Nombre del jugador
  const { progress } = req.body;

  if (!progress) {
    return res.status(400).json({ error: 'El progreso es obligatorio.' });
  }

  try {
    // Buscar el documento en la colección `progress` por nombre del jugador
    const progressRef = db.collection('progress');
    const querySnapshot = await progressRef.where('playerName', '==', playerName).get();

    if (querySnapshot.empty) {
      // Crear un nuevo documento si no existe
      await db.collection('progress').add({
        playerName,
        progress,
      });
      res.status(200).json({ message: 'Progreso guardado correctamente.' });
    } else {
      // Actualizar el documento existente
      const docId = querySnapshot.docs[0].id;
      await db.collection('progress').doc(docId).update({ progress });
      res.status(200).json({ message: 'Progreso actualizado correctamente.' });
    }
  } catch (error) {
    console.error('Error al guardar el progreso:', error);
    res.status(500).json({ error: 'Error al guardar el progreso.' });
  }
});
*/

app.put('/api/progress/:name', async (req, res) => {
 const playerName = req.params.name;
 const { progress } = req.body;

 if (!progress) {
   return res.status(400).json({ error: 'El progreso es obligatorio.' });
 }

 try {
   const progressRef = db.collection('progress').doc(playerName);
   const doc = await progressRef.get();

   if (!doc.exists) {
     await progressRef.set({
       playerName,
       progress,
       updatedAt: admin.firestore.FieldValue.serverTimestamp()
     });
   } else {
     await progressRef.update({ 
       progress,
       updatedAt: admin.firestore.FieldValue.serverTimestamp()  
     });
   }

   res.status(200).json({ success: true, message: 'Progreso actualizado correctamente.' });
 } catch (error) {
   console.error('Error al guardar progreso:', error);
   res.status(500).json({ success: false, error: 'Error al guardar el progreso.' });
 }
});

/*
// Endpoint para guardar los detalles del juego en Firestore
app.put('/api/game-details', async (req, res) => {
  const { playerName, details, section } = req.body;

  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'El nombre del jugador, los detalles y la sección son obligatorios.' });
  }

  try {
    const playerDocId = `player_${playerName}`;
    const playerRef = db.collection('gameDetails').doc(playerDocId);

    // Obtener el documento actual si existe
    const doc = await playerRef.get();
    let existingData = {};

    if (doc.exists) {
      existingData = doc.data();
    } else {
      console.log(`Creando un nuevo documento para el jugador: ${playerName}`);
    }

    // Fusionar los detalles nuevos con los existentes en la sección específica
    const updatedSection = { ...existingData[section] };

    Object.entries(details).forEach(([key, value]) => {
      const existingDetails = updatedSection[key] || { errors: 0, time: 0, completed: false };

      updatedSection[key] = {
        errors: value.errors,
        time: value.time,
        completed: value.errors === 0,
      };
    });

    // Calcular los totales para la sección específica
    const totalErrors = Object.values(updatedSection).reduce(
      (sum, item) => (item.errors !== undefined ? sum + item.errors : sum),
      0
    );
    const totalTime = Object.values(updatedSection).reduce(
      (sum, item) => (item.time !== undefined ? sum + item.time : sum),
      0
    );

    // Guardar la sección actualizada y sus totales
    await playerRef.set(
      {
        playerName,
        [section]: { ...updatedSection, totalErrors, totalTime },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.status(200).json({ message: `Detalles del juego para la sección "${section}" guardados correctamente.` });
  } catch (error) {
    console.error('Error al guardar los detalles:', error);
    res.status(500).json({ error: 'Error al guardar los detalles en la base de datos.' });
  }
});

*/


app.put('/api/game-details-numeros', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {

    // Obtener tiempo del temporizador de la colección tiempos
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel1?.numeros || 10 : 10;

    const playerRef = db.collection('gameDetailsNumeros').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastNumberInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const numberOrder = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const targetNumber = Object.keys(details)[0];
    const targetNumberIndex = numberOrder.indexOf(targetNumber);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastNumberInAttempt = currentData[section].lastNumberInAttempt;

    // Asegurarnos que el intento actual existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          cero: null,
          uno: null,
          dos: null,
          tres: null,
          cuatro: null,
          cinco: null,
          seis: null,
          siete: null,
          ocho: null,
          nueve: null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];

    // Si es un nuevo intento con cero y el anterior está completo
    if (targetNumber === 'cero' && lastNumberInAttempt >= 0) {
      const attemptComplete = Object.values(currentAttemptData.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );

      if (attemptComplete) {
        currentAttempt++;
        lastNumberInAttempt = -1;
        
        // Inicializar nuevo intento
        currentData[section].attempts[`attempt_${currentAttempt}`] = {
          details: {
            cero: null,
            uno: null,
            dos: null,
            tres: null,
            cuatro: null,
            cinco: null,
            seis: null,
            siete: null,
            ocho: null,
            nueve: null
          },
          timestamp: new Date(),
          totalErrors: 0,
          totalTime: 0,
          completed: false
        };
      }
    }

    // Validar que no se salte números en la secuencia
    if (targetNumberIndex > lastNumberInAttempt + 1 && targetNumberIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar números en la secuencia'
      });
    }

    // Actualizar detalles
    const updatedDetails = {
      ...currentData[section].attempts[`attempt_${currentAttempt}`].details,
      [targetNumber]: Object.values(details)[0]
    };

    // Calcular totales
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si está completo (incluye timeout)
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    // Actualizar el intento actual
    currentData[section].attempts[`attempt_${currentAttempt}`] = {
      details: updatedDetails,
      timestamp: new Date(),
      totalErrors: totalErrors,
      totalTime: totalTime,
      completed: isComplete,
      timerValue: timerValue
    };

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: currentData[section].attempts,
        currentAttempt: currentAttempt,
        lastNumberInAttempt: targetNumberIndex
      }
    };

    // Actualizar el documento con merge
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});

app.put('/api/game-details-vocales', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Obtener tiempo del temporizador
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel1?.vocales || 10 : 10;

    const playerRef = db.collection('gameDetailsVocales').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastVocalInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const vocalOrder = ['a', 'e', 'i', 'o', 'u'];
    const targetVocal = Object.keys(details)[0];
    const targetVocalIndex = vocalOrder.indexOf(targetVocal);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastVocalInAttempt = currentData[section].lastVocalInAttempt;
    
    // Solo crear nuevo intento si:
    // 1. La vocal es 'a'
    // 2. El intento anterior existe y está completo
    if (targetVocal === 'a') {
      const previousAttempt = currentData[section].attempts[`attempt_${currentAttempt}`];
      if (previousAttempt && previousAttempt.completed) {
        currentAttempt++;
        lastVocalInAttempt = -1;
      }
    }

    // Validar que no se salte vocales en la secuencia
    if (targetVocalIndex > lastVocalInAttempt + 1 && targetVocalIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar vocales en la secuencia'
      });
    }

    // Inicializar el attempt si no existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          a: null,
          e: null,
          i: null,
          o: null,
          u: null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    
    // Calcular totales y actualizar datos
    let totalErrors = 0;
    let totalTime = 0;
    const updatedDetails = {
      ...currentAttemptData.details,
      [targetVocal]: Object.values(details)[0]
    };

    // Calcular totales del intento actual
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si esta es la última vocal del intento (u)
    const isLastVocal = targetVocalIndex === 4;
    let isComplete = false;

    if (isLastVocal) {
      isComplete = vocalOrder.every(vocal => {
        const detail = updatedDetails[vocal];
        return detail && (detail.resultado === true || detail.resultado === false);
      });
    }

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: {
          ...currentData[section].attempts,
          [`attempt_${currentAttempt}`]: {
            details: updatedDetails,
            timestamp: new Date(),
            totalErrors: totalErrors,
            totalTime: totalTime,
            completed: isComplete,
            timerValue: timerValue
          }
        },
        currentAttempt: currentAttempt,
        lastVocalInAttempt: targetVocalIndex
      }
    };

    // Actualizar el documento
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});

app.put('/api/game-details-figuras', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel1?.figuras || 10 : 10;

    const playerRef = db.collection('gameDetailsFiguras').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastFigureInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const figureOrder = ['circulo', 'cuadrado', 'triangulo', 'rombo', 'estrella', 'corazon', 'luna'];
    const targetFigure = Object.keys(details)[0];
    const targetFigureIndex = figureOrder.indexOf(targetFigure);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastFigureInAttempt = currentData[section].lastFigureInAttempt;

    // Obtener el intento actual o crear uno nuevo si no existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          circulo: null,
          cuadrado: null,
          triangulo: null,
          rombo: null,
          estrella: null,
          corazon: null,
          luna: null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    
    // Si es un nuevo intento con 'circulo' y el anterior está completo
    if (targetFigure === 'circulo' && lastFigureInAttempt >= 0) {
      const attemptComplete = figureOrder.every(fig => {
        const detail = currentAttemptData.details[fig];
        return detail && (detail.resultado === true || detail.resultado === false);
      });

      if (attemptComplete) {
        currentAttempt++;
        lastFigureInAttempt = -1;
        
        // Inicializar nuevo intento
        currentData[section].attempts[`attempt_${currentAttempt}`] = {
          details: {
            circulo: null,
            cuadrado: null,
            triangulo: null,
            rombo: null,
            estrella: null,
            corazon: null,
            luna: null
          },
          timestamp: new Date(),
          totalErrors: 0,
          totalTime: 0,
          completed: false
        };
      }
    }

    // Verificar que la figura sigue la secuencia
    if (targetFigureIndex > lastFigureInAttempt + 1 && targetFigureIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar figuras en la secuencia'
      });
    }

    // Actualizar los detalles de la figura actual
    const updatedDetails = {
      ...currentData[section].attempts[`attempt_${currentAttempt}`].details,
      [targetFigure]: Object.values(details)[0]
    };

    // Calcular totales incluyendo el resultado actual
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Un intento está completo cuando todas las figuras tienen un resultado
    const isComplete = figureOrder.every(fig => {
      const detail = updatedDetails[fig];
      return detail && (detail.resultado === true || detail.resultado === false);
    });

    // Actualizar los datos del intento actual
    currentData[section].attempts[`attempt_${currentAttempt}`] = {
      details: updatedDetails,
      timestamp: new Date(),
      totalErrors: totalErrors,
      totalTime: totalTime,
      completed: isComplete,
      timerValue: timerValue
    };

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: currentData[section].attempts,
        currentAttempt: currentAttempt,
        lastFigureInAttempt: targetFigureIndex
      }
    };

    // Actualizar el documento
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});

app.put('/api/game-details-animales', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Obtener tiempo del temporizador
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel1?.animales || 10 : 10;

    const playerRef = db.collection('gameDetailsAnimales').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastAnimalInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const animalOrder = ['pajaro', 'tortuga', 'cerdo', 'pato', 'mariposa', 'pollito', 'gato', 'perro', 'oveja', 'abeja', 'elefante', 'iguana', 'oso', 'unicornio'];
    const targetAnimal = Object.keys(details)[0];
    const targetAnimalIndex = animalOrder.indexOf(targetAnimal);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastAnimalInAttempt = currentData[section].lastAnimalInAttempt;

    // Asegurarnos que el intento actual existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          pajaro: null,
          tortuga: null,
          cerdo: null,
          pato: null,
          mariposa: null,
          pollito: null,
          gato: null,
          perro: null,
          oveja: null,
          abeja: null,
          elefante: null,
          iguana: null,
          oso: null,
          unicornio: null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];

    // Si es un nuevo intento con pajaro y el anterior está completo
    if (targetAnimal === 'pajaro' && lastAnimalInAttempt >= 0) {
      const attemptComplete = Object.values(currentAttemptData.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );

      if (attemptComplete) {
        currentAttempt++;
        lastAnimalInAttempt = -1;
        
        // Inicializar nuevo intento
        currentData[section].attempts[`attempt_${currentAttempt}`] = {
          details: {
            pajaro: null,
            tortuga: null,
            cerdo: null,
            pato: null,
            mariposa: null,
            pollito: null,
            gato: null,
            perro: null,
            oveja: null,
            abeja: null,
            elefante: null,
            iguana: null,
            oso: null,
            unicornio: null
          },
          timestamp: new Date(),
          totalErrors: 0,
          totalTime: 0,
          completed: false
        };
      }
    }

    // Validar que no se salten animales en la secuencia
    if (targetAnimalIndex > lastAnimalInAttempt + 1 && targetAnimalIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar animales en la secuencia'
      });
    }

    // Actualizar detalles
    const updatedDetails = {
      ...currentData[section].attempts[`attempt_${currentAttempt}`].details,
      [targetAnimal]: Object.values(details)[0]
    };

    // Calcular totales
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si está completo (incluye timeout)
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    // Actualizar el intento actual
    currentData[section].attempts[`attempt_${currentAttempt}`] = {
      details: updatedDetails,
      timestamp: new Date(),
      totalErrors: totalErrors,
      totalTime: totalTime,
      completed: isComplete,
      timerValue: timerValue
    };

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: currentData[section].attempts,
        currentAttempt: currentAttempt,
        lastAnimalInAttempt: targetAnimalIndex
      }
    };

    // Actualizar el documento con merge
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});

app.put('/api/game-details-colores', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel1?.colores || 10 : 10;

    const playerRef = db.collection('gameDetailsColores').doc(playerName);
    
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastColorInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const colorOrder = ['celeste', 'verde', 'rosado', 'amarillo', 'morado', 'gris', 'rojo', 'marron', 'anaranjado', 'azul'];
    const targetColor = Object.keys(details)[0];
    const targetColorIndex = colorOrder.indexOf(targetColor);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastColorInAttempt = currentData[section].lastColorInAttempt;

    // Asegurarnos que el intento actual existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          celeste: null,
          verde: null,
          rosado: null,
          amarillo: null,
          morado: null,
          gris: null,
          rojo: null,
          marron: null,
          anaranjado: null,
          azul: null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];

    // Si es un nuevo intento con celeste y el anterior está completo
    if (targetColor === 'celeste' && lastColorInAttempt >= 0) {
      const attemptComplete = Object.values(currentAttemptData.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );

      if (attemptComplete) {
        currentAttempt++;
        lastColorInAttempt = -1;
        
        // Inicializar nuevo intento
        currentData[section].attempts[`attempt_${currentAttempt}`] = {
          details: {
            celeste: null,
            verde: null,
            rosado: null,
            amarillo: null,
            morado: null,
            gris: null,
            rojo: null,
            marron: null,
            anaranjado: null,
            azul: null
          },
          timestamp: new Date(),
          totalErrors: 0,
          totalTime: 0,
          completed: false
        };
      }
    }

    // Validar que no se salte colores en la secuencia
    if (targetColorIndex > lastColorInAttempt + 1 && targetColorIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar colores en la secuencia'
      });
    }

    // Actualizar detalles
    const updatedDetails = {
      ...currentData[section].attempts[`attempt_${currentAttempt}`].details,
      [targetColor]: Object.values(details)[0]
    };

    // Calcular totales
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si está completo (incluye timeout)
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    // Actualizar el intento actual
    currentData[section].attempts[`attempt_${currentAttempt}`] = {
      details: updatedDetails,
      timestamp: new Date(),
      totalErrors: totalErrors,
      totalTime: totalTime,
      completed: isComplete,
      timerValue: timerValue
    };

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: currentData[section].attempts,
        currentAttempt: currentAttempt,
        lastColorInAttempt: targetColorIndex
      }
    };

    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});


app.put('/api/game-details-animales-numeros', async (req, res) => {
  const { playerName, details, section } = req.body;
  
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Obtener tiempo del temporizador
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel2?.['animales-numeros'] || 10 : 10;

    const playerRef = db.collection('gameDetailsAnimalesNumeros').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastAnimalInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const animalOrder = [
      { nombre: 'pájaro', numero: 1 },
      { nombre: 'tortuga', numero: 2 },
      { nombre: 'cerdo', numero: 3 },
      { nombre: 'pato', numero: 4 },
      { nombre: 'mariposa', numero: 5 },
      { nombre: 'pollito', numero: 6 },
      { nombre: 'gato', numero: 7 },
      { nombre: 'perro', numero: 8 },
      { nombre: 'oveja', numero: 9 }
    ];
    
    const targetAnimal = Object.keys(details)[0];
    const targetAnimalIndex = animalOrder.findIndex(animal => animal.nombre === targetAnimal);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastAnimalInAttempt = currentData[section].lastAnimalInAttempt;

    // Asegurarnos que el intento actual existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          'pájaro': null,
          'tortuga': null,
          'cerdo': null,
          'pato': null,
          'mariposa': null,
          'pollito': null,
          'gato': null,
          'perro': null,
          'oveja': null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];

    // Si es un nuevo intento con pájaro y el anterior está completo
    if (targetAnimal === 'pájaro' && lastAnimalInAttempt >= 0) {
      const attemptComplete = Object.values(currentAttemptData.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );

      if (attemptComplete) {
        currentAttempt++;
        lastAnimalInAttempt = -1;
        
        // Inicializar nuevo intento
        currentData[section].attempts[`attempt_${currentAttempt}`] = {
          details: {
            'pájaro': null,
            'tortuga': null,
            'cerdo': null,
            'pato': null,
            'mariposa': null,
            'pollito': null,
            'gato': null,
            'perro': null,
            'oveja': null
          },
          timestamp: new Date(),
          totalErrors: 0,
          totalTime: 0,
          completed: false
        };
      }
    }

    // Validar secuencia
    if (targetAnimalIndex > lastAnimalInAttempt + 1 && targetAnimalIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar animales en la secuencia'
      });
    }

    // Actualizar detalles
    const updatedDetails = {
      ...currentData[section].attempts[`attempt_${currentAttempt}`].details,
      [targetAnimal]: details[targetAnimal]
    };

    // Recalcular totales desde cero usando todos los detalles
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        // Para errors, acumulamos todos los errores registrados
        totalErrors += detail.errors || 0;
        // Para time, sumamos el tiempo de cada intento
        totalTime += detail.time || 0;
      }
    });

    // Verificar si está completo (incluye timeout)
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    // Actualizar el intento actual
    currentData[section].attempts[`attempt_${currentAttempt}`] = {
      details: updatedDetails,
      timestamp: new Date(),
      totalErrors: totalErrors,
      totalTime: totalTime,
      completed: isComplete,
      timerValue: timerValue
    };

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: currentData[section].attempts,
        currentAttempt: currentAttempt,
        lastAnimalInAttempt: targetAnimalIndex
      }
    };

    // Actualizar el documento con merge
    await playerRef.set(updateData, { merge: true });

    res.json({
      success: true,
      message: 'Detalles guardados correctamente'
    });

  } catch (error) {
    console.error('Error al guardar detalles:', error);
    res.status(500).json({
      success: false,
      error: 'Error al guardar los detalles del juego'
    });
  }
});

app.put('/api/game-details-animales-vocales', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel2?.['animales-vocales'] || 10 : 10;

    const playerRef = db.collection('gameDetailsAnimalesVocales').doc(playerName);
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastVocalInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const vocalOrder = ['abeja', 'elefante', 'iguana', 'oso', 'unicornio'];
    const targetAnimal = Object.keys(details)[0];
    const targetAnimalIndex = vocalOrder.indexOf(targetAnimal);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastVocalInAttempt = currentData[section].lastVocalInAttempt;

    // Asegurarnos que el intento actual existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          abeja: null,
          elefante: null,
          iguana: null,
          oso: null,
          unicornio: null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];

    // Si es un nuevo intento con abeja y el anterior está completo
    if (targetAnimal === 'abeja' && lastVocalInAttempt >= 0) {
      const attemptComplete = Object.values(currentAttemptData.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );

      if (attemptComplete) {
        currentAttempt++;
        lastVocalInAttempt = -1;
        
        // Inicializar nuevo intento
        currentData[section].attempts[`attempt_${currentAttempt}`] = {
          details: {
            abeja: null,
            elefante: null,
            iguana: null,
            oso: null,
            unicornio: null
          },
          timestamp: new Date(),
          totalErrors: 0,
          totalTime: 0,
          completed: false
        };
      }
    }

    // Validar que no se salten animales en la secuencia
    if (targetAnimalIndex > lastVocalInAttempt + 1 && targetAnimalIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar animales en la secuencia'
      });
    }

    // Actualizar detalles
    const updatedDetails = {
      ...currentData[section].attempts[`attempt_${currentAttempt}`].details,
      [targetAnimal]: Object.values(details)[0]
    };

    // Calcular totales
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si está completo
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    // Actualizar el intento actual
    currentData[section].attempts[`attempt_${currentAttempt}`] = {
      details: updatedDetails,
      timestamp: new Date(),
      totalErrors: totalErrors,
      totalTime: totalTime,
      completed: isComplete,
      timerValue: timerValue
    };

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: currentData[section].attempts,
        currentAttempt: currentAttempt,
        lastVocalInAttempt: targetAnimalIndex
      }
    };

    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});

app.put('/api/game-details-colores-formas', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel2?.['colores-formas'] || 10 : 10;

    const playerRef = db.collection('gameDetailsColoresFormas').doc(playerName);
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0,
        lastShapeInAttempt: -1,
        timerConfig: timerValue
      };
    }

    const shapeOrder = [
      'circulo-verde',
      'cuadrado-rosado',
      'estrella-amarillo',
      'triangulo-morado',
      'corazon-rojo',
      'rombo-anaranjado',
      'luna-azul'
    ];
    
    const targetShape = Object.keys(details)[0];
    const targetShapeIndex = shapeOrder.indexOf(targetShape);
    
    let currentAttempt = currentData[section].currentAttempt;
    let lastShapeInAttempt = currentData[section].lastShapeInAttempt;

    // Asegurarnos que el intento actual existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          'circulo-verde': null,
          'cuadrado-rosado': null,
          'estrella-amarillo': null,
          'triangulo-morado': null,
          'corazon-rojo': null,
          'rombo-anaranjado': null,
          'luna-azul': null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];

    // Si es un nuevo intento con circulo-verde y el anterior está completo
    if (targetShape === 'circulo-verde' && lastShapeInAttempt >= 0) {
      const attemptComplete = Object.values(currentAttemptData.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );

      if (attemptComplete) {
        currentAttempt++;
        lastShapeInAttempt = -1;
        
        // Inicializar nuevo intento
        currentData[section].attempts[`attempt_${currentAttempt}`] = {
          details: {
            'circulo-verde': null,
            'cuadrado-rosado': null,
            'estrella-amarillo': null,
            'triangulo-morado': null,
            'corazon-rojo': null,
            'rombo-anaranjado': null,
            'luna-azul': null
          },
          timestamp: new Date(),
          totalErrors: 0,
          totalTime: 0,
          completed: false
        };
      }
    }

    // Validar secuencia
    if (targetShapeIndex > lastShapeInAttempt + 1 && targetShapeIndex !== 0) {
      return res.status(400).json({
        success: false,
        error: 'No se pueden saltar formas en la secuencia'
      });
    }

    // Actualizar detalles
    const updatedDetails = {
      ...currentData[section].attempts[`attempt_${currentAttempt}`].details,
      [targetShape]: Object.values(details)[0]
    };

    // Calcular totales
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si está completo
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    // Actualizar el intento actual
    currentData[section].attempts[`attempt_${currentAttempt}`] = {
      details: updatedDetails,
      timestamp: new Date(),
      totalErrors: totalErrors,
      totalTime: totalTime,
      completed: isComplete,
      timerValue: timerValue
    };

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: currentData[section].attempts,
        currentAttempt: currentAttempt,
        lastShapeInAttempt: targetShapeIndex
      }
    };

    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});

/*
// Endpoint para patitos
app.put('/api/game-details-patitos', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Obtener tiempo del temporizador
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel3.patitos || 10 : 10;

    const playerRef = db.collection('gameDetailsPatitos').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0
      };
    }

    const targetNumber = Object.keys(details)[0];
    let currentAttempt = currentData[section].currentAttempt;
    
    // Verificar si el intento anterior está completo antes de crear uno nuevo
    const previousAttempt = currentData[section].attempts[`attempt_${currentAttempt}`];
    if (previousAttempt) {
      const attemptComplete = Object.values(previousAttempt.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );
      
      if (attemptComplete) {
        // Si el intento anterior está completo, incrementar para empezar uno nuevo
        currentAttempt++;
      }
    }

    // Inicializar el attempt si no existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          '1': null, '2': null, '3': null, '4': null, '5': null,
          '6': null, '7': null, '8': null, '9': null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    
    // Calcular totales y actualizar datos
    let totalErrors = 0;
    let totalTime = 0;
    const updatedDetails = {
      ...currentAttemptData.details,
      [targetNumber]: Object.values(details)[0]
    };

    // Calcular totales del intento actual
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si este intento está completo
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: {
          ...currentData[section].attempts,
          [`attempt_${currentAttempt}`]: {
            details: updatedDetails,
            timestamp: new Date(),
            totalErrors: totalErrors,
            totalTime: totalTime,
            completed: isComplete,
            timerValue: timerValue
          }
        },
        currentAttempt: currentAttempt
      }
    };

    // Actualizar el documento
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});
*/

app.put('/api/game-details-patitos', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Obtener tiempo del temporizador
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel3.patitos || 10 : 10;

    const playerRef = db.collection('gameDetailsPatitos').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0
      };
    }

    let currentAttempt = currentData[section].currentAttempt;
    
    // Verificar si el intento actual existe y está completo
    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    if (currentAttemptData) {
      const attemptDetails = currentAttemptData.details;
      const isAttemptComplete = Object.keys(attemptDetails).length === 9;
      
      if (isAttemptComplete) {
        // Si el intento actual está completo, incrementar para crear uno nuevo
        currentAttempt++;
      }
    }

    // Inicializar el nuevo attempt si no existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {},
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    // Obtener los detalles del intento actual (que podría ser el nuevo)
    let attemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    
    // Crear una copia de los detalles actuales
    const updatedDetails = { ...attemptData.details };
    
    // Obtener el número del patito que se está actualizando
    const targetNumber = Object.keys(details)[0];
    const newDetail = details[targetNumber];

    // Verificar si el número ya existe y fue respondido correctamente
    const existingDetail = updatedDetails[targetNumber];
    if (existingDetail && existingDetail.resultado === true) {
      // Si el número ya fue respondido correctamente, no lo actualizamos
      return res.status(200).json({ 
        success: true, 
        message: 'El número ya fue respondido correctamente'
      });
    }

    // Actualizar solo el número específico
    updatedDetails[targetNumber] = newDetail;

    // Calcular totales
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si este intento está completo
    const isComplete = Object.keys(updatedDetails).length === 9;

    const updateData = {
      [section]: {
        attempts: {
          ...currentData[section].attempts,
          [`attempt_${currentAttempt}`]: {
            details: updatedDetails,
            timestamp: new Date(),
            totalErrors,
            totalTime,
            completed: isComplete,
            timerValue
          }
        },
        currentAttempt
      }
    };

    // Actualizar el documento
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});
/*
// Endpoint para cerditos
app.put('/api/game-details-cerditos', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Obtener tiempo del temporizador
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel3.cerditos || 10 : 10;

    const playerRef = db.collection('gameDetailsCerditos').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0
      };
    }

    const targetNumber = Object.keys(details)[0];
    let currentAttempt = currentData[section].currentAttempt;
    
    // Verificar si el intento anterior está completo antes de crear uno nuevo
    const previousAttempt = currentData[section].attempts[`attempt_${currentAttempt}`];
    if (previousAttempt) {
      const attemptComplete = Object.values(previousAttempt.details).every(detail => 
        detail && (detail.resultado === true || detail.resultado === false)
      );
      
      if (attemptComplete) {
        // Si el intento anterior está completo, incrementar para empezar uno nuevo
        currentAttempt++;
      }
    }

    // Inicializar el attempt si no existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {
          '1': null, '2': null, '3': null, '4': null, '5': null,
          '6': null, '7': null, '8': null, '9': null
        },
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    
    // Calcular totales y actualizar datos
    let totalErrors = 0;
    let totalTime = 0;
    const updatedDetails = {
      ...currentAttemptData.details,
      [targetNumber]: Object.values(details)[0]
    };

    // Calcular totales del intento actual
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si este intento está completo
    const isComplete = Object.values(updatedDetails).every(detail => 
      detail && (detail.resultado === true || detail.resultado === false)
    );

    const updateData = {
      [section]: {
        ...currentData[section],
        attempts: {
          ...currentData[section].attempts,
          [`attempt_${currentAttempt}`]: {
            details: updatedDetails,
            timestamp: new Date(),
            totalErrors: totalErrors,
            totalTime: totalTime,
            completed: isComplete,
            timerValue: timerValue
          }
        },
        currentAttempt: currentAttempt
      }
    };

    // Actualizar el documento
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});
*/

app.put('/api/game-details-cerditos', async (req, res) => {
  const { playerName, details, section } = req.body;
  if (!playerName || !details || !section) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  
  try {
    // Obtener tiempo del temporizador
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const tiemposDoc = await tiemposRef.get();
    const timerValue = tiemposDoc.exists ? tiemposDoc.data()?.nivel3.cerditos || 10 : 10;

    const playerRef = db.collection('gameDetailsCerditos').doc(playerName);
    
    // Obtener el documento actual
    const doc = await playerRef.get();
    let currentData = doc.exists ? doc.data() : {};
    
    // Inicializar la estructura si no existe
    if (!currentData[section]) {
      currentData[section] = {
        attempts: {},
        currentAttempt: 0
      };
    }

    let currentAttempt = currentData[section].currentAttempt;
    
    // Verificar si el intento actual existe y está completo
    const currentAttemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    if (currentAttemptData) {
      const attemptDetails = currentAttemptData.details;
      const isAttemptComplete = Object.keys(attemptDetails).length === 9;
      
      if (isAttemptComplete) {
        // Si el intento actual está completo, incrementar para crear uno nuevo
        currentAttempt++;
      }
    }

    // Inicializar el nuevo attempt si no existe
    if (!currentData[section].attempts[`attempt_${currentAttempt}`]) {
      currentData[section].attempts[`attempt_${currentAttempt}`] = {
        details: {},
        timestamp: new Date(),
        totalErrors: 0,
        totalTime: 0,
        completed: false
      };
    }

    // Obtener los detalles del intento actual (que podría ser el nuevo)
    let attemptData = currentData[section].attempts[`attempt_${currentAttempt}`];
    
    // Crear una copia de los detalles actuales
    const updatedDetails = { ...attemptData.details };
    
    // Obtener el número del cerdito que se está actualizando
    const targetNumber = Object.keys(details)[0];
    const newDetail = details[targetNumber];

    // Verificar si el número ya existe y fue respondido correctamente
    const existingDetail = updatedDetails[targetNumber];
    if (existingDetail && existingDetail.resultado === true) {
      // Si el número ya fue respondido correctamente, no lo actualizamos
      return res.status(200).json({ 
        success: true, 
        message: 'El número ya fue respondido correctamente'
      });
    }

    // Actualizar solo el número específico
    updatedDetails[targetNumber] = newDetail;

    // Calcular totales
    let totalErrors = 0;
    let totalTime = 0;
    Object.values(updatedDetails).forEach(detail => {
      if (detail) {
        totalErrors += detail.errors || 0;
        totalTime += detail.time || 0;
      }
    });

    // Verificar si este intento está completo
    const isComplete = Object.keys(updatedDetails).length === 9;

    const updateData = {
      [section]: {
        attempts: {
          ...currentData[section].attempts,
          [`attempt_${currentAttempt}`]: {
            details: updatedDetails,
            timestamp: new Date(),
            totalErrors,
            totalTime,
            completed: isComplete,
            timerValue
          }
        },
        currentAttempt
      }
    };

    // Actualizar el documento
    await playerRef.set(updateData, { merge: true });

    res.status(200).json({ 
      success: true, 
      message: 'Datos guardados exitosamente'
    });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los datos'
    });
  }
});

/*
// Endpoint para guardar tiempos configurados
app.put('/api/tiempos/:playerName', async (req, res) => {
  const playerName = req.params.playerName;
  const { tiemposNivel1, tiemposNivel2, tiemposNivel3 } = req.body;

  if (!playerName) {
    return res.status(400).json({ error: 'Nombre del jugador requerido' });
  }

  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    
    const tiemposData = {
      nivel1: tiemposNivel1 || {},
      nivel2: tiemposNivel2 || {},
      nivel3: tiemposNivel3 || {},
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await tiemposRef.set(tiemposData, { merge: true });

    res.json({ 
      success: true, 
      message: 'Tiempos actualizados correctamente',
      data: tiemposData
    });

  } catch (error) {
    console.error('Error al guardar tiempos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al guardar los tiempos' 
    });
  }
});

// Endpoint para obtener tiempos configurados
app.get('/api/tiempos/:playerName', async (req, res) => {
  const playerName = req.params.playerName;

  if (!playerName) {
    return res.status(400).json({ error: 'Nombre del jugador requerido' });
  }

  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const doc = await tiemposRef.get();

    if (!doc.exists) {
      return res.json({
        success: true,
        data: {
          nivel1: {
            numeros: 10,
            vocales: 10,
            figuras: 10,
            animales: 10,
            colores: 10
          },
          nivel2: {
            'animales-numeros': 10,
            'animales-vocales': 10,
            'colores-formas': 10
          },
          nivel3: {
            patitos: 10,
            cerditos: 10
          }
        }
      });
    }

    res.json({ 
      success: true, 
      data: doc.data() 
    });

  } catch (error) {
    console.error('Error al obtener tiempos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener los tiempos' 
    });
  }
});*/

// Endpoints para tiempos


app.put('/api/tiempos/:playerName', async (req, res) => {
  const { playerName } = req.params;
  const { tiemposNivel1, tiemposNivel2, tiemposNivel3 } = req.body;

  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    await tiemposRef.set({
      nivel1: tiemposNivel1,
      nivel2: tiemposNivel2,
      nivel3: tiemposNivel3,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Error al guardar tiempos' });
  }
});

app.get('/api/tiempos/:playerName', async (req, res) => {
  const { playerName } = req.params;

  try {
    const tiemposRef = db.collection('tiempos').doc(playerName);
    const doc = await tiemposRef.get();
    res.json({ success: true, data: doc.exists ? doc.data() : null });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Error al obtener tiempos' });
  }
});

app.post('/api/esp32/upload', async (req, res) => {
  try {
    const { object_count } = req.body;

    if (!object_count) {
      return res.status(400).json({ error: 'No se recibieron datos válidos.' });
    }

    // Guardar o actualizar datos en Firestore en el documento "animalitos"
    await db.collection('esp32').doc('animalitos').set({
      object_count,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Datos guardados en el documento "animalitos"' });
  } catch (error) {
    console.error('Error al guardar datos en Firestore:', error);
    res.status(500).json({ error: 'Error al guardar datos en Firestore.' });
  }
});

app.get('/api/esp32/counts', async (req, res) => {
  try {
    const docRef = db.collection('esp32').doc('animalitos');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const data = docSnap.data();
    res.json(data.object_count); // Solo enviamos los conteos de cerditos y patitos
  } catch (error) {
    console.error('Error obteniendo los datos de Firestore:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
