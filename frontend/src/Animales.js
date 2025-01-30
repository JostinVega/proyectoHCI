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
import abeja from '../src/images/abeja.png';
import elefante from '../src/images/elefante.png';
import iguana from '../src/images/iguana.png';
import oso from '../src/images/oso.png';
import unicornio from '../src/images/unicornio.png';


import animpajaro from '../src/images/pajarito.png';
import animtortuga from '../src/images/tortuga.png';
import animcerdo from '../src/images/cerdito.png';
import animpato from '../src/images/patito.png';
import animmariposa from '../src/images/mariposa.png';
import animpollito from '../src/images/pollito.png';
import animgato from '../src/images/gatito.png';
import animperro from '../src/images/perrito.png';
import animoveja from '../src/images/oveja.png';
import animabeja from '../src/images/abeja.png';
import animelefante from '../src/images/elefante.png';
import animiguana from '../src/images/iguana.png';
import animoso from '../src/images/oso.png';
import animunicornio from '../src/images/unicornio.png';

import audioPajaro from '../src/sounds/animales/pajaro.MP3';
import audioTortuga from '../src/sounds/animales/tortuga.MP3';
import audioCerdo from '../src/sounds/animales/cerdo.MP3';
import audioPato from '../src/sounds/animales/pato.MP3';
import audioMariposa from '../src/sounds/animales/mariposa.MP3';
import audioPollito from '../src/sounds/animales/pollito.MP3';
import audioGato from '../src/sounds/animales/gato.MP3';
import audioPerro from '../src/sounds/animales/perro.MP3';
import audioOveja from '../src/sounds/animales/oveja.MP3';
import audioAbeja from '../src/sounds/animales/abeja.MP3';
import audioElefante from '../src/sounds/animales/elefante.MP3';
import audioIguana from '../src/sounds/animales/iguana.MP3';
import audioOso from '../src/sounds/animales/oso.MP3';
import audioUnicornio from '../src/sounds/animales/unicornio.MP3';

import time from '../src/sounds/time.mp3';
import success from '../src/sounds/success.mp3';
import encouragement from '../src/sounds/encouragement.mp3';
import completed from '../src/sounds/completed.mp3';

// Diccionario de componentes para representar animales como emojis
/* 
const Shapes = {
  pajaro: () => <div className="text-9xl">🐦</div>,
  tortuga: () => <div className="text-9xl">🐢</div>,
  cerdo: () => <div className="text-9xl">🐷</div>,
  pato: () => <div className="text-9xl">🦆</div>,
  mariposa: () => <div className="text-9xl">🦋</div>,
  pollito: () => <div className="text-9xl">🐥</div>,
  gato: () => <div className="text-9xl">🐱</div>,
  perro: () => <div className="text-9xl">🐶</div>,
  oveja: () => <div className="text-9xl">🐑</div>,
  abeja: () => <div className="text-9xl">🐝</div>,
  elefante: () => <div className="text-9xl">🐘</div>,
  iguana: () => <div className="text-9xl">🦎</div>,
  oso: () => <div className="text-9xl">🐻</div>,
  unicornio: () => <div className="text-9xl">🦄</div>
};
*/

const Shapes = {
  pajaro: () => (
    <div>
      <img src={pajarito} alt="pajarito" className="w-64 h-64 object-contain" />
    </div>
  ),
  tortuga: () => (
    <div>
      <img src={tortuga} alt="tortuga" className="w-64 h-64 object-contain" />
    </div>
  ),
  cerdo: () => (
    <div>
      <img src={cerdito} alt="cerdito" className="w-64 h-64 object-contain" />
    </div>
  ),
  pato: () => (
    <div>
      <img src={patito} alt="patito" className="w-64 h-64 object-contain" />
    </div>
  ),
  mariposa: () => (
    <div>
      <img src={mariposa} alt="mariposa" className="w-64 h-64 object-contain" />
    </div>
  ),
  pollito: () => (
    <div>
      <img src={pollito} alt="pollito" className="w-64 h-64 object-contain" />
    </div>
  ),
  gato: () => (
    <div>
      <img src={gatito} alt="gatito" className="w-64 h-64 object-contain" />
    </div>
  ),
  perro: () => (
    <div>
      <img src={perrito} alt="perrito" className="w-64 h-64 object-contain" />
    </div>
  ),
  oveja: () => (
    <div>
      <img src={oveja} alt="oveja" className="w-64 h-64 object-contain" />
    </div>
  ),
  abeja: () => (
    <div>
      <img src={abeja} alt="abeja" className="w-64 h-64 object-contain" />
    </div>
  ),
  elefante: () => (
    <div>
      <img src={elefante} alt="elefante" className="w-64 h-64 object-contain" />
    </div>
  ),
  iguana: () => (
    <div>
      <img src={iguana} alt="iguana" className="w-64 h-64 object-contain" />
    </div>
  ),
  oso: () => (
    <div>
      <img src={oso} alt="oso" className="w-64 h-64 object-contain" />
    </div>
  ),
  unicornio: () => (
    <div>
      <img src={unicornio} alt="unicornio" className="w-64 h-64 object-contain" />
    </div>
  )
};

