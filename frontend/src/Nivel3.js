import React, { useState, useEffect } from 'react';

const Nivel3 = ({ player, onBack, onConfigClick }) => {
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [cantidadActual, setCantidadActual] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [cantidadesCompletadasPatitos, setCantidadesCompletadasPatitos] = useState([]);
  const [cantidadesCompletadasCerditos, setCantidadesCompletadasCerditos] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false); // Nuevo estado

  // Mensajes de felicitación
  const successMessages = [
    "¡Excelente trabajo! 🌟",
    "¡Lo lograste! ¡Eres increíble! ⭐",
    "¡Muy bien! ¡Sigue así! 🎉",
    "¡Fantástico! ¡Eres muy inteligente! 🏆",
    "¡Genial! ¡Lo hiciste perfectamente! 🌈",
    "¡Asombroso trabajo! ✨",
    "¡Eres un campeón! 🎯",
    "¡Increíble! ¡Lo has hecho super bien! 🌠",
    "¡Extraordinario! ¡Sigue brillando! 🌞",
    "¡Magnífico! ¡Eres una estrella! ⭐",
    "¡Espectacular! ¡Sigue así! 🎨",
    "¡Maravilloso! ¡Eres sorprendente! 🎪",
    "¡Fenomenal! ¡Continúa así! 🎮",
    "¡Brillante trabajo! ¡Eres genial! 💫",
    "¡Lo has hecho de maravilla! 🌈"
  ];

  // Mensajes de ánimo
  const encouragementMessages = [
    "¡Casi lo tienes! Intenta de nuevo 💪",
    "¡Sigue intentando! Tú puedes 🌟",
    "¡No te rindas! Estás muy cerca ⭐",
    "¡Vamos a intentarlo una vez más! 🎈",
    "¡Tú puedes lograrlo! ¡Inténtalo de nuevo! 🚀",
    "¡Vamos! ¡La práctica hace al maestro! 🎯",
    "¡Estás aprendiendo! ¡Sigue adelante! 🌱",
    "¡Un intento más! ¡Lo conseguirás! 🎪",
    "¡Ánimo! ¡Cada intento te hace más fuerte! 💫",
    "¡No pasa nada! ¡Vuelve a intentarlo! 🌈",
    "¡Confío en ti! ¡Puedes hacerlo! 🎨",
    "¡Sigue practicando! ¡Lo lograrás! 🎮",
    "¡No te desanimes! ¡Lo harás mejor! ✨",
    "¡Inténtalo una vez más! ¡Tú puedes! 🌟",
    "¡Cada intento cuenta! ¡Sigue adelante! 🎉"
  ];

  const animales = {
    patito: {
      emoji: '🦆',
    },
    cerdito: {
      emoji: '🐷',
    },
  };

  const saveProgress = () => {
    try {
      const progressData = {
        patitos: cantidadesCompletadasPatitos,
        cerditos: cantidadesCompletadasCerditos,
        gameCompleted,
        lastAnimal: animalSeleccionado,
        lastCantidad: cantidadActual,
      };
      localStorage.setItem(`nivel3_progress_${player.name}`, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  };

  const loadProgress = () => {
    try {
      const savedProgress = localStorage.getItem(`nivel3_progress_${player.name}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCantidadesCompletadasPatitos(progress.patitos || []);
        setCantidadesCompletadasCerditos(progress.cerditos || []);
        setGameCompleted(progress.gameCompleted || false);
        setAnimalSeleccionado(progress.lastAnimal || null);
        setCantidadActual(progress.lastCantidad || 0);
      } else {
        resetProgress();
      }
    } catch (error) {
      console.error('Error cargando progreso:', error);
    } finally {
      setProgressLoaded(true);
    }
  };

  const resetProgress = () => {
    setCantidadesCompletadasPatitos([]);
    setCantidadesCompletadasCerditos([]);
    setGameCompleted(false);
    setAnimalSeleccionado(null);
    setCantidadActual(0);
  };

  useEffect(() => {
    loadProgress();
  }, [player.name]);

  useEffect(() => {
    if (progressLoaded) saveProgress();
  }, [
    cantidadesCompletadasPatitos,
    cantidadesCompletadasCerditos,
    gameCompleted,
    animalSeleccionado,
    cantidadActual,
    progressLoaded,
  ]);

  const generarNuevaCantidad = () => {
    const cantidadesCompletadas = animalSeleccionado === 'patito' ? cantidadesCompletadasPatitos : cantidadesCompletadasCerditos;
    const numerosPosibles = Array.from({ length: 9 }, (_, i) => i + 1).filter(n => !cantidadesCompletadas.includes(n));

    if (numerosPosibles.length === 0) {
      setGameCompleted(true);
      return null;
    }

    const nuevaCantidad = numerosPosibles[Math.floor(Math.random() * numerosPosibles.length)];
    setCantidadActual(nuevaCantidad);
    return nuevaCantidad;
  };

  const iniciarJuego = (animal) => {
    setAnimalSeleccionado(animal);
    setGameCompleted(false);
    generarNuevaCantidad();
  };

  const checkAnswer = (input) => {
    const isRight = parseInt(input) === cantidadActual;
    setIsCorrect(isRight);
    setShowFeedback(true);

    if (isRight) {
      const updateList = animalSeleccionado === 'patito' ? setCantidadesCompletadasPatitos : setCantidadesCompletadasCerditos;
      updateList((prev) => [...prev, cantidadActual]);
      setTimeout(() => {
        setShowFeedback(false);
        setUserInput('');
        generarNuevaCantidad();
      }, 2000);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
        setUserInput('');
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (!animalSeleccionado || gameCompleted) return;
    if (!/[0-9]/.test(e.key)) return;
    setUserInput(e.key);
    checkAnswer(e.key);
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [animalSeleccionado, cantidadActual, showFeedback]);

  const handleBack = () => {
    saveProgress();
    if (animalSeleccionado) {
      setAnimalSeleccionado(null);
    } else {
      onBack();
    }
  };

  const renderProgressBar = () => {
    const totalNumbersPerAnimal = 9;
    const patitosProgress = (cantidadesCompletadasPatitos.length / totalNumbersPerAnimal) * 100;
    const cerditosProgress = (cantidadesCompletadasCerditos.length / totalNumbersPerAnimal) * 100;

    return (
      <div className="bg-white bg-opacity-80 rounded-xl p-4 mb-8">
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          Progreso del Nivel 3: {Math.round((patitosProgress + cerditosProgress) / 2)}%
        </h3>
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Patitos 🦆</span>
            <span>{Math.round(patitosProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="h-2.5 bg-blue-500 rounded-full" style={{ width: `${patitosProgress}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Cerditos 🐷</span>
            <span>{Math.round(cerditosProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="h-2.5 bg-pink-500 rounded-full" style={{ width: `${cerditosProgress}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  const renderSeleccionAnimal = () => (
    <div className="text-center space-y-8">
      {renderProgressBar()}
      <h2 className="text-4xl font-bold text-purple-600">¿Con qué animal quieres practicar?</h2>
      <div className="flex justify-center gap-8">
        {Object.entries(animales).map(([nombre, datos]) => (
          <button
            key={nombre}
            className="bg-white p-8 rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => iniciarJuego(nombre)}
          >
            <div className="text-8xl mb-4">{datos.emoji}</div>
            <div className="text-2xl font-bold text-purple-600 capitalize">{nombre}s</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderJuego = () => (
    <div className="text-center space-y-8">
      <h2 className="text-4xl font-bold text-purple-600">Coloca {cantidadActual} {animalSeleccionado}{cantidadActual > 1 ? 's' : ''}</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[...Array(cantidadActual)].map((_, i) => (
          <span key={i} className="text-6xl">{animales[animalSeleccionado].emoji}</span>
        ))}
      </div>
      <div>
        
        <div className="text-4xl font-bold text-purple-600">Tu respuesta: {userInput}</div>
        {showFeedback && (
          <div className={`mt-4 text-2xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'} 
                          animate-bounce`}>
          
            {isCorrect ? successMessages[Math.floor(Math.random() * successMessages.length)] : encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-2 px-4
                    rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={handleBack}
          >
            ← Volver
          </button>
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onConfigClick}>
            
            <span className="text-4xl">{player?.avatar}</span>
            <span className="text-2xl font-bold text-purple-600">{player?.name}</span>
          </div>
        </div>
        {progressLoaded && (animalSeleccionado ? renderJuego() : renderSeleccionAnimal())}
      </div>
    </div>
  );
};

export default Nivel3;
