import React, { useState, useEffect, useRef } from 'react';

import pajarito from '../src/images/pajarito.png';
import tortuga from '../src/images/tortuga.png';
import cerdito from '../src/images/cerdito.png';
import patito from '../src/images/patito.png';
import mariposa from '../src/images/mariposa.png';
import pollito from '../src/images/pollito.png';
import gatito from '../src/images/gatito.png';
import perrito from '../src/images/perrito.png';
import oveja from '../src/images/oveja.png';

// Importar las imágenes de solución
import soluno from '../src/images/numero1.png';
import soldos from '../src/images/numero2.png';
import soltres from '../src/images/numero3.png';
import solcuatro from '../src/images/numero4.png';
import solcinco from '../src/images/numero5.png';
import solseis from '../src/images/numero6.png';
import solsiete from '../src/images/numero7.png';
import solocho from '../src/images/numero8.png';
import solnueve from '../src/images/numero9.png';

import uno from '../src/sounds/animales-numeros/1pajarito.MP3';
import dos from '../src/sounds/animales-numeros/2tortugas.MP3';
import tres from '../src/sounds/animales-numeros/3cerditos.MP3';
import cuatro from '../src/sounds/animales-numeros/4patitos.MP3';
import cinco from '../src/sounds/animales-numeros/5mariposas.MP3';
import seis from '../src/sounds/animales-numeros/6pollitos.MP3';
import siete from '../src/sounds/animales-numeros/7gatitos.MP3';
import ocho from '../src/sounds/animales-numeros/8perritos.MP3';
import nueve from '../src/sounds/animales-numeros/9ovejas.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

