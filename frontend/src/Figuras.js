import React, { useState, useEffect } from 'react';

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
  // Comprobar la respuesta
  const checkAnswer = (input) => {
    const currentFormaNombre = formas[currentForma];
    const isRight = input === currentFormaNombre.charAt(0);
    setIsCorrect(isRight);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (isRight) {
      // Calcular progreso
      const progress = ((currentForma + 1) / formas.length) * 100;
      
      // Guardar progreso en localStorage
      localStorage.setItem(`nivel1_figuras_progress_${player.name}`, currentForma + 1);

      // Comunicar progreso
      onProgressUpdate(progress, false);
      
      if (currentForma === formas.length - 1) {
        // Si es la última forma, mostrar pantalla de completado
        localStorage.setItem(`nivel1_figuras_progress_${player.name}`, '7');
        
        onProgressUpdate(100, true);

        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        // Si no es la última, continuar a la siguiente forma
        setTimeout(() => {
          setCurrentForma(prev => prev + 1);
          setShowFeedback(false);
          setUserInput('');
          setAttempts(0);
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
  

  const checkAnswer = (input) => {
    const currentFormaNombre = formas[currentForma];
    const isRight = input === currentFormaNombre.charAt(0);
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    // Calcular el tiempo de respuesta
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
  
    // Actualizar los detalles de la respuesta actual
    setDetailsByNumber((prevDetails) => {
      const updatedDetails = { ...prevDetails };
  
      // Usa el nombre de la forma como clave
      if (!updatedDetails[currentFormaNombre]) {
        updatedDetails[currentFormaNombre] = { errors: 0, time: 0 };
      }
  
      updatedDetails[currentFormaNombre] = {
        ...updatedDetails[currentFormaNombre],
        time: responseTime,
        errors: isRight
          ? updatedDetails[currentFormaNombre].errors
          : updatedDetails[currentFormaNombre].errors + 1,
      };
  
     // Guardar los detalles en el backend
    saveDetailsToDatabase({
      section: 'figuras', // Especifica la sección
      details: {
        [currentFormaNombre]: updatedDetails[currentFormaNombre], // Usa el nombre de la forma como clave
      },
    });

      return updatedDetails;
    });
  
    if (!isRight) {
      setErrorsArray((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[currentForma] += 1;
        return updatedErrors;
      });
  
      console.log("Error");
      return;
    }
  
    const progress = ((currentForma + 1) / formas.length) * 100;
    localStorage.setItem(
      `nivel1_figuras_progress_${player.name}`,
      currentForma + 1
    );
    onProgressUpdate(progress, false);
  
    if (currentForma === formas.length - 1) {
      localStorage.setItem(`nivel1_figuras_progress_${player.name}`, '7');
      onProgressUpdate(100, true);
  
      showFinalStats();
  
      setTimeout(() => {
        setGameCompleted(true);
        setShowFeedback(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setCurrentForma((prev) => prev + 1);
        setShowFeedback(false);
        setUserInput('');
        setStartTime(Date.now());
      }, 2000);
    }
  };  
  
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
  //const CurrentShape = Shapes[formas[currentForma]];

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

        {showInstructions ? (
          // Pantalla de instrucciones
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-purple-600">
              ¡Vamos a aprender las formas! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Presiona la primera letra de la forma que ves en la pantalla.
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
              Presiona la primera letra de {formas[currentForma]}
            </p>

            {/* Retroalimentación */}
            {showFeedback && (
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                          animate-bounce`}>
                {isCorrect 
                  ? successMessages[Math.floor(Math.random() * successMessages.length)]
                  : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
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