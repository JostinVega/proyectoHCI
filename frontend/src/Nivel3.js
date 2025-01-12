import React, { useState, useEffect } from 'react';
import patito from '../src/images/patito.png';
import cerdito from '../src/images/cerdito.png';

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

  const [patitosStats, setPatitosStats] = useState({});
  const [cerditosStats, setCerditosStats] = useState({});
  

  const [tiempoInicio, setTiempoInicio] = useState(null);


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

  /*
  const animales = {
    patito: {
      emoji: '🦆',
    },
    cerdito: {
      emoji: '🐷',
    },
  };
  */

  const animales = {
    patito: {
      imagen: patito,
      nombre: 'patito'
    },
    cerdito: {
      imagen: cerdito,
      nombre: 'cerdito'
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

      // Evitar guardar progreso si el animalSeleccionado es nulo
      if (!['patito', 'cerdito'].includes(animalSeleccionado)) return;

      localStorage.setItem(`nivel3_progress_${player.name}`, JSON.stringify(progressData));
  
      // Calcular progreso para cada animal
      const progressPatitos = (cantidadesCompletadasPatitos.length / 9) * 100;
      const progressCerditos = (cantidadesCompletadasCerditos.length / 9) * 100;
  
      window.parent.postMessage(
        {
          type: 'SAVE_PHASE_PROGRESS',
          level: 3,
          phase: animalSeleccionado,
          progress: animalSeleccionado === 'patito' ? progressPatitos : progressCerditos,
          isCompleted: gameCompleted,
        },
        '*'
      );
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

  const resetAnimalProgress = (animal) => {
    if (window.confirm(`¿Estás seguro de que quieres reiniciar el progreso de ${animal}? Se perderá todo el progreso.`)) {
      if (animal === 'patitos') {
        setCantidadesCompletadasPatitos([]);
        setPatitosStats({});
        if (animalSeleccionado === 'patito') {
          setGameCompleted(false);
          setAnimalSeleccionado(null);
          setCantidadActual(0);
        }
      } else if (animal === 'cerditos') {
        setCantidadesCompletadasCerditos([]);
        setCerditosStats({});
        if (animalSeleccionado === 'cerdito') {
          setGameCompleted(false);
          setAnimalSeleccionado(null);
          setCantidadActual(0);
        }
      }
    }
  };

  useEffect(() => {
    loadProgress();
  }, [player.name]);

  useEffect(() => {
    if (progressLoaded) {
      saveProgress();
    }
  }, [
    cantidadesCompletadasPatitos,
    cantidadesCompletadasCerditos,
    gameCompleted,
    progressLoaded,
  ]);

  const generarNuevaCantidad = () => {
    const cantidadesCompletadas =
      animalSeleccionado === 'patito'
        ? cantidadesCompletadasPatitos
        : cantidadesCompletadasCerditos;
  
    const numerosPosibles = Array.from({ length: 9 }, (_, i) => i + 1).filter(
      (num) => !cantidadesCompletadas.includes(num)
    );
  
    if (numerosPosibles.length === 0) {
      setGameCompleted(true);
      return null;
    }
  
    const index = Math.floor(Math.random() * numerosPosibles.length);
    const nuevaCantidad = numerosPosibles[index];
  
    if (nuevaCantidad === cantidadActual && numerosPosibles.length > 1) {
      const otherNumbers = numerosPosibles.filter((num) => num !== nuevaCantidad);
      setCantidadActual(
        otherNumbers[Math.floor(Math.random() * otherNumbers.length)]
      );
    } else {
      setCantidadActual(nuevaCantidad);
    }
  
    setTiempoInicio(Date.now());
  };
  

  const iniciarJuego = (animal) => {
    setAnimalSeleccionado(animal);
    setGameCompleted(false);
    generarNuevaCantidad();
    setTiempoInicio(Date.now()); // Inicia el tiempo
  };  

  /*
  const checkAnswer = (input) => {
    const isRight = parseInt(input) === cantidadActual;
    setIsCorrect(isRight);
    setShowFeedback(true);
  
    if (isRight) {
      const cantidadesCompletadas = animalSeleccionado === 'patito' ? cantidadesCompletadasPatitos : cantidadesCompletadasCerditos;
      const updateList = animalSeleccionado === 'patito' ? setCantidadesCompletadasPatitos : setCantidadesCompletadasCerditos;
      
      // Verificar que el número no esté ya en la lista
      if (!cantidadesCompletadas.includes(cantidadActual)) {
        updateList(prev => [...prev, cantidadActual]);
  
        // Verificar si con este número se completan los 9
        if (cantidadesCompletadas.length + 1 >= 9) {
          setGameCompleted(true);
          // Actualizar el localStorage para mantener el 100%
          localStorage.setItem(
            `nivel3_${animalSeleccionado === 'patito' ? 'patitos' : 'cerditos'}_completed`,
            'true'
          );
        }
      }
  
      setTimeout(() => {
        setShowFeedback(false);
        setUserInput('');
        if (cantidadesCompletadas.length + 1 < 9) {
          generarNuevaCantidad();
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
        setUserInput('');
      }, 1500);
    }
  };
*/

const checkAnswer = (input) => {
  const isRight = parseInt(input) === cantidadActual; // Verifica si la respuesta es correcta
  setIsCorrect(isRight);
  setShowFeedback(true);

  if (tiempoInicio) {
    const tiempoRespuesta = (Date.now() - tiempoInicio) / 1000; // Calcula el tiempo de respuesta
    const currentStats = animalSeleccionado === 'patito' ? patitosStats : cerditosStats;

    // Actualiza las estadísticas del número actual
    const updatedStats = {
      ...currentStats,
      [cantidadActual]: {
        errores: currentStats[cantidadActual]?.errores || 0,
        attempts: currentStats[cantidadActual]?.attempts || 0,
        tiempo: currentStats[cantidadActual]?.tiempo || 0,
      },
    };

    // Incrementar intentos (siempre, ya que es un intento)
    updatedStats[cantidadActual].attempts += 1;

    // Si la respuesta es incorrecta, incrementar errores
    if (!isRight) {
      updatedStats[cantidadActual].errores += 1;
    } else {
      // Si es correcta, acumular tiempo
      updatedStats[cantidadActual].tiempo += tiempoRespuesta;
    }

    // Actualiza el estado correspondiente
    if (animalSeleccionado === 'patito') {
      setPatitosStats(updatedStats);
    } else {
      setCerditosStats(updatedStats);
    }

    console.log(
      `Animal: ${animalSeleccionado}, Número: ${cantidadActual}, ` +
        `Intentos: ${updatedStats[cantidadActual].attempts}, ` +
        `Errores: ${updatedStats[cantidadActual].errores}, ` +
        `Tiempo acumulado: ${updatedStats[cantidadActual].tiempo.toFixed(2)}s`
    );
  }

  // Manejo de respuesta correcta o incorrecta
  if (isRight) {
    const cantidadesCompletadas = animalSeleccionado === 'patito' ? cantidadesCompletadasPatitos : cantidadesCompletadasCerditos;
    const updateList = animalSeleccionado === 'patito' ? setCantidadesCompletadasPatitos : setCantidadesCompletadasCerditos;

    if (!cantidadesCompletadas.includes(cantidadActual)) {
      updateList((prev) => [...prev, cantidadActual]);

      if (cantidadesCompletadas.length + 1 >= 9) {
        setGameCompleted(true);
      }
    }

    // Generar nueva cantidad tras un acierto
    setTimeout(() => {
      setShowFeedback(false);
      setUserInput('');
      if (cantidadesCompletadas.length + 1 < 9) {
        generarNuevaCantidad();
      }
    }, 2000);
  } else {
    // Solo espera cuando es incorrecto
    setTimeout(() => {
      setShowFeedback(false);
      setUserInput('');
    }, 1500);
  }
};

useEffect(() => {
  if (gameCompleted) {
    const sumarErrores = (stats) =>
      Object.values(stats).reduce((acc, curr) => acc + (curr.errores || 0), 0);
    const sumarTiempos = (stats) =>
      Object.values(stats).reduce((acc, curr) => acc + (curr.tiempo || 0), 0);

    console.log(`Errores Totales Patitos: ${sumarErrores(patitosStats)}`);
    console.log(`Errores Totales Cerditos: ${sumarErrores(cerditosStats)}`);
    console.log(`Tiempo Total Patitos: ${sumarTiempos(patitosStats).toFixed(2)}s`);
    console.log(`Tiempo Total Cerditos: ${sumarTiempos(cerditosStats).toFixed(2)}s`);
    console.log(
      `Tiempo Total General: ${(sumarTiempos(patitosStats) + sumarTiempos(cerditosStats)).toFixed(2)}s`
    );
  }
}, [gameCompleted]);
  
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
      <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-purple-600">Progreso</h3>
          <span className="text-xl font-bold text-purple-600">
            {Math.round((patitosProgress + cerditosProgress) / 2)}%
          </span>
        </div>
        
        <div className="space-y-2">
          <div 
            className="bg-gray-50 rounded-lg p-2 transition-all duration-300 
                       hover:bg-white hover:shadow-md hover:scale-[1.02] 
                       cursor-pointer border border-transparent hover:border-purple-200"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  🦆
                </span>
                <span className="text-gray-700 capitalize text-sm font-medium">
                  Patitos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 font-medium">
                  {Math.round(patitosProgress)}%
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAnimalProgress('patitos');
                  }}
                  className="text-red-500 hover:text-red-700 text-sm
                           transition-all duration-300 hover:scale-110"
                  title="Reiniciar patitos"
                >
                  🔄
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300
                         bg-gradient-to-r from-blue-400 to-purple-500" 
                style={{width: `${patitosProgress}%`}}
              />
            </div>
          </div>
  
          <div 
            className="bg-gray-50 rounded-lg p-2 transition-all duration-300 
                       hover:bg-white hover:shadow-md hover:scale-[1.02] 
                       cursor-pointer border border-transparent hover:border-purple-200"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  🐷
                </span>
                <span className="text-gray-700 capitalize text-sm font-medium">
                  Cerditos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 font-medium">
                  {Math.round(cerditosProgress)}%
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAnimalProgress('cerditos');
                  }}
                  className="text-red-500 hover:text-red-700 text-sm
                           transition-all duration-300 hover:scale-110"
                  title="Reiniciar cerditos"
                >
                  🔄
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300
                         bg-gradient-to-r from-pink-400 to-purple-500" 
                style={{width: `${cerditosProgress}%`}}
              />
            </div>
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

        {/* 
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
        */}
        {Object.entries(animales).map(([nombre, datos]) => (
          <button
            key={nombre}
            className="bg-white p-8 rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => iniciarJuego(nombre)}
          >
            <div className="mb-4">
              <img 
                src={datos.imagen} 
                alt={datos.nombre}
                className="w-32 h-32 object-contain"
              />
            </div>
            <div className="text-2xl font-bold text-purple-600 capitalize">{nombre}s</div>
          </button>
        ))}

      </div>
    </div>
  );

  const renderJuego = () => {
    if (gameCompleted) {
      return (
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            ¡Felicitaciones! 🎉
          </h2>
          <div className="mb-8">
            <div className="text-9xl mb-8">🏆</div>
            <p className="text-2xl text-gray-600">
              ¡Has completado todos los números con {animalSeleccionado === 'patito' ? 'los patitos' : 'los cerditos'}!
            </p>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => setAnimalSeleccionado(null)}
          >
            Volver al menú
          </button>
        </div>
      );
    }
  
    return (
      <div className="text-center space-y-8">
        <h2 className="text-4xl font-bold text-purple-600">
          Coloca {cantidadActual} {animalSeleccionado}{cantidadActual > 1 ? 's' : ''}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[...Array(cantidadActual)].map((_, i) => (
            //<span key={i} className="text-6xl">{animales[animalSeleccionado].emoji}</span>
            <div key={i} className="w-24 h-24">
              <img 
                src={animales[animalSeleccionado].imagen}
                alt={animales[animalSeleccionado].nombre}
                className="w-full h-full object-contain"
              />
            </div>
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
  };

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
        {progressLoaded && (animalSeleccionado ? renderJuego() : renderSeleccionAnimal())}
      </div>
    </div>
  );
};

export default Nivel3;
