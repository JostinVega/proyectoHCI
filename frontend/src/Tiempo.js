import React, { useState, useEffect } from 'react';

const Tiempo = ({ player, onBack, onConfigClick }) => {
  // Estados para los tiempos de cada fase
  const [tiemposNivel1, setTiemposNivel1] = useState({
    numeros: 10,
    vocales: 10,
    figuras: 10,
    animales: 10,
    colores: 10
  });

  const [tiemposNivel2, setTiemposNivel2] = useState({
    'animales-numeros': 10,
    'animales-vocales': 10,
    'colores-formas': 10
  });

  const [tiemposNivel3, setTiemposNivel3] = useState({
    patitos: 10,
    cerditos: 10
  });

  // Cargar tiempos guardados al iniciar
  useEffect(() => {
    const tiempos1 = JSON.parse(localStorage.getItem(`tiempos_nivel1_${player.name}`)) || tiemposNivel1;
    const tiempos2 = JSON.parse(localStorage.getItem(`tiempos_nivel2_${player.name}`)) || tiemposNivel2;
    const tiempos3 = JSON.parse(localStorage.getItem(`tiempos_nivel3_${player.name}`)) || tiemposNivel3;
    
    setTiemposNivel1(tiempos1);
    setTiemposNivel2(tiempos2);
    setTiemposNivel3(tiempos3);
  }, [player.name]);

  // Función para guardar los tiempos
  const guardarTiempos = () => {
    const tiemposNivel1Formato = {
        numeros: tiemposNivel1.numeros,
        vocales: tiemposNivel1.vocales,
        figuras: tiemposNivel1.figuras,
        animales: tiemposNivel1.animales,
        colores: tiemposNivel1.colores
    };
    
    localStorage.setItem(`tiempos_nivel1_${player.name}`, JSON.stringify(tiemposNivel1Formato));
    //localStorage.setItem(`tiempos_nivel1_${player.name}`, JSON.stringify(tiemposNivel1));

    // Formato para Nivel 2
    const tiemposNivel2Formato = {
        'animales-numeros': tiemposNivel2['animales-numeros'],
        'animales-vocales': tiemposNivel2['animales-vocales'],
        'colores-formas': tiemposNivel2['colores-formas']
    };

    localStorage.setItem(`tiempos_nivel2_${player.name}`, JSON.stringify(tiemposNivel2Formato));

     // Formato para Nivel 3
     const tiemposNivel3Formato = {
        'patitos': tiemposNivel3.patitos,
        'cerditos': tiemposNivel3.cerditos
    };

    localStorage.setItem(`tiempos_nivel3_${player.name}`, JSON.stringify(tiemposNivel3Formato));

    //localStorage.setItem(`tiempos_nivel3_${player.name}`, JSON.stringify(tiemposNivel3));
    // Mostrar algún tipo de confirmación
    alert('¡Tiempos guardados correctamente!');
  };

  // Renderizar configuración del Nivel 1
  const renderConfigNivel1 = () => (
    <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-purple-600">Nivel 1: Aprendizaje Básico</h3>
      </div>
      
      <div className="space-y-4">
      {Object.entries(tiemposNivel1).map(([fase, tiempo]) => (
        <div key={fase} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="text-2xl bg-white p-3 rounded-full shadow-md">
                {fase === 'numeros' ? '🔢' : 
                fase === 'vocales' ? '📝' : 
                fase === 'figuras' ? '⭐' : 
                fase === 'animales' ? '🦁' : '🎨'}
                </div>
                <div>
                <span className="text-gray-700 capitalize text-lg font-semibold block">
                    {fase}
                </span>
                <span className="text-gray-500 text-sm">
                    Tiempo límite para completar
                </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                onClick={() => {
                    const newValue = Math.max(1, tiempo - 1);
                    setTiemposNivel1({...tiemposNivel1, [fase]: newValue});
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
                >
                -
                </button>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm min-w-[80px] text-center">
                <span className="text-2xl font-bold text-purple-600">{tiempo}</span>
                <span className="text-gray-500 text-sm ml-1">seg</span>
                </div>
                <button 
                onClick={() => {
                    const newValue = Math.min(20, tiempo + 1);
                    setTiemposNivel1({...tiemposNivel1, [fase]: newValue});
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
                >
                +
                </button>
            </div>
            </div>
            <div className="relative">
            <input
                type="range"
                min="1"
                max="20"
                value={tiempo}
                onChange={(e) => setTiemposNivel1({...tiemposNivel1, [fase]: parseInt(e.target.value)})}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                        focus:outline-none focus:ring-2 focus:ring-purple-300
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-purple-600
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:hover:bg-purple-700
                        [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1 text-xs text-gray-400">
                <span>1s</span>
                <span>5s</span>
                <span>10s</span>
                <span>15s</span>
                <span>20s</span>
            </div>
            </div>
        </div>
        ))}
      </div>
    </div>
  );

  // Renderizar configuración del Nivel 2
  const renderConfigNivel2 = () => (
    <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-purple-600">Nivel 2: Relaciones</h3>
      </div>
      
      <div className="space-y-4">
      {Object.entries(tiemposNivel2).map(([fase, tiempo]) => (
        <div key={fase} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="text-2xl bg-white p-3 rounded-full shadow-md">
                {fase === 'animales-numeros' ? '🦁1️⃣' : 
                fase === 'animales-vocales' ? '🐘A' : '🎨⭕'}
                </div>
                <div>
                <span className="text-gray-700 text-lg font-semibold block">
                    {fase === 'animales-numeros' ? 'Animales y Números' :
                    fase === 'animales-vocales' ? 'Animales y Vocales' : 
                    'Colores y Formas'}
                </span>
                <span className="text-gray-500 text-sm">
                    Tiempo límite para completar
                </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                onClick={() => {
                    const newValue = Math.max(1, tiempo - 1);
                    setTiemposNivel2({...tiemposNivel2, [fase]: newValue});
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
                >
                -
                </button>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm min-w-[80px] text-center">
                <span className="text-2xl font-bold text-purple-600">{tiempo}</span>
                <span className="text-gray-500 text-sm ml-1">seg</span>
                </div>
                <button 
                onClick={() => {
                    const newValue = Math.min(20, tiempo + 1);
                    setTiemposNivel2({...tiemposNivel2, [fase]: newValue});
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
                >
                +
                </button>
            </div>
            </div>
            <div className="relative">
            <input
                type="range"
                min="1"
                max="20"
                value={tiempo}
                onChange={(e) => setTiemposNivel2({...tiemposNivel2, [fase]: parseInt(e.target.value)})}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                        focus:outline-none focus:ring-2 focus:ring-purple-300
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-purple-600
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:hover:bg-purple-700
                        [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1 text-xs text-gray-400">
                <span>1s</span>
                <span>5s</span>
                <span>10s</span>
                <span>15s</span>
                <span>20s</span>
            </div>
            </div>
        </div>
        ))}
      </div>
    </div>
  );

  // Renderizar configuración del Nivel 3
  const renderConfigNivel3 = () => (
    <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-purple-600">Nivel 3: Conteo</h3>
      </div>
      
      <div className="space-y-4">
      {Object.entries(tiemposNivel3).map(([fase, tiempo]) => (
        <div key={fase} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="text-2xl bg-white p-3 rounded-full shadow-md">
                {fase === 'patitos' ? '🦆' : '🐷'}
                </div>
                <div>
                <span className="text-gray-700 capitalize text-lg font-semibold block">
                    {fase === 'patitos' ? 'Patitos' : 'Cerditos'}
                </span>
                <span className="text-gray-500 text-sm">
                    Tiempo límite para completar
                </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                onClick={() => {
                    const newValue = Math.max(1, tiempo - 1);
                    setTiemposNivel3({...tiemposNivel3, [fase]: newValue});
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
                >
                -
                </button>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm min-w-[80px] text-center">
                <span className="text-2xl font-bold text-purple-600">{tiempo}</span>
                <span className="text-gray-500 text-sm ml-1">seg</span>
                </div>
                <button 
                onClick={() => {
                    const newValue = Math.min(20, tiempo + 1);
                    setTiemposNivel3({...tiemposNivel3, [fase]: newValue});
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
                >
                +
                </button>
            </div>
            </div>
            <div className="relative">
            <input
                type="range"
                min="1"
                max="20"
                value={tiempo}
                onChange={(e) => setTiemposNivel3({...tiemposNivel3, [fase]: parseInt(e.target.value)})}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                        focus:outline-none focus:ring-2 focus:ring-purple-300
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-purple-600
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:hover:bg-purple-700
                        [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1 text-xs text-gray-400">
                <span>1s</span>
                <span>5s</span>
                <span>10s</span>
                <span>15s</span>
                <span>20s</span>
            </div>
            </div>
        </div>
        ))}
      </div>
    </div>
  );

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

        {/* Título y descripción */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Configurar tiempos</h2>
          <p className="text-gray-600">Ajusta el tiempo límite para cada actividad (en segundos)</p>
        </div>

        {/* Configuración por niveles */}
        <div className="space-y-6">
          {renderConfigNivel1()}
          {renderConfigNivel2()}
          {renderConfigNivel3()}
        </div>

        {/* Botón guardar */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={guardarTiempos}
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-3 px-6
                     rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            💾 Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tiempo;