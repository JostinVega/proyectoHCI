import React, { useState, useEffect, useRef } from 'react';
import MensajesPrediccion from './MensajesPrediccion';
import MensajesPrediccionNivel3 from './MensajesPrediccionNivel3';

import patito from '../src/images/patito.png';
import cerdito from '../src/images/cerdito.png';

// Importar las imágenes de solución para números
import soluno from '../src/images/numero1.png';
import soldos from '../src/images/numero2.png';
import soltres from '../src/images/numero3.png';
import solcuatro from '../src/images/numero4.png';
import solcinco from '../src/images/numero5.png';
import solseis from '../src/images/numero6.png';
import solsiete from '../src/images/numero7.png';
import solocho from '../src/images/numero8.png';
import solnueve from '../src/images/numero9.png';

//Importar los audios de patitos
import patito1 from '../src/sounds/patitos/patito1.MP3';
import patito2 from '../src/sounds/patitos/patito2.MP3';
import patito3 from '../src/sounds/patitos/patito3.MP3';
import patito4 from '../src/sounds/patitos/patito4.MP3';
import patito5 from '../src/sounds/patitos/patito5.MP3';
import patito6 from '../src/sounds/patitos/patito6.MP3';
import patito7 from '../src/sounds/patitos/patito7.MP3';
import patito8 from '../src/sounds/patitos/patito8.MP3';
import patito9 from '../src/sounds/patitos/patito9.MP3';

//Importar los audios de cerditos
import cerdito1 from '../src/sounds/cerditos/cerdito1.MP3';
import cerdito2 from '../src/sounds/cerditos/cerdito2.MP3';
import cerdito3 from '../src/sounds/cerditos/cerdito3.MP3';
import cerdito4 from '../src/sounds/cerditos/cerdito4.MP3';
import cerdito5 from '../src/sounds/cerditos/cerdito5.MP3';
import cerdito6 from '../src/sounds/cerditos/cerdito6.MP3';
import cerdito7 from '../src/sounds/cerditos/cerdito7.MP3';
import cerdito8 from '../src/sounds/cerditos/cerdito8.MP3';
import cerdito9 from '../src/sounds/cerditos/cerdito9.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

