import React from 'react';

// Componente Niveles
// Permite al jugador seleccionar un nivel de juego, mostrando opciones para los niveles disponibles.
// Props:
// - player: Objeto con información del jugador actual (nombre y avatar).
// - onBack: Función para regresar a la pantalla anterior.
// - onConfigClick: Función para abrir la configuración del jugador.
// - onSelectLevel: Función para seleccionar un nivel y avanzar.

const Niveles = ({ player, onBack, onConfigClick, onSelectLevel }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        {/* Header con información del jugador y botón volver */}
        <div className="flex items-center justify-between mb-8">
          {/* Botón para regresar a la pantalla anterior */}
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-2 px-4
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={onBack}
          >
            ← Volver
          </button>
          {/* Información del jugador con nombre y avatar */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-300"
            onClick={onConfigClick}
          >
            <span className="text-4xl">{player?.avatar}</span> {/* Muestra el avatar */}
            <span className="text-2xl font-bold text-purple-600 hover:text-purple-700">
              {player?.name} {/* Muestra el nombre del jugador */}
            </span>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-600">
          Selecciona un Nivel 🎮
        </h2>

        {/* Grid de niveles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Nivel 1 */}
          <button
            className="bg-gradient-to-br from-green-400 to-green-600 
                     hover:from-green-500 hover:to-green-700
                     text-white rounded-2xl p-8 transform hover:scale-105 
                     transition-all duration-300 shadow-xl"
            onClick={() => onSelectLevel(1)}
          >
            <div className="flex flex-col items-center space-y-4">
              <span className="text-6xl">🌟</span>
              <h3 className="text-2xl font-bold">Nivel 1</h3>
              <p className="text-lg opacity-90">Principiante</p>
              <div className="mt-4 text-sm bg-white bg-opacity-20 rounded-lg p-2">
                Reconoce números, vocales, formas, animales y colores
              </div>
            </div>
          </button>

          {/* Nivel 2 */}
          <button
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 
                     hover:from-yellow-500 hover:to-yellow-700
                     text-white rounded-2xl p-8 transform hover:scale-105 
                     transition-all duration-300 shadow-xl"
            onClick={() => onSelectLevel(2)}
          >
            <div className="flex flex-col items-center space-y-4">
              <span className="text-6xl">⭐</span>
              <h3 className="text-2xl font-bold">Nivel 2</h3>
              <p className="text-lg opacity-90">Intermedio</p>
              <div className="mt-4 text-sm bg-white bg-opacity-20 rounded-lg p-2">
                Relaciona conceptos (números, vocales, formas y colores)
              </div>
            </div>
          </button>

          {/* Nivel 3 */}
          <button
            className="bg-gradient-to-br from-purple-400 to-purple-600 
                     hover:from-purple-500 hover:to-purple-700
                     text-white rounded-2xl p-8 transform hover:scale-105 
                     transition-all duration-300 shadow-xl"
            onClick={() => onSelectLevel(3)}
          >
            <div className="flex flex-col items-center space-y-4">
              <span className="text-6xl">💫</span>
              <h3 className="text-2xl font-bold">Nivel 3</h3>
              <p className="text-lg opacity-90">Avanzado</p>
              <div className="mt-4 text-sm bg-white bg-opacity-20 rounded-lg p-2">
                Aprende a contar jugando con animales
              </div>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-lg">
            Selecciona un nivel para comenzar tu aventura de aprendizaje.
            ¡Cada nivel te traerá nuevos desafíos y diversión! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Niveles;