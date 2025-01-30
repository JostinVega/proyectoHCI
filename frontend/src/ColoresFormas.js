import React, { useState, useEffect, useRef } from 'react';

import solrojo from '../src/images/colorrojo.png';
import solamarillo from '../src/images/coloramarillo.png';
import solazul from '../src/images/colorazul.png';
import solmorado from '../src/images/colormorado.png';
import solverde from '../src/images/colorverde.png';
import solrosado from '../src/images/colorrosado.png';
import solanaranjado from '../src/images/coloranaranjado.png';

import audioVerde from '../src/sounds/colores-formas/colorCirculo.MP3';
import audioRosado from '../src/sounds/colores-formas/colorCuadrado.MP3';
import audioAmarillo from '../src/sounds/colores-formas/colorEstrella.MP3';
import audioMorado from '../src/sounds/colores-formas/colorTriangulo.MP3';
import audioRojo from '../src/sounds/colores-formas/colorCorazon.MP3';
import audioAnaranjado from '../src/sounds/colores-formas/colorRombo.MP3';
import audioAzul from '../src/sounds/colores-formas/colorLuna.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

const ColoresFormas = ({ player, onBack, onConfigClick, onProgressUpdate }) => {

  // Objeto para mapear colores con sus imágenes de solución
  const solutionImages = {
    'rojo': solrojo,
    'amarillo': solamarillo,
    'azul': solazul,
    'morado': solmorado,
    'verde': solverde,
    'rosado': solrosado,
    'anaranjado': solanaranjado
  };

  // Objeto para mapear colores con sus audios
  const colorFormasAudios = {
    'verde': audioVerde,
    'rosado': audioRosado,
    'amarillo': audioAmarillo,
    'morado': audioMorado,
    'rojo': audioRojo,
    'anaranjado': audioAnaranjado,
    'azul': audioAzul
  };

  // Datos de los pares color-forma
  const pairs = [
    {
      forma: 'circulo',
      color: 'verde',
      inicial: 'v'
    },
    {
      forma: 'cuadrado',
      color: 'rosado',
      inicial: 'r'
    },
    {
      forma: 'estrella',
      color: 'amarillo',
      inicial: 'a'
    },
    {
      forma: 'triangulo',
      color: 'morado',
      inicial: 'm'
    },
    {
      forma: 'corazon',
      color: 'rojo',
      inicial: 'r'
    },
    {
      forma: 'rombo',
      color: 'anaranjado',
      inicial: 'a'
    },
    {
      forma: 'luna',
      color: 'azul',
      inicial: 'a'
    }
  ];
  
  //const [currentPair, setCurrentPair] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [errorsArray, setErrorsArray] = useState(new Array(pairs.length).fill(0)); // Errores por forma
  const [responseTimes, setResponseTimes] = useState([]); // Tiempos de respuesta por forma
  const [startTime, setStartTime] = useState(Date.now()); // Tiempo de inicio de la pregunta actual
  const [currentPair, setCurrentPair] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel2_colores_formas_progress_${player.name}`);
    const completedStatus = localStorage.getItem(`nivel2_colores_formas_completed_${player.name}`);
    
    // Si está completado, forzar 100%
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
    const savedInstructions = localStorage.getItem(`nivel2_colores_formas_instructions_${player.name}`);
    return !savedInstructions;
  });

  //const [timeLeft, setTimeLeft] = useState(10);

  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};
    return tiempos['colores-formas'] || 10;
  });

  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};

  const [showSolution, setShowSolution] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const colorFormAudioRef = useRef(null);

   // SVG Components con animaciones más divertidas y amigables para niños
   const shapes = {
    circulo: () => (
      <svg 
        viewBox="0 0 100 100" 
        className="w-64 h-64 shape-circle"
      >
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="#10B981" 
          className="origin-center" 
        />
      </svg>
    ),
    cuadrado: () => (
      <svg 
        viewBox="0 0 100 100" 
        className="w-64 h-64 shape-square"
      >
        <rect 
          x="10" 
          y="10" 
          width="80" 
          height="80" 
          fill="#EC4899" 
          className="origin-center" 
        />
      </svg>
    ),
    estrella: () => (
      <svg 
        viewBox="0 0 100 100" 
        className="w-64 h-64 shape-star"
      >
        <polygon 
          points="50,5 61.8,38.2 95.1,38.2 69.4,61.8 80.3,95 50,75.4 19.7,95 30.6,61.8 4.9,38.2 38.2,38.2"
          fill="#F59E0B" 
          className="origin-center" 
        />
      </svg>
    ),
    triangulo: () => (
      <svg 
        viewBox="0 0 100 100" 
        className="w-64 h-64 shape-triangle"
      >
        <polygon 
          points="50,10 10,90 90,90" 
          fill="#8B5CF6" 
          className="origin-center" 
        />
      </svg>
    ),
    corazon: () => (
      <svg 
        viewBox="0 0 100 100" 
        className="w-64 h-64 shape-heart"
      >
        <path 
          d="M50,30 C30,20 10,40 30,60 C50,80 50,80 50,80 C50,80 50,80 70,60 C90,40 70,20 50,30"
          fill="#EF4444" 
          className="origin-center" 
        />
      </svg>
    ),
    rombo: () => (
      <svg 
        viewBox="0 0 100 100" 
        className="w-64 h-64 shape-diamond"
      >
        <polygon 
          points="50,10 90,50 50,90 10,50" 
          fill="#F97316" 
          className="origin-center" 
        />
      </svg>
    ),
    luna: () => (
      <svg 
        viewBox="0 0 100 100" 
        className="w-64 h-64 shape-moon"
      >
        <path 
          d="M60,10 C35,10 20,30 20,50 C20,70 35,90 60,90 C45,75 45,25 60,10 Z"
          fill="#3B82F6" 
          className="origin-center" 
        />
      </svg>
    )
  };

  

  // Mensajes de felicitación y ánimo
  const successMessages = [
    "¡Excelente trabajo! 🌟",
    "¡Lo lograste! ¡Eres increíble! ⭐",
    "¡Muy bien! ¡Sigue así! 🎉",
    "¡Fantástico! ¡Eres muy inteligente! 🏆",
    "¡Genial! ¡Lo hiciste perfectamente! 🌈"
  ];

  const encouragementMessages = [
    "¡Casi lo tienes! Intenta de nuevo 💪",
    "¡Sigue intentando! Tú puedes 🌟",
    "¡No te rindas! Estás muy cerca ⭐",
    "¡Vamos a intentarlo una vez más! 🎈"
  ];

  // Manejar la entrada del teclado
  const handleKeyPress = (e) => {
    if (showInstructions) return;
    
    const key = e.key.toLowerCase();
    if (!/[a-z]/.test(key)) return;
    
    setUserInput(key);
    checkAnswer(key);
  };

  /*
  const checkAnswer = (input) => {
    const isRight = input === pairs[currentPair].inicial;
    const responseTime = Date.now() - startTime; // Calcular tiempo de respuesta
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    if (!isRight) {
      // Registrar error
      setErrorsArray((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[currentPair] += 1;
  
        // Guardar detalles en el backend
        saveDetailsToDatabase({
          section: 'colores-formas',
          details: {
            [pairs[currentPair].forma]: {
              errors: updatedErrors[currentPair],
              time: responseTime / 1000, // Tiempo en segundos
              completed: false,
            },
          },
        });
  
        return updatedErrors;
      });
  
      // Reiniciar el tiempo de inicio para el próximo intento
      setStartTime(Date.now());
      return;
    }
  
    if (isRight) {
      // Guardar errores acumulados antes de guardar el estado como completado
      setErrorsArray((prevErrors) => {
        const updatedErrors = [...prevErrors];
  
        // Guardar detalles en el backend incluyendo los errores acumulados
        saveDetailsToDatabase({
          section: 'colores-formas',
          details: {
            [pairs[currentPair].forma]: {
              errors: updatedErrors[currentPair],
              time: responseTime / 1000, // Tiempo en segundos
              completed: true,
            },
          },
        });
  
        return updatedErrors; // Devolver los errores actualizados
      });
  
      if (currentPair === pairs.length - 1) {
        // Marcar como completado y guardar estado final
        localStorage.setItem(`nivel2_colores_formas_completed_${player.name}`, 'true');
        localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, pairs.length);
  
        // Comunicar 100% de progreso
        onProgressUpdate(100, true);
  
        // Mostrar estadísticas finales después de completar
        showFinalStats();
  
        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        // Avanzar al siguiente par
        const nextPair = currentPair + 1;
        localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, nextPair);
  
        // Calcular y comunicar progreso parcial
        const progress = ((nextPair) / pairs.length) * 100;
        onProgressUpdate(progress, false);
  
        setTimeout(() => {
          setCurrentPair(nextPair);
          setShowFeedback(false);
          setUserInput('');
          setStartTime(Date.now()); // Reiniciar tiempo de inicio para el próximo intento
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

  // UseEffect para reproducir el audio cuando cambia el par de color-forma
  useEffect(() => {
    if (!showInstructions && !gameCompleted && !showSolution) {
      if (colorFormAudioRef.current) {
        colorFormAudioRef.current.pause();
        colorFormAudioRef.current.currentTime = 0;
      }

      if (currentPair < pairs.length) {
        colorFormAudioRef.current = new Audio(colorFormasAudios[pairs[currentPair].color]);
        colorFormAudioRef.current.play().catch(error => {
          console.log("Error al reproducir el audio del color:", error);
        });
      }

      return () => {
        if (colorFormAudioRef.current) {
          colorFormAudioRef.current.pause();
          colorFormAudioRef.current.currentTime = 0;
        }
      };
    }
  }, [currentPair]);

  const checkAnswer = (input) => {
    if (showFeedback || showSolution || showInstructions || gameCompleted) return;

    const isRight = input === pairs[currentPair].inicial;
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
    const currentFormaColor = `${pairs[currentPair].forma}-${pairs[currentPair].color}`;

    if (!isRight) {
        setErrorsArray(prevErrors => {
            const updatedErrors = [...prevErrors];
            updatedErrors[currentPair] += 1;

            saveDetailsToDatabase({
                section: 'colores-formas',
                details: {
                    [currentFormaColor]: {
                        errors: updatedErrors[currentPair],
                        time: responseTime,
                        resultado: false
                    }
                }
            });

            console.log(`Intento incorrecto para ${currentFormaColor}:`, {
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
            section: 'colores-formas',
            details: {
                [currentFormaColor]: {
                    errors: currentErrors,
                    time: responseTime,
                    resultado: true
                }
            }
        });

        console.log(`Intento correcto para ${currentFormaColor}:`, {
            errors: currentErrors,
            time: responseTime,
            resultado: true
        });

        return prevErrors;
    });

    if (currentPair === pairs.length - 1) {
        localStorage.setItem(`nivel2_colores_formas_completed_${player.name}`, 'true');
        localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, pairs.length);
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
        localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, currentPair + 1);
        onProgressUpdate(((currentPair + 1) / pairs.length) * 100, false);

        setTimeout(() => {
            setCurrentPair(prev => prev + 1);
            setShowFeedback(false);
            setUserInput('');
            setStartTime(Date.now());
            //setTimeLeft(10);
            // Obtener el tiempo configurado
            const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || {};
            setTimeLeft(tiempos['colores-formas'] || 10);
        }, 2000);
    }
  };
  
  /*
  // Guardar detalles en el backend
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
        const response = await fetch('http://localhost:5000/api/game-details-colores-formas', {
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
                
                const currentFormaColor = `${pairs[currentPair].forma}-${pairs[currentPair].color}`;
                setErrorsArray(prevErrors => {
                    const currentErrors = prevErrors[currentPair];
                    
                    saveDetailsToDatabase({
                        section: 'colores-formas',
                        details: {
                            [currentFormaColor]: {
                                errors: currentErrors,
                                time: timeLeft,
                                resultado: false
                            }
                        }
                    });

                    console.log(`Tiempo agotado para ${currentFormaColor}:`, {
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
                        localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, pairs.length);
                        localStorage.setItem(`nivel2_colores_formas_completed_${player.name}`, 'true');
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
      totalErrors += errors;
      console.log(
        `Forma: ${pairs[index].forma} (${pairs[index].color}) | Errores: ${errors}`
      );
    });
  
    responseTimes.forEach((time, index) => {
      totalTime += time;
      console.log(
        `Forma: ${pairs[index].forma} (${pairs[index].color}) | Tiempo de respuesta: ${(time / 1000).toFixed(2)}s`
      );
    });
  
    console.log(`Errores totales: ${totalErrors}`);
    console.log(`Tiempo total de respuesta: ${(totalTime / 1000).toFixed(2)}s`);
  };  

  // Event listener para el teclado
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentPair, showInstructions]);

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel2_colores_formas_instructions_${player.name}`, 'started');
  };

  const handleBack = () => {
    // Verificar si está completado
    const isCompleted = localStorage.getItem(`nivel2_colores_formas_completed_${player.name}`) === 'true';
    
    if (isCompleted || gameCompleted) {
      // Si está completado, mantener el estado y forzar 100%
      localStorage.setItem(`nivel2_colores_formas_completed_${player.name}`, 'true');
      localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, pairs.length);
      onProgressUpdate(100, true);
    } else {
      // Guardar progreso parcial
      localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, currentPair);
      const progress = ((currentPair) / pairs.length) * 100;
      onProgressUpdate(progress, false);
    }
    
    onBack();
  };

  // Renderizar la forma actual
  const CurrentShape = shapes[pairs[currentPair].forma];

  return (
    <div>
      {/* Estilos de animación más divertida */}
      <style>{`
        /* Animaciones más dinámicas y divertidas para niños */
        @keyframes dance-wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.05); }
          75% { transform: rotate(10deg) scale(1.05); }
        }
        @keyframes jump-and-grow {
          0%, 100% { 
            transform: translateY(0) scale(1);
          }
          50% { 
            transform: translateY(-20px) scale(1.1);
          }
        }
        @keyframes happy-spin {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1.05); }
        }
        @keyframes playful-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        /* Aplicación de animaciones divertidas */
        .shape-circle { 
          animation: jump-and-grow 2s ease-in-out infinite; 
          transition: all 0.3s ease;
        }
        .shape-square { 
          animation: dance-wiggle 2.5s ease-in-out infinite; 
          transition: all 0.3s ease;
        }
        .shape-star { 
          animation: happy-spin 4s linear infinite; 
          transition: all 0.3s ease;
        }
        .shape-triangle { 
          animation: playful-shake 2s ease-in-out infinite; 
          transition: all 0.3s ease;
        }
        .shape-heart { 
          animation: jump-and-grow 3s ease-in-out infinite; 
          transition: all 0.3s ease;
        }
        .shape-diamond { 
          animation: dance-wiggle 3s ease-in-out infinite; 
          transition: all 0.3s ease;
        }
        .shape-moon { 
          animation: happy-spin 5s linear infinite; 
          transition: all 0.3s ease;
        }
      `}</style>

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
                      <span className="text-lg font-bold">Colores y Formas</span>
                  </div>

                  {/* Fases */}
                  <div className="flex justify-between items-center gap-3 mt-4 flex-wrap">
                      {pairs.map((pair, i) => (
                          <div key={i} className="flex-1 min-w-[3rem] max-w-[4rem] mb-4">
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
                                          <div className="w-full h-full flex items-center justify-center">
                                              {React.cloneElement(shapes[pair.forma](), {
                                                  className: 'w-6 h-6',
                                                  children: React.Children.map(shapes[pair.forma]().props.children, child =>
                                                      React.cloneElement(child, {
                                                          fill: i === currentPair
                                                              ? '#9333EA'
                                                              : i < currentPair
                                                              ? '#FFFFFF'
                                                              : '#6B7280'
                                                      })
                                                  )
                                              })}
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
                      src={solutionImages[pairs[currentPair].color]}
                      alt={`Solución: color ${pairs[currentPair].color}`}
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
                              strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.['colores-formas'] || 10))}
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
                ¡Vamos a identificar colores! 🎯
              </h2>
              <p className="text-xl text-gray-600">
                ¿De qué color es cada forma?
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
                ¡Has identificado todos los colores!
              </p>
              <button
                className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
                     onClick={() => {
                      // Asegurar que se guarda como completado
                      localStorage.setItem(`nivel2_colores_formas_completed_${player.name}`, 'true');
                      localStorage.setItem(`nivel2_colores_formas_progress_${player.name}`, pairs.length);
                      onProgressUpdate(100, true);
                      onBack();
                    }}
              >
                Volver al menú
              </button>
            </div>
          ) : (
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-purple-600 mb-8">
                ¿De qué color es este {pairs[currentPair].forma}?
              </h2>
              
              <div className="flex justify-center items-center mb-8">
                <CurrentShape />
              </div>

              <div className="mt-8">
                <div className="text-2xl text-gray-600 mb-4">
                Inserta la tarjeta que coincide con el color de la figura mostrada en pantalla.
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
    </div>
  );
};

export default ColoresFormas;