// Objeto para mapear animales con sus imágenes de solución
const solutionImages = {
  'pajaro': animpajaro,
  'tortuga': animtortuga,
  'cerdo': animcerdo,
  'pato': animpato,
  'mariposa': animmariposa,
  'pollito': animpollito,
  'gato': animgato,
  'perro': animperro,
  'oveja': animoveja,
  'abeja': animabeja,
  'elefante': animelefante,
  'iguana': animiguana,
  'oso': animoso,
  'unicornio': animunicornio
};

// Objeto para mapear animales con sus audios
const animalAudios = {
  'pajaro': audioPajaro,
  'tortuga': audioTortuga,
  'cerdo': audioCerdo,
  'pato': audioPato,
  'mariposa': audioMariposa,
  'pollito': audioPollito,
  'gato': audioGato,
  'perro': audioPerro,
  'oveja': audioOveja,
  'abeja': audioAbeja,
  'elefante': audioElefante,
  'iguana': audioIguana,
  'oso': audioOso,
  'unicornio': audioUnicornio
};

const Animales = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  // Lista de animales que se mostrarán en el juego
  const animales = ['pajaro', 'tortuga', 'cerdo', 'pato', 'mariposa', 'pollito', 'gato', 'perro', 'oveja', 'abeja', 'elefante', 'iguana', 'oso', 'unicornio'];
  
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const [startTime, setStartTime] = useState(Date.now());
  const [animalStats, setAnimalStats] = useState([]);

  const [errorsArray, setErrorsArray] = useState(new Array(animales.length).fill(0));


  // Modificar estado inicial para recuperar progreso
  const [currentAnimal, setCurrentAnimal] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel1_animales_progress_${player.name}`);
    return savedProgress ? parseInt(savedProgress) : 0;
  });

  // Modificar estado de instrucciones para recuperar
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem(`nivel1_animales_instructions_${player.name}`);
    return !savedInstructions;
  });

  //const [timeLeft, setTimeLeft] = useState(10);
  // Por esta nueva inicialización
  const [timeLeft, setTimeLeft] = useState(() => {
    const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
    return tiempos.animales || 10; // 10 es el valor por defecto si no hay tiempo configurado
  });
  const [showSolution, setShowSolution] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};

  const audioRef = useRef(null);
  const successAudioRef = useRef(null);
  const encouragementAudioRef = useRef(null);
  const completedAudioRef = useRef(null);
  const animalAudioRef = useRef(null);

  // Mensajes de éxito para respuestas correctas
  const successMessages = [
    "¡Excelente trabajo! 🌟",
    "¡Lo lograste! ¡Eres increíble! ⭐",
    "¡Muy bien! ¡Sigue así! 🎉",
    "¡Fantástico! ¡Eres muy inteligente! 🏆",
    "¡Genial! ¡Lo hiciste perfectamente! 🌈"
  ];

  // Mensajes de ánimo para respuestas incorrectas
  const encouragementMessages = [
    "¡Casi lo tienes! Intenta de nuevo 💪",
    "¡Sigue intentando! Tú puedes 🌟",
    "¡No te rindas! Estás muy cerca ⭐",
    "¡Vamos a intentarlo una vez más! 🎈"
  ];

  // Maneja las teclas presionadas por el jugador
  const handleKeyPress = (e) => {
    if (showInstructions) return;
    
    // Permitir cualquier letra del alfabeto
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    
    setUserInput(e.key.toLowerCase());
    checkAnswer(e.key.toLowerCase());
  };

  // Verificar si el juego está completado al cargar
  useEffect(() => {
    const savedProgress = localStorage.getItem(`nivel1_animales_progress_${player.name}`);
    const savedInstructions = localStorage.getItem(`nivel1_animales_instructions_${player.name}`);
    
    if (savedProgress === '14') {
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
          playerName: player.name, // Nombre del jugador
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
        section: section,
        details: details
    };

    console.log('Datos que se enviarán al backend:', dataToSend);

    try {
        const response = await fetch('http://localhost:5000/api/game-details-animales', {
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

  // UseEffect para reproducir el audio cuando cambia el animal
  useEffect(() => {
    if (!showInstructions && !gameCompleted && !showSolution) {
      // Limpiar cualquier audio anterior
      if (animalAudioRef.current) {
        animalAudioRef.current.pause();
        animalAudioRef.current.currentTime = 0;
      }

      // Crear y reproducir el nuevo audio
      animalAudioRef.current = new Audio(animalAudios[animales[currentAnimal]]);
      animalAudioRef.current.play().catch(error => {
        console.log("Error al reproducir el audio del animal:", error);
      });
    }
    
    // Limpiar el audio cuando se desmonta o cambia el animal
    return () => {
      if (animalAudioRef.current) {
        animalAudioRef.current.pause();
        animalAudioRef.current.currentTime = 0;
      }
    };
  }, [currentAnimal]);

  const checkAnswer = (input) => {
    if (showFeedback || showSolution || showInstructions || gameCompleted) return;

    const currentAnimalNombre = animales[currentAnimal];
    const isRight = input === currentAnimalNombre.charAt(0);
    setIsCorrect(isRight);

    // Selecciona el mensaje una sola vez
    setFeedbackMessage(
      isRight
        ? successMessages[Math.floor(Math.random() * successMessages.length)]
        : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
    );

    // Reproducir el audio correspondiente
    if (isRight) {
      playAudio(successAudioRef);
    } else {
      playAudio(encouragementAudioRef);
    }

    setShowFeedback(true);

    const endTime = Date.now();
    const responseTime = Math.min((endTime - startTime) / 1000, 10);

    if (!isRight) {
        setAnimalStats((prevStats) => {
            const updatedStats = { ...prevStats };
            
            if (!updatedStats[currentAnimalNombre]) {
                updatedStats[currentAnimalNombre] = { 
                    errors: 0, 
                    time: 0, 
                    resultado: false 
                };
            }
            
            updatedStats[currentAnimalNombre] = {
                ...updatedStats[currentAnimalNombre],
                errors: updatedStats[currentAnimalNombre].errors + 1,
                resultado: false
            };

            saveDetailsToDatabase({
                section: 'animales',
                details: { [currentAnimalNombre]: updatedStats[currentAnimalNombre] }
            });

            return updatedStats;
        });

        setTimeout(() => {
            setShowFeedback(false);
            setUserInput('');
        }, 1000);
        return;
    }

    const progress = ((currentAnimal + 1) / animales.length) * 100;
    localStorage.setItem(`nivel1_animales_progress_${player.name}`, currentAnimal + 1);
    onProgressUpdate(progress, false);

    setAnimalStats((prevStats) => {
        const updatedStats = { ...prevStats };

        if (!updatedStats[currentAnimalNombre]) {
            updatedStats[currentAnimalNombre] = { 
                errors: 0, 
                time: 0, 
                resultado: true 
            };
        }

        updatedStats[currentAnimalNombre] = {
            ...updatedStats[currentAnimalNombre],
            time: responseTime,
            resultado: true
        };

        saveDetailsToDatabase({
            section: 'animales',
            details: { [currentAnimalNombre]: updatedStats[currentAnimalNombre] }
        });

        return updatedStats;
    });

    if (currentAnimal >= animales.length - 1) {
        localStorage.setItem(`nivel1_animales_progress_${player.name}`, '14');
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
            setCurrentAnimal(prev => prev + 1);
            setShowFeedback(false);
            setUserInput('');
            setStartTime(Date.now());
            //setTimeLeft(10);
            // Obtener el tiempo configurado
            const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
            setTimeLeft(tiempos.animales || 10);
        }, 2000);
    }
  };
  
  const showFinalStats = () => {
    let totalErrors = 0;
    let totalTime = 0;
  
    Object.keys(animalStats).forEach((key) => {
      const { errors, time } = animalStats[key];
      totalErrors += errors;
      totalTime += time;
      console.log(
        `Animal: ${key} | Errores: ${errors} | Tiempo de respuesta: ${time.toFixed(2)}s`
      );
    });
  
    console.log(`Errores totales: ${totalErrors}`);
    console.log(`Tiempo total: ${totalTime.toFixed(2)}s`);
  };    

  // Configurar el event listener del teclado
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentAnimal, showInstructions]);

  //Temporizador
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
                
                const currentAnimalNombre = animales[currentAnimal];
                setAnimalStats((prevStats) => {
                    const updatedStats = { ...prevStats };
                    
                    if (!updatedStats[currentAnimalNombre]) {
                        updatedStats[currentAnimalNombre] = { 
                            errors: 0, 
                            time: timeLeft, 
                            resultado: false 
                        };
                    }
                    
                    updatedStats[currentAnimalNombre] = {
                        ...updatedStats[currentAnimalNombre],
                        time: 10,
                        resultado: false
                    };

                    saveDetailsToDatabase({
                        section: 'animales',
                        details: { [currentAnimalNombre]: updatedStats[currentAnimalNombre] }
                    });

                    return updatedStats;
                });
                
                timeoutId = setTimeout(() => {
                    setShowSolution(false);
                    
                    if (currentAnimal < animales.length - 1) {
                        setCurrentAnimal(prev => prev + 1);
                        //setTimeLeft(10);
                        // Obtener el tiempo configurado
                        const tiempos = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || {};
                        setTimeLeft(tiempos.animales || 10);
                        setStartTime(Date.now());
                    } else {
                        localStorage.setItem(`nivel1_animales_progress_${player.name}`, '14');
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
  }, [currentAnimal, showInstructions, gameCompleted, showSolution, player.name]);

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel1_animales_instructions_${player.name}`, 'started');
  };

  // Método para manejar volver atrás
  const handleBack = () => {
    onBack();
  };

  // Componente que representa el animal actual
  const CurrentShape = Shapes[animales[currentAnimal]] || (() => <div className="text-9xl">❓</div>);


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
                      <span className="text-lg font-bold">Animales</span>
                  </div>

                  {/* Fases - aquí mostramos los animales */}
                  <div className="flex justify-between items-center gap-3 mt-4 flex-wrap">
                      {animales.map((animal, i) => (
                          <div key={i} className="flex-1 min-w-[3rem] max-w-[4rem] mb-4">
                              <div className="relative">
                                  {i < animales.length - 1 && (
                                      <div className={`absolute top-1/2 left-[60%] right-0 h-2 rounded-full
                                                  ${i < currentAnimal 
                                                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                                      : 'bg-gray-200'}`}>
                                      </div>
                                  )}
                                  
                                  <div className={`relative z-10 flex flex-col items-center transform 
                                              transition-all duration-500 ${
                                                  i === currentAnimal ? 'scale-110' : 'hover:scale-105'
                                              }`}>
                                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                                  shadow-lg transition-all duration-300 border-4
                                                  ${i === currentAnimal
                                                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 animate-pulse'
                                                      : i < currentAnimal
                                                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-200'
                                                      : 'bg-white border-gray-100'
                                                  }`}>
                                          <div className="w-full h-full flex items-center justify-center">
                                              {React.cloneElement(Shapes[animal](), {
                                                  className: 'w-6 h-6', // Tamaño miniatura para las fases
                                                  children: React.Children.map(Shapes[animal]().props.children, child =>
                                                      React.cloneElement(child, {
                                                          className: 'w-6 h-6' // También ajustar el tamaño de la imagen
                                                      })
                                                  )
                                              })}
                                          </div>
                                      </div>
                                      
                                      {i === currentAnimal && (
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
                                  {(currentAnimal / (animales.length - 1) * 100).toFixed(0)}%
                              </div>
                          </div>
                      </div>
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                          <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 
                                      transition-all duration-1000 relative"
                              style={{ width: `${(currentAnimal / (animales.length - 1)) * 100}%` }}
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
              ¡Vamos a aprender los animales! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Inserta la tarjeta donde se encuentre el animal que ves en la pantalla.
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
              ¡Has completado todos los animales!
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
          <div className="text-center space-y-14">
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              Encuentra el animal:
            </h2>
            
            {/* Animal actual */}
            <div className="flex justify-center items-center animate-bounce mt-8">
              <CurrentShape />
            </div>

            {/* Mensaje de instrucción */}
            <p className="text-2xl text-gray-600">
              Inserta la tarjeta donde se encuentra un {animales[currentAnimal]}
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
                            src={solutionImages[animales[currentAnimal]]}
                            alt={`Solución: animal ${animales[currentAnimal]}`}
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
                                    strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft/(tiempos?.animales || 10))}
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

export default Animales;