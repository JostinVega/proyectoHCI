import React, { useState, useEffect } from 'react';
import MensajesPrediccion from './MensajesPrediccion';

const Nivel2 = ({ player, onBack, onSelectPhase, onConfigClick }) => {

  const [mlPredictions, setMlPredictions] = useState(null);

  // Efecto para obtener las predicciones
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/predictions/${player.name}`);
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Estructura completa de predicciones:', JSON.stringify(data, null, 2));
        setMlPredictions(data);
      } catch (err) {
        console.error('Error al obtener predicciones:', err);
        alert('Hubo un problema al obtener las predicciones. Intenta nuevamente.');
      }
    };

    if (player?.name) {
      fetchPredictions();
    }
  }, [player?.name]);

  // Estado para manejar el progreso
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem(`nivel2_progress_${player.name}`);
    return savedProgress 
      ? JSON.parse(savedProgress) 
      : {
          totalProgress: 0,
          phases: {
            'animales-numeros': { 
              completed: localStorage.getItem(`nivel2_animales_numeros_completed_${player.name}`) === 'true', 
              progress: parseInt(localStorage.getItem(`nivel2_animales_numeros_progress_${player.name}`)) || 0 
            },
            'animales-vocales': { completed: false, progress: 0 },
            'colores-formas': { completed: false, progress: 0 }
          }
        };
  });

  const [currentPhase, setCurrentPhase] = useState('menu');

  // Función para reiniciar fase
  const resetPhase = (phaseId) => {
    localStorage.removeItem(`nivel2_${phaseId}_progress_${player.name}`);
    localStorage.removeItem(`nivel2_${phaseId}_completed_${player.name}`);
    localStorage.removeItem(`nivel2_${phaseId}_instructions_${player.name}`);
    
    // Importante: Resetear también cualquier otro dato específico de la fase
    if (phaseId === 'animales-numeros') {
      localStorage.removeItem(`nivel2_animales_numeros_progress_${player.name}`);
      localStorage.removeItem(`nivel2_animales_numeros_completed_${player.name}`);
    }




    if (phaseId === 'animales-vocales') {
      localStorage.removeItem(`nivel2_animales_vocales_progress_${player.name}`);
      localStorage.removeItem(`nivel2_animales_vocales_completed_${player.name}`);
    }


    if (phaseId === 'colores-formas') {
      localStorage.removeItem(`nivel2_colores_formas_progress_${player.name}`);
      localStorage.removeItem(`nivel2_colores_formas_completed_${player.name}`);
      localStorage.setItem(`nivel2_colores_formas_reset_${player.name}`, 'true');
    }

    
    setProgress(prevProgress => ({
      ...prevProgress,
      phases: {
        ...prevProgress.phases,
        [phaseId]: {
          completed: false,
          progress: 0
        }
      }
    }));
  };

  

  // Efecto para guardar progreso en localStorage y comunicar al padre
  useEffect(() => {
    // Guardar progreso en localStorage
    localStorage.setItem(`nivel2_progress_${player.name}`, JSON.stringify(progress));
    
    // Guardar progreso específico de cada fase
    Object.entries(progress.phases).forEach(([phase, data]) => {
      localStorage.setItem(`nivel2_${phase}_progress_${player.name}`, data.progress);
      localStorage.setItem(`nivel2_${phase}_completed_${player.name}`, data.completed);
    });
    
    // Calcular progreso total
    const phases = progress.phases;
    const completedPhases = Object.values(phases).filter(phase => phase.completed).length;
    const totalProgress = Object.values(phases).reduce((sum, phase) => sum + phase.progress, 0) / Object.keys(phases).length;
    
    // Comunicar progreso al componente padre
    window.parent.postMessage({
      type: 'SAVE_LEVEL_PROGRESS',
      level: 2,
      progress: totalProgress,
      completed: completedPhases === Object.keys(phases).length
    }, '*');
  }, [progress, player.name]);
  // Método para actualizar el progreso de una fase
  const updatePhaseProgress = (phase, phaseProgress, isCompleted) => {
    setProgress(prevProgress => {
      const newProgress = {
        ...prevProgress,
        phases: {
          ...prevProgress.phases,
          [phase]: {
            completed: isCompleted,
            progress: phaseProgress
          }
        }
      };
      return newProgress;
    });
  };

  // Efecto para actualizar progreso
useEffect(() => {
    // Actualizar progreso desde localStorage para cada fase
    const updateProgressFromStorage = () => {
      const newProgress = { ...progress };
      
      // Verificar progreso de AnimalesNumeros
      const animalesNumerosProgress = localStorage.getItem(`nivel2_animales_numeros_progress_${player.name}`);
      if (animalesNumerosProgress) {
        newProgress.phases['animales-numeros'].progress = (parseInt(animalesNumerosProgress) / 9) * 100;
      }
  
      // Verificar progreso de AnimalesVocales
      const animalesVocalesProgress = localStorage.getItem(`nivel2_animales_vocales_progress_${player.name}`);
      if (animalesVocalesProgress) {
        newProgress.phases['animales-vocales'].progress = (parseInt(animalesVocalesProgress) / 5) * 100;
      }
  
      // Verificar progreso de ColoresFormas
      const coloresFormasProgress = localStorage.getItem(`nivel2_colores_formas_progress_${player.name}`);
      if (coloresFormasProgress) {
        newProgress.phases['colores-formas'].progress = (parseInt(coloresFormasProgress) / 7) * 100;
      }
  
      // Calcular progreso total
      const phases = newProgress.phases;
      const completedPhases = Object.values(phases).filter(phase => phase.completed).length;
      const totalProgress = Object.values(phases).reduce((sum, phase) => sum + phase.progress, 0) / Object.keys(phases).length;
      
      newProgress.totalProgress = totalProgress;
  
      // Actualizar estado
      setProgress(newProgress);
    };
  
    updateProgressFromStorage();
  }, [player.name]);

  // Renderizar barra de progreso
  const renderProgressBar = () => {
  const { phases } = progress;
  
  return (
    <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-purple-600">Progreso</h3>
        <span className="text-xl font-bold text-purple-600">
          {progress.totalProgress.toFixed(0)}%
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
                  {phase === 'animales-numeros' ? '🦁1️⃣' : 
                   phase === 'animales-vocales' ? '🐘A' : '🎨⭕'}
                </span>
                <span className="text-gray-700 capitalize text-sm font-medium">
                  {phase === 'animales-numeros' ? 'Animales y Números' :
                   phase === 'animales-vocales' ? 'Animales y Vocales' : 
                   'Colores y Formas'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 font-medium">
                  {data.completed ? '100%' : `${data.progress.toFixed(0)}%`}
                </span>
                {data.progress > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('¿Estás seguro de que quieres reiniciar esta fase? Se perderá todo el progreso.')) {
                        resetPhase(phase);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm
                             transition-all duration-300 hover:scale-110"
                    title="Reiniciar fase"
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
                style={{width: `${data.progress}%`}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  // Datos para cada fase
  const fases = [
    {
      id: 'animales-numeros',
      nombre: 'Animales y Números',
      emoji: '🦁1️⃣',
      color: 'from-blue-400 to-blue-600',
      descripcion: 'Relaciona cada animal con su número'
    },
    {
      id: 'animales-vocales',
      nombre: 'Animales y Vocales',
      emoji: '🐘A',
      color: 'from-pink-400 to-pink-600',
      descripcion: 'Relaciona cada animal con su vocal'
    },
    {
      id: 'colores-formas',
      nombre: 'Colores y Formas',
      emoji: '🎨⭕',
      color: 'from-purple-400 to-purple-600',
      descripcion: 'Relaciona cada color con su forma'
    }
  ];

  // Datos específicos para cada fase
  const faseData = {
    'animales-numeros': {
      relaciones: [
        { elemento1: '🐦', elemento2: '1', nombre: 'pájaro' },
        { elemento1: '🐢', elemento2: '2', nombre: 'tortuga' },
        { elemento1: '🐷', elemento2: '3', nombre: 'cerdo' },
        { elemento1: '🦆', elemento2: '4', nombre: 'pato' },
        { elemento1: '🦋', elemento2: '5', nombre: 'mariposa' },
        { elemento1: '🐥', elemento2: '6', nombre: 'pollito' },
        { elemento1: '🐱', elemento2: '7', nombre: 'gato' },
        { elemento1: '🐶', elemento2: '8', nombre: 'perro' },
        { elemento1: '🐑', elemento2: '9', nombre: 'oveja' }
      ]
    },
    'animales-vocales': {
      relaciones: [
        { elemento1: '🐝', elemento2: 'A', nombre: 'abeja' },
        { elemento1: '🐘', elemento2: 'E', nombre: 'elefante' },
        { elemento1: '🦎', elemento2: 'I', nombre: 'iguana' },
        { elemento1: '🐻', elemento2: 'O', nombre: 'oso' },
        { elemento1: '🦄', elemento2: 'U', nombre: 'unicornio' }
      ]
    },
    'colores-formas': {
      relaciones: [
        { elemento1: '🟢', elemento2: '⭕', nombre: 'verde círculo' },
        { elemento1: '💗', elemento2: '⬜', nombre: 'rosado cuadrado' },
        { elemento1: '💛', elemento2: '⭐', nombre: 'amarillo estrella' },
        { elemento1: '💜', elemento2: '△', nombre: 'morado triángulo' },
        { elemento1: '❤️', elemento2: '♥️', nombre: 'rojo corazón' },
        { elemento1: '🟧', elemento2: '◆', nombre: 'anaranjado rombo' },
        { elemento1: '💙', elemento2: '🌙', nombre: 'azul luna' }
      ]
    }
  };

  // Componente para el menú principal del nivel 2
  const MenuNivel2 = () => (
    <div className="space-y-8">
      {renderProgressBar()}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          Nivel 2: Relaciones
        </h2>
        <p className="text-gray-600">
          Relaciona elementos y aprende sus conexiones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fases.map((fase) => {
          // Obtener el progreso de la fase actual
          const phaseProgress = progress.phases[fase.id];
          const prediction = mlPredictions?.level2?.[fase.id];

          
          return (
            <button
              key={fase.id}
              className={`bg-gradient-to-r ${fase.color} hover:opacity-90
                        text-white rounded-2xl p-6 transform hover:scale-105 
                        transition-all duration-300 shadow-xl text-left
                        ${phaseProgress.completed ? 'opacity-50' : ''}`}
              onClick={() => onSelectPhase(fase.id)}
            >
              <div className="flex items-start space-x-4">
                <span className="text-4xl">{fase.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold mb-1">{fase.nombre}</h3>
                  <p className="text-sm opacity-90">{fase.descripcion}</p>
                  {prediction && (
                    <MensajesPrediccion prediction={prediction} />
                  )}
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
        <MenuNivel2 />
      </div>
    </div>
  );
};

export default Nivel2;