import React, { useState, useEffect, useRef } from 'react';

// Importar las imágenes de solución
import colorceleste from '../src/images/colorceleste.png';
import colorverde from '../src/images/colorverde.png';
import colorrosado from '../src/images/colorrosado.png';
import coloramarillo from '../src/images/coloramarillo.png';
import colormorado from '../src/images/colormorado.png';
import colorgris from '../src/images/colorgris.png';
import colorrojo from '../src/images/colorrojo.png';
import colormarron from '../src/images/colormarron.png';
import coloranaranjado from '../src/images/coloranaranjado.png';
import colorazul from '../src/images/colorazul.png';

import audioCeleste from '../src/sounds/colores/celeste.MP3';
import audioVerde from '../src/sounds/colores/verde.MP3';
import audioRosado from '../src/sounds/colores/rosado.MP3';
import audioAmarillo from '../src/sounds/colores/amarillo.MP3';
import audioMorado from '../src/sounds/colores/morado.MP3';
import audioGris from '../src/sounds/colores/gris.MP3';
import audioRojo from '../src/sounds/colores/rojo.MP3';
import audioMarron from '../src/sounds/colores/marron.MP3';
import audioAnaranjado from '../src/sounds/colores/anaranjado.MP3';
import audioAzul from '../src/sounds/colores/azul.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

// Mapa de colores y sus códigos hexadecimales
const ColorMap = {
  celeste: '#64B5F6',    
  verde: '#4CAF50',      
  rosado: '#FF69B4',     
  amarillo: '#FFEB3B',   
  morado: '#9C27B0',     
  gris: '#9E9E9E',       
  rojo: '#F44336',       
  marron: '#795548',     
  anaranjado: '#FF5722', 
  azul: '#2196F3'        
};

// Objeto para mapear colores con sus imágenes de solución
const solutionImages = {
  'celeste': colorceleste,
  'verde': colorverde,
  'rosado': colorrosado,
  'amarillo': coloramarillo,
  'morado': colormorado,
  'gris': colorgris,
  'rojo': colorrojo,
  'marron': colormarron,
  'anaranjado': coloranaranjado,
  'azul': colorazul
};

// Objeto para mapear colores con sus audios
const colorAudios = {
  'celeste': audioCeleste,
  'verde': audioVerde,
  'rosado': audioRosado,
  'amarillo': audioAmarillo,
  'morado': audioMorado,
  'gris': audioGris,
  'rojo': audioRojo,
  'marron': audioMarron,
  'anaranjado': audioAnaranjado,
  'azul': audioAzul
};

