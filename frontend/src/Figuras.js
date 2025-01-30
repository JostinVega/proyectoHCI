import figuracirculo from '../src/images/figuracirculo.png';
import figuracuadrado from '../src/images/figuracuadrado.png';
import figuratriangulo from '../src/images/figuratriangulo.png';
import figurarombo from '../src/images/figurarombo.png';
import figuraestrella from '../src/images/figuraestrella.png';
import figuracorazon from '../src/images/figuracorazon.png';
import figuraluna from '../src/images/figuraluna.png';

import audioCirculo from '../src/sounds/figuras/circulo.MP3';
import audioCorazon from '../src/sounds/figuras/corazon.MP3';
import audioCuadrado from '../src/sounds/figuras/cuadrado.MP3';
import audioEstrella from '../src/sounds/figuras/estrella.MP3';
import audioLuna from '../src/sounds/figuras/luna.MP3';
import audioRombo from '../src/sounds/figuras/rombo.MP3';
import audioTriangulo from '../src/sounds/figuras/triangulo.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

import React, { useState, useEffect, useRef } from 'react';

// SVG Component for each shape
const Shapes = {
  circulo: () => (
    <svg viewBox="0 0 100 100" className="w-64 h-64">
      <circle cx="50" cy="50" r="45" fill="#3B82F6" />
    </svg>
  ),
  cuadrado: () => (
    <svg viewBox="0 0 100 100" className="w-64 h-64">
      <rect x="10" y="10" width="80" height="80" fill="#10B981" />
    </svg>
  ),
  triangulo: () => (
    <svg viewBox="0 0 100 100" className="w-64 h-64">
      <polygon points="50,10 10,90 90,90" fill="#8B5CF6" />
    </svg>
  ),
  rombo: () => (
    <svg viewBox="0 0 100 100" className="w-64 h-64">
      <polygon points="50,10 90,50 50,90 10,50" fill="#EC4899" />
    </svg>
  ),
  estrella: () => (
    <svg viewBox="0 0 100 100" className="w-64 h-64">
      <polygon 
        points="50,5 61.8,38.2 95.1,38.2 69.4,61.8 80.3,95 50,75.4 19.7,95 30.6,61.8 4.9,38.2 38.2,38.2"
        fill="#F59E0B" 
      />
    </svg>
  ),
  corazon: () => (
    <svg viewBox="0 0 100 100" className="w-64 h-64">
      <path 
        d="M50,30 C30,20 10,40 30,60 C50,80 50,80 50,80 C50,80 50,80 70,60 C90,40 70,20 50,30"
        fill="#EF4444" 
      />
    </svg>
  ),
  luna: () => (
    <svg viewBox="0 0 100 100" className="w-64 h-64">
      <path 
        d="M60,10 C35,10 20,30 20,50 C20,70 35,90 60,90 C45,75 45,25 60,10 Z"
        fill="#6366F1" 
      />
    </svg>
  )
};

// Objeto para mapear figuras con sus imágenes de solución
const solutionImages = {
  'circulo': figuracirculo,
  'cuadrado': figuracuadrado,
  'triangulo': figuratriangulo,
  'rombo': figurarombo,
  'estrella': figuraestrella,
  'corazon': figuracorazon,
  'luna': figuraluna
};

// Objeto para mapear figuras con sus audios
const figuraAudios = {
  'circulo': audioCirculo,
  'corazon': audioCorazon,
  'cuadrado': audioCuadrado,
  'estrella': audioEstrella,
  'luna': audioLuna,
  'rombo': audioRombo,
  'triangulo': audioTriangulo
};

