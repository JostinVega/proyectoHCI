import React, { useState, useEffect } from 'react';

const AnimalesVocales = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  //const [currentPair, setCurrentPair] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  //const [showInstructions, setShowInstructions] = useState(true);

  // Modificar estado inicial para recuperar progreso
  const [currentPair, setCurrentPair] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel2_animales_vocales_progress_${player.name}`);
    return savedProgress ? parseInt(savedProgress) : 0;
  });

  // Modificar estado de instrucciones para recuperar
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedInstructions = localStorage.getItem(`nivel2_animales_vocales_instructions_${player.name}`);
    return !savedInstructions;
  });

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

  // Comprobar la respuesta
  const checkAnswer = (input) => {
    const isRight = input === pairs[currentPair].vocal;
    setIsCorrect(isRight);
    setShowFeedback(true);

    if (isRight) {
      // Calcular progreso
      const progress = ((currentPair + 1) / pairs.length) * 100;
      
      // Guardar progreso en localStorage
      localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, currentPair + 1);

      // Comunicar progreso
      onProgressUpdate(progress, false);

      if (currentPair === pairs.length - 1) {
        // Si es el último par, mostrar pantalla de completado
        localStorage.removeItem(`nivel2_animales_vocales_progress_${player.name}`);
        localStorage.removeItem(`nivel2_animales_vocales_instructions_${player.name}`);
        
        onProgressUpdate(100, true);

        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        setTimeout(() => {
          setCurrentPair(prev => prev + 1);
          setShowFeedback(false);
          setUserInput('');
        }, 2000);
      }
    }
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
  };

  // Método para manejar volver atrás
  const handleBack = () => {
    if (!gameCompleted) {
      // Si no está completado, mantener el progreso
      localStorage.setItem(`nivel2_animales_vocales_progress_${player.name}`, currentPair);
      localStorage.setItem(`nivel2_animales_vocales_instructions_${player.name}`, 'started');
    } else {
      // Si está completado, limpiar progreso
      localStorage.removeItem(`nivel2_animales_vocales_progress_${player.name}`);
      localStorage.removeItem(`nivel2_animales_vocales_instructions_${player.name}`);
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
              onClick={onBack}
            >
              Volver al menú
            </button>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              ¿Con qué vocal empieza {pairs[currentPair].nombre}?
            </h2>
            
            <div className="text-9xl animate-bounce mb-8">
              {pairs[currentPair].animal}
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

            <div className="mt-8 text-gray-500">
              Progreso: {currentPair + 1} / {pairs.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalesVocales;