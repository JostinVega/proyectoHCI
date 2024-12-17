import React from 'react';

const Configuracion = ({ player, onBack, onEditProfile, onLogout }) => {
  // Calcula el progreso (esto es un ejemplo, ajusta según tus necesidades)
  const progress = 67; // Porcentaje de progreso

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        {/* Encabezado con botón de retorno */}
        <div className="flex justify-start mb-8">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-2 px-4
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={onBack}
          >
            ← Volver
          </button>
        </div>

        {/* Perfil Principal */}
        <div className="flex flex-col items-center mb-8">
          {/* Avatar Grande */}
          <div className="text-9xl mb-4">
            {player?.avatar}
          </div>
          {/* Nombre del Jugador */}
          <h2 className="text-3xl font-bold text-purple-600 mb-2">
            {player?.name}
          </h2>
          {/* Nivel y Progreso */}
          <div className="text-xl text-gray-600 mb-4">
            Nivel 2
          </div>
          {/* Barra de Progreso */}
          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-purple-600 rounded-full h-4 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            Progreso General: {progress}%
          </span>
        </div>

        {/* Logros y Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-100 rounded-xl p-4 text-center">
            <span className="text-4xl mb-2 block">🌟</span>
            <span className="font-bold">12 Estrellas</span>
          </div>
          <div className="bg-blue-100 rounded-xl p-4 text-center">
            <span className="text-4xl mb-2 block">🏆</span>
            <span className="font-bold">5 Trofeos</span>
          </div>
          <div className="bg-green-100 rounded-xl p-4 text-center">
            <span className="text-4xl mb-2 block">💎</span>
            <span className="font-bold">100 Puntos</span>
          </div>
        </div>

        {/* Opciones del Perfil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-6
                     rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg
                     flex items-center justify-center space-x-2"
            onClick={onEditProfile}  
          >
            <span>✏️</span>
            <span>Editar Perfil</span>
          </button>

          <button
            className="bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold py-4 px-6
                     rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg
                     flex items-center justify-center space-x-2"
          >
            <span>📊</span>
            <span>Ver Progreso Detallado</span>
          </button>

          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-6
                     rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg
                     flex items-center justify-center space-x-2"
          >
            <span>⚙️</span>
            <span>Configuración</span>
          </button>

          <button
            className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-4 px-6
                     rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg
                     flex items-center justify-center space-x-2"
            onClick={onLogout}
          >
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Sección de Últimos Logros */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">
            Últimos Logros 🏆
          </h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span>Completaste el Nivel 1</span>
              <span className="text-yellow-500">⭐⭐⭐</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Primera Partida Perfecta</span>
              <span className="text-yellow-500">🏆</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Racha de 3 días jugando</span>
              <span className="text-yellow-500">🌟</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;