import React, { useState } from 'react';

const Nivel2 = ({ player, onBack, onSelectPhase, onConfigClick }) => {
  const [currentPhase, setCurrentPhase] = useState('menu');

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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          Nivel 2: Relaciones
        </h2>
        <p className="text-gray-600">
          Relaciona elementos y aprende sus conexiones
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