const Nivel3 = ({ player, onBack, onConfigClick }) => {

  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [cantidadActual, setCantidadActual] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [cantidadesCompletadasPatitos, setCantidadesCompletadasPatitos] = useState([]);
  const [cantidadesCompletadasCerditos, setCantidadesCompletadasCerditos] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false); // Nuevo estado

  const [patitosStats, setPatitosStats] = useState({});
  const [cerditosStats, setCerditosStats] = useState({});
  
  const [tiempoInicio, setTiempoInicio] = useState(null);

  const [databaseValue, setDatabaseValue] = useState(null); // valor de la base de datos

  //const [timeLeft, setTimeLeft] = useState(10);
  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel3_${player.name}`)) || {};
    return tiempos[animalSeleccionado ? `${animalSeleccionado}s` : 'patitos'] || 10;
  });
  
  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel3_${player.name}`)) || {};

  const [showSolution, setShowSolution] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const animalAudioRef = useRef(null);

  const [mlPredictions, setMlPredictions] = useState(null);

  // Efecto para obtener las predicciones
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/predictions/${player.name}`);
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Predicciones recibidas:', data);
        setMlPredictions(data);
      } catch (err) {
        console.error('Error al obtener predicciones:', err);
        alert('Hubo un problema al obtener las predicciones. Intenta nuevamente.');
      }
    };

    if (player?.name) {
      fetchPredictions();
    }
  }, [player?.name]);

  // Objeto para mapear números con sus imágenes de solución
  const solutionImages = {
    1: soluno,
    2: soldos,
    3: soltres,
    4: solcuatro,
    5: solcinco,
    6: solseis,
    7: solsiete,
    8: solocho,
    9: solnueve
  };

  // Objetos para mapear las cantidades con sus audios
  const patitosAudios = {
    1: patito1,
    2: patito2,
    3: patito3,
    4: patito4,
    5: patito5,
    6: patito6,
    7: patito7,
    8: patito8,
    9: patito9
  };

  const cerditosAudios = {
    1: cerdito1,
    2: cerdito2,
    3: cerdito3,
    4: cerdito4,
    5: cerdito5,
    6: cerdito6,
    7: cerdito7,
    8: cerdito8,
    9: cerdito9
  };

  // Mensajes de felicitación
  const successMessages = [
    "¡Excelente trabajo! 🌟",
    "¡Lo lograste! ¡Eres increíble! ⭐",
    "¡Muy bien! ¡Sigue así! 🎉",
    "¡Fantástico! ¡Eres muy inteligente! 🏆",
    "¡Genial! ¡Lo hiciste perfectamente! 🌈",
    "¡Asombroso trabajo! ✨",
    "¡Eres un campeón! 🎯",
    "¡Increíble! ¡Lo has hecho super bien! 🌠",
    "¡Extraordinario! ¡Sigue brillando! 🌞",
    "¡Magnífico! ¡Eres una estrella! ⭐",
    "¡Maravilloso! ¡Eres sorprendente! 🎪",
    "¡Brillante trabajo! ¡Eres genial! 💫",
    "¡Lo has hecho de maravilla! 🌈"
  ];

  // Mensajes de ánimo
  const encouragementMessages = [
    "¡Casi lo tienes! Intenta de nuevo 💪",
    "¡Sigue intentando! Tú puedes 🌟",
    "¡No te rindas! Estás muy cerca ⭐",
    "¡Vamos a intentarlo una vez más! 🎈",
    "¡Tú puedes lograrlo! ¡Inténtalo de nuevo! 🚀",
    "¡Vamos! ¡La práctica hace al maestro! 🎯",
    "¡Estás aprendiendo! ¡Sigue adelante! 🌱",
    "¡Un intento más! ¡Lo conseguirás! 🎪",
    "¡Ánimo! ¡Cada intento te hace más fuerte! 💫",
    "¡No pasa nada! ¡Vuelve a intentarlo! 🌈",
    "¡Confío en ti! ¡Puedes hacerlo! 🎨",
    "¡Sigue practicando! ¡Lo lograrás! 🎮",
    "¡No te desanimes! ¡Lo harás mejor! ✨",
    "¡Inténtalo una vez más! ¡Tú puedes! 🌟",
    "¡Cada intento cuenta! ¡Sigue adelante! 🎉"
  ];

  /*
  const animales = {
    patito: {
      emoji: '🦆',
    },
    cerdito: {
      emoji: '🐷',
    },
  };
  */

  const animales = {
    patito: {
      imagen: patito,
      nombre: 'patito'
    },
    cerdito: {
      imagen: cerdito,
      nombre: 'cerdito'
    },
  };

  const fetchDatabaseValue = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/esp32/counts'); // URL correcta
  
      if (!response.ok) {
        throw new Error('Error al obtener datos de la base de datos');
      }
  
      const data = await response.json(); // Convertimos la respuesta a JSON
      console.log("Datos recibidos del backend:", data);
  
      // Verificar si animalSeleccionado tiene un valor válido
      if (!animalSeleccionado) {
        throw new Error("animalSeleccionado es null o undefined.");
      }
  
      // Asegurémonos de que estamos accediendo al valor correcto
      const valorDesdeDB = data[animalSeleccionado]; // Puede ser data.cerdito o data.patito
  
      if (valorDesdeDB === undefined) {
        throw new Error(`No se encontró el conteo para el animal seleccionado: ${animalSeleccionado}`);
      }
  
      setDatabaseValue(valorDesdeDB); // Guardamos el valor correcto
    } catch (error) {
      console.error('Error al obtener datos del backend:', error.message);
    }
  };

  useEffect(() => {
    if (!animalSeleccionado || gameCompleted) return;
  
    const interval = setInterval(() => {
      fetchDatabaseValue(); // Obtener datos de la base de datos cada segundo
    }, 1000); // Cada 1 segundo
  
    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [animalSeleccionado, gameCompleted]); // Se ejecuta solo cuando cambia el animal seleccionado o se completa el juego

  const handleDatabaseValue = () => {
    if (!animalSeleccionado || gameCompleted || !databaseValue) return;

    // Guardamos el valor de la base de datos como "input del usuario"
    setUserInput(databaseValue);

    // Llamamos a la función para verificar la respuesta
    checkAnswer(databaseValue);
  };

  useEffect(() => {
    // Verificamos automáticamente la respuesta al recibir un nuevo valor de la base de datos
    if (databaseValue) {
      handleDatabaseValue();
    }
  }, [databaseValue, animalSeleccionado, gameCompleted]);

  const saveProgress = () => {
    try {
      const progressData = {
        patitos: cantidadesCompletadasPatitos,
        cerditos: cantidadesCompletadasCerditos,
        gameCompleted,
        lastAnimal: animalSeleccionado,
        lastCantidad: cantidadActual,
      };

      // Evitar guardar progreso si el animalSeleccionado es nulo
      if (!['patito', 'cerdito'].includes(animalSeleccionado)) return;

      localStorage.setItem(`nivel3_progress_${player.name}`, JSON.stringify(progressData));
  
      // Calcular progreso para cada animal
      const progressPatitos = (cantidadesCompletadasPatitos.length / 9) * 100;
      const progressCerditos = (cantidadesCompletadasCerditos.length / 9) * 100;
  
      window.parent.postMessage(
        {
          type: 'SAVE_PHASE_PROGRESS',
          level: 3,
          phase: animalSeleccionado,
          progress: animalSeleccionado === 'patito' ? progressPatitos : progressCerditos,
          isCompleted: gameCompleted,
        },
        '*'
      );
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  };  

  const loadProgress = () => {
    try {
      const savedProgress = localStorage.getItem(`nivel3_progress_${player.name}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCantidadesCompletadasPatitos(progress.patitos || []);
        setCantidadesCompletadasCerditos(progress.cerditos || []);
        setGameCompleted(progress.gameCompleted || false);
        setCantidadActual(progress.lastCantidad || 0);
      } else {
        resetProgress();
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
    } finally {
      setProgressLoaded(true);
    }
  };

  const resetProgress = () => {
    setCantidadesCompletadasPatitos([]);
    setCantidadesCompletadasCerditos([]);
    setGameCompleted(false);
    setAnimalSeleccionado(null);
    setCantidadActual(0);
  };

  const resetAnimalProgress = (animal) => {
    if (window.confirm(`¿Estás seguro de que quieres reiniciar el progreso de ${animal}? Se perderá todo el progreso.`)) {
      if (animal === 'patitos') {
        setCantidadesCompletadasPatitos([]);
        setPatitosStats({});
        if (animalSeleccionado === 'patito') {
          setGameCompleted(false);
          setAnimalSeleccionado(null);
          setCantidadActual(0);
        }
      } else if (animal === 'cerditos') {
        setCantidadesCompletadasCerditos([]);
        setCerditosStats({});
        if (animalSeleccionado === 'cerdito') {
          setGameCompleted(false);
          setAnimalSeleccionado(null);
          setCantidadActual(0);
        }
      }
    }
  };

  useEffect(() => {
    loadProgress();
  }, [player.name]);

  useEffect(() => {
    if (progressLoaded) {
      saveProgress();
    }
  }, [
    cantidadesCompletadasPatitos,
    cantidadesCompletadasCerditos,
    gameCompleted,
    progressLoaded,
  ]);

  const generarNuevaCantidad = () => {
    const cantidadesCompletadas =
      animalSeleccionado === 'patito'
        ? cantidadesCompletadasPatitos
        : cantidadesCompletadasCerditos;
  
    const numerosPosibles = Array.from({ length: 9 }, (_, i) => i + 1).filter(
      (num) => !cantidadesCompletadas.includes(num)
    );
  
    if (numerosPosibles.length === 0) {
      setGameCompleted(true);
      return null;
    }
  
    const index = Math.floor(Math.random() * numerosPosibles.length);
    const nuevaCantidad = numerosPosibles[index];
  
    if (nuevaCantidad === cantidadActual && numerosPosibles.length > 1) {
      const otherNumbers = numerosPosibles.filter((num) => num !== nuevaCantidad);
      setCantidadActual(
        otherNumbers[Math.floor(Math.random() * otherNumbers.length)]
      );
    } else {
      setCantidadActual(nuevaCantidad);
    }
  
    setTiempoInicio(Date.now());
  };
  

  const iniciarJuego = (animal) => {
    setAnimalSeleccionado(animal);
    setGameCompleted(false);
    generarNuevaCantidad();
    setTiempoInicio(Date.now()); // Inicia el tiempo
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel3_${player.name}`)) || {};
    setTimeLeft(tiempos[`${animal}s`] || 10);
  };  

  // Función para reproducir audio de manera confiable
  const playAudio = async (audioRef) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        await new Promise(resolve => setTimeout(resolve, 50));
        await audioRef.current.play();
      }
    } catch (error) {
      console.log("Error al reproducir audio:", error);
    }
  };

  /*
  // Inicializar los audios de feedback
  useEffect(() => {
    successAudioRef.current = new Audio(success);
    encouragementAudioRef.current = new Audio(encouragement);
    completedAudioRef.current = new Audio(completed); 
    return () => {
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.currentTime = 0;
      }
      if (encouragementAudioRef.current) {
        encouragementAudioRef.current.pause();
        encouragementAudioRef.current.currentTime = 0;
      }
      if (completedAudioRef.current) {
        completedAudioRef.current.pause();
        completedAudioRef.current.currentTime = 0;
      }
    };
  }, []);
  */

  // UseEffect para inicializar los audios de feedback
  useEffect(() => {
    successAudioRef.current = new Audio(success);
    encouragementAudioRef.current = new Audio(encouragement);
    completedAudioRef.current = new Audio(completed); 
    return () => {
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.currentTime = 0;
      }
      if (encouragementAudioRef.current) {
        encouragementAudioRef.current.pause();
        encouragementAudioRef.current.currentTime = 0;
      }
      if (completedAudioRef.current) {
        completedAudioRef.current.pause();
        completedAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // UseEffect para reproducir el audio cuando cambia la cantidad
  useEffect(() => {
    if (!animalSeleccionado || gameCompleted || showSolution) return;

    if (animalAudioRef.current) {
      animalAudioRef.current.pause();
      animalAudioRef.current.currentTime = 0;
    }

    // Seleccionar el conjunto de audios correcto según el animal
    const audios = animalSeleccionado === 'patito' ? patitosAudios : cerditosAudios;
    
    // Crear y reproducir el nuevo audio
    if (cantidadActual > 0) {
      animalAudioRef.current = new Audio(audios[cantidadActual]);
      animalAudioRef.current.play().catch(error => {
        console.log("Error al reproducir el audio del animal:", error);
      });
    }

    return () => {
      if (animalAudioRef.current) {
        animalAudioRef.current.pause();
        animalAudioRef.current.currentTime = 0;
      }
    };
  }, [cantidadActual, animalSeleccionado]);

  const checkAnswer = (valorDesdeDB) => {
    if (showFeedback || showSolution || !animalSeleccionado || gameCompleted) return;
  
    const isRight = parseInt(valorDesdeDB) === cantidadActual;
    setIsCorrect(isRight);

    console.log(`✅ Verificando: Base de datos = ${valorDesdeDB}, Solicitado = ${cantidadActual}, ¿Correcto? ${isRight}`);

    // Reproducir el audio correspondiente
    if (isRight) {
      playAudio(successAudioRef);
    } else {
      playAudio(encouragementAudioRef);
    }

    // Selecciona el mensaje una sola vez
    setFeedbackMessage(
      isRight
        ? successMessages[Math.floor(Math.random() * successMessages.length)]
        : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
    );

    setShowFeedback(true);
  
    if (tiempoInicio) {
      const tiempoRespuesta = Math.min((Date.now() - tiempoInicio) / 1000, 10);
      const currentStats = animalSeleccionado === 'patito' ? patitosStats : cerditosStats;
  
      const updatedStats = {
        ...currentStats,
        [cantidadActual]: {
          errores: currentStats[cantidadActual]?.errores || 0,
          attempts: currentStats[cantidadActual]?.attempts || 0,
          tiempo: currentStats[cantidadActual]?.tiempo || 0,
          resultado: isRight
        },
      };
  
      if (!isRight) {
        updatedStats[cantidadActual].errores += 1;
        updatedStats[cantidadActual].resultado = false;
      } else {
        updatedStats[cantidadActual].resultado = true;
      }
      updatedStats[cantidadActual].attempts += 1;
      updatedStats[cantidadActual].tiempo = tiempoRespuesta;
  
      if (animalSeleccionado === 'patito') {
        setPatitosStats(updatedStats);
      } else {
        setCerditosStats(updatedStats);
      }
  
      // Guardar en la base de datos
      const details = {
        [cantidadActual]: {
          errors: updatedStats[cantidadActual].errores,
          time: tiempoRespuesta,
          resultado: isRight
        }
      };
  
      saveDetailsToDatabase({
        section: `${animalSeleccionado}s`,
        details
      });
  
      console.log(`${animalSeleccionado} - Número ${cantidadActual}:`, details[cantidadActual]);
    }
  
    if (!isRight) {
      setTimeout(() => {
        setShowFeedback(false);
        setUserInput('');
      }, 1500);
      return;
    }
  
    const cantidadesCompletadas = animalSeleccionado === 'patito' ? cantidadesCompletadasPatitos : cantidadesCompletadasCerditos;
    const updateList = animalSeleccionado === 'patito' ? setCantidadesCompletadasPatitos : setCantidadesCompletadasCerditos;
  
    if (!cantidadesCompletadas.includes(cantidadActual)) {
      updateList(prev => [...prev, cantidadActual]);
      if (cantidadesCompletadas.length + 1 >= 9) {
        setGameCompleted(true);
        
        // Reproducir sonido de completado
        if (completedAudioRef.current) {
          completedAudioRef.current.play().catch(error => {
            console.log("Error al reproducir audio de completado:", error);
          });
        }
      }
    }
  
    setTimeout(() => {
      setShowFeedback(false);
      setUserInput('');
      if (cantidadesCompletadas.length + 1 < 9) {
        generarNuevaCantidad();
        //setTimeLeft(10);
        const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel3_${player.name}`)) || {};
        setTimeLeft(tiempos[`${animalSeleccionado}s`] || 10);
      }
    }, 2000);
  };

  /*
  const saveDetailsToDatabase = async ({ section, details }) => {
    console.log('Datos que se enviarán al backend:', { section, details });
  
    try {
      const response = await fetch('http://localhost:5000/api/game-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: player.name,
          section,
          details,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Advertencia al guardar detalles:', errorData);
        return;
      }
  
      console.log('Detalles guardados correctamente en la base de datos');
    } catch (error) {
      console.error('Error al guardar detalles:', error);
    }
  };
  */

  const saveDetailsToDatabase = async ({ section, details }) => {
    if (!player?.name || !section || !details) {
        console.warn('Faltan datos requeridos:', { 
            player: player?.name, 
            section, 
            details 
        });
        return;
    }

    // Determinar el endpoint basado en la sección
    const endpoint = section === 'patitos' 
        ? 'game-details-patitos'
        : 'game-details-cerditos';

    // Convertir el número a string en el objeto details
    const formattedDetails = {};
    Object.entries(details).forEach(([key, value]) => {
        formattedDetails[key.toString()] = value;
    });

    const dataToSend = {
        playerName: player.name,
        section: section,
        details: formattedDetails
    };

    console.log('Datos que se enviarán al backend:', dataToSend);

    try {
        const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.warn('Advertencia al guardar detalles:', errorData);
            return;
        }

        console.log('Detalles guardados correctamente en la base de datos');
    } catch (error) {
        console.error('Error al guardar detalles:', error);
    }
};

  useEffect(() => {
    if (!animalSeleccionado || gameCompleted || showSolution) return;
  
    // Asegurarnos de que el audio está inicializado
    if (!audioRef.current) {
      audioRef.current = new Audio(time);
      audioRef.current.loop = true;
    }

    let timeoutId;
    const timerId = setInterval(() => {
      setTimeLeft(time => {

         // Manejar el audio cuando el tiempo es bajo
         if (time <= 3 && time > 0) {
          audioRef.current.play().catch(error => {
            console.log("Error al reproducir el audio:", error);
          });
        } else if (time > 3 || time <= 0) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        if (time <= 0) {
          clearInterval(timerId);
          setShowSolution(true);
          
          const currentStats = animalSeleccionado === 'patito' ? patitosStats : cerditosStats;
          const updatedStats = {
            ...currentStats,
            [cantidadActual]: {
              errores: (currentStats[cantidadActual]?.errores || 0),
              attempts: (currentStats[cantidadActual]?.attempts || 0) + 1,
              tiempo: 10,
              resultado: false
            }
          };
  
          if (animalSeleccionado === 'patito') {
            setPatitosStats(updatedStats);
          } else {
            setCerditosStats(updatedStats);
          }
  
          saveDetailsToDatabase({
            section: `${animalSeleccionado}s`,
            details: {
              [cantidadActual]: {
                errors: updatedStats[cantidadActual].errores,
                time: timeLeft,
                resultado: false
              }
            }
          });
          
          timeoutId = setTimeout(() => {
            setShowSolution(false);
            if (!gameCompleted) {
              generarNuevaCantidad();
              //setTimeLeft(10);
              const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel3_${player.name}`)) || {};
              setTimeLeft(tiempos[`${animalSeleccionado}s`] || 10);
            }
          }, 2000);
          
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  
    return () => {
      if (timerId) clearInterval(timerId);
      if (timeoutId) clearTimeout(timeoutId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [animalSeleccionado, gameCompleted, showSolution]);


  useEffect(() => {
    if (gameCompleted) {
      const sumarErrores = (stats) =>
        Object.values(stats).reduce((acc, curr) => acc + (curr.errores || 0), 0);
      const sumarTiempos = (stats) =>
        Object.values(stats).reduce((acc, curr) => acc + (curr.tiempo || 0), 0);

      console.log(`Errores Totales Patitos: ${sumarErrores(patitosStats)}`);
      console.log(`Errores Totales Cerditos: ${sumarErrores(cerditosStats)}`);
      console.log(`Tiempo Total Patitos: ${sumarTiempos(patitosStats).toFixed(2)}s`);
      console.log(`Tiempo Total Cerditos: ${sumarTiempos(cerditosStats).toFixed(2)}s`);
      console.log(
        `Tiempo Total General: ${(sumarTiempos(patitosStats) + sumarTiempos(cerditosStats)).toFixed(2)}s`
      );
    }
  }, [gameCompleted]);
  
  /*const handleKeyPress = (e) => {
    if (!animalSeleccionado || gameCompleted) return;
    if (!/[0-9]/.test(e.key)) return;
    setUserInput(e.key);
    checkAnswer(e.key);
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [animalSeleccionado, cantidadActual, showFeedback]);
  */
  /*
  const handleBack = () => {
    if (animalSeleccionado) {
      setAnimalSeleccionado(null);
    } else {
      onBack();
    }
  };  
  */

  const handleBack = () => {
    if (animalSeleccionado) {
      if (completedAudioRef.current) {
        completedAudioRef.current.pause();
        completedAudioRef.current.currentTime = 0;
      }
      setAnimalSeleccionado(null);
    } else {
      onBack();
    }
  };

  const renderProgressBar = () => {
    const totalNumbersPerAnimal = 9;
    const patitosProgress = (cantidadesCompletadasPatitos.length / totalNumbersPerAnimal) * 100;
    const cerditosProgress = (cantidadesCompletadasCerditos.length / totalNumbersPerAnimal) * 100;
  
    return (
      <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-purple-600">Progreso</h3>
          <span className="text-xl font-bold text-purple-600">
            {Math.round((patitosProgress + cerditosProgress) / 2)}%
          </span>
        </div>
        
        <div className="space-y-2">
          <div 
            className="bg-gray-50 rounded-lg p-2 transition-all duration-300 
                       hover:bg-white hover:shadow-md hover:scale-[1.02] 
                       cursor-pointer border border-transparent hover:border-purple-200"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  🦆
                </span>
                <span className="text-gray-700 capitalize text-sm font-medium">
                  Patitos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 font-medium">
                  {Math.round(patitosProgress)}%
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAnimalProgress('patitos');
                  }}
                  className="text-red-500 hover:text-red-700 text-sm
                           transition-all duration-300 hover:scale-110"
                  title="Reiniciar patitos"
                >
                  🔄
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300
                         bg-gradient-to-r from-blue-400 to-purple-500" 
                style={{width: `${patitosProgress}%`}}
              />
            </div>
          </div>
  
          <div 
            className="bg-gray-50 rounded-lg p-2 transition-all duration-300 
                       hover:bg-white hover:shadow-md hover:scale-[1.02] 
                       cursor-pointer border border-transparent hover:border-purple-200"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  🐷
                </span>
                <span className="text-gray-700 capitalize text-sm font-medium">
                  Cerditos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 font-medium">
                  {Math.round(cerditosProgress)}%
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAnimalProgress('cerditos');
                  }}
                  className="text-red-500 hover:text-red-700 text-sm
                           transition-all duration-300 hover:scale-110"
                  title="Reiniciar cerditos"
                >
                  🔄
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300
                         bg-gradient-to-r from-pink-400 to-purple-500" 
                style={{width: `${cerditosProgress}%`}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/*
  const renderSeleccionAnimal = () => (
    <div className="text-center space-y-8">
      {renderProgressBar()}
      <h2 className="text-4xl font-bold text-purple-600">¿Con qué animal quieres practicar?</h2>
      <div className="flex justify-center gap-8">

        {/* 
        {Object.entries(animales).map(([nombre, datos]) => (
          <button
            key={nombre}
            className="bg-white p-8 rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => iniciarJuego(nombre)}
          >
            <div className="text-8xl mb-4">{datos.emoji}</div>
            <div className="text-2xl font-bold text-purple-600 capitalize">{nombre}s</div>
          </button>
        ))}
        */}{/*
        {Object.entries(animales).map(([nombre, datos]) => (
          <button
            key={nombre}
            className="bg-white p-8 rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => iniciarJuego(nombre)}
          >
            <div className="mb-4">
              <img 
                src={datos.imagen} 
                alt={datos.nombre}
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="text-2xl font-bold text-purple-600 capitalize">{nombre}s</div>
          </button>
        ))}

      </div>
    </div>
  );*/}

  const renderSeleccionAnimal = () => {
    return (
      <div className="text-center space-y-8">
        {renderProgressBar()}
        <h2 className="text-4xl font-bold text-purple-600">¿Con qué animal quieres practicar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(animales).map(([nombre, datos]) => {
            const prediction = mlPredictions?.level3?.[`${nombre}s`];
            
            return (
              <button
                key={nombre}
                className="bg-white pl-2 pr-8 py-6 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 w-full"
                onClick={() => iniciarJuego(nombre)}
              >
                <div className="flex items-center">
                  <div className="shrink-0 ml-0"> {/* Añadido ml-2 */}
                    <img 
                      src={datos.imagen} 
                      alt={datos.nombre}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="flex-1 text-left ml-1">
                    <h3 className="text-2xl font-bold text-purple-600 capitalize mb-2">
                      {nombre}s
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Practica contando {nombre}s del 1 al 9
                    </p>
                    {prediction && (
                      <div className="mt-2">
                        <MensajesPrediccionNivel3 prediction={prediction} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderJuego = () => {
    if (gameCompleted) {
      return (
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            ¡Felicitaciones! 🎉
          </h2>
          <div className="mb-8">
            <div className="text-9xl mb-8">🏆</div>
            <p className="text-2xl text-gray-600">
              ¡Has completado todos los números con {animalSeleccionado === 'patito' ? 'los patitos' : 'los cerditos'}!
            </p>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              // Reproducir sonido de completado
              if (completedAudioRef.current) {
                completedAudioRef.current.play().catch(error => {
                  console.log("Error al reproducir audio de completado:", error);
                });
              }
              setAnimalSeleccionado(null);
            }}
          >
            Volver al menú
          </button>
        </div>
      );
    }
  
    return (
      <div className="text-center space-y-8">
        {animalSeleccionado && !gameCompleted && (
          <div className="mb-12">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg relative">
                  {/* Título del nivel */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 
                              bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                              px-6 py-2 rounded-full shadow-lg">
                      <span className="text-lg font-bold capitalize">{animalSeleccionado}s</span>
                  </div>

                  {/* Fases */}
                  <div className="flex justify-between items-center gap-3 mt-4">
                      {[...Array(9)].map((_, i) => {
                          const cantidadesCompletadas = animalSeleccionado === 'patito' 
                              ? cantidadesCompletadasPatitos 
                              : cantidadesCompletadasCerditos;
                          const numero = i + 1;
                          const isCompleted = cantidadesCompletadas.includes(numero);
                          const isCurrent = cantidadActual === numero;

                          return (
                              <div key={i} className="flex-1">
                                  <div className="relative">
                                      {i < 8 && (
                                          <div className={`absolute top-1/2 left-[60%] right-0 h-2 rounded-full
                                                      ${isCompleted 
                                                          ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                                          : 'bg-gray-200'}`}>
                                          </div>
                                      )}
                                      
                                      <div className={`relative z-10 flex flex-col items-center transform 
                                                  transition-all duration-500 ${
                                                      isCurrent ? 'scale-110' : 'hover:scale-105'
                                                  }`}>
                                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                                      shadow-lg transition-all duration-300 border-4
                                                      ${isCurrent
                                                          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 animate-pulse'
                                                          : isCompleted
                                                          ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-200'
                                                          : 'bg-white border-gray-100'
                                                      }`}>
                                              <span className={`text-2xl font-bold ${
                                                  isCurrent
                                                      ? 'text-yellow-900'
                                                      : isCompleted
                                                      ? 'text-white'
                                                      : 'text-gray-400'
                                              }`}>
                                                  {numero}
                                              </span>
                                          </div>
                                          
                                          {isCurrent && (
                                              <div className="absolute -bottom-6">
                                                  <span className="text-yellow-500 text-2xl animate-bounce">⭐</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>

                  {/* Barra de progreso */}
                  <div className="mt-12">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-purple-700">
                              Tu Progreso
                          </span>
                          <div className="flex items-center gap-2">
                              <div className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-bold">
                                  {((animalSeleccionado === 'patito' ? cantidadesCompletadasPatitos.length : cantidadesCompletadasCerditos.length) / 9 * 100).toFixed(0)}%
                              </div>
                          </div>
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                          <div
                              className={`h-full rounded-full transition-all duration-1000 relative
                                      ${animalSeleccionado === 'patito'
                                          ? 'bg-gradient-to-r from-blue-400 to-purple-500'
                                          : 'bg-gradient-to-r from-pink-400 to-purple-500'}`}
                              style={{ width: `${((animalSeleccionado === 'patito' ? cantidadesCompletadasPatitos.length : cantidadesCompletadasCerditos.length) / 9) * 100}%` }}
                          >
                              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                              <div className="absolute inset-0 overflow-hidden">
                                  <div className="w-full h-full animate-shimmer 
                                            bg-gradient-to-r from-transparent via-white to-transparent"
                                        style={{ backgroundSize: '200% 100%' }}>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
        <h2 className="text-4xl font-bold text-purple-600">
          Coloca {cantidadActual} {animalSeleccionado}{cantidadActual > 1 ? 's' : ''}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[...Array(cantidadActual)].map((_, i) => (
            //<span key={i} className="text-6xl">{animales[animalSeleccionado].emoji}</span>
            <div key={i} className="w-24 h-24">
              <img 
                src={animales[animalSeleccionado].imagen}
                alt={animales[animalSeleccionado].nombre}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
        <div>
          <div className="text-4xl font-bold text-purple-600">Tu respuesta: {userInput}</div>
          {/*
          {showFeedback && (
            <div className={`mt-4 text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                            animate-bounce`}>
              {isCorrect ? successMessages[Math.floor(Math.random() * successMessages.length)] : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
            </div>
          )}
          */}
          {showFeedback && (
              <div className={`mt-8 text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                              animate-bounce`}>
                {feedbackMessage}
              </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-2 px-4
                    rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={handleBack}
          >
            ← Volver
          </button>
          
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-300"
            onClick={onConfigClick}
          >
            <span className="text-4xl">{player?.avatar}</span>
            <span className="text-2xl font-bold text-purple-600 hover:text-purple-700">
              {player?.name}
            </span>
          </div>
        </div>
        {progressLoaded && (animalSeleccionado ? renderJuego() : renderSeleccionAnimal())}

        {/* Mostrar solución cuando se acaba el tiempo */}
        {showSolution && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-2xl transform transition-all">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                ¡Se acabó el tiempo!
              </h3>
              <p className="text-xl text-gray-600 mb-4">
                La respuesta correcta era:
              </p>
              <img 
                src={solutionImages[cantidadActual]}
                alt={`Solución: número ${cantidadActual}`}
                className="w-96 h-96 object-contain mx-auto mb-4"
              />
            </div>
          </div>
        )}

        {/* Temporizador */}
        {animalSeleccionado && !gameCompleted && (
          <div className="absolute bottom-8 right-8">
            <div className={`relative group transform transition-all duration-300 ${
              timeLeft <= 3 ? 'scale-110' : 'hover:scale-105'
            }`}>
              <div className={`w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg
                            relative overflow-hidden ${timeLeft <= 3 ? 'animate-pulse' : ''}`}>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={timeLeft <= 3 ? '#FEE2E2' : '#E0E7FF'}
                    strokeWidth="8"
                    className="opacity-30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={timeLeft <= 3 ? '#EF4444' : '#3B82F6'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    //strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/10)}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.[`${animalSeleccionado}s`] || 10))}
                    className="transition-all duration-1000"
                  />
                </svg>

                <div className={`relative z-10 text-4xl font-bold 
                            ${timeLeft <= 3 ? 'text-red-500' : 'text-blue-500'}`}>
                  {timeLeft}
                </div>

                {timeLeft <= 3 && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full 
                                flex items-center justify-center animate-bounce shadow-lg">
                      <span className="text-white text-xs">⚠️</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nivel3;
