'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { Camera, User, Mail, CreditCard, Calendar, Shield, Loader2, Crown, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const getProfile = async () => {
    try {
      const res = await axios.get('/api/admin/profile/me');
      setProfile(res.data);
    } catch (error) {
      toast.error('Error al cargar perfil');
    }
  };

  useEffect(() => { getProfile(); }, []);

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
      toast.success('Foto actualizada correctamente');
      getProfile();
    } catch (error) {
      toast.error('Error al actualizar foto');
    } finally {
      setUploading(false);
    }
  };

  if (!profile) {
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
        <div className="px-8 py-6">
          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="relative flex-shrink-0 group">
              <img
                src={profile.profileUrl}
                alt="Perfil"
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100 shadow-sm"
              />
              <label className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer shadow-md flex items-center justify-center transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-widest">Panel de administración</p>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{profile.name} {profile.apellido}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{profile.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
                <Crown className="w-3 h-3" />
                {profile.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">

            {/* Info rápida */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Resumen</p>
              <div className="space-y-3">
                {[
                  { label: 'Eventos', value: 156, color: 'bg-blue-50 text-blue-600', bar: 'bg-blue-400' },
                  { label: 'Usuarios', value: 342, color: 'bg-purple-50 text-purple-600', bar: 'bg-purple-400' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${s.color}`}>{s.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bar} rounded-full`} style={{ width: '100%', transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Estado de cuenta</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-600">Cuenta activa</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-semibold text-blue-600">Acceso total</span>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:col-span-2 space-y-5">

            {/* Información personal */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="text-gray-400" size={15} />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Información personal</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: <Mail size={15} className="text-blue-500" />, bg: 'bg-blue-50', label: 'Correo', value: profile.email },
                  { icon: <CreditCard size={15} className="text-purple-500" />, bg: 'bg-purple-50', label: 'Cédula', value: profile.cedula || 'No registrada' },
                  { icon: <User size={15} className="text-green-500" />, bg: 'bg-green-50', label: 'Género', value: profile.genero || 'No especificado' },
                  { icon: <Calendar size={15} className="text-amber-500" />, bg: 'bg-amber-50', label: 'Miembro desde', value: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '---' },
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

            {/* Privilegios */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="text-gray-400" size={15} />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Privilegios de administrador</p>
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                {[
                  'Gestión completa de usuarios',
                  'Crear y editar eventos',
                  'Administrar asistencias',
                  'Generar reportes',
                  'Configuración del sistema',
                  'Acceso a estadísticas',
                ].map((privilege, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-100 border border-transparent transition-all">
                    <CheckCircle2 className="text-green-500 flex-shrink-0" size={15} />
                    <span className="text-xs font-medium text-gray-600">{privilege}</span>
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