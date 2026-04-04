'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { FiUserPlus, FiUser, FiMail, FiLock, FiHash, FiCheck } from 'react-icons/fi';

export default function UserColaborador() {
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', apellido: '', cedula: '', genero: '', email: '', password: 'Sic2025*'
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, apellido, cedula, genero, email, password } = form;
    if (!name || !apellido || !cedula || !genero || !email || !password) {
      toast.warning('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      if (role === 'admin') {
        await axios.post('/api/auth/register/admin', form);
        toast.success('Administrador creado correctamente');
      } else {
        await axios.post('/api/auth/register', form);
        toast.success('Colaborador creado correctamente');
      }
      setForm({ name: '', apellido: '', cedula: '', genero: '', email: '', password: 'Sic2025*' });
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error del servidor');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (hasValue) => `
    w-full pl-10 pr-4 py-3.5 text-sm rounded-2xl border-2 transition-all duration-200
    focus:outline-none placeholder:text-gray-300
    ${hasValue
      ? 'border-green-300 bg-white text-gray-800'
      : 'border-gray-200 bg-white focus:border-green-300 text-gray-800'
    }
  `;

  const fields = [
    { name: 'name', label: 'Nombre', icon: FiUser, placeholder: 'Ej: Juan', type: 'text' },
    { name: 'apellido', label: 'Apellido', icon: FiUser, placeholder: 'Ej: Pérez', type: 'text' },
    { name: 'cedula', label: 'Cédula', icon: FiHash, placeholder: 'Ej: 12345678', type: 'text' },
    { name: 'email', label: 'Correo electrónico', icon: FiMail, placeholder: 'correo@ejemplo.com', type: 'email' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row-reverse">

      {/* PANEL DERECHO — sidebar info (ahora a la derecha) */}
      <div className="hidden lg:flex w-80 flex-shrink-0 bg-gray-100 border-l border-gray-200 flex-col justify-between p-8">
        <div>
          <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center mb-8">
            <FiUserPlus className="text-white" size={20} />
          </div>

          <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">Sistema SIC</p>
          <h1 className="text-gray-800 text-2xl font-bold leading-tight mb-3">
            Crear nuevo<br />usuario
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Registra colaboradores y administradores con acceso al sistema comunitario.
          </p>

          <div className="mt-10 space-y-3">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-4">Tipo de acceso</p>
            {[
              { value: 'user', emoji: '👤', label: 'Colaborador', desc: 'Gestiona eventos y asistencias' },
              { value: 'admin', emoji: '🛡️', label: 'Administrador', desc: 'Acceso total al sistema' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-200 ${role === opt.value
                  ? 'bg-green-50 border-2 border-green-300 shadow-sm'
                  : 'border-2 border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${role === opt.value ? 'text-green-700' : 'text-gray-600'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
                {role === opt.value && (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <FiCheck size={11} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white border border-gray-200 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 mb-1">Contraseña por defecto</p>
            <p className="font-mono text-green-600 text-sm font-bold">Sic2025*</p>
            <p className="text-xs text-gray-400 mt-1">El usuario puede cambiarla desde su perfil</p>
          </div>
        </div>

        <p className="text-gray-400 text-xs">Sistema Integral Comunitario © 2025</p>
      </div>

      {/* PANEL IZQUIERDO — formulario */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Top bar móvil */}
        <div className="lg:hidden bg-gray-100 border-b border-gray-200 px-6 py-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-widest">Sistema SIC</p>
          <h1 className="text-lg font-bold text-gray-800">Crear Usuario</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl">

            {/* Título desktop */}
            <div className="hidden lg:block mb-8">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">Panel de administración</p>
              <h2 className="text-2xl font-bold text-gray-800">Información del usuario</h2>
              <p className="text-gray-400 text-sm mt-1">
                Completa todos los campos para crear el {role === 'admin' ? 'administrador' : 'colaborador'}
              </p>
            </div>

            {/* Selector móvil */}
            <div className="lg:hidden mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tipo de usuario</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'user', label: '👤 Colaborador' },
                  { value: 'admin', label: '🛡️ Administrador' },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${role === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'
                      }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Grid campos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ name, label, icon: Icon, placeholder, type }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label} *</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                      <input
                        name={name}
                        type={type}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={inputCls(!!form[name])}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Género */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Género *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Masculino', 'Femenino', 'Otro'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm({ ...form, genero: g })}
                      className={`py-3 rounded-2xl text-sm font-semibold border-2 transition-all duration-200 ${form.genero === g
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                        }`}
                    >
                      {g === 'Masculino' ? '👨' : g === 'Femenino' ? '👩' : '🧑'} {g}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="genero" value={form.genero} />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contraseña</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                  <input
                    name="password"
                    type="text"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputCls(!!form.password)}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#31DCB7] text-white font-bold py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creando usuario...</>
                  ) : (
                    <><FiUserPlus size={17} />{role === 'admin' ? 'Crear administrador' : 'Crear colaborador'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}