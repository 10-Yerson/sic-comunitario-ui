'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { FiCamera } from 'react-icons/fi';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/user/profile/me');
      setUser(data);
      console.log(data)
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar el perfil');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleFileChange = (file) => {
    if (!file) return;
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!profilePicture) return toast.error('Selecciona una imagen primero');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('profilePicture', profilePicture);
      await axios.put('/api/user/profile/me', fd);
      toast.success('Imagen de perfil actualizada');
      setProfilePicture(null);
      setPreview(null);
      getUser();
    } catch (error) {
      console.error(error);
      toast.error('Error actualizando la foto');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="flex items-center justify-center h-screen">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Card ancho */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Foto de perfil */}
        <div className="relative flex-shrink-0">
          <img
            src={preview || user.profilePicture}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-lg object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition">
            <FiCamera size={18} />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </label>
          {profilePicture && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              {loading ? 'Subiendo...' : 'Actualizar Foto'}
            </button>
          )}
        </div>

        {/* Información */}
        <div className="flex-1 w-full">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">{user.name} {user.apellido}</h2>
            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Género', value: user.profile.genero || 'N/A' },
              { label: 'Documento', value: user.profile.cedula || 'N/A' },
              { label: 'Teléfono', value: user.profile.telefono || 'N/A' },
              { label: 'Rol', value: user.role.toUpperCase() },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition flex justify-between items-center"
              >
                <span className="font-semibold text-gray-600">{item.label}:</span>
                <span className="text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
