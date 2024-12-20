import React, { useState, useEffect } from 'react';

// Emoji icons for animals
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
  aveja: () => <div className="text-9xl">🐝</div>,
  elefante: () => <div className="text-9xl">🐘</div>,
  iguana: () => <div className="text-9xl">🦎</div>,
  oso: () => <div className="text-9xl">🐻</div>,
  unicornio: () => <div className="text-9xl">🦄</div>
};

const Animales = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  const animales = ['pajaro', 'tortuga', 'cerdo', 'pato', 'mariposa', 'pollito', 'gato', 'perro', 'oveja', 'aveja', 'elefante', 'iguana', 'oso', 'unicornio'];
  //const [currentAnimal, setCurrentAnimal] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  //const [showInstructions, setShowInstructions] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);

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

  // Comprobar la respuesta
  const checkAnswer = (input) => {
    const currentAnimalNombre = animales[currentAnimal];
    const isRight = input === currentAnimalNombre.charAt(0);
    setIsCorrect(isRight);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (isRight) {
      // Calcular progreso
      const progress = ((currentAnimal + 1) / animales.length) * 100;
      
      // Guardar progreso en localStorage
      localStorage.setItem(`nivel1_animales_progress_${player.name}`, currentAnimal + 1);

      // Comunicar progreso
      onProgressUpdate(progress, false);

      if (currentAnimal === animales.length - 1) {
        // Si es el último animal, mostrar pantalla de completado
        localStorage.removeItem(`nivel1_animales_progress_${player.name}`);
        localStorage.removeItem(`nivel1_animales_instructions_${player.name}`);
        
        onProgressUpdate(100, true);

        // Si es el último animal, mostrar pantalla de completado
        setTimeout(() => {
          setGameCompleted(true);
          setShowFeedback(false);
        }, 2000);
      } else {
        // Si no es el último, continuar al siguiente animal
        setTimeout(() => {
          setCurrentAnimal(prev => prev + 1);
          setShowFeedback(false);
          setUserInput('');
          setAttempts(0);
        }, 2000);
      }
    }
  };

  // Configurar el event listener del teclado
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentAnimal, showInstructions]);

  // Método para iniciar el juego y guardar estado
  const startGame = () => {
    setShowInstructions(false);
    localStorage.setItem(`nivel1_animales_instructions_${player.name}`, 'started');
  };

  // Método para manejar volver atrás
  const handleBack = () => {
    if (!gameCompleted) {
      // Si no está completado, mantener el progreso
      localStorage.setItem(`nivel1_animales_progress_${player.name}`, currentAnimal);
      localStorage.setItem(`nivel1_animales_instructions_${player.name}`, 'started');
    } else {
      // Si está completado, limpiar progreso
      localStorage.removeItem(`nivel1_animales_progress_${player.name}`);
      localStorage.removeItem(`nivel1_animales_instructions_${player.name}`);
    }
    onBack();
  };

  // Obtener el componente del animal actual
  const CurrentShape = Shapes[animales[currentAnimal]];

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
              ¡Vamos a aprender los animales! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Presiona la primera letra del animal que ves en la pantalla.
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
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-purple-600 mb-8">
              Encuentra el animal:
            </h2>
            
            {/* Animal actual */}
            <div className="flex justify-center items-center animate-bounce">
              <CurrentShape />
            </div>

            {/* Mensaje de instrucción */}
            <p className="text-2xl text-gray-600">
              Presiona la primera letra de {animales[currentAnimal]}
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

export default Animales;