'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { Camera, User, Mail, CreditCard, Calendar, Shield, Loader2, Crown, Settings, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      getProfile();
    } catch (error) {
      toast.error('❌ Error al actualizar foto');
    } finally {
      setUploading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 py-8 px-4">

      {/* Patrón de fondo */}
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header con badge Admin */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-3 font-medium text-sm border border-green-200">
              <Crown className="w-4 h-4" />
              Panel de Administrador
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Mi Perfil</h1>
          </div>
          <button className="p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 shadow-sm transition-all group">
            <Settings className="w-6 h-6 text-gray-600 group-hover:text-green-600 group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Columna 1 - Card de Foto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

              {/* Gradiente superior */}
              <div className="h-24 bg-gradient-to-r from-green-600 to-emerald-600 relative">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Foto de perfil */}
              <div className="px-6 pb-6 -mt-16 relative">
                <div className="relative inline-block">
                  <img
                    src={profile.profileUrl}
                    alt="Perfil"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-2xl bg-white"
                  />
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-green-600 text-white rounded-xl cursor-pointer shadow-lg hover:bg-green-700 transition-all flex items-center justify-center group">
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.name} {profile.apellido}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{profile.email}</p>

                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg mt-3 text-sm font-semibold border border-green-200">
                    <Shield className="w-4 h-4" />
                    {profile.role.toUpperCase()}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center border border-blue-100">
                      <div className="text-2xl font-bold text-gray-900">156</div>
                      <div className="text-xs text-gray-600 mt-1">Eventos</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border border-purple-100">
                      <div className="text-2xl font-bold text-gray-900">342</div>
                      <div className="text-xs text-gray-600 mt-1">Usuarios</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2 y 3 - Información */}
          <div className="lg:col-span-2 space-y-6">

            {/* Información Personal */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Información Personal
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 hover:shadow-md transition-all border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-medium">Correo</p>
                      <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 hover:shadow-md transition-all border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-medium">Cédula</p>
                      <p className="text-sm font-semibold text-gray-900">{profile.cedula || 'No registrada'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 hover:shadow-md transition-all border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-medium">Género</p>
                      <p className="text-sm font-semibold text-gray-900">{profile.genero || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 hover:shadow-md transition-all border border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-medium">Miembro desde</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '---'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privilegios y Permisos */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Privilegios de Administrador
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Gestión completa de usuarios',
                  'Crear y editar eventos',
                  'Administrar asistencias',
                  'Generar reportes',
                  'Configuración del sistema',
                  'Acceso a estadísticas'
                ].map((privilege, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{privilege}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}