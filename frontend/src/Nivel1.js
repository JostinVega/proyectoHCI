import React, { useState, useEffect } from 'react';
import MensajesPrediccion from './MensajesPrediccion';

const Nivel1 = ({ player, onBack, onSelectPhase, onConfigClick }) => {
  const [currentPhase, setCurrentPhase] = useState('menu'); // menu, numeros, vocales, figuras, animales, colores

  const [mlPredictions, setMlPredictions] = useState(null);

  const mapFrontToBackId = (frontendId) => {
    return frontendId === 'numeros' ? 'numbers' : frontendId;
  };

  const mapBackToFrontId = (backendId) => {
    return backendId === 'numbers' ? 'numeros' : backendId;
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        //const response = await fetch(`/api/predictions/${player.name}`);
        const response = await fetch(`http://localhost:5000/api/predictions/${player.name}`);
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }
  
        const data = await response.json(); // Intentar parsear el JSON
        console.log('Predicciones recibidas:', data);
        setMlPredictions(data);
      } catch (err) {
        console.error('Error al obtener predicciones:', err);
        //alert('Hubo un problema al obtener las predicciones. Intenta nuevamente.');
      }
    };
  
    if (player?.name) {
      fetchPredictions();
    }
  }, [player?.name]);
  
  
  

  // Función para reiniciar el progreso de una fase específica
  const handleResetPhase = (phaseId) => {
    if (window.confirm(`¿Estás seguro que deseas reiniciar el progreso de ${phaseId}?`)) {
      // Eliminar el progreso específico del localStorage
      localStorage.removeItem(`nivel1_${phaseId}_progress_${player.name}`);
      localStorage.removeItem(`nivel1_${phaseId}_instructions_${player.name}`);
      
      // Actualizar el estado de progress
      const newProgress = { ...progress };
      newProgress.phases[phaseId] = { completed: false, progress: 0 };
      
      // Recalcular el progreso total
      const totalProgress = Object.values(newProgress.phases).reduce(
        (sum, phase) => sum + phase.progress, 0
      ) / Object.keys(newProgress.phases).length;
      
      newProgress.totalProgress = totalProgress;
      
      // Actualizar el estado y localStorage
      setProgress(newProgress);
      localStorage.setItem(`nivel1_progress_${player.name}`, JSON.stringify(newProgress));
    }
  };

  // Estado para manejar el progreso
  const [progress, setProgress] = useState(() => {
    // Leer progreso desde localStorage
    const savedProgress = localStorage.getItem(`nivel1_progress_${player.name}`);
    return savedProgress 
      ? JSON.parse(savedProgress) 
      : {
          totalProgress: 0,
          phases: {
            numeros: { completed: false, progress: 0 },
            vocales: { completed: false, progress: 0 },
            figuras: { completed: false, progress: 0 },
            animales: { completed: false, progress: 0 },
            colores: { completed: false, progress: 0 }
          }
        };
  });

  // Efecto para actualizar progreso
  useEffect(() => {
  const updateProgressFromStorage = () => {
    // Asegúrate de que el estado `progress` tenga una estructura válida
    const newProgress = { ...progress };
    if (!newProgress.phases) {
      newProgress.phases = {
        numeros: { completed: false, progress: 0 },
        vocales: { completed: false, progress: 0 },
        figuras: { completed: false, progress: 0 },
        animales: { completed: false, progress: 0 },
        colores: { completed: false, progress: 0 },
      };
    }

    // Verifica y actualiza cada progreso desde localStorage
    const numerosProgress = localStorage.getItem(`nivel1_numeros_progress_${player.name}`);
    if (numerosProgress) {
      newProgress.phases.numeros.progress = (parseInt(numerosProgress) / 10) * 100;
    }

    const vocalesProgress = localStorage.getItem(`nivel1_vocales_progress_${player.name}`);
    if (vocalesProgress) {
      newProgress.phases.vocales.progress = (parseInt(vocalesProgress) / 5) * 100;
    }

    const figurasProgress = localStorage.getItem(`nivel1_figuras_progress_${player.name}`);
    if (figurasProgress) {
      newProgress.phases.figuras.progress = (parseInt(figurasProgress) / 7) * 100;
    }

    const animalesProgress = localStorage.getItem(`nivel1_animales_progress_${player.name}`);
    if (animalesProgress) {
      newProgress.phases.animales.progress = (parseInt(animalesProgress) / 14) * 100;
    }

    const coloresProgress = localStorage.getItem(`nivel1_colores_progress_${player.name}`);
    if (coloresProgress) {
      newProgress.phases.colores.progress = (parseInt(coloresProgress) / 10) * 100;
    }

    // Asegúrate de que las claves de `newProgress.phases` existan antes de calcular el progreso total
    const totalProgress = Object.keys(newProgress.phases).length
      ? Object.values(newProgress.phases).reduce((sum, phase) => sum + (phase.progress || 0), 0) /
        Object.keys(newProgress.phases).length
      : 0;

    newProgress.totalProgress = totalProgress;

    // Actualiza el estado y guarda en localStorage
    setProgress(newProgress);
    localStorage.setItem(`nivel1_progress_${player.name}`, JSON.stringify(newProgress));
  };

  updateProgressFromStorage();
}, [player.name]);

