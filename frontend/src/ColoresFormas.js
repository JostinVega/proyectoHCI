import React, { useState, useEffect } from 'react';

const ColoresFormas = ({ player, onBack, onConfigClick }) => {
  const [currentPair, setCurrentPair] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

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

  // Comprobar la respuesta
  const checkAnswer = (input) => {
    const isRight = input === pairs[currentPair].inicial;
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

  // Event listener para el teclado
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentPair, showInstructions]);

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
                ¡Vamos a identificar colores! 🎯
              </h2>
              <p className="text-xl text-gray-600">
                ¿De qué color es cada forma?
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
                ¡Has identificado todos los colores!
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
                ¿De qué color es este {pairs[currentPair].forma}?
              </h2>
              
              <div className="flex justify-center items-center mb-8">
                <CurrentShape />
              </div>

              <div className="mt-8">
                <div className="text-2xl text-gray-600 mb-4">
                  Presiona la primera letra del color
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
    </div>
  );
};

export default ColoresFormas;