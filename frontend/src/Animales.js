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
import abeja from '../src/images/abeja.png';
import elefante from '../src/images/elefante.png';
import iguana from '../src/images/iguana.png';
import oso from '../src/images/oso.png';
import unicornio from '../src/images/unicornio.png';

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

const Animales = ({ player, onBack, onConfigClick, onProgressUpdate }) => {
  // Lista de animales que se mostrarán en el juego
  const animales = ['pajaro', 'tortuga', 'cerdo', 'pato', 'mariposa', 'pollito', 'gato', 'perro', 'oveja', 'abeja', 'elefante', 'iguana', 'oso', 'unicornio'];
  //const [currentAnimal, setCurrentAnimal] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  //const [showInstructions, setShowInstructions] = useState(true);
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
  // Verifica si la respuesta del jugador es correcta
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
        localStorage.setItem(`nivel1_animales_progress_${player.name}`, '14');
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
  */

  // Verifica si la respuesta del jugador es correcta
  
  const checkAnswer = (input) => {
    const currentAnimalNombre = animales[currentAnimal];
    const isRight = input === currentAnimalNombre.charAt(0);
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    if (!isRight) {
      // Usar una copia local para acumular errores correctamente
      setErrorsArray((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[currentAnimal] += 1; // Incrementar el error para el animal actual
        return updatedErrors;
      });
  
      // Mostrar mensaje de ánimo
      const randomEncouragement =
        encouragementMessages[
          Math.floor(Math.random() * encouragementMessages.length)
        ];
      //console.log(randomEncouragement);
      console.log("Error");
  
      return; // Salir si la respuesta es incorrecta
    }
  
    // Calcular progreso
    const progress = ((currentAnimal + 1) / animales.length) * 100;
    localStorage.setItem(
      `nivel1_animales_progress_${player.name}`,
      currentAnimal + 1
    );
    onProgressUpdate(progress, false);
  
    // Calcular tiempo de respuesta
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
  
    // Guardar estadísticas del animal actual
    const animalStatsEntry = {
      animal: currentAnimalNombre,
      errors: errorsArray[currentAnimal], // Usar errores del array
      responseTime
    };
    setAnimalStats((prevStats) => [...prevStats, animalStatsEntry]);
  
    if (currentAnimal === animales.length - 1) {
      // Si es el último animal, mostrar pantalla de completado
      localStorage.setItem(`nivel1_animales_progress_${player.name}`, '14');
      onProgressUpdate(100, true);
  
      // Mostrar estadísticas finales
      showFinalStats([...animalStats, animalStatsEntry]);
  
      setTimeout(() => {
        setGameCompleted(true);
        setShowFeedback(false);
      }, 2000);
    } else {
      // Continuar al siguiente animal
      setTimeout(() => {
        setCurrentAnimal((prev) => prev + 1);
        setShowFeedback(false);
        setUserInput('');
        setStartTime(Date.now());
      }, 2000);
    }
  };
  
  const showFinalStats = (stats) => {
    let totalErrors = 0;
    let totalTime = 0;
  
    stats.forEach(({ animal, responseTime }, index) => {
      totalErrors += errorsArray[index]; // Usar errores del array
      totalTime += responseTime;
      console.log(
        `Animal: ${animal} | Errores: ${errorsArray[index]} | Tiempo de respuesta: ${responseTime}s`
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