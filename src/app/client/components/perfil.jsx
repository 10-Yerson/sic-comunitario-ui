'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { Camera, Mail, Phone, CreditCard, User, Shield, Upload, Check, X, Edit, MapPin, Calendar, Award } from 'lucide-react';

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

  const cancelPreview = () => {
    setProfilePicture(null);
    setPreview(null);
  };

  if (!user) {
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda - Tarjeta de Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              
              {/* Header con gradiente */}
              <div className="h-24 bg-gradient-to-r from-green-600 to-emerald-600 relative">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src={preview || user.profilePicture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                    <label className="absolute bottom-2 right-2 w-10 h-10 bg-green-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-green-700 transition-all flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Información básica */}
              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.name} {user.apellido}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <Shield className="w-4 h-4" />
                  {user.role.toUpperCase()}
                </div>

                {/* Botones de foto */}
                {profilePicture && (
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Guardar Foto
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelPreview}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Stats rápidos */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">2</div>
                      <div className="text-xs text-gray-500 mt-1">Eventos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">10</div>
                      <div className="text-xs text-gray-500 mt-1">Asistencias</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Información Detallada */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sección: Información Personal */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Información Personal
                </h3>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Género</p>
                    <p className="text-sm font-semibold text-gray-900">{user.profile.genero || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Documento</p>
                    <p className="text-sm font-semibold text-gray-900">{user.profile.cedula || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                    <p className="text-sm font-semibold text-gray-900">{user.profile.telefono || 'No registrado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Actividad Reciente */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Actividad Reciente
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Asistencia Registrada</p>
                    <p className="text-sm text-gray-600 mt-1">Reunión General de Vecinos</p>
                    <p className="text-xs text-gray-500 mt-2">Hace 2 días</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Evento Próximo</p>
                    <p className="text-sm text-gray-600 mt-1">Jornada de Limpieza Comunitaria</p>
                    <p className="text-xs text-gray-500 mt-2">En 5 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}