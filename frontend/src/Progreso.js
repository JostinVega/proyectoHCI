import React from 'react';

const Progreso = ({ player, onBack, onConfigClick }) => {
  // Función para calcular progreso general (reutilizada de Configuracion.js)
  const calcularProgresoGeneral = () => {
    const progresoNivel1 = JSON.parse(localStorage.getItem(`nivel1_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress;
    const progresoNivel2 = JSON.parse(localStorage.getItem(`nivel2_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress;
    
    const datosNivel3 = JSON.parse(localStorage.getItem(`nivel3_progress_${player.name}`) || '{"patitos":[],"cerditos":[]}');
    const progresoPatitos = (datosNivel3.patitos?.length || 0) * (100/9);
    const progresoCerditos = (datosNivel3.cerditos?.length || 0) * (100/9);
    const progresoNivel3 = (progresoPatitos + progresoCerditos) / 2;

    return Math.round((progresoNivel1 + progresoNivel2 + progresoNivel3) / 3);
  };

  // Renderizar el progreso del Nivel 1
  const renderProgresoNivel1 = () => {
    const progress = JSON.parse(localStorage.getItem(`nivel1_progress_${player.name}`) || '{"totalProgress": 0, "phases": {}}');
    const phases = progress.phases;

    return (
      <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-purple-600">Nivel 1: Aprendizaje Básico</h3>
          <span className="text-xl font-bold text-purple-600">
            {progress.totalProgress.toFixed(1)}%
          </span>
        </div>
        
        <div className="space-y-2">
          {Object.entries(phases).map(([phase, data]) => (
            <div key={phase} className="bg-gray-50 rounded-lg p-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {phase === 'numeros' ? '🔢' : 
                     phase === 'vocales' ? '📝' : 
                     phase === 'figuras' ? '⭐' : 
                     phase === 'animales' ? '🦁' : '🎨'}
                  </span>
                  <span className="text-gray-700 capitalize text-sm font-medium">
                    {phase}
                  </span>
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  {data.progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    data.completed ? 'bg-green-500' : 'bg-blue-500'
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

  // Renderizar el progreso del Nivel 2
  const renderProgresoNivel2 = () => {
    const progress = JSON.parse(localStorage.getItem(`nivel2_progress_${player.name}`) || '{"totalProgress": 0, "phases": {}}');
    const phases = progress.phases;

    return (
      <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-purple-600">Nivel 2: Relaciones</h3>
          <span className="text-xl font-bold text-purple-600">
            {progress.totalProgress.toFixed(1)}%
          </span>
        </div>
        
        <div className="space-y-2">
          {Object.entries(phases).map(([phase, data]) => (
            <div key={phase} className="bg-gray-50 rounded-lg p-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {phase === 'animales-numeros' ? '🦁1️⃣' : 
                     phase === 'animales-vocales' ? '🐘A' : '🎨⭕'}
                  </span>
                  <span className="text-gray-700 capitalize text-sm font-medium">
                    {phase === 'animales-numeros' ? 'Animales y Números' :
                     phase === 'animales-vocales' ? 'Animales y Vocales' : 
                     'Colores y Formas'}
                  </span>
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  {data.progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    data.completed ? 'bg-green-500' : 'bg-blue-500'
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

  // Renderizar el progreso del Nivel 3
  const renderProgresoNivel3 = () => {
    const datos = JSON.parse(localStorage.getItem(`nivel3_progress_${player.name}`) || '{"patitos":[],"cerditos":[]}');
    const progresoPatitos = (datos.patitos?.length || 0) * (100/9);
    const progresoCerditos = (datos.cerditos?.length || 0) * (100/9);
    const progresoTotal = (progresoPatitos + progresoCerditos) / 2;

    return (
      <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-purple-600">Nivel 3: Conteo</h3>
          <span className="text-xl font-bold text-purple-600">
            {progresoTotal.toFixed(1)}%
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🦆</span>
                <span className="text-gray-700 text-sm font-medium">Patitos</span>
              </div>
              <span className="text-sm text-purple-600 font-medium">
                {progresoPatitos.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{width: `${progresoPatitos}%`}}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐷</span>
                <span className="text-gray-700 text-sm font-medium">Cerditos</span>
              </div>
              <span className="text-sm text-purple-600 font-medium">
                {progresoCerditos.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{width: `${progresoCerditos}%`}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        {/* Header con botón de retorno */}
        <div className="flex justify-between items-center mb-8">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-2 px-4
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={onBack}
          >
            ← Volver
          </button>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-300" onClick={onConfigClick}>
            <span className="text-4xl">{player?.avatar}</span>
            <span className="text-2xl font-bold text-purple-600">
              {player?.name}
            </span>
          </div>
        </div>

        {/* Progreso General */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Progreso General</h2>
          <div className="bg-white bg-opacity-90 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-bold text-purple-600">Total</span>
              <span className="text-xl font-bold text-purple-600">{calcularProgresoGeneral()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-purple-600 rounded-full h-4 transition-all duration-500"
                style={{ width: `${calcularProgresoGeneral()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Progreso por niveles */}
        <div className="space-y-6">
          {renderProgresoNivel1()}
          {renderProgresoNivel2()}
          {renderProgresoNivel3()}
        </div>
      </div>
    </div>
  );
};

export default Progreso;