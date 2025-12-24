'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';

import {
  FiUserPlus,
  FiUser,
  FiMail,
  FiLock,
  FiHash,
  FiUserCheck
} from 'react-icons/fi';

export default function UserColaborador() {

  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    apellido: '',
    cedula: '',
    genero: '',
    email: '',
    password: 'Sic2025*'
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, apellido, cedula, genero, email, password } = form;

    if (!name || !apellido || !cedula || !genero || !email || !password) {
      toast.warning('⚠️ Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      if (role === 'admin') {
        await axios.post('/api/auth/register/admin', form);
        toast.success('🎉 Administrador creado correctamente');
      } else {
        await axios.post('/api/auth/register', form);
        toast.success('🎉 Colaborador creado correctamente');
      }

      setForm({
        name: '',
        apellido: '',
        cedula: '',
        genero: '',
        email: '',
        password: 'Sic2025*'
      });

    } catch (error) {
      toast.error(error.response?.data?.msg || '❌ Error del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-scree from-blue-50 to-indigo-100 flex justify-center overflow-x-hidden">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 p-2 md:p-10 my-2">

        <div className="mb-10 flex items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Registro de Usuarios
            </h1>

            <p className="text-gray-500">
              Crea colaboradores y administradores fácilmente
            </p>
          </div>

          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <FiUserPlus size={28} />
          </div>

        </div>


        <form onSubmit={handleSubmit} className="space-y-8">

          <div>
            <label className="font-semibold text-gray-700">
              Tipo de usuario
            </label>

            <div className="relative mt-2">
              <FiUserCheck className="absolute left-4 top-3.5 text-gray-400" />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="user">Colaborador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-semibold text-gray-700">
                Nombre
              </label>

              <div className="relative mt-2">
                <FiUser className="absolute left-4 top-3.5 text-gray-400" />

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Apellido
              </label>

              <div className="relative mt-2">
                <FiUser className="absolute left-4 top-3.5 text-gray-400" />

                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Cédula
              </label>

              <div className="relative mt-2">
                <FiHash className="absolute left-4 top-3.5 text-gray-400" />

                <input
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Género
              </label>

              <div className="relative mt-2">
                <FiUser className="absolute left-4 top-3.5 text-gray-400" />

                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Correo electrónico
              </label>

              <div className="relative mt-2">
                <FiMail className="absolute left-4 top-3.5 text-gray-400" />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@example.com"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Contraseña
              </label>

              <div className="relative mt-2">
                <FiLock className="absolute left-4 top-3.5 text-gray-400" />

                <input
                  name="password"
                  type="text" 
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-60"
          >
            <FiUserPlus />

            {loading
              ? 'Creando usuario...'
              : role === 'admin'
                ? 'Crear administrador'
                : 'Crear colaborador'}
          </button>
        </form>
      </div>
    </div>
  );
}
