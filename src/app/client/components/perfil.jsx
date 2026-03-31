'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';
import { Camera, Mail, Phone, CreditCard, User, Shield, Upload, Check, Calendar } from 'lucide-react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/user/profile/me');
      setUser(data);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar el perfil');
    }
  };

  useEffect(() => { getUser(); }, []);

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
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO HEADER */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto px-6 py-8">
          <div className="flex items-center gap-6">

            <div className="relative flex-shrink-0 group">
              <img
                src={preview || user.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-gray-100 shadow-sm"
              />

              <div
                onClick={() => setLightbox(true)}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
              >
                <span className="text-white text-xs font-semibold">Ver foto</span>
              </div>

              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer shadow-md flex items-center justify-center transition-colors">
                <Camera className="w-4 h-4" />
                <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} />
              </label>
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">Perfil de usuario</p>
              <h1 className="text-2xl font-bold text-gray-800">{user.name} {user.apellido}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
                <Shield className="w-3 h-3" />
                {user.role.toUpperCase()}
              </span>
            </div>

            {profilePicture && (
              <div className="flex gap-2">
                <button
                  onClick={cancelPreview}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-500 disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {loading ? 'Guardando...' : 'Guardar foto'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          <div className="space-y-5">

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resumen</p>
              <div className="space-y-4">
                {[
                  { label: 'Eventos', value: 2, color: 'bg-purple-50 text-purple-600', bar: 'bg-purple-400' },
                  { label: 'Asistencias', value: 10, color: 'bg-green-50 text-green-600', bar: 'bg-green-400' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${s.color}`}>{s.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${Math.min(s.value * 10, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Estado de cuenta</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-600">Cuenta activa</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="text-gray-400" size={15} />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Información personal</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: <User size={15} className="text-purple-500" />, bg: 'bg-purple-50', label: 'Género', value: user.profile.genero || 'No especificado' },
                  { icon: <CreditCard size={15} className="text-blue-500" />, bg: 'bg-blue-50', label: 'Documento', value: user.profile.cedula || 'N/A' },
                  { icon: <Phone size={15} className="text-green-500" />, bg: 'bg-green-50', label: 'Teléfono', value: user.profile.telefono || 'No registrado' },
                  { icon: <Mail size={15} className="text-amber-500" />, bg: 'bg-amber-50', label: 'Email', value: user.email },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="text-gray-400" size={15} />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actividad reciente</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Check className="text-green-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Asistencia Registrada</p>
                    <p className="text-xs text-gray-400 mt-0.5">Reunión General de Vecinos</p>
                  </div>
                  <span className="text-xs text-gray-300 flex-shrink-0">Hace 2 días</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Evento Próximo</p>
                    <p className="text-xs text-gray-400 mt-0.5">Jornada de Limpieza Comunitaria</p>
                  </div>
                  <span className="text-xs text-gray-300 flex-shrink-0">En 5 días</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {lightbox && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img
              src={preview || user.profilePicture}
              alt="Foto de perfil"
              className="max-w-sm max-h-[80vh] rounded-2xl shadow-2xl object-cover"
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}