import React, { useState, useEffect, useRef } from 'react';

// Importar imágenes para las vocales y soluciones
import abejita from '../src/images/abejita.gif';
import elefante from '../src/images/elefante.gif';
import iguana from '../src/images/iguana.png';
import oso from '../src/images/oso.gif';
import unicornio from '../src/images/unicornio.gif';

// Importar las imágenes de solución 
import vocala from '../src/images/vocala.png';
import vocale from '../src/images/vocale.png';
import vocali from '../src/images/vocali.png';
import vocalo from '../src/images/vocalo.png';
import vocalu from '../src/images/vocalu.png';

// Importaciones de audios de vocales
import vocalA from '../src/sounds/vocales/vocalA.MP3';
import vocalE from '../src/sounds/vocales/vocalE.MP3';
import vocalI from '../src/sounds/vocales/vocalI.MP3';
import vocalO from '../src/sounds/vocales/vocalO.MP3';
import vocalU from '../src/sounds/vocales/vocalU.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

// Objeto para mapear vocales con sus imágenes de solución
const solutionImages = {
  'a': vocala,
  'e': vocale,
  'i': vocali,
  'o': vocalo,
  'u': vocalu
};

// Objeto para mapear vocales con sus audios correspondientes
const vocalAudios = {
  'a': vocalA,
  'e': vocalE,
  'i': vocalI,
  'o': vocalO,
  'u': vocalU
};

