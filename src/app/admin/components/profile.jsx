'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { FiCamera, FiUser } from 'react-icons/fi';

export default function Profile() {

  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);


  // =========================
  //  GET PROFILE
  // =========================
  const getProfile = async () => {
    try {
      const res = await axios.get('/api/admin/profile/me');
      setProfile(res.data);
    } catch (error) {
      toast.error('❌ Error al cargar perfil');
    }
  };


  useEffect(() => {
    getProfile();
  }, []);



  // =========================
  //  UPLOAD PHOTO
  // =========================
  const handleFileChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('profileUrl', file);

    setUploading(true);

    try {

      await axios.put('/api/admin/profile/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('🎉 Foto actualizada correctamente');

      getProfile(); // reload data

    } catch (error) {
      toast.error('❌ Error al actualizar foto');
    } finally {
      setUploading(false);
    }
  };



  if (!profile) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Cargando perfil...
      </p>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-3xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Mi Perfil
            </h1>
            <p className="text-gray-500">
              Información del administrador
            </p>
          </div>

          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <FiUser size={28} />
          </div>
        </div>


        {/* PERFIL */}
        <div className="flex flex-col md:flex-row gap-10 items-center">

          {/* FOTO */}
          <div className="relative">

            <img
              src={profile.profileUrl}
              alt="Perfil"
              className="w-40 h-40 rounded-2xl object-cover border shadow"
            />

            {/* BOTÓN SUBIR */}
            <label
              className="
                absolute bottom-2 right-2
                bg-blue-600 text-white
                p-2 rounded-xl shadow cursor-pointer
                hover:bg-blue-700 transition
              "
            >
              <FiCamera size={18} />

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>

          </div>


          {/* INFO */}
          {/* INFO */}
          <div className="space-y-4 w-full">

            <p className="text-xl font-bold text-gray-800">
              {profile.name} {profile.apellido}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-gray-400 uppercase">Correo</p>
                <p className="text-gray-700">{profile.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Cédula</p>
                <p className="text-gray-700">{profile.cedula || 'No registrada'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Género</p>
                <p className="text-gray-700">{profile.genero || 'No especificado'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Rol</p>
                <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-700">
                  {profile.role}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase">Miembro desde</p>
                <p className="text-gray-700">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '---'}
                </p>
              </div>

            </div>

          </div>


        </div>


        {/* ESTADO SUBIDA */}
        {uploading && (
          <p className="mt-6 text-blue-600 text-sm">
            Subiendo imagen...
          </p>
        )}

      </div>
    </div>
  );
}
