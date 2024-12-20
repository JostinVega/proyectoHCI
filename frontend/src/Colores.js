import React, { useState, useEffect } from 'react';

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

const Colores = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  const colores = ['celeste', 'verde', 'rosado', 'amarillo', 'morado', 'gris', 'rojo', 'marron', 'anaranjado', 'azul'];
  //const [currentColor, setCurrentColor] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  //const [showInstructions, setShowInstructions] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const StarBurst = ({ color }) => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30 - 40}%`, // Empiezan desde arriba de la pantalla
              animation: `fallingStar ${2 + Math.random() * 3}s linear forwards`,
              animationDelay: `${Math.random() * 1}s`,
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
        <style jsx>{`
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
              <style jsx>{`
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

  const handleKeyPress = (e) => {
    if (showInstructions || isAnimating) return;
    if (!/^[a-zA-Z]$/.test(e.key)) return;
    setUserInput(e.key.toLowerCase());
    checkAnswer(e.key.toLowerCase());
  };

  const checkAnswer = (input) => {
    const currentColorNombre = colores[currentColor];
    const isRight = input === currentColorNombre.charAt(0);
    setIsCorrect(isRight);
    setShowFeedback(true);

    if (isRight) {
      // Calcular progreso
      const progress = ((currentColor + 1) / colores.length) * 100;
      
      // Guardar progreso en localStorage
      localStorage.setItem(`nivel1_colores_progress_${player.name}`, currentColor + 1);

      // Comunicar progreso
      onProgressUpdate(progress, false);

      if (currentColor === colores.length - 1) {
        // Si es el último color, mostrar pantalla de completado
        localStorage.removeItem(`nivel1_colores_progress_${player.name}`);
        localStorage.removeItem(`nivel1_colores_instructions_${player.name}`);
        
        onProgressUpdate(100, true);

        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        setTimeout(() => {
          setCurrentColor(prev => prev + 1);
          setShowFeedback(false);
          setUserInput('');
        }, 2000);
      }
    }
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

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel1_colores_instructions_${player.name}`, 'started');
  };

  // Método para manejar volver atrás
  const handleBack = () => {
    if (!gameCompleted) {
      // Si no está completado, mantener el progreso
      localStorage.setItem(`nivel1_colores_progress_${player.name}`, currentColor);
      localStorage.setItem(`nivel1_colores_instructions_${player.name}`, 'started');
    } else {
      // Si está completado, limpiar progreso
      localStorage.removeItem(`nivel1_colores_progress_${player.name}`);
      localStorage.removeItem(`nivel1_colores_instructions_${player.name}`);
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
              ¡Vamos a aprender los colores! 🎨
            </h2>
            <p className="text-xl text-gray-600">
              Presiona la primera letra del color que se destaca en el arcoíris.
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
              {isCorrect && showFeedback && (
                <StarBurst color={colores[currentColor]} />
              )}
            </div>

            <p className="text-2xl text-gray-600">
              {!isAnimating && `Presiona la primera letra de ${colores[currentColor]}`}
            </p>

            {showFeedback && !isAnimating && (
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                          animate-bounce`}>
                {isCorrect 
                  ? successMessages[Math.floor(Math.random() * successMessages.length)]
                  : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
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