{/*
  // Método para renderizar la barra de progreso
  const renderProgressBar = () => {
    const { phases } = progress || {}; // Asegurarse de que progress exista
  
    // Validar que phases esté definido y sea un objeto
    if (!phases || typeof phases !== 'object') {
      return (
        <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
          <h3 className="text-xl font-bold text-red-600">
            No hay datos de progreso disponibles.
          </h3>
        </div>
      );
    }

    return (
      <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-purple-600">Progreso</h3>
          <span className="text-xl font-bold text-purple-600">
            {progress.totalProgress ? progress.totalProgress.toFixed(0) : 0}%
          </span>
        </div>
        
        <div className="space-y-2">
          {Object.entries(phases).map(([phase, data]) => (
            <div 
              key={phase} 
              className="bg-gray-50 rounded-lg p-2 transition-all duration-300 
                       hover:bg-white hover:shadow-md hover:scale-[1.02] 
                       cursor-pointer border border-transparent hover:border-purple-200"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                    {phase === 'numeros' ? '🔢' : 
                     phase === 'vocales' ? '📝' : 
                     phase === 'figuras' ? '⭐' : 
                     phase === 'animales' ? '🦁' : '🎨'}
                  </span>
                  <span className="text-gray-700 capitalize text-sm font-medium">
                    {phase}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-purple-600 font-medium">
                    {data.progress ? data.progress.toFixed(0) : 0}%
                  </span>
                  {data.progress > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetPhase(phase);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm
                               transition-all duration-300 hover:scale-110"
                      title="Reiniciar progreso"
                    >
                      🔄
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    data.completed 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`} 
                  style={{width: `${data.progress || 0}%`}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  */}


  const renderProgressBar = () => {
    const { phases } = progress || {};
  
    if (!phases || typeof phases !== 'object') {
      return <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <h3 className="text-xl font-bold text-red-600">No hay datos disponibles.</h3>
      </div>;
    }
  
    return (
      <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-purple-600">Progreso</h3>
          <span className="text-xl font-bold text-purple-600">
            {progress.totalProgress ? progress.totalProgress.toFixed(0) : 0}%
          </span>
        </div>
        
        <div className="space-y-2">
          {Object.entries(phases).map(([phase, data]) => {
            const prediction = mlPredictions?.level1?.[phase];
            
            return (
              <div key={phase} className="bg-gray-50 rounded-lg p-2 hover:bg-white hover:shadow-md">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{phase === 'numeros' ? '🔢' : 
                     phase === 'vocales' ? '📝' : 
                     phase === 'figuras' ? '⭐' : 
                     phase === 'animales' ? '🦁' : '🎨'}</span>
                    <span className="text-gray-700 capitalize text-sm font-medium">{phase}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-600 font-medium">
                      {data.progress ? data.progress.toFixed(0) : 0}%
                    </span>
                    {/*
                    {prediction && (
                      <div className="mt-2 text-sm">
                        {prediction.needs_review && (
                          <div>
                            <p className="text-red-500 font-bold">¡Vuelve a practicar!</p>
                          </div>
                        )}
                        <p className="text-blue-600">
                          Tiempo recomendado: {prediction.recommended_timer}s
                        </p>
                      </div>
                    )}*/}
                    {data.progress > 0 && (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleResetPhase(phase);
                      }} className="text-red-500 hover:text-red-700 text-sm">
                        🔄
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${data.completed ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`} 
                    style={{width: `${data.progress || 0}%`}}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  
  // Datos para cada fase
  const fases = [
    {
      id: 'numeros',
      nombre: 'Números',
      emoji: '🔢',
      color: 'from-blue-400 to-blue-600',
      descripcion: 'Aprende los números del 1 al 10'
    },
    {
      id: 'vocales',
      nombre: 'Vocales',
      emoji: '📝',
      color: 'from-pink-400 to-pink-600',
      descripcion: 'Descubre las vocales: a, e, i, o, u'
    },
    {
      id: 'figuras',
      nombre: 'Figuras',
      emoji: '⭐',
      color: 'from-purple-400 to-purple-600',
      descripcion: 'Conoce las figuras geométricas'
    },
    {
      id: 'animales',
      nombre: 'Animales',
      emoji: '🦁',
      color: 'from-green-400 to-green-600',
      descripcion: 'Explora el mundo de los animales'
    },
    {
      id: 'colores',
      nombre: 'Colores',
      emoji: '🎨',
      color: 'from-yellow-400 to-yellow-600',
      descripcion: 'Aprende los colores básicos'
    }
  ];

  // Componente para el menú principal del nivel 1
  const MenuNivel1 = () => {
    // Verifica que `progress` y `phases` sean válidos antes de usarlos
    if (!progress || !progress.phases) {
      return (
        <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
          <h3 className="text-xl font-bold text-red-600">
            Error: Datos de progreso no disponibles.
          </h3>
        </div>
      );
    }
  
    return (
      <div className="space-y-8">
        {renderProgressBar()}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">
            Nivel 1: Aprendizaje Básico
          </h2>
          <p className="text-gray-600">
            Elige una categoría para empezar a aprender y divertirte
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fases.map((fase) => {
            // Verifica que `phaseProgress` exista antes de acceder a sus propiedades
            const phaseProgress = progress.phases[fase.id] || { completed: false, progress: 0 };
            //const prediction = mlPredictions?.level1?.[fase.id];
            const prediction = mlPredictions?.level1?.[mapFrontToBackId(fase.id)];

            return (
              <button
                key={fase.id}
                className={`bg-gradient-to-r ${fase.color} hover:opacity-90
                         text-white rounded-2xl p-6 transform hover:scale-105 
                         transition-all duration-300 shadow-xl text-left
                         ${phaseProgress.completed ? 'opacity-50' : ''}`}
                onClick={() => onSelectPhase(fase.id)}
                disabled={phaseProgress.completed}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-4xl">{fase.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{fase.nombre}</h3>
                    <p className="text-sm opacity-90">{fase.descripcion}</p>
                    {/*{prediction && (
                      <div className="mt-2 text-sm">
                        {prediction.needs_review && (
                          <p className="text-yellow-200 font-bold">¡Vuelve a practicar!</p>
                        )}
                        <p className="text-white">
                          Tiempo recomendado: {prediction.recommended_timer}s
                        </p>
                      </div>
                    )}*/}
                    <MensajesPrediccion prediction={prediction} />

                    {phaseProgress.completed && (
                      <span className="text-sm text-green-200">Completado ✅</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
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

        {/* Contenido dinámico según la fase */}
        {currentPhase === 'menu' && <MenuNivel1 />}
        
        {currentPhase === 'vocales' && (
          <div className="text-center">
            {/* Aquí irá el componente de Vocales */}
            <h3>Fase de Vocales</h3>
          </div>
        )}
        {currentPhase === 'figuras' && (
          <div className="text-center">
            {/* Aquí irá el componente de Figuras */}
            <h3>Fase de Figuras</h3>
          </div>
        )}
        {currentPhase === 'animales' && (
          <div className="text-center">
            {/* Aquí irá el componente de Animales */}
            <h3>Fase de Animales</h3>
          </div>
        )}
        {currentPhase === 'colores' && (
          <div className="text-center">
            {/* Aquí irá el componente de Colores */}
            <h3>Fase de Colores</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nivel1;