const Colores = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  // Lista de colores que se utilizarán en el juego
  const colores = ['celeste', 'verde', 'rosado', 'amarillo', 'morado', 'gris', 'rojo', 'marron', 'anaranjado', 'azul'];
  //const [currentColor, setCurrentColor] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  //const [showInstructions, setShowInstructions] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [errorsArray, setErrorsArray] = useState(new Array(colores.length).fill(0));
  const [colorStats, setColorStats] = useState([]);

  const [startTime, setStartTime] = useState(Date.now());

   // Modificar estado inicial para recuperar progreso
   const [currentColor, setCurrentColor] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel1_colores_progress_${player.name}`);
    return savedProgress ? parseInt(savedProgress) : 0;
  });

  // Modificar estado de instrucciones para recuperar
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem(`nivel1_colores_instructions_${player.name}`);
    return !savedInstructions;
  });

  //const [timeLeft, setTimeLeft] = useState(10);

  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
    return tiempos.colores || 10; // 10 es el valor por defecto si no hay tiempo configurado
  });

  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};

  const [showSolution, setShowSolution] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const colorAudioRef = useRef(null);

  // Mensajes de éxito y ánimo
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

  /*
  // Componente para mostrar estrellas al acertar
  const StarBurst = ({ color }) => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30 - 40}%`, // Empiezan desde arriba de la pantalla
              animation: `fallingStar ${4 + Math.random() * 5}s linear forwards`, // Aumenté la duración de 2-3s a 4-5s
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <div
              style={{
                background: ColorMap[color],
                width: `${20 + Math.random() * 15}px`, // Tamaños variados
                height: `${20 + Math.random() * 15}px`,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                boxShadow: `0 0 10px ${ColorMap[color]}, 0 0 20px ${ColorMap[color]}`,
              }}
            />
          </div>
        ))}
        <style>{`
          @keyframes fallingStar {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(${window.innerHeight}px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  */


  const StarBurst = ({ color }) => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              animation: `starFall ${3 + Math.random() * 2}s linear forwards`,
              animationDelay: `${Math.random() * 1}s`,
            }}
          >
            <div
              style={{
                background: ColorMap[color],
                width: `${15 + Math.random() * 25}px`,  // Aumentado de 8-20px a 15-40px
                height: `${15 + Math.random() * 25}px`, // Aumentado de 8-20px a 15-40px
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                boxShadow: `0 0 15px ${ColorMap[color]}`, // Aumentado el brillo también
                opacity: 0.8 + Math.random() * 0.2,
              }}
            />
          </div>
        ))}
        <style>{`
          @keyframes starFall {
            from {
              transform: translateY(0) translateX(0) rotate(0deg);
              opacity: 1;
            }
            to {
              transform: translateY(${window.innerHeight + 100}px) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };
  
  // Componente para mostrar colores en una animación de arcoíris
  const RainbowDisplay = () => {
    return (
      <div className="flex justify-center items-end perspective-1000">
        {colores.map((color, index) => {
          const isCurrentColor = index === currentColor;
          
          return (
            <div 
              key={color}
              className={`
                w-16 h-40 mx-2 rounded-t-full
                transition-all duration-500 ease-in-out
                ${isCurrentColor ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
              `}
              style={{
                backgroundColor: ColorMap[color],
                transform: isCurrentColor ? 'translateY(-60px)' : 'translateY(100px)',
                boxShadow: isCurrentColor ? '0 10px 30px rgba(0,0,0,0.3)' : 'none',
                animation: isCurrentColor ? 'playfulJump 2s infinite' : 'none'
              }}
            >
              <style>{`
                @keyframes playfulJump {
                  0% {
                    transform: translateY(-20px) scale(1);
                    filter: brightness(1);
                  }
                  25% {
                    transform: translateY(-120px) scale(1.4) rotate(15deg);
                    filter: brightness(1.3);
                  }
                  50% {
                    transform: translateY(-20px) scale(1) rotate(0deg);
                    filter: brightness(1);
                  }
                  75% {
                    transform: translateY(-100px) scale(1.3) rotate(-15deg);
                    filter: brightness(1.2);
                  }
                  100% {
                    transform: translateY(-20px) scale(1) rotate(0deg);
                    filter: brightness(1);
                  }
                }
              `}</style>
            </div>
          );
        })}
      </div>
    );
  };

  // Maneja la entrada del teclado
  const handleKeyPress = (e) => {
    if (showInstructions || isAnimating) return;
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    setUserInput(e.key.toLowerCase());
    checkAnswer(e.key.toLowerCase());
  };

  // Efecto para manejar el progreso inicial y las instrucciones
  useEffect(() => {
    const savedProgress = localStorage.getItem(`nivel1_colores_progress_${player.name}`);
    const savedInstructions = localStorage.getItem(`nivel1_colores_instructions_${player.name}`);
    
    if (savedProgress === '10') {
      setGameCompleted(true);
      onProgressUpdate(100, true);
    }
    
    if (savedInstructions) {
      setShowInstructions(false);
    }
  }, []);

  /*
  const saveDetailsToDatabase = async ({ section, details }) => {
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
        section: 'colores',
        details: details
    };

    console.log('Datos que se enviarán al backend:', dataToSend);

    try {
        const response = await fetch('http://localhost:5000/api/game-details-colores', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al guardar detalles: ${JSON.stringify(errorData)}`);
        }

        console.log('Detalles guardados correctamente en la base de datos');
    } catch (error) {
        console.error('Error en saveDetailsToDatabase:', error.message);
    }
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

// UseEffect para el audio del color actual
useEffect(() => {
  if (!showInstructions && !gameCompleted && !showSolution && !isAnimating) {
    if (colorAudioRef.current) {
      colorAudioRef.current.pause();
      colorAudioRef.current.currentTime = 0;
    }

    // Crear un nuevo audio para el color actual
    colorAudioRef.current = new Audio(colorAudios[colores[currentColor]]);

    // Función para reproducir el audio
    const playAudioSequence = () => {
      colorAudioRef.current.addEventListener('ended', () => {
        console.log("Audio de color completado");
      });

      colorAudioRef.current.play().catch(error => {
        console.log("Error al reproducir el audio del color:", error);
      });
    };

    // Iniciar la secuencia después de un pequeño delay
    const timeoutId = setTimeout(playAudioSequence, 300);

    return () => {
      clearTimeout(timeoutId);
      if (colorAudioRef.current) {
        colorAudioRef.current.pause();
        colorAudioRef.current.currentTime = 0;
      }
    };
  }
}, [currentColor]);

  const checkAnswer = (input) => {
    if (showFeedback || showSolution || showInstructions || gameCompleted || isAnimating) return;

    const currentColorNombre = colores[currentColor];
    const isRight = input === currentColorNombre.charAt(0);
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

    
    if (!isRight) {
        setColorStats((prevStats) => {
            const updatedStats = { ...prevStats };
            
            if (!updatedStats[currentColorNombre]) {
                updatedStats[currentColorNombre] = { 
                    errors: 0, 
                    time: 0, 
                    resultado: false 
                };
            }
            
            updatedStats[currentColorNombre] = {
                ...updatedStats[currentColorNombre],
                errors: updatedStats[currentColorNombre].errors + 1,
                resultado: false
            };

            saveDetailsToDatabase({
                section: 'colores',
                details: { [currentColorNombre]: updatedStats[currentColorNombre] }
            });

            console.log(`Intento incorrecto para color ${currentColorNombre}:`, updatedStats[currentColorNombre]);

            return updatedStats;
        });

        setTimeout(() => {
            setShowFeedback(false);
            setUserInput('');
        }, 1000);
        return;
    }

    const endTime = Date.now();
    const responseTime = Math.min((endTime - startTime) / 1000, 10);

    const progress = ((currentColor + 1) / colores.length) * 100;
    localStorage.setItem(`nivel1_colores_progress_${player.name}`, currentColor + 1);
    onProgressUpdate(progress, false);

    setColorStats((prevStats) => {
        const updatedStats = { ...prevStats };

        if (!updatedStats[currentColorNombre]) {
            updatedStats[currentColorNombre] = { 
                errors: 0, 
                time: 0, 
                resultado: true 
            };
        }

        updatedStats[currentColorNombre] = {
            ...updatedStats[currentColorNombre],
            time: responseTime,
            resultado: true
        };

        saveDetailsToDatabase({
            section: 'colores',
            details: { [currentColorNombre]: updatedStats[currentColorNombre] }
        });

        console.log(`Intento correcto para color ${currentColorNombre}:`, updatedStats[currentColorNombre]);

        return updatedStats;
    });

    if (currentColor >= colores.length - 1) {
        localStorage.setItem(`nivel1_colores_progress_${player.name}`, '10');
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
        setTimeout(() => {
            setCurrentColor(prev => prev + 1);
            setShowFeedback(false);
            setUserInput('');
            setStartTime(Date.now());
            //setTimeLeft(10);
            const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
            setTimeLeft(tiempos.colores || 10);
        }, 2000);
    }
};
  
  const showFinalStats = () => {
    let totalErrors = 0;
    let totalTime = 0;
  
    Object.keys(colorStats).forEach((key) => {
      const { errors, time } = colorStats[key];
      totalErrors += errors;
      totalTime += time;
      console.log(
        `Color: ${key} | Errores: ${errors} | Tiempo de respuesta: ${time.toFixed(2)}s`
      );
    });
  
    console.log(`Errores totales: ${totalErrors}`);
    console.log(`Tiempo total: ${totalTime.toFixed(2)}s`);
  };  
  

  useEffect(() => {
    if (!showInstructions && !gameCompleted) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  }, [currentColor, showInstructions, gameCompleted]);

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentColor, showInstructions, isAnimating]);

  useEffect(() => {
    if (showInstructions || gameCompleted || showSolution || isAnimating) return;

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
                
                const currentColorNombre = colores[currentColor];
                setColorStats((prevStats) => {
                    const updatedStats = { ...prevStats };
                    
                    if (!updatedStats[currentColorNombre]) {
                        updatedStats[currentColorNombre] = { 
                            errors: 0, 
                            time: timeLeft, 
                            resultado: false 
                        };
                    }
                    
                    updatedStats[currentColorNombre] = {
                        ...updatedStats[currentColorNombre],
                        time: timeLeft,
                        resultado: false
                    };

                    saveDetailsToDatabase({
                        section: 'colores',
                        details: { [currentColorNombre]: updatedStats[currentColorNombre] }
                    });

                    console.log(`Tiempo agotado para color ${currentColorNombre}:`, updatedStats[currentColorNombre]);

                    return updatedStats;
                });
                
                timeoutId = setTimeout(() => {
                    setShowSolution(false);
                    
                    if (currentColor < colores.length - 1) {
                        setCurrentColor(prev => prev + 1);
                        //setTimeLeft(10);
                        // Obtener el tiempo configurado
                        const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
                        setTimeLeft(tiempos.colores || 10);
                        setStartTime(Date.now());
                    } else {
                        localStorage.setItem(`nivel1_colores_progress_${player.name}`, '10');
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
}, [currentColor, showInstructions, gameCompleted, showSolution, isAnimating, player.name]);

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel1_colores_instructions_${player.name}`, 'started');
  };

  // Método para manejar volver atrás
  const handleBack = () => {
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
                      <span className="text-lg font-bold">Colores</span>
                  </div>

                  {/* Fases */}
                  <div className="flex justify-between items-center gap-3 mt-4">
                      {colores.map((color, i) => (
                          <div key={i} className="flex-1">
                              <div className="relative">
                                  {i < colores.length - 1 && (
                                      <div className={`absolute top-1/2 left-[60%] right-0 h-2 rounded-full
                                                  ${i < currentColor 
                                                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                                      : 'bg-gray-200'}`}>
                                      </div>
                                  )}
                                  
                                  <div className={`relative z-10 flex flex-col items-center transform 
                                              transition-all duration-500 ${
                                                  i === currentColor ? 'scale-110' : 'hover:scale-105'
                                              }`}>
                                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                                  shadow-lg transition-all duration-300 border-4
                                                  ${i === currentColor
                                                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 animate-pulse'
                                                      : i < currentColor
                                                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-200'
                                                      : 'bg-white border-gray-100'
                                                  }`}>
                                          <div
                                              className="w-10 h-10 rounded-full"
                                              style={{ backgroundColor: ColorMap[color] }}
                                          />
                                      </div>
                                      
                                      {i === currentColor && (
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
                                  {(currentColor / (colores.length - 1) * 100).toFixed(0)}%
                              </div>
                          </div>
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                          <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 
                                      transition-all duration-1000 relative"
                              style={{ width: `${(currentColor / (colores.length - 1)) * 100}%` }}
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
                            src={solutionImages[colores[currentColor]]}
                            alt={`Solución: color ${colores[currentColor]}`}
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
                                    strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.colores || 10))}
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
      )}

        {showInstructions ? (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-purple-600">
              ¡Vamos a aprender los colores! 🎨
            </h2>
            <p className="text-xl text-gray-600">
              Inserta la tarjeta del color que se destaca en el arcoíris.
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
              ¡Has completado todos los colores!
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
            <h2 className="text-4xl font-bold text-purple-600 mb-24">
              Encuentra el color:
            </h2>
            
            <div className="flex justify-center items-end mb-24 relative">
                <RainbowDisplay />
                {isCorrect && showFeedback && !isAnimating && (
                    <StarBurst color={colores[currentColor]} />
                )}
            </div>

            <p className="text-2xl text-gray-600">
              {!isAnimating && `Inserta la tarjeta del color ${colores[currentColor]}`}
            </p>

            {/*
            {showFeedback && !isAnimating && (
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                          animate-bounce`}>
                {isCorrect 
                  ? successMessages[Math.floor(Math.random() * successMessages.length)]
                  : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
              </div>
            )}*/}

            {showFeedback && !isAnimating && (
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                              animate-bounce`}>
                {feedbackMessage}
              </div>
            )}

            <div className="mt-8 text-gray-500">
              Tu respuesta: <span className="text-3xl font-bold uppercase">{userInput}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Colores;