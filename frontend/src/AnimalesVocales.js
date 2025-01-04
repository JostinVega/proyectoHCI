import React, { useState, useEffect } from 'react';
import abeja from '../src/images/abeja.png';
import elefante from '../src/images/elefante.png';
import iguana from '../src/images/iguana.png';
import oso from '../src/images/oso.png';
import unicornio from '../src/images/unicornio.png';

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
  // Comprobar la respuesta
  const checkAnswer = (input) => {
    const isRight = input === pairs[currentPair].vocal;
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    if (isRight) {
      if (currentPair === pairs.length - 1) {
        // Marcar como completado y guardar el progreso final
        localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, 'true');
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, pairs.length);
        
        // IMPORTANTE: Comunicar el 100% de progreso
        onProgressUpdate(100, true);
  
        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        // Guardar progreso parcial
        const nextPair = currentPair + 1;
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, nextPair);
        
        // Calcular y comunicar progreso
        const progress = ((nextPair) / pairs.length) * 100;
        onProgressUpdate(progress, false);
  
        setTimeout(() => {
          setCurrentPair(nextPair);
          setShowFeedback(false);
          setUserInput('');
        }, 2000);
      }
    }
  };
  */

  const checkAnswer = (input) => {
    const isRight = input === pairs[currentPair].vocal;
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    // Calcular el tiempo de respuesta
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // Convertir a segundos
  
    // Registrar el tiempo de respuesta
    setResponseTimes((prevTimes) => [...prevTimes, responseTime]);
  
    if (!isRight) {
      setErrorsArray((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[currentPair] += 1;
        return updatedErrors;
      });
  
      const randomEncouragement =
        encouragementMessages[
          Math.floor(Math.random() * encouragementMessages.length)
        ];
      //console.log(randomEncouragement);
      console.log("Error");
  
      return;
    }
  
    if (isRight) {
      if (currentPair === pairs.length - 1) {
        localStorage.setItem(`nivel2_animales_vocales_completed_${player.name}`, 'true');
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, pairs.length);
  
        onProgressUpdate(100, true);
  
        showFinalStats();
  
        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        const nextPair = currentPair + 1;
        localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, nextPair);
  
        const progress = ((nextPair) / pairs.length) * 100;
        onProgressUpdate(progress, false);
  
        setTimeout(() => {
          setCurrentPair(nextPair);
          setShowFeedback(false);
          setUserInput('');
          setStartTime(Date.now()); // Reiniciar el tiempo de inicio para la siguiente pregunta
        }, 2000);
      }
    }
  };
  
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
                    Presiona la vocal correcta en tu teclado
                  </div>
                  <div className="text-4xl font-bold text-purple-600">
                    Tu respuesta: <span className="text-6xl uppercase">{userInput}</span>
                  </div>
                </div>
        
                {showFeedback && (
                  <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                              animate-bounce`}>
                    {isCorrect 
                      ? successMessages[Math.floor(Math.random() * successMessages.length)]
                      : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
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