const AnimalesNumeros = ({ player, onBack, onConfigClick, onProgressUpdate }) => {

  // Datos de los pares animal-número
  /*
  const pairs = [
    {
      animal: '🐦',
      cantidad: 1,
      nombre: 'pájaro'
    },
    {
      animal: '🐢',
      cantidad: 2,
      nombre: 'tortuga'
    },
    {
      animal: '🐷',
      cantidad: 3,
      nombre: 'cerdo'
    },
    {
      animal: '🦆',
      cantidad: 4,
      nombre: 'pato'
    },
    {
      animal: '🦋',
      cantidad: 5,
      nombre: 'mariposa'
    },
    {
      animal: '🐥',
      cantidad: 6,
      nombre: 'pollito'
    },
    {
      animal: '🐱',
      cantidad: 7,
      nombre: 'gato'
    },
    {
      animal: '🐶',
      cantidad: 8,
      nombre: 'perro'
    },
    {
      animal: '🐑',
      cantidad: 9,
      nombre: 'oveja'
    }
  ];
  */

  // Objeto para mapear las soluciones
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

  // Objeto para mapear números con sus audios
  const numberAudios = {
    1: uno,
    2: dos,
    3: tres,
    4: cuatro,
    5: cinco,
    6: seis,
    7: siete,
    8: ocho,
    9: nueve
  };

  const pairs = [
    {
      imagen: pajarito,
      cantidad: 1,
      nombre: 'pájaro'
    },
    {
      imagen: tortuga,
      cantidad: 2,
      nombre: 'tortuga'
    },
    {
      imagen: cerdito,
      cantidad: 3,
      nombre: 'cerdo'
    },
    {
      imagen: patito,
      cantidad: 4,
      nombre: 'pato'
    },
    {
      imagen: mariposa,
      cantidad: 5,
      nombre: 'mariposa'
    },
    {
      imagen: pollito,
      cantidad: 6,
      nombre: 'pollito'
    },
    {
      imagen: gatito,
      cantidad: 7,
      nombre: 'gato'
    },
    {
      imagen: perrito,
      cantidad: 8,
      nombre: 'perro'
    },
    {
      imagen: oveja,
      cantidad: 9,
      nombre: 'oveja'
    }
  ];

  //const [currentPair, setCurrentPair] = useState(0);
  const [userInput, setUserInput] = useState('');  // Cambiado de userAnswer
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  //const [showInstructions, setShowInstructions] = useState(true);

  const [errorsArray, setErrorsArray] = useState(new Array(pairs.length).fill(0));

  const [startTime, setStartTime] = useState(Date.now()); // Tiempo de inicio para cada intento
  const [responseTimes, setResponseTimes] = useState([]); // Array para almacenar los tiempos de respuesta

  const [currentPair, setCurrentPair] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel2_animales_numeros_progress_${player.name}`);
    const isCompleted = localStorage.getItem(`nivel2_animales_numeros_completed_${player.name}`);
    
    if (isCompleted === 'true') {
      return pairs.length - 1; // Retorna el último índice si está completado
    }
    
    const progress = savedProgress ? parseInt(savedProgress) : 0;
    return progress >= 0 && progress < pairs.length ? progress : 0;
  });

  // Modificar estado de instrucciones para recuperar
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem(`nivel2_animales_numeros_instructions_${player.name}`);
    return !savedInstructions;
  });

  //const [timeLeft, setTimeLeft] = useState(10);

  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};
    return tiempos['animales-numeros'] || 10; // 10 es el valor por defecto
  });

  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};

  const [showSolution, setShowSolution] = useState(false);
  
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const numberAudioRef = useRef(null);

  // Al inicio del componente, después de la definición de pairs
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

  // Verificar si el juego está completado al cargar
  useEffect(() => {
    const savedProgress = localStorage.getItem(`nivel2_animales_numeros_progress_${player.name}`);
    const isCompleted = localStorage.getItem(`nivel2_animales_numeros_completed_${player.name}`);
    const savedInstructions = localStorage.getItem(`nivel2_animales_numeros_instructions_${player.name}`);
    
    if (isCompleted === 'true' || savedProgress === '9') {
      setGameCompleted(true);
      onProgressUpdate(100, true);
      setCurrentPair(pairs.length - 1); // Asegurarnos que currentPair esté en la última posición
    }
    
    if (savedInstructions) {
      setShowInstructions(false);
    }
  }, []);

  // Manejar la entrada del teclado
  const handleKeyPress = (e) => {
    if (showInstructions) return;
    
    // Solo permitir números
    if (!/[0-9]/.test(e.key)) return;
    
    setUserInput(e.key);
    checkAnswer(e.key);
  };

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
        const response = await fetch('http://localhost:5000/api/game-details-animales-numeros', {
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
  /*
  const checkAnswer = (input) => {
    if (currentPair >= pairs.length) return;
  
    const isRight = parseInt(input) === pairs[currentPair].cantidad;
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    // Calcular el tiempo de respuesta
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // Tiempo en segundos
  
    // Actualizar detalles de la respuesta
    setResponseTimes((prevTimes) => [...prevTimes, responseTime]);
  
    setErrorsArray((prevErrors) => {
      const updatedErrors = [...prevErrors];
      if (!isRight) {
        updatedErrors[currentPair] += 1; // Incrementar el error para el par actual
      }
    
      // Enviar los detalles al backend con los errores acumulados
      const currentAnimal = pairs[currentPair].nombre;
      const errorsForCurrentPair = updatedErrors[currentPair]; // Obtener los errores acumulados para este par
    
      saveDetailsToDatabase({
        section: 'animales-numeros',
        details: {
          [currentAnimal]: {
            errors: errorsForCurrentPair, // Usar el valor actualizado
            time: (Date.now() - startTime) / 1000, // Tiempo en segundos
            completed: isRight,
          },
        },
      });
    
      return updatedErrors; // Actualizar el estado de errores
    });       
  
    const currentAnimal = pairs[currentPair].nombre;
  
    // Guardar los detalles en el backend
    saveDetailsToDatabase({
      section: 'animales-numeros',
      details: {
        [currentAnimal]: {
          errors: errorsArray[currentPair], // Pasar los errores acumulados hasta ahora
          time: responseTime,
          completed: isRight,
        },
      },
    });    
  
    if (!isRight) {
      console.log('Respuesta incorrecta');
      return;
    }
  
    // Actualizar progreso
    if (currentPair === pairs.length - 1) {
      localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, pairs.length);
      localStorage.setItem(`nivel2_animales_numeros_completed_${player.name}`, 'true');
      onProgressUpdate(100, true);
  
      showFinalStats();
  
      setTimeout(() => {
        setGameCompleted(true);
        setShowFeedback(false);
      }, 2000);
    } else {
      localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, currentPair + 1);
      onProgressUpdate(((currentPair + 1) / pairs.length) * 100, false);
  
      setTimeout(() => {
        setCurrentPair((prev) => prev + 1);
        setShowFeedback(false);
        setUserInput('');
        setStartTime(Date.now());
      }, 2000);
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
    return () => {
      if (successAudioRef.current) {
        successAudioRef.current.pause();
        successAudioRef.current.currentTime = 0;
      }
      if (encouragementAudioRef.current) {
        encouragementAudioRef.current.pause();
        encouragementAudioRef.current.currentTime = 0;
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

  // UseEffect para reproducir el audio cuando cambia el par de animal-número
  useEffect(() => {
    if (!showInstructions && !gameCompleted && !showSolution) {
      if (numberAudioRef.current) {
        numberAudioRef.current.pause();
        numberAudioRef.current.currentTime = 0;
      }

      if (currentPair < pairs.length) {
        numberAudioRef.current = new Audio(numberAudios[pairs[currentPair].cantidad]);
        numberAudioRef.current.play().catch(error => {
          console.log("Error al reproducir el audio del número:", error);
        });
      }

      return () => {
        if (numberAudioRef.current) {
          numberAudioRef.current.pause();
          numberAudioRef.current.currentTime = 0;
        }
      };
    }
  }, [currentPair, showInstructions, gameCompleted, showSolution]);

  const checkAnswer = (input) => {
    if (showFeedback || showSolution || showInstructions || gameCompleted) return;
    if (currentPair >= pairs.length) return;

    const isRight = parseInt(input) === pairs[currentPair].cantidad;
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
        // Actualizar estado para respuesta incorrecta
        setErrorsArray(prevErrors => {
            const updatedErrors = [...prevErrors];
            updatedErrors[currentPair] += 1;

            // Guardar en backend con errores acumulados
            saveDetailsToDatabase({
                section: 'animales-numeros',
                details: {
                    [currentAnimal]: {
                        errors: updatedErrors[currentPair],
                        time: responseTime,
                        resultado: false
                    }
                }
            });

            // Mostrar en consola
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

    // Para respuesta correcta
    setErrorsArray(prevErrors => {
        const currentErrors = prevErrors[currentPair];
        
        // Guardar en backend con errores acumulados
        saveDetailsToDatabase({
            section: 'animales-numeros',
            details: {
                [currentAnimal]: {
                    errors: currentErrors,
                    time: responseTime,
                    resultado: true
                }
            }
        });

        // Mostrar en consola
        console.log(`Intento correcto para ${currentAnimal}:`, {
            errors: currentErrors,
            time: responseTime,
            resultado: true
        });

        return prevErrors; // Mantener el array de errores sin cambios
    });

    // Actualizar progreso
    const progress = ((currentPair + 1) / pairs.length) * 100;

    if (currentPair === pairs.length - 1) {
        localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, pairs.length);
        localStorage.setItem(`nivel2_animales_numeros_completed_${player.name}`, 'true');
        onProgressUpdate(100, true);
        showFinalStats();

        // Reproducir el audio de completado
        if (completedAudioRef.current) {
          completedAudioRef.current.play().catch(error => {
            console.log("Error al reproducir audio de completado:", error);
          });
        }

        setTimeout(() => {
            setGameCompleted(true);
            setShowFeedback(false);
        }, 2000);
    } else {
        localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, currentPair + 1);
        onProgressUpdate(progress, false);

        setTimeout(() => {
            setCurrentPair(prev => prev + 1);
            setShowFeedback(false);
            setUserInput('');
            setStartTime(Date.now());
            //setTimeLeft(10);
            // Obtener el tiempo configurado
            const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};
            setTimeLeft(tiempos['animales-numeros'] || 10);
        }, 2000);
    }
  };

  // Temporizador
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
                    
                    // Guardar detalles cuando se acaba el tiempo
                    saveDetailsToDatabase({
                        section: 'animales-numeros',
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
                        setTimeLeft(tiempos['animales-numeros'] || 10);
                        setStartTime(Date.now());
                    } else {
                        localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, pairs.length);
                        localStorage.setItem(`nivel2_animales_numeros_completed_${player.name}`, 'true');
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

  const showFinalStats = () => {
    let totalErrors = 0;
    let totalTime = 0;
  
    errorsArray.forEach((errors, index) => {
      const time = responseTimes[index] || 0; // Tiempo de respuesta para el par actual
      totalErrors += errors; // Sumar los errores acumulados
      totalTime += time;
      console.log(
        `Animal: ${pairs[index].nombre} (${pairs[index].cantidad}) | Errores: ${errors} | Tiempo de respuesta: ${time.toFixed(2)}s`
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
    localStorage.setItem(`nivel2_animales_numeros_instructions_${player.name}`, 'started');
  };

  // Método para manejar volver atrás
  const handleBack = () => {
    if (!gameCompleted) {
      localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, currentPair);
      localStorage.setItem(`nivel2_animales_numeros_instructions_${player.name}`, 'started');
    }
    onBack();
  };

  // Renderizar los animales según la cantidad
  /*
  const renderAnimales = () => {
    if (currentPair >= pairs.length) return null;
    
    const animales = [];
    for (let i = 0; i < pairs[currentPair].cantidad; i++) {
      animales.push(
        <span key={i} className="text-5xl animate-bounce inline-block m-2">
          {pairs[currentPair].animal}
        </span>
      );
    }
    return animales;
  };
  */

  const renderAnimales = () => {
    if (currentPair >= pairs.length) return null;
    
    const animales = [];
    for (let i = 0; i < pairs[currentPair].cantidad; i++) {
      animales.push(
        <div key={i} className="animate-bounce inline-block m-2">
          <img 
            src={pairs[currentPair].imagen} 
            alt={pairs[currentPair].nombre}
            className="w-24 h-24 object-contain"
          />
        </div>
      );
    }
    return animales;
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
                    <span className="text-lg font-bold">Conteo de animales</span>
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
                                        <div className={`text-2xl font-bold ${
                                            i === currentPair
                                                ? 'text-yellow-900'
                                                : i < currentPair
                                                ? 'text-white'
                                                : 'text-gray-400'
                                        }`}>
                                            {pair.cantidad}
                                        </div>
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
                    src={solutionImages[pairs[currentPair].cantidad]}
                    alt={`Solución: número ${pairs[currentPair].cantidad}`}
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
                            strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.['animales-numeros'] || 10))}
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
              ¡Vamos a contar animales! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Cuenta los animales y presiona el número correcto en tu teclado.
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
              ¡Has completado todos los ejercicios!
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={onBack}
            >
              Volver al menú
            </button>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              {currentPair < pairs.length ? 
                `¿Cuántos ${pairs[currentPair].nombre}s hay?` : 
                "¿Cuántos animales hay?"}
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {renderAnimales()}
            </div>

            {/* Indicador visual de entrada */}
            <div className="mt-8">
              <div className="text-2xl text-gray-600 mb-4">
                Inserta la tarjeta que corresponda al número de animales que se muestra en pantalla.
              </div>
              <div className="text-4xl font-bold text-purple-600">
                Tu respuesta: <span className="text-6xl">{userInput}</span>
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
            )}*/}

            {showFeedback && (
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                              animate-bounce`}>
                {feedbackMessage}
              </div>
            )}

            <div className="mt-8 text-gray-500">
              Progreso: {currentPair + 1} / {pairs.length}
            </div>
          </div>
        )}
      </div>
    </div>
    
  );

  
};

export default AnimalesNumeros;