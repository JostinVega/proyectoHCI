import React, { useState, useEffect } from 'react';

const AnimalesNumeros = ({ player, onBack, onConfigClick }) => {
  const [currentPair, setCurrentPair] = useState(0);
  const [userInput, setUserInput] = useState('');  // Cambiado de userAnswer
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Datos de los pares animal-número
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
    
    // Solo permitir números
    if (!/[0-9]/.test(e.key)) return;
    
    setUserInput(e.key);
    checkAnswer(e.key);
  };

  // Comprobar la respuesta
  const checkAnswer = (input) => {
    const isRight = parseInt(input) === pairs[currentPair].cantidad;
    setIsCorrect(isRight);
    setShowFeedback(true);

    if (isRight) {
      if (currentPair === pairs.length - 1) {
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

  // Renderizar los animales según la cantidad
  const renderAnimales = () => {
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

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-2 px-4
                    rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={onBack}
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
              onClick={() => setShowInstructions(false)}
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
              ¿Cuántos {pairs[currentPair].nombre}s hay?
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