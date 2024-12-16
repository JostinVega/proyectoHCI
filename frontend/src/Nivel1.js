import React, { useState } from 'react';

const Nivel1 = ({ player, onBack, onSelectPhase }) => {
  const [currentPhase, setCurrentPhase] = useState('menu'); // menu, numeros, vocales, figuras, animales, colores

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
  const MenuNivel1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          Nivel 1: Aprendizaje Básico
        </h2>
        <p className="text-gray-600">
          Elige una categoría para empezar a aprender y divertirte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fases.map((fase) => (
          <button
            key={fase.id}
            className={`bg-gradient-to-r ${fase.color} hover:opacity-90
                     text-white rounded-2xl p-6 transform hover:scale-105 
                     transition-all duration-300 shadow-xl text-left`}
            onClick={() => onSelectPhase(fase.id)}
          >
            <div className="flex items-start space-x-4">
              <span className="text-4xl">{fase.emoji}</span>
              <div>
                <h3 className="text-xl font-bold mb-1">{fase.nombre}</h3>
                <p className="text-sm opacity-90">{fase.descripcion}</p>
              </div>
            </div>
          </button>
        ))}
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
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{player?.avatar}</span>
            <span className="text-2xl font-bold text-purple-600">
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