import React, { useState, useEffect } from 'react';

const EditarPerfil = ({ player, onBack, onUpdate }) => {

    // Array de avatares simples
  const avatars = [
    '🦁', '🐰', '🐸', '🐼', '🦊', '🐯', '🐶', '🐱', '🐮', // Animales originales
    '🦄', '🐨', '🐹', '🐻', '🐙', '🦋', '🦜', '🦒', '🦈', // Más animales
    '🦉', '🦝', '🐢', '🦡', '🦘', '🐳', '🦚', '🦩', '🦁', // Animales exóticos
    '🤖', '👽', '👨‍🚀', '👻'  // Personajes fantasía
  ];  
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    avatar: ''
  });

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        age: player.age || '',
        gender: player.gender || '',
        avatar: player.avatar || ''
      });
    }
  }, [player]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-2 px-4
                     rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={onBack}
          >
            ← Volver
          </button>
          <div className="text-2xl font-bold text-purple-600">
            Editar Perfil
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-2xl font-bold text-purple-600 mb-2">
              Tu Nombre 📝
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full text-xl p-4 border-4 border-purple-300 rounded-2xl 
                       focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
              placeholder="¿Cómo te llamas?"
              required
            />
          </div>

          <div>
            <label className="block text-2xl font-bold text-purple-600 mb-2">
              Tu Género 👤
            </label>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className={`px-6 py-3 text-xl font-bold rounded-full transform transition-all duration-300
                         ${formData.gender === 'niño' 
                           ? 'bg-blue-500 text-white scale-105' 
                           : 'bg-blue-100 text-blue-500 hover:bg-blue-200'}`}
                onClick={() => setFormData({...formData, gender: 'niño'})}
              >
                Niño 👦
              </button>
              <button
                type="button"
                className={`px-6 py-3 text-xl font-bold rounded-full transform transition-all duration-300
                         ${formData.gender === 'niña' 
                           ? 'bg-pink-500 text-white scale-105' 
                           : 'bg-pink-100 text-pink-500 hover:bg-pink-200'}`}
                onClick={() => setFormData({...formData, gender: 'niña'})}
              >
                Niña 👧
              </button>
            </div>
          </div>

          <div>
            <label className="block text-2xl font-bold text-purple-600 mb-2">
              Tu Edad 🎂
            </label>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4, 5].map((age) => (
                <button
                  key={age}
                  type="button"
                  className={`w-16 h-16 text-2xl font-bold rounded-full transform transition-all duration-300
                           ${formData.age === age.toString()
                             ? 'bg-blue-500 text-white scale-110'
                             : 'bg-blue-100 text-blue-500 hover:bg-blue-200'}`}
                  onClick={() => setFormData({...formData, age: age.toString()})}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-2xl font-bold text-purple-600 mb-4">
              Tu Avatar 🎭
            </label>
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((avatar, index) => (
                <button
                  type="button"
                  key={index}
                  className={`bg-gray-100 p-6 rounded-xl transform transition-all duration-300
                           hover:scale-110 flex items-center justify-center
                           ${formData.avatar === avatar ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''}`}
                  onClick={() => setFormData({...formData, avatar: avatar})}
                >
                  <span className="text-5xl">{avatar}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-6">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold py-4 px-8
                       rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={onBack}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8
                       rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;