const Formas = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  const formas = ['circulo', 'cuadrado', 'triangulo', 'rombo', 'estrella', 'corazon', 'luna'];
  //const [currentForma, setCurrentForma] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [detailsByNumber, setDetailsByNumber] = useState({});
  const [attempts, setAttempts] = useState(0);
  //const [showInstructions, setShowInstructions] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);

  const [errorsArray, setErrorsArray] = useState(new Array(formas.length).fill(0));

  const [startTime, setStartTime] = useState(Date.now()); // Tiempo de inicio de cada forma
  const [responseTimes, setResponseTimes] = useState([]); // Array para guardar los tiempos de respuesta


   // Estado inicial para recuperar progreso
   //const [currentForma, setCurrentForma] = useState(() => {
    //const savedProgress = localStorage.getItem(`nivel1_figuras_progress_${player.name}`);
    //return savedProgress ? parseInt(savedProgress) : 0;
  //});

  const [currentForma, setCurrentForma] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel1_figuras_progress_${player.name}`);
    const progress = savedProgress ? parseInt(savedProgress) : 0;
    return progress < formas.length ? progress : 0; // Asegura que no exceda el límite
  });

  // Estado de instrucciones para recuperar
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem(`nivel1_figuras_instructions_${player.name}`);
    return !savedInstructions;
  });

  //const [timeLeft, setTimeLeft] = useState(10); // Temporizador de 10 segundos
  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
    return tiempos.figuras || 10; // 10 es el valor por defecto si no hay tiempo configurado
  });

  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};

  const [showSolution, setShowSolution] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const figuraAudioRef = useRef(null);

  // Mensajes de felicitación aleatorios
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
    
    // Permitir cualquier letra del alfabeto
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    
    setUserInput(e.key.toLowerCase());
    checkAnswer(e.key.toLowerCase());
  };

  // Verificar si el juego está completado al cargar
  useEffect(() => {
    const savedProgress = localStorage.getItem(`nivel1_figuras_progress_${player.name}`);
    const savedInstructions = localStorage.getItem(`nivel1_figuras_instructions_${player.name}`);
    
    if (savedProgress === '7') {
      setGameCompleted(true);
      onProgressUpdate(100, true);
    }
    
    if (savedInstructions) {
      setShowInstructions(false);
    }
  }, []);

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
          playerName: player.name, // Asegúrate de que "player.name" esté disponible
          section,
          details,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Advertencia al guardar detalles:', errorData);
        return; // Detén aquí si no es un error crítico
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
        section: 'figuras',
        details: details
    };

    console.log('Datos que se enviarán al backend:', dataToSend);

    try {
        const response = await fetch('http://localhost:5000/api/game-details-figuras', {
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

  // UseEffect para reproducir el audio cuando cambia la figura
  useEffect(() => {
    if (!showInstructions && !gameCompleted && !showSolution) {
      // Crear nuevo audio para la figura actual
      if (figuraAudioRef.current) {
        figuraAudioRef.current.pause();
        figuraAudioRef.current.currentTime = 0;
      }

      figuraAudioRef.current = new Audio(figuraAudios[formas[currentForma]]);
      
      // Reproducir el audio
      figuraAudioRef.current.play().catch(error => {
        console.log("Error al reproducir el audio de la figura:", error);
      });
    }
    
    // Limpiar el audio cuando se desmonta o cambia la figura
    return () => {
      if (figuraAudioRef.current) {
        figuraAudioRef.current.pause();
        figuraAudioRef.current.currentTime = 0;
      }
    };
  }, [currentForma]);

  const checkAnswer = (input) => {
    if (showFeedback || showSolution || showInstructions || gameCompleted) return;

    const currentFormaNombre = formas[currentForma];
    const isRight = input === currentFormaNombre.charAt(0);
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

    if (!isRight) {
        setDetailsByNumber((prevDetails) => {
            const updatedDetails = { ...prevDetails };
            
            if (!updatedDetails[currentFormaNombre]) {
                updatedDetails[currentFormaNombre] = { errors: 0, time: 0, resultado: false };
            }
            
            updatedDetails[currentFormaNombre] = {
                ...updatedDetails[currentFormaNombre],
                errors: updatedDetails[currentFormaNombre].errors + 1,
                resultado: false
            };

            saveDetailsToDatabase({
                section: 'figuras',
                details: { [currentFormaNombre]: updatedDetails[currentFormaNombre] }
            });

            console.log(`Intento incorrecto para figura ${currentFormaNombre}:`, updatedDetails[currentFormaNombre]);

            return updatedDetails;
        });

        setTimeout(() => {
            setShowFeedback(false);
            setUserInput('');
        }, 1000);

        return;
    }

    const progress = ((currentForma + 1) / formas.length) * 100;
    localStorage.setItem(`nivel1_figuras_progress_${player.name}`, currentForma + 1);
    onProgressUpdate(progress, false);

    setDetailsByNumber((prevDetails) => {
        const updatedDetails = { ...prevDetails };

        if (!updatedDetails[currentFormaNombre]) {
            updatedDetails[currentFormaNombre] = { errors: 0, time: 0, resultado: true };
        }

        updatedDetails[currentFormaNombre] = {
            ...updatedDetails[currentFormaNombre],
            time: responseTime,
            resultado: true
        };

        saveDetailsToDatabase({
            section: 'figuras',
            details: { [currentFormaNombre]: updatedDetails[currentFormaNombre] }
        });

        console.log(`Intento correcto para figura ${currentFormaNombre}:`, updatedDetails[currentFormaNombre]);

        return updatedDetails;
    });

    if (currentForma >= formas.length - 1) {
      localStorage.setItem(`nivel1_figuras_progress_${player.name}`, '7');
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
            setCurrentForma(prev => prev + 1);
            setShowFeedback(false);
            setUserInput('');
            setStartTime(Date.now());
            //setTimeLeft(10);
            // Obtener el tiempo configurado
            const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
            setTimeLeft(tiempos.figuras || 10);
        }, 2000);
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
                
                const currentFormaNombre = formas[currentForma];
                setDetailsByNumber((prevDetails) => {
                    const updatedDetails = { ...prevDetails };
                    
                    if (!updatedDetails[currentFormaNombre]) {
                        updatedDetails[currentFormaNombre] = { errors: 0, time: timeLeft, resultado: false };
                    }
                    
                    updatedDetails[currentFormaNombre] = {
                        ...updatedDetails[currentFormaNombre],
                        time: timeLeft,
                        resultado: false
                    };

                    saveDetailsToDatabase({
                        section: 'figuras',
                        details: { [currentFormaNombre]: updatedDetails[currentFormaNombre] }
                    });

                    console.log(`Tiempo agotado para figura ${currentFormaNombre}:`, updatedDetails[currentFormaNombre]);

                    return updatedDetails;
                });
                
                timeoutId = setTimeout(() => {
                    setShowSolution(false);
                    
                    if (currentForma < formas.length - 1) {
                        setCurrentForma(prev => prev + 1);
                        //setTimeLeft(10);
                        // Obtener el tiempo configurado
                        const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
                        setTimeLeft(tiempos.figuras || 10);
                        setStartTime(Date.now());
                    } else {
                        localStorage.setItem(`nivel1_figuras_progress_${player.name}`, '7');
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
  }, [currentForma, showInstructions, gameCompleted, showSolution, player.name]);
  
  const showFinalStats = () => {
    let totalErrors = 0;
    let totalTime = 0;
  
    Object.keys(detailsByNumber).forEach((key) => {
      const { errors, time } = detailsByNumber[key];
      totalErrors += errors;
      totalTime += time;
      console.log(
        `Forma: ${key} | Errores: ${errors} | Tiempo de respuesta: ${time.toFixed(2)}s`
      );
    });
  
    console.log(`Errores totales: ${totalErrors}`);
    console.log(`Tiempo total: ${totalTime.toFixed(2)}s`);
  };  

  // Configurar el event listener del teclado
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentForma, showInstructions]);

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel1_figuras_instructions_${player.name}`, 'started');
  };

  // Método para manejar volver atrás
  const handleBack = () => {
    onBack();
  };

  // Obtener el componente SVG de la forma actual
  const CurrentShape = formas[currentForma] ? Shapes[formas[currentForma]] : null;

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
                <span className="text-lg font-bold">Figuras</span>
              </div>

              {/* Fases */}
              <div className="flex justify-between items-center gap-3 mt-4">
                {formas.map((forma, i) => (
                  <div key={i} className="flex-1">
                    <div className="relative">
                      {i < formas.length - 1 && (
                        <div className={`absolute top-1/2 left-[60%] right-0 h-2 rounded-full
                                    ${i < currentForma 
                                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                      : 'bg-gray-200'}`}>
                        </div>
                      )}
                      
                      <div className={`relative z-10 flex flex-col items-center transform 
                                  transition-all duration-500 ${
                                    i === currentForma ? 'scale-110' : 'hover:scale-105'
                                  }`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                    shadow-lg transition-all duration-300 border-4
                                    ${i === currentForma
                                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 animate-pulse'
                                      : i < currentForma
                                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-200'
                                      : 'bg-white border-gray-100'
                                    }`}>
                          <div className="w-full h-full flex items-center justify-center">
                            {React.cloneElement(Shapes[forma](), {
                              className: 'w-6 h-6',
                              children: React.Children.map(Shapes[forma]().props.children, child =>
                                React.cloneElement(child, {
                                  fill: i === currentForma
                                    ? '#9333EA' // Púrpura más brillante para la figura actual
                                    : i < currentForma
                                    ? '#FFFFFF' // Blanco para las completadas (sobre el fondo verde)
                                    : '#6B7280' // Gris para las que faltan
                                })
                              )
                            })}
                          </div>
                        </div>
                        
                        {i === currentForma && (
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
                      {(currentForma / (formas.length - 1) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 
                            transition-all duration-1000 relative"
                    style={{ width: `${(currentForma / (formas.length - 1)) * 100}%` }}
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
              ¡Vamos a aprender las formas! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Inserta la tarjeta de la forma que ves en la pantalla.
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
              ¡Has completado todas las formas!
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
              Encuentra la forma:
            </h2>
            
            {/* Forma actual */}
            <div className="flex justify-center items-center animate-bounce">
              <CurrentShape />
            </div>

            {/* Mensaje de instrucción */}
            <p className="text-2xl text-gray-600">
              Inserta la tarjeta del {formas[currentForma]}
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
            )}*/}

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
                            src={solutionImages[formas[currentForma]]}
                            alt={`Solución: figura ${formas[currentForma]}`}
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
                                    strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.figuras || 10))}
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

export default Formas;