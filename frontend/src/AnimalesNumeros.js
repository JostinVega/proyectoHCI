import React, { useState, useEffect } from 'react';
import pajarito from '../src/images/pajarito.png';
import tortuga from '../src/images/tortuga.png';
import cerdito from '../src/images/cerdito.png';
import patito from '../src/images/patito.png';
import mariposa from '../src/images/mariposa.png';
import pollito from '../src/images/pollito.png';
import gatito from '../src/images/gatito.png';
import perrito from '../src/images/perrito.png';
import oveja from '../src/images/oveja.png';

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

  /*
  // Modificar estado inicial para recuperar progreso
  const [currentPair, setCurrentPair] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel2_animales_numeros_progress_${player.name}`);
    const progress = savedProgress ? parseInt(savedProgress) : 0;
    // Añadir validación para asegurar que el valor está dentro del rango
    return progress >= 0 && progress < pairs.length ? progress : 0;
  });
  */

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

  /*
  // Comprobar la respuesta
  const checkAnswer = (input) => {
    if (currentPair >= pairs.length) return;
  
    const isRight = parseInt(input) === pairs[currentPair].cantidad;
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    if (isRight) {
      if (currentPair === pairs.length - 1) {
        // Si es el último par, mantener el progreso en 100%
        localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, pairs.length);
        localStorage.setItem(`nivel2_animales_numeros_completed_${player.name}`, 'true');
        
        onProgressUpdate(100, true);
  
        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        localStorage.setItem(`nivel2_animales_numeros_progress_${player.name}`, currentPair + 1);
        onProgressUpdate(((currentPair + 1) / pairs.length) * 100, false);
  
        setTimeout(() => {
          setCurrentPair(prev => prev + 1);
          setShowFeedback(false);
          setUserInput('');
        }, 2000);
      }
    }
  };
  */

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
                Presiona un número en tu teclado
              </div>
              <div className="text-4xl font-bold text-purple-600">
                Tu respuesta: <span className="text-6xl">{userInput}</span>
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