const Vocales = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  // Lista de vocales
  const vocales = ['a', 'e', 'i', 'o', 'u'];
  
  // Estados para manejar el progreso y las interacciones del usuario
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [detailsByNumber, setDetailsByNumber] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [errorsArray, setErrorsArray] = useState(new Array(vocales.length).fill(0));
  const [startTime, setStartTime] = useState(Date.now()); // Tiempo de inicio para cada intento
  const [responseTimes, setResponseTimes] = useState([]); // Array para almacenar los tiempos de respuesta

  // Estado inicial de currentVocal para recuperar progreso
  const [currentVocal, setCurrentVocal] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel1_vocales_progress_${player.name}`);
    return savedProgress ? parseInt(savedProgress) : 0;
  });

  // Recuperar el estado de instrucciones
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem(`nivel1_vocales_instructions_${player.name}`);
    return !savedInstructions;
  });

  // Temporizador para cada vocal
  //const [timeLeft, setTimeLeft] = useState(10);

  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
    return tiempos.vocales || 10; // 10 es el valor por defecto si no hay tiempo configurado
  });
  
  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};

  // Mostrar solución después de agotar el tiempo
  const [showSolution, setShowSolution] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const vocalAudioRef = useRef(null);

  // Configuración de cada vocal con su imagen y nombre
  const vocalesConfig = {
    'a': { imagen: abejita, nombre: 'abejita' },
    'e': { imagen: elefante, nombre: 'elefante' },
    'i': { imagen: iguana, nombre: 'iguana' },
    'o': { imagen: oso, nombre: 'oso' },
    'u': { imagen: unicornio, nombre: 'unicornio' }
  };

  // Mensajes de felicitación
  const successMessages = [
    "¡Excelente trabajo! 🌟",
    "¡Lo lograste! ¡Eres increíble! ⭐",
    "¡Muy bien! ¡Sigue así! 🎉",
    "¡Fantástico! ¡Eres muy inteligente! 🏆",
    "¡Genial! ¡Lo hiciste perfectamente! 🌈"
  ];

  // Mensajes de ánimo para intentos incorrectos
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
    if (!/[aeiou]/i.test(e.key)) return;
    //if (!/^[a-zA-Z]$/.test(e.key)) return;
    
    setUserInput(e.key.toLowerCase());
    checkAnswer(e.key.toLowerCase());
  };

  // Verificar el progreso guardado al cargar el componente
  useEffect(() => {
    const savedProgress = localStorage.getItem(`nivel1_vocales_progress_${player.name}`);
    const savedInstructions = localStorage.getItem(`nivel1_vocales_instructions_${player.name}`);
    
    if (savedProgress === '5') {
      setGameCompleted(true);
      onProgressUpdate(100, true);
    }
    
    if (savedInstructions) {
      setShowInstructions(false);
    }
  }, []);

  /*
  const saveDetailsToDatabase = async (updatedDetails) => {
    console.log('Datos que se enviarán al backend:', updatedDetails);
  
    try {
      const response = await fetch('http://localhost:5000/api/game-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: player.name,
          details: updatedDetails,
          section: 'vocales', // Especificar la sección
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
        const response = await fetch('http://localhost:5000/api/game-details-vocales', {
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

// UseEffect para reproducir el audio de instrucción de la vocal
useEffect(() => {
  if (!showInstructions && !gameCompleted && !showSolution) {
    // Reproducir el audio de la vocal actual
    if (vocalAudioRef.current) {
      vocalAudioRef.current.pause();
      vocalAudioRef.current.currentTime = 0;
    }

    // Crear nuevo audio para la vocal actual
    vocalAudioRef.current = new Audio(vocalAudios[vocales[currentVocal]]);
    vocalAudioRef.current.play().catch(error => {
      console.log("Error al reproducir el audio:", error);
    });

    // Limpiar cuando el componente se desmonte o cambien las condiciones
    return () => {
      if (vocalAudioRef.current) {
        vocalAudioRef.current.pause();
        vocalAudioRef.current.currentTime = 0;
      }
    };
  }
}, [currentVocal, showInstructions, gameCompleted, showSolution]);
  
  // Verificar respuesta del usuario
  const checkAnswer = (input) => {
    if (showFeedback || showSolution || showInstructions || gameCompleted) return;

    const isRight = input === vocales[currentVocal];
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
    const currentVocalName = vocales[currentVocal];

    if (!isRight) {
        setDetailsByNumber((prevDetails) => {
            const updatedDetails = { ...prevDetails };
            
            if (!updatedDetails[currentVocalName]) {
                updatedDetails[currentVocalName] = { 
                    errors: 0, 
                    time: 0, 
                    resultado: false 
                };
            }
            
            updatedDetails[currentVocalName] = {
                ...updatedDetails[currentVocalName],
                errors: updatedDetails[currentVocalName].errors + 1,
                resultado: false
            };

            
            // Guardar detalles en el backend
            saveDetailsToDatabase({
              section: "vocales",
              details: { [currentVocalName]: updatedDetails[currentVocalName] }  // Pasar los detalles directamente
            });
                      
            return updatedDetails;
        });

        setTimeout(() => {
            setShowFeedback(false);
            setUserInput('');
        }, 1000);
        return;
    }

    const progress = ((currentVocal + 1) / vocales.length) * 100;
    localStorage.setItem(`nivel1_vocales_progress_${player.name}`, currentVocal + 1);
    onProgressUpdate(progress, false);

    setDetailsByNumber((prevDetails) => {
        const updatedDetails = { ...prevDetails };

        if (!updatedDetails[currentVocalName]) {
            updatedDetails[currentVocalName] = { 
                errors: 0, 
                time: 0, 
                resultado: true 
            };
        }

        updatedDetails[currentVocalName] = {
            ...updatedDetails[currentVocalName],
            time: responseTime,
            resultado: true
        };

        // Guardar y mostrar en consola
        saveDetailsToDatabase({
          section: "vocales",
          details: { [currentVocalName]: updatedDetails[currentVocalName] }  // Pasar los detalles directamente
        });

        return updatedDetails;
    });

    if (currentVocal >= 4) {
      localStorage.setItem(`nivel1_vocales_progress_${player.name}`, '5');
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
            setCurrentVocal(prev => prev + 1);
            setShowFeedback(false);
            setUserInput('');
            setStartTime(Date.now());
            //setTimeLeft(10);
            // Obtener el tiempo configurado
            const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
            setTimeLeft(tiempos.vocales || 10);
        }, 2000);
      }
  };

  
  const showFinalStats = () => {
    let totalErrors = 0;
    let totalTime = 0;
  
    errorsArray.forEach((errors, index) => {
      const time = responseTimes[index] || 0; // Tiempo de respuesta para la vocal
      totalErrors += errors;
      totalTime += time;
      console.log(
        `Vocal: ${vocales[index]} | Errores: ${errors} | Tiempo de respuesta: ${time.toFixed(2)}s`
      );
    });
  
    console.log(`Errores totales: ${totalErrors}`);
    console.log(`Tiempo total: ${totalTime.toFixed(2)}s`);
  };  
  
  // Configurar el event listener del teclado
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentVocal, showInstructions]);


  // Temporizador para cada vocal
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
                
                const currentVocalName = vocales[currentVocal];
                setDetailsByNumber((prevDetails) => {
                    const updatedDetails = { ...prevDetails };
                    
                    if (!updatedDetails[currentVocalName]) {
                        updatedDetails[currentVocalName] = { 
                            errors: 0, 
                            time: timeLeft, 
                            resultado: false 
                        };
                    }
                    
                    updatedDetails[currentVocalName] = {
                        ...updatedDetails[currentVocalName],
                        time: timeLeft,
                        resultado: false
                    };

                    // Guardar y mostrar en consola
                    saveDetailsToDatabase({
                      section: 'vocales',
                      details: { [currentVocalName]: updatedDetails[currentVocalName] }
                    });
                    return updatedDetails;
                });
                
                timeoutId = setTimeout(() => {
                    setShowSolution(false);
                    
                    if (currentVocal < 4) {
                        setCurrentVocal(prev => prev + 1);
                        //setTimeLeft(10);
                        // Obtener el tiempo configurado
                        const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
                        setTimeLeft(tiempos.vocales || 10);
                        setStartTime(Date.now());
                    } else {
                        localStorage.setItem(`nivel1_vocales_progress_${player.name}`, '5');
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
  }, [currentVocal, showInstructions, gameCompleted, showSolution, player.name]);

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel1_vocales_instructions_${player.name}`, 'started');
  };

  // Método para manejar volver atrás
  const handleBack = () => {
    onBack();
  };

  // Renderizar el componente
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
                <span className="text-lg font-bold">Vocales</span>
              </div>

              {/* Fases - aquí mostramos las vocales A,E,I,O,U */}
              <div className="flex justify-between items-center gap-3 mt-4">
                {vocales.map((vocal, i) => (
                  <div key={i} className="flex-1">
                    <div className="relative">
                      {i < 4 && (
                        <div className={`absolute top-1/2 left-[60%] right-0 h-2 rounded-full
                                    ${i < currentVocal 
                                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                      : 'bg-gray-200'}`}>
                        </div>
                      )}
                      
                      <div className={`relative z-10 flex flex-col items-center transform 
                                  transition-all duration-500 ${
                                    i === currentVocal ? 'scale-110' : 'hover:scale-105'
                                  }`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                    shadow-lg transition-all duration-300 border-4
                                    ${i === currentVocal
                                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 animate-pulse'
                                      : i < currentVocal
                                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-200'
                                      : 'bg-white border-gray-100'
                                    }`}>
                          <span className={`text-2xl font-bold uppercase ${
                            i === currentVocal
                              ? 'text-yellow-900'
                              : i < currentVocal
                              ? 'text-white'
                              : 'text-gray-400'
                          }`}>
                            {vocal}
                          </span>
                        </div>
                        
                        {i === currentVocal && (
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
                      {(currentVocal / 4 * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 
                            transition-all duration-1000 relative"
                    style={{ width: `${(currentVocal / 4) * 100}%` }}
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
        

        {showInstructions ? (
          // Pantalla de instrucciones
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-purple-600">
              ¡Vamos a aprender las vocales! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Inserta la tarjeta de la vocal que ves en pantalla.
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
          // Pantalla de juego completado
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              ¡Felicitaciones! 🎉
            </h2>
            <div className="text-9xl mb-8">🏆</div>
            <p className="text-2xl text-gray-600 mb-8">
              ¡Has completado todas las vocales!
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
          // Pantalla del juego
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              Encuentra la vocal:
            </h2>
      
            {/* Contenedor principal de la vocal y el animal */}
            <div className="flex flex-col items-center justify-center gap-4">
              {/* Vocal - ahora más grande y en la parte superior */}
              <div className="text-[200px] font-bold text-blue-500 animate-bounce leading-none uppercase">
                {vocales[currentVocal]}
              </div>
              
              {/* Animal correspondiente - ahora más pequeño y debajo */}
              {vocalesConfig[vocales[currentVocal]] && (
                <div className="flex justify-center mt-4">
                  <img 
                    src={vocalesConfig[vocales[currentVocal]].imagen}
                    alt={vocalesConfig[vocales[currentVocal]].nombre}
                    className="w-48 h-48 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Mensaje de instrucción */}
            <p className="text-2xl text-gray-600">
              Inserta la tarjeta de la vocal {vocales[currentVocal]}
            </p>

            {/* Retroalimentación */}
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
                            src={solutionImages[vocales[currentVocal]]}
                            alt={`Solución: vocal ${vocales[currentVocal]}`}
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
                                    strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.vocales || 10))}
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

            {/* Indicador visual de entrada */}
            <div className="mt-8 text-gray-500">
              Tu respuesta: <span className="text-3xl font-bold uppercase">{userInput}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocales;