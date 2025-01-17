import React from 'react';

const Configuracion = ({ player, onBack, onEditProfile, onLogout, onShowProgress,onShowTimeConfig }) => {
  // Calcula el progreso (esto es un ejemplo, ajusta según tus necesidades)
  //const progress = 67; // Porcentaje de progreso

   // Validación temprana
   if (!player) {
    // Si no hay jugador, podrías redirigir o mostrar un mensaje de error
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
        <div className="text-center text-red-500 text-2xl">
          Error: No se ha seleccionado un jugador
        </div>
        <button 
          onClick={onBack}
          className="mx-auto block bg-pink-500 text-white px-4 py-2 rounded-full mt-4"
        >
          Volver
        </button>
      </div>
    );
  }
  
  const calcularProgresoGeneral = () => {
    // Obtener progreso de Nivel 1
    const progresoNivel1 = JSON.parse(localStorage.getItem(`nivel1_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress;
    
    // Obtener progreso de Nivel 2
    const progresoNivel2 = JSON.parse(localStorage.getItem(`nivel2_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress;
    
    // Obtener progreso de Nivel 3
    const datosNivel3 = JSON.parse(localStorage.getItem(`nivel3_progress_${player.name}`) || '{"patitos":[],"cerditos":[]}');
    const progresoPatitos = (datosNivel3.patitos?.length || 0) * (100/9);
    const progresoCerditos = (datosNivel3.cerditos?.length || 0) * (100/9);
    const progresoNivel3 = (progresoPatitos + progresoCerditos) / 2;

    // Calcular promedio de los 3 niveles
    return Math.round((progresoNivel1 + progresoNivel2 + progresoNivel3) / 3);
  };

  const progress = calcularProgresoGeneral();

  const levelConfigs = [
    {
      emoji: "1️⃣",
      bgClass: "bg-yellow-50",
      barClass: "bg-yellow-500",
      title: "Nivel 1",
      progress: JSON.parse(localStorage.getItem(`nivel1_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress
    },
    {
      emoji: "2️⃣",
      bgClass: "bg-blue-50",
      barClass: "bg-blue-500",
      title: "Nivel 2",
      progress: JSON.parse(localStorage.getItem(`nivel2_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress
    },
    {
      emoji: "3️⃣",
      bgClass: "bg-green-50",
      barClass: "bg-green-500",
      title: "Nivel 3",
      progress: (() => {
        const datos = JSON.parse(localStorage.getItem(`nivel3_progress_${player.name}`) || '{"patitos":[],"cerditos":[]}');
        const progresoPatitos = (datos.patitos?.length || 0) * (100/9);
        const progresoCerditos = (datos.cerditos?.length || 0) * (100/9);
        return ((progresoPatitos + progresoCerditos) / 2).toFixed(1);
      })()
    }
  ];
  
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
 
        {/* Niveles y Progreso */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { emoji: "1️⃣", color: "yellow", title: "Nivel 1", progress: JSON.parse(localStorage.getItem(`nivel1_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress },
            { emoji: "2️⃣", color: "blue", title: "Nivel 2", progress: JSON.parse(localStorage.getItem(`nivel2_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress },
            { 
              emoji: "3️⃣", 
              color: "green", 
              title: "Nivel 3", 
              progress: (() => {
                const datos = JSON.parse(localStorage.getItem(`nivel3_progress_${player.name}`) || '{"patitos":[],"cerditos":[]}');
                const progresoPatitos = (datos.patitos?.length || 0) * (100/9);
                const progresoCerditos = (datos.cerditos?.length || 0) * (100/9);
                return ((progresoPatitos + progresoCerditos) / 2).toFixed(1);
              })()
            }
          ].map((nivel, index) => (
            <div key={index} className={`bg-${nivel.color}-50 rounded-xl p-4 shadow hover:shadow-md transition-shadow duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{nivel.emoji}</span>
                  <span className="font-semibold">{nivel.title}</span>
                </div>
                {nivel.progress >= 100 && <span className="text-xl">⭐</span>}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-grow bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${nivel.color}-500 rounded-full h-2 transition-all duration-500`}
                    style={{ width: `${nivel.progress}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${nivel.progress >= 100 ? 'text-yellow-500' : 'text-gray-600'}`}>
                  {Number(nivel.progress).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
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
            onClick={() => onShowProgress()}
          >
            <span>📊</span>
            <span>Ver Progreso Detallado</span>
          </button>

          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-6
                     rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg
                     flex items-center justify-center space-x-2"
            onClick={onShowTimeConfig}
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
            Logros Desbloqueados 🏆
          </h3>
          <div className="bg-gray-50 rounded-xl p-4">
            {/* Logros de Nivel 1 */}
            {JSON.parse(localStorage.getItem(`nivel1_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress >= 100 && (
              <div className="flex items-center justify-between mb-2">
                <span>¡Maestro del Nivel 1! - Dominaste los conceptos básicos</span>
                <span className="text-yellow-500">🌟</span>
              </div>
            )}
            
            {/* Logros de Nivel 2 */}
            {JSON.parse(localStorage.getItem(`nivel2_progress_${player.name}`) || '{"totalProgress": 0}').totalProgress >= 100 && (
              <div className="flex items-center justify-between mb-2">
                <span>¡Experto en Relaciones! - Completaste el Nivel 2</span>
                <span className="text-yellow-500">🏆</span>
              </div>
            )}
            
            {/* Logros de Nivel 3 */}
            {(() => {
              const datos = JSON.parse(localStorage.getItem(`nivel3_progress_${player.name}`) || '{"patitos":[],"cerditos":[]}');
              return datos.patitos?.length === 9 || datos.cerditos?.length === 9;
            })() && (
              <div className="flex items-center justify-between">
                <span>¡Contador Prodigio! - Dominaste el conteo en el Nivel 3</span>
                <span className="text-yellow-500">👑</span>
              </div>
            )}
            
            {/* Mensaje si no hay logros */}
            {!localStorage.getItem(`nivel1_progress_${player.name}`) && 
            !localStorage.getItem(`nivel2_progress_${player.name}`) && 
            !localStorage.getItem(`nivel3_progress_${player.name}`) && (
              <div className="text-center text-gray-500">
                ¡Comienza a jugar para desbloquear logros! 🎮
              </div>
            )}
          </div>
        </div>



      </div>
    </div>
  );
};

export default Configuracion;