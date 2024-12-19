import React, { useState, useEffect } from 'react';
import { Star, Music, Volume2, X } from 'lucide-react';
import Niveles from './Niveles'; 
import Configuracion from './Configuracion'; 
import EditarPerfil from './EditarPerfil';
import Nivel1 from './Nivel1';
import Numeros from './Numeros';
import Vocales from './Vocales';
import Figuras from './Figuras';
import Animales from './Animales';
import Colores from './Colores';

const KidsGameUI = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showBalloons, setShowBalloons] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedPlayerForOptions, setSelectedPlayerForOptions] = useState(null);

  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [showConfig, setShowConfig] = useState(false);

  const [currentLevel, setCurrentLevel] = useState(null);

  const [currentPhase, setCurrentPhase] = useState(null);

  const [showEditProfile, setShowEditProfile] = useState(false); //Editar el perfil

  // Array de avatares simples
  const avatars = [
    '🦁', '🐰', '🐸', '🐼', '🦊', '🐯', '🐶', '🐱', '🐮', // Animales originales
    '🦄', '🐨', '🐹', '🐻', '🐙', '🦋', '🦜', '🦒', '🦈', // Más animales
    '🦉', '🦝', '🐢', '🦡', '🦘', '🐳', '🦚', '🦩', '🦁', // Animales exóticos
    '🤖', '👽', '👨‍🚀', '👻'  // Personajes fantasía
  ];  
  

  // Array de colores de fondo pastel
  const backgroundColors = [
    'bg-pastel-blue',        // #AEC6CF
    'bg-pastel-green',       // #77DD77
    'bg-pastel-yellow',      // #FFECB3
    'bg-pastel-purple',      // #D6A2E8
    'bg-pastel-pink',        // #FFB7C5
    'bg-pastel-red',         // #FF6961
    'bg-pastel-indigo',      // #C3B1E1
    'bg-pastel-orange',      // #FFDAC1
    'bg-pastel-teal',        // #AFE4E0
    'bg-light-sky-blue',     // #87CEFA
    'bg-peach-puff',         // #FFDAB9
  ];

  // Obtener usuarios de Firebase al cargar la aplicación
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users'); // Asegúrate de que la ruta coincida con tu backend
        if (response.ok) {
          const users = await response.json(); // Transformar los datos recibidos
          setRegisteredPlayers(users); // Actualizar el estado con los usuarios registrados
        } else {
          console.error('Error al obtener usuarios');
        }
      } catch (error) {
        console.error('Error de red al obtener usuarios:', error);
      }
    };

    fetchUsers(); // Llama a la función al montar el componente
  }, []);

  // Agregar este nuevo componente junto a los otros modales
  const ErrorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-600 mb-4">
            ¡Ups! Hay un problema
          </h3>
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-full font-bold
                    hover:bg-red-600 transition-colors"
            onClick={() => setShowErrorModal(false)}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );

  const PlayerOptionsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">{selectedPlayerForOptions?.avatar}</div>
          <h3 className="text-2xl font-bold text-purple-600 mb-4">
            {selectedPlayerForOptions?.name}
          </h3>
          <div className="space-y-4">
            <button
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-full font-bold
                       hover:bg-blue-600 transition-colors"
              onClick={() => {
                setIsEditing(true);
                setEditingPlayer(selectedPlayerForOptions);
                setShowOptionsModal(false);
                //setCurrentScreen('register');
                setCurrentScreen('editProfile');
              }}
            >
              ✏️ Editar Perfil
            </button>
            <button
              className="w-full bg-purple-500 text-white px-6 py-3 rounded-full font-bold
                       hover:bg-purple-600 transition-colors"
              onClick={() => {
                setEditingPlayer(selectedPlayerForOptions);
                setShowOptionsModal(false);
                setCurrentScreen('changeAvatar');
              }}
            >
              🎭 Cambiar Avatar
            </button>
            <button
              className="w-full bg-red-500 text-white px-6 py-3 rounded-full font-bold
                      hover:bg-red-600 transition-colors"
              onClick={() => {
                setShowDeleteConfirmModal(true); // Solo mostramos el modal de confirmación
              }}
            >
              🗑️ Eliminar Jugador
            </button>
            <button
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-full font-bold
                       hover:bg-gray-600 transition-colors"
              onClick={() => setShowOptionsModal(false)}
            >
              ← Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal de Registro Exitoso
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 animate-bounce">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            ¡Registro Exitoso!
          </h3>
          <p className="text-gray-600 mb-6">
            ¡Ya puedes empezar a jugar!
          </p>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-full font-bold
                     hover:bg-green-600 transition-colors"
            onClick={() => {
              setShowSuccessModal(false);
              setCurrentScreen('login');
            }}
          >
            ¡Genial! 🎮
          </button>
        </div>
      </div>
    </div>
  );

  // Modal de Actualización Exitosa
  const UpdateSuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 animate-bounce">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            ¡Actualización Exitosa!
          </h3>
          <p className="text-gray-600 mb-6">
            ¡Los cambios se han guardado correctamente!
          </p>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-full font-bold
                    hover:bg-green-600 transition-colors"
            onClick={() => {
              setShowUpdateSuccessModal(false);
              setCurrentScreen('login');
            }}
          >
            ¡Genial! 🎮
          </button>
        </div>
      </div>
    </div>
  );

  // Modal de Confirmación de Eliminación
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🗑️</div>
          <h3 className="text-2xl font-bold text-red-600 mb-4">
            ¿Estás seguro?
          </h3>
          <p className="text-gray-600 mb-6">
            ¿Realmente deseas eliminar a {selectedPlayerForOptions?.name}?
          </p>
          <div className="space-y-3">
            <button
              className="w-full bg-red-500 text-white px-6 py-2 rounded-full font-bold
                      hover:bg-red-600 transition-colors"
              onClick={() => {
                const newPlayers = registeredPlayers.filter(
                  player => player !== selectedPlayerForOptions
                );
                setRegisteredPlayers(newPlayers);
                setShowDeleteConfirmModal(false);
                setShowOptionsModal(false);
                setErrorMessage(`¡El jugador ${selectedPlayerForOptions.name} ha sido eliminado con éxito!`);
                setShowErrorModal(true);
              }}
            >
              Sí, Eliminar
            </button>
            <button
              className="w-full bg-gray-500 text-white px-6 py-2 rounded-full font-bold
                      hover:bg-gray-600 transition-colors"
              onClick={() => setShowDeleteConfirmModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de globos flotantes
  const FloatingBalloons = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute animate-float-balloon-${i + 1} w-12 h-12 text-4xl`}
          style={{
            left: `${i * 20}%`,
            animationDelay: `${i * 0.5}s`,
            top: '100%'
          }}
        >
          {['🎈', '🎪', '⭐', '🌟', '🎯', '🎨'][i]}
        </div>
      ))}
    </div>
  );

  // Pantalla de Login
  const LoginScreen = () => (

    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 p-6">
      <FloatingBalloons />
      
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600 animate-bounce">
          ¡Vamos a Jugar! 🎮
        </h1>

        {registeredPlayers.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {registeredPlayers.map((player, index) => (
            <div key={player.name} className="relative">
              <button
                className={`${player.color || 'bg-gray-100'} hover:scale-105 transform transition-all duration-300 
                        rounded-2xl p-6 shadow-lg flex flex-col items-center w-full
                        ${selectedPlayer === index ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}`}
                onClick={() => {
                  setSelectedPlayer(index);
                  setCurrentScreen('niveles');
                }}
              >
                <span className="text-6xl mb-2">{player.avatar}</span>
                <span className="text-xl font-bold text-black">{player.name}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-6 mb-8">
          <div className="text-gray-600 text-xl">
            No hay jugadores registrados aún. ¡Sé el primero!
          </div>
        </div>
      )}

        <div className="flex justify-center space-x-6">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-8 rounded-full
                     transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => setCurrentScreen('register')}
          >
            ¡Nuevo Jugador! 🌟
          </button>
        </div>
      </div>
    </div>
  );

  // Pantalla de Registro
  const RegisterScreen = () => {
    const [formData, setFormData] = useState({
      name: '',
      age: '',
      gender: '',
      avatar: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Verificar campos vacíos
      if (!formData.name.trim()) {
        setErrorMessage("¡Debes ingresar tu nombre para continuar!");
        setShowErrorModal(true);
        return;
      }
      
      if (!formData.age) {
        setErrorMessage("¡Debes seleccionar tu edad para continuar!");
        setShowErrorModal(true);
        return;
      }
    
      if (!formData.gender) {
        setErrorMessage("¡Debes seleccionar tu género para continuar!");
        setShowErrorModal(true);
        return;
      }
    
      if (!formData.avatar) {
        setErrorMessage("¡Debes elegir un avatar para continuar!");
        setShowErrorModal(true);
        return;
      }

      // Si estamos editando
      if (isEditing && editingPlayer) {
        const updatedPlayers = registeredPlayers.map(player =>
          player === editingPlayer
            ? { ...formData, color: player.color }
            : player
        );
        setRegisteredPlayers(updatedPlayers);
        setIsEditing(false);
        setEditingPlayer(null);
        setShowSuccessModal(true);
        return;
      }

      // Verificar nombre duplicado solo si no estamos editando
      if (!isEditing) {
        const nameExists = registeredPlayers.some(
          player => player.name.toLowerCase() === formData.name.trim().toLowerCase()
        );

        if (nameExists) {
          setErrorMessage(`¡El nombre "${formData.name}" ya está registrado! Por favor, elige otro nombre.`);
          setShowErrorModal(true);
          return;
        }
      }
    
      // Enviar datos al backend
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            age: formData.age,
            gender: formData.gender,
            avatar: formData.avatar,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          
          // Actualizar jugadores registrados localmente
          const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
          const newPlayer = {
            ...formData,
            name: formData.name.trim(),
            color: randomColor,
          };
          
          setRegisteredPlayers([...registeredPlayers, newPlayer]);
          setShowSuccessModal(true);
          setFormData({ name: '', age: '', gender: '', avatar: '' });
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Error al registrar al usuario.');
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('Error al enviar datos al backend:', error);
        setErrorMessage('Error de red al intentar registrar al usuario.');
        setShowErrorModal(true);
      }

    };

    return (
      <div className="relative min-h-screen bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 p-6">
        <FloatingBalloons />
        
        <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
            ¡Nuevo Jugador! 🚀
          </h2>

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
                Escoge tu Avatar 🎭
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

            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="bg-pink-500 hover:bg-pink-600 text-white text-2xl font-bold py-4 px-8
                         rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
                onClick={() => setCurrentScreen('login')}
              >
                ← Volver
              </button>
              
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-8
                         rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Registrar 🎮
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Pantalla de Editar Perfil
const EditProfileScreen = () => {
  const [formData, setFormData] = useState({
    name: editingPlayer?.name || '',
    age: editingPlayer?.age || '',
    gender: editingPlayer?.gender || '',
    avatar: editingPlayer?.avatar || ''
  });

  useEffect(() => {
    if (editingPlayer) {
      setFormData({
        name: editingPlayer.name,
        age: editingPlayer.age,
        gender: editingPlayer.gender,
        avatar: editingPlayer.avatar
      });
    }
  }, [editingPlayer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar campos vacíos
    if (!formData.name.trim()) {
      setErrorMessage("¡Debes ingresar tu nombre para continuar!");
      setShowErrorModal(true);
      return;
    }

    // Verificar si el nombre ya existe y no es el mismo jugador
    const nameExists = registeredPlayers.some(
      player => player !== editingPlayer && 
      player.name.toLowerCase() === formData.name.trim().toLowerCase()
    );

    if (nameExists) {
      setErrorMessage(`¡El nombre "${formData.name}" ya está registrado!`);
      setShowErrorModal(true);
      return;
    }

    // Actualizar jugador
    const updatedPlayers = registeredPlayers.map(player =>
      player === editingPlayer
        ? { ...formData, color: player.color }
        : player
    );
    
    setRegisteredPlayers(updatedPlayers);
    setIsEditing(false);
    setEditingPlayer(null);
    setShowUpdateSuccessModal(true);
  };

  // Usar el mismo JSX que RegisterScreen pero cambiar el botón de "Registrar" por "Actualizar"
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 p-6">
      <FloatingBalloons />
      
      <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
          Editar Perfil de {editingPlayer?.name} 📝
        </h2>
        {/* Mismo formulario que RegisterScreen */}
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
      Escoge tu Avatar 🎭
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

  <div className="flex justify-center space-x-4">
    <button
      type="button"
      className="bg-pink-500 hover:bg-pink-600 text-white text-2xl font-bold py-4 px-8
               rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
      onClick={() => {
        setIsEditing(false);
        setEditingPlayer(null);
        setCurrentScreen('login');
      }}
    >
      ← Cancelar
    </button>
    
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold py-4 px-8
               rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
    >
      Actualizar ✨
    </button>
  </div>
</form>
        




      </div>
    </div>
  );
};

// Pantalla de Cambiar Avatar
const ChangeAvatarScreen = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(editingPlayer?.avatar || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedAvatar) {
      setErrorMessage("¡Debes elegir un avatar!");
      setShowErrorModal(true);
      return;
    }

    // Actualizar solo el avatar del jugador
    const updatedPlayers = registeredPlayers.map(player =>
      player === editingPlayer
        ? { ...player, avatar: selectedAvatar }
        : player
    );
    
    setRegisteredPlayers(updatedPlayers);
    setEditingPlayer(null);
    setShowUpdateSuccessModal(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 p-6">
      <FloatingBalloons />
      
      <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
          Cambiar Avatar de {editingPlayer?.name} 🎭
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-2xl font-bold text-purple-600 mb-4">
              Escoge tu nuevo Avatar
            </label>
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((avatar, index) => (
                <button
                  type="button"
                  key={index}
                  className={`bg-gray-100 p-6 rounded-xl transform transition-all duration-300
                           hover:scale-110 flex items-center justify-center
                           ${selectedAvatar === avatar ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <span className="text-5xl">{avatar}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="bg-pink-500 hover:bg-pink-600 text-white text-2xl font-bold py-4 px-8
                       rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => {
                setEditingPlayer(null);
                setCurrentScreen('login');
              }}
            >
              ← Cancelar
            </button>
            
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white text-2xl font-bold py-4 px-8
                       rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Actualizar Avatar 🎭
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

  // Animaciones de globos
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-balloon-1 { 
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(360deg); }
      }
      .animate-float-balloon-1 { animation: float-balloon-1 15s linear infinite; }
      @keyframes float-balloon-2 { 
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(-360deg); }
      }
      .animate-float-balloon-2 { animation: float-balloon-2 12s linear infinite; }
      @keyframes float-balloon-3 { 
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(360deg); }
      }
      .animate-float-balloon-3 { animation: float-balloon-3 18s linear infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'register' && <RegisterScreen />}
      {currentScreen === 'editProfile' && <EditProfileScreen />}
      {currentScreen === 'changeAvatar' && <ChangeAvatarScreen />}
      {currentScreen === 'niveles' && !showConfig && !currentLevel && (
        <Niveles 
          player={registeredPlayers[selectedPlayer]}
          onBack={() => setCurrentScreen('login')}
          onConfigClick={() => setShowConfig(true)}
          onSelectLevel={(level) => setCurrentLevel(level)}
        />
      )}
      {currentLevel === 1 && !currentPhase && !showConfig && (
      <Nivel1 
        player={registeredPlayers[selectedPlayer]}
        onBack={() => setCurrentLevel(null)}
        onSelectPhase={(phase) => setCurrentPhase(phase)}
        onConfigClick={() => {setShowConfig(true);}}
      />
      )}
      {currentPhase === 'numeros' && !showConfig && (
        <Numeros 
          player={registeredPlayers[selectedPlayer]}
          onBack={() => {
            setCurrentPhase(null);
          }}
          onConfigClick={() => setShowConfig(true)}
        />
      )}
      {currentPhase === 'vocales' && !showConfig && (
        <Vocales 
          player={registeredPlayers[selectedPlayer]}
          onBack={() => {
            setCurrentPhase(null);
          }}
          onConfigClick={() => setShowConfig(true)}
        />
      )}
      {currentPhase === 'figuras' && !showConfig && (
        <Figuras
          player={registeredPlayers[selectedPlayer]}
          onBack={() => {
            setCurrentPhase(null);
          }}
          onConfigClick={() => setShowConfig(true)}
        />
      )}
      {currentPhase === 'animales' && !showConfig && (
        <Animales
          player={registeredPlayers[selectedPlayer]}
          onBack={() => {
            setCurrentPhase(null);
          }}
          onConfigClick={() => setShowConfig(true)}
        />
      )}
      {currentPhase === 'colores' && !showConfig && (
        <Colores
          player={registeredPlayers[selectedPlayer]}
          onBack={() => {
            setCurrentPhase(null);
          }}
          onConfigClick={() => setShowConfig(true)}
        />
      )}
      {showConfig && !showEditProfile && (
      <Configuracion 
        player={registeredPlayers[selectedPlayer]}
        onBack={() => setShowConfig(false)}
        onEditProfile={() => setShowEditProfile(true)}
        onLogout={() => {
          setShowConfig(false);
          setCurrentScreen('login');
          setSelectedPlayer(null);
        }}
      />
      )}

      {showEditProfile && (
        <EditarPerfil
          player={registeredPlayers[selectedPlayer]}
          onBack={() => setShowEditProfile(false)}
          onUpdate={(updatedData) => {
            // Actualizar los datos del jugador
            const updatedPlayers = registeredPlayers.map((player, index) => 
              index === selectedPlayer ? { ...player, ...updatedData } : player
            );
            setRegisteredPlayers(updatedPlayers);
            setShowEditProfile(false);
            setShowConfig(false);
            setCurrentScreen('login')
            // Mostrar mensaje de éxito
            setShowUpdateSuccessModal(true);
          }}
        />
      )}

      
      {showSuccessModal && <SuccessModal />}
      {showUpdateSuccessModal && <UpdateSuccessModal />}
      {showErrorModal && <ErrorModal />} 
      {showOptionsModal && <PlayerOptionsModal />}
      {showDeleteConfirmModal && <DeleteConfirmModal />} 

    </div>
  );
};

export default KidsGameUI;