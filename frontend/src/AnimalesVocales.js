import abeja from '../src/images/abeja.png';
import elefante from '../src/images/elefante.png';
import iguana from '../src/images/iguana.png';
import oso from '../src/images/oso.png';
import unicornio from '../src/images/unicornio.png';

// Importar las imágenes de solución
import sola from '../src/images/vocala.png';
import sole from '../src/images/vocale.png';
import soli from '../src/images/vocali.png';
import solo from '../src/images/vocalo.png';
import solu from '../src/images/vocalu.png';

import vocalAbeja from '../src/sounds/animales-vocales/vocalAAbeja.MP3';
import vocalElefante from '../src/sounds/animales-vocales/vocalEElefante.MP3';
import vocalIguana from '../src/sounds/animales-vocales/vocalIIguana.MP3';
import vocalOso from '../src/sounds/animales-vocales/vocalOOso.MP3';
import vocalUnicornio from '../src/sounds/animales-vocales/vocalUUnicornio.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

import React, { useState, useEffect, useRef } from 'react';

const AnimalesVocales = ({ player, onBack, onConfigClick, onProgressUpdate }) => {

  /*
  // Datos de los pares animal-vocal
  const pairs = [
    {
      animal: '🐝',
      vocal: 'a',
      nombre: 'abeja'
    },
    {
      animal: '🐘',
      vocal: 'e',
      nombre: 'elefante'
    },
    {
      animal: '🦎',
      vocal: 'i',
      nombre: 'iguana'
    },
    {
      animal: '🐻',
      vocal: 'o',
      nombre: 'oso'
    },
    {
      animal: '🦄',
      vocal: 'u',
      nombre: 'unicornio'
    }
  ];
  */

  const pairs = [
    {
      imagen: abeja,
      vocal: 'a',
      nombre: 'abeja'
    },
    {
      imagen: elefante,
      vocal: 'e',
      nombre: 'elefante'
    },
    {
      imagen: iguana,
      vocal: 'i',
      nombre: 'iguana'
    },
    {
      imagen: oso,
      vocal: 'o',
      nombre: 'oso'
    },
    {
      imagen: unicornio,
      vocal: 'u',
      nombre: 'unicornio'
    }
  ];

  // Objeto para mapear vocales con sus imágenes de solución
  const solutionImages = {
    'a': sola,
    'e': sole,
    'i': soli,
    'o': solo,
    'u': solu
  };

  // Objeto para mapear animales con sus audios
  const animalVocalAudios = {
    'abeja': vocalAbeja,
    'elefante': vocalElefante,
    'iguana': vocalIguana,
    'oso': vocalOso,
    'unicornio': vocalUnicornio
  };

  //const [currentPair, setCurrentPair] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  //const [showInstructions, setShowInstructions] = useState(true);

  const [errorsArray, setErrorsArray] = useState(new Array(pairs.length).fill(0));

  const [startTime, setStartTime] = useState(Date.now()); // Tiempo de inicio para cada intento
  const [responseTimes, setResponseTimes] = useState([]); // Array para almacenar los tiempos de respuesta


  const [currentPair, setCurrentPair] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel2_animales_vocales_progress_${player.name}`);
    const completedStatus = localStorage.getItem(`nivel2_animales_vocales_completed_${player.name}`);
    
    // Si está completado, forzar el último par y comunicar 100%
    if (completedStatus === 'true') {
      onProgressUpdate(100, true);
      setGameCompleted(true);
      return pairs.length - 1;
    }
    
    // Si hay progreso guardado
    if (savedProgress) {
      const progress = parseInt(savedProgress);
      const currentProgress = (progress / pairs.length) * 100;
      onProgressUpdate(currentProgress, false);
      return progress < pairs.length ? progress : 0;
    }
    
    return 0;
  });

  // Modificar estado de instrucciones para recuperar
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem(`nivel2_animales_vocales_instructions_${player.name}`);
    return !savedInstructions;
  });

  //const [timeLeft, setTimeLeft] = useState(10);
  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};
    return tiempos['animales-vocales'] || 10; // 10 es el valor por defecto
  });

  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};

  const [showSolution, setShowSolution] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const vocalAudioRef = useRef(null);

  // Agregar después de la definición de estados
  useEffect(() => {
    if (currentPair >= pairs.length) {
      setCurrentPair(0);
    }
  }, [currentPair]);

  

  // Mensajes de felicitación
  const successMessages = [
    "¡Excelente trabajo! 🌟",
    "¡Lo lograste! ¡Eres increíble! ⭐",
    "¡Muy bien! ¡Sigue así! 🎉",
    "¡Fantástico! ¡Eres muy inteligente! 🏆",
    "¡Genial! ¡Lo hiciste perfectamente! 🌈"
  ];

  // Mensajes de ánimo
  const encouragementMessages = [
    "¡Casi lo tienes! Intenta de nuevo 💪",
    "¡Sigue intentando! Tú puedes 🌟",
    "¡No te rindas! Estás muy cerca ⭐",
    "¡Vamos a intentarlo una vez más! 🎈"
  ];

  // Manejar la entrada del teclado
  const handleKeyPress = (e) => {
    if (showInstructions) return;
    
    // Solo permitir vocales
    if (!/[aeiou]/.test(e.key.toLowerCase())) return;
    
    setUserInput(e.key.toLowerCase());
    checkAnswer(e.key.toLowerCase());
  };

  /*
  const checkAnswer = (input) => {
    const isRight = input === pairs[currentPair].vocal;
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    // Calcular el tiempo de respuesta
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // Convertir a segundos
  
    // Actualizar los errores si la respuesta es incorrecta
    setErrorsArray((prevErrors) => {
      const updatedErrors = [...prevErrors];
      if (!isRight) {
        updatedErrors[currentPair] += 1; // Incrementar errores del par actual
      }
  
      // Preparar los datos para enviar al backend
      const currentAnimal = pairs[currentPair].nombre;
      const errorsForCurrentPair = updatedErrors[currentPair];
  
      saveDetailsToDatabase({
        section: 'animales-vocales',
        details: {
          [currentAnimal]: {
            errors: errorsForCurrentPair, // Errores acumulados
            time: responseTime, // Tiempo de respuesta
            completed: isRight,
          },
        },
      });
  
      return updatedErrors;
    });
  
    // Si la respuesta es incorrecta, mostrar el mensaje y detener el flujo
    if (!isRight) {
      console.log("Error registrado para:", pairs[currentPair].nombre);
      return;
    }
  
    // Si la respuesta es correcta, avanzar al siguiente par o terminar
    if (isRight) {
      if (currentPair === pairs.length - 1) {
        // Juego completado
        localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, 'true');
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, pairs.length);
  
        onProgressUpdate(100, true);
  
        showFinalStats();
  
        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        // Avanzar al siguiente par
        const nextPair = currentPair + 1;
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, nextPair);
  
        const progress = ((nextPair) / pairs.length) * 100;
        onProgressUpdate(progress, false);
  
        setTimeout(() => {
          setCurrentPair(nextPair);
          setShowFeedback(false);
          setUserInput('');
          setStartTime(Date.now()); // Reiniciar el tiempo de inicio
        }, 2000);
      }
    }
  };
  */

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
      if (completedAudioRef.current) { // Añadir esta verificación
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

  // UseEffect para reproducir el audio cuando cambia el animal/vocal
  useEffect(() => {
    if (!showInstructions && !gameCompleted && !showSolution) {
      if (vocalAudioRef.current) {
        vocalAudioRef.current.pause();
        vocalAudioRef.current.currentTime = 0;
      }

      if (currentPair < pairs.length) {
        vocalAudioRef.current = new Audio(animalVocalAudios[pairs[currentPair].nombre]);
        vocalAudioRef.current.play().catch(error => {
          console.log("Error al reproducir el audio de la vocal:", error);
        });
      }

      return () => {
        if (vocalAudioRef.current) {
          vocalAudioRef.current.pause();
          vocalAudioRef.current.currentTime = 0;
        }
      };
    }
  }, [currentPair]);

  const checkAnswer = (input) => {
    if (showFeedback || showSolution || showInstructions || gameCompleted) return;
    
    const isRight = input === pairs[currentPair].vocal;
    setIsCorrect(isRight);

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

    const endTime = Date.now();
    const responseTime = Math.min((endTime - startTime) / 1000, 10);
    const currentAnimal = pairs[currentPair].nombre;

    if (!isRight) {
        setErrorsArray(prevErrors => {
            const updatedErrors = [...prevErrors];
            updatedErrors[currentPair] += 1;

            saveDetailsToDatabase({
                section: 'animales-vocales',
                details: {
                    [currentAnimal]: {
                        errors: updatedErrors[currentPair],
                        time: responseTime,
                        resultado: false
                    }
                }
            });

            console.log(`Intento incorrecto para ${currentAnimal}:`, {
                errors: updatedErrors[currentPair],
                time: responseTime,
                resultado: false
            });

            return updatedErrors;
        });

        setTimeout(() => {
            setShowFeedback(false);
            setUserInput('');
        }, 1000);
        return;
    }

    setErrorsArray(prevErrors => {
        const currentErrors = prevErrors[currentPair];
        
        saveDetailsToDatabase({
            section: 'animales-vocales',
            details: {
                [currentAnimal]: {
                    errors: currentErrors,
                    time: responseTime,
                    resultado: true
                }
            }
        });

        console.log(`Intento correcto para ${currentAnimal}:`, {
            errors: currentErrors,
            time: responseTime,
            resultado: true
        });

        return prevErrors;
    });

    if (currentPair === pairs.length - 1) {
        localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, 'true');
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, pairs.length);
        onProgressUpdate(100, true);

        // Reproducir sonido de completado
        if (completedAudioRef.current) {
          completedAudioRef.current.play().catch(error => {
            console.log("Error al reproducir audio de completado:", error);
          });
        }

        showFinalStats();

        setTimeout(() => {
            setGameCompleted(true);
            setShowFeedback(false);
        }, 2000);
    } else {
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, currentPair + 1);
        onProgressUpdate(((currentPair + 1) / pairs.length) * 100, false);

        setTimeout(() => {
            setCurrentPair(prev => prev + 1);
            setShowFeedback(false);
            setUserInput('');
            setStartTime(Date.now());
            //setTimeLeft(10);
            // Obtener el tiempo configurado
            const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};
            setTimeLeft(tiempos['animales-vocales'] || 10);
        }, 2000);
    }
  };
  
  /*
  // Guardar detalles en la base de datos
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

    const dataToSend = {
        playerName: player.name,
        section: section,
        details: details
    };

    console.log('Datos que se enviarán al backend:', dataToSend);

    try {
        const response = await fetch('http://localhost:5000/api/game-details-animales-vocales', {
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
    if (showInstructions || gameCompleted || showSolution) return;

    // Crear el elemento de audio si no existe
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
                
                const currentAnimal = pairs[currentPair].nombre;
                setErrorsArray(prevErrors => {
                    const currentErrors = prevErrors[currentPair];
                    
                    saveDetailsToDatabase({
                        section: 'animales-vocales',
                        details: {
                            [currentAnimal]: {
                                errors: currentErrors,
                                time: timeLeft,
                                resultado: false
                            }
                        }
                    });

                    console.log(`Tiempo agotado para ${currentAnimal}:`, {
                        errors: currentErrors,
                        time: timeLeft,
                        resultado: false
                    });

                    return prevErrors;
                });
                
                timeoutId = setTimeout(() => {
                    setShowSolution(false);
                    
                    if (currentPair < pairs.length - 1) {
                        setCurrentPair(prev => prev + 1);
                        //setTimeLeft(10);
                        // Obtener el tiempo configurado
                        const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};
                        setTimeLeft(tiempos['animales-vocales'] || 10);
                        setStartTime(Date.now());
                    } else {
                        localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, pairs.length);
                        localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, 'true');
                        onProgressUpdate(100, true);
                        setGameCompleted(true);
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
  }, [currentPair, showInstructions, gameCompleted, showSolution, player.name]);
  
  // Mostrar estadísticas finales
  const showFinalStats = () => {
    let totalErrors = 0;
    let totalTime = 0;
  
    errorsArray.forEach((errors, index) => {
      const time = responseTimes[index] || 0; // Tiempo de respuesta para el par actual
      totalErrors += errors;
      totalTime += time;
      console.log(
        `Animal: ${pairs[index].nombre} (${pairs[index].vocal}) | Errores: ${errors} | Tiempo de respuesta: ${time.toFixed(2)}s`
      );
    });
  
    console.log(`Errores totales: ${totalErrors}`);
    console.log(`Tiempo total: ${totalTime.toFixed(2)}s`);
  };
  
  // Configurar el event listener del teclado
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentPair, showInstructions]);

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel2_animales_vocales_instructions_${player.name}`, 'started');
    
    // Eliminar la marca de reinicio
    localStorage.removeItem(`nivel2_animales_vocales_reset_${player.name}`);
  };


  // Método para manejar volver atrás

  const handleBack = () => {
    // Verificar si está completado primero
    const isCompleted = localStorage.getItem(`nivel2_animales_vocales_completed_${player.name}`) === 'true';
    
    if (isCompleted || gameCompleted) {
      // Si está completado, forzar 100%
      localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, 'true');
      localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, pairs.length);
      onProgressUpdate(100, true);
    } else {
      // Guardar progreso parcial
      localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, currentPair);
      const progress = ((currentPair) / pairs.length) * 100;
      onProgressUpdate(progress, false);
    }
    
    onBack();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
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

        {!showInstructions && !gameCompleted && (
          <div className="mb-12">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg relative">
                  {/* Título del nivel */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 
                              bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                              px-6 py-2 rounded-full shadow-lg">
                      <span className="text-lg font-bold">Animales y vocales</span>
                  </div>

                  {/* Fases */}
                  <div className="flex justify-between items-center gap-3 mt-4">
                      {pairs.map((pair, i) => (
                          <div key={i} className="flex-1">
                              <div className="relative">
                                  {i < pairs.length - 1 && (
                                      <div className={`absolute top-1/2 left-[60%] right-0 h-2 rounded-full
                                                  ${i < currentPair 
                                                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                                      : 'bg-gray-200'}`}>
                                      </div>
                                  )}
                                  
                                  <div className={`relative z-10 flex flex-col items-center transform 
                                              transition-all duration-500 ${
                                                  i === currentPair ? 'scale-110' : 'hover:scale-105'
                                              }`}>
                                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                                  shadow-lg transition-all duration-300 border-4
                                                  ${i === currentPair
                                                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 animate-pulse'
                                                      : i < currentPair
                                                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-200'
                                                      : 'bg-white border-gray-100'
                                                  }`}>
                                          <span className={`text-2xl font-bold ${
                                              i === currentPair
                                                  ? 'text-yellow-900'
                                                  : i < currentPair
                                                  ? 'text-white'
                                                  : 'text-gray-400'
                                          }`}>
                                              {pair.vocal.toUpperCase()}
                                          </span>
                                      </div>
                                      
                                      {i === currentPair && (
                                          <div className="absolute -bottom-6">
                                              <span className="text-yellow-500 text-2xl animate-bounce">⭐</span>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Barra de progreso */}
                  <div className="mt-12">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-purple-700">
                              Tu Progreso
                          </span>
                          <div className="flex items-center gap-2">
                              <div className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-bold">
                                  {(currentPair / (pairs.length - 1) * 100).toFixed(0)}%
                              </div>
                          </div>
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                          <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 
                                      transition-all duration-1000 relative"
                              style={{ width: `${(currentPair / (pairs.length - 1)) * 100}%` }}
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
                      src={solutionImages[pairs[currentPair].vocal]}
                      alt={`Solución: vocal ${pairs[currentPair].vocal}`}
                      className="w-96 h-96 object-contain mx-auto mb-4"
                  />
              </div>
          </div>
      )}

      {/* Temporizador */}
      {!showInstructions && !gameCompleted && (
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
                              strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.['animales-vocales'] || 10))}
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

        {showInstructions ? (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-purple-600">
              ¡Vamos a encontrar las vocales! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              ¿Con qué vocal empieza el nombre de cada animal?
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={startGame}
            >
              ¡Empezar! 🚀
            </button>
          </div>
        ) : gameCompleted ? (
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              ¡Felicitaciones! 🎉
            </h2>
            <div className="text-9xl mb-8">🏆</div>
            <p className="text-2xl text-gray-600 mb-8">
              ¡Has encontrado todas las vocales!
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8
                        rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => {
                // Asegurar que se guarda como completado
                localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, 'true');
                localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, pairs.length);
                onProgressUpdate(100, true);
                onBack();
              }}
            >
              Volver al menú
            </button>
          </div>
        ) : (
          <div className="text-center space-y-16">
            {currentPair < pairs.length && (
              <>
                <h2 className="text-4xl font-bold text-purple-600 mb-8">
                  ¿Con qué vocal empieza {pairs[currentPair].nombre}?
                </h2>
                {/* 
                <div className="text-9xl animate-bounce mb-8">
                  {pairs[currentPair].animal}
                </div>
                */}
                <div className="text-9xl animate-bounce mb-8 mt-2">
                  <img 
                    src={pairs[currentPair].imagen} 
                    alt={pairs[currentPair].nombre}
                    className="w-64 h-64 object-contain inline-block"
                  />
                </div>
        
                {/* Indicador visual de entrada */}
                <div className="mt-8">
                  <div className="text-2xl text-gray-600 mb-4">
                    Inserta la tarjeta con la vocal que corresponde a la primera letra del nombre del animal.
                  </div>
                  <div className="text-4xl font-bold text-purple-600">
                    Tu respuesta: <span className="text-6xl uppercase">{userInput}</span>
                  </div>
                </div>

                {/*
                {showFeedback && (
                  <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                              animate-bounce`}>
                    {isCorrect 
                      ? successMessages[Math.floor(Math.random() * successMessages.length)]
                      : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
                  </div>
                )}
                */}

              {showFeedback && (
                <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                                animate-bounce`}>
                  {feedbackMessage}
                </div>
              )}
              </>
            )}
        
            <div className="mt-8 text-gray-500">
              Progreso: {currentPair + 1} / {pairs.length}
            </div>
          </div>
        )
        
        }
      </div>
    </div>
  );
};

export default AnimalesVocales;