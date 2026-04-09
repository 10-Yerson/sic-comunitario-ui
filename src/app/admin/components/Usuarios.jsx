'use client';

import { useEffect, useState, useRef } from 'react';
import axios from '@/utils/axios';
import { FiEdit, FiTrash2, FiSearch, FiUsers } from 'react-icons/fi';

export default function Usuarios() {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCedula, setSearchCedula] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/resident/');
      setUserInfo(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar residentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResidents(); }, []);

  const searchByCedula = async (cedula) => {
    if (!cedula) { fetchResidents(); return; }
    try {
      setLoading(true);
      const res = await axios.get(`/api/resident/cedula/${cedula}`);
      setUserInfo(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      setUserInfo([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (userId) => {
    try {
      setLoading(true);
      setModalOpen(true);
      const res = await axios.get(`/api/resident/${userId}`);
      setSelectedUser(res.data);
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar el perfil');
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`/api/resident/${selectedUser._id}`);
      setUserInfo(userInfo.filter(u => u._id !== selectedUser._id));
      setModalOpen(false);
      alert('Usuario eliminado correctamente');
    } catch (err) {
      alert('No se pudo eliminar el usuario');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async () => {
    try {
      const res = await axios.put(`/api/resident/${selectedUser._id}`, formData);
      setUserInfo(userInfo.map(u => u._id === selectedUser._id ? res.data : u));
      setSelectedUser(res.data);
      setEditMode(false);
      alert('Usuario actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">Panel de administración</p>
        <h1 className="text-2xl font-bold text-gray-800">Habitantes</h1>
        <p className="text-gray-400 text-sm mt-0.5">Gestión de residentes de la comunidad</p>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
            <FiUsers className="text-green-600" size={15} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">{userInfo.length} residentes</p>
            <p className="text-xs text-gray-400">registrados en el sistema</p>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
          <input
            type="text"
            placeholder="Buscar por cédula..."
            value={searchCedula}
            onChange={(e) => { setSearchCedula(e.target.value); searchByCedula(e.target.value); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:border-green-300 focus:bg-white transition-all placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Residente</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lote</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Correo</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Teléfono</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userInfo.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-14">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">👥</span>
                      <p className="text-gray-400 text-sm font-medium">No se encontraron residentes</p>
                    </div>
                  </td>
                </tr>
              ) : (
                userInfo.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-2 ring-gray-100"
                          alt={user.name}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user.name} {user.apellido}</p>
                          <p className="text-xs text-gray-400 font-mono">CC: {user.cedula}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">{user.lote}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs hidden md:table-cell">{user.email}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs hidden md:table-cell font-mono">{user.telefono}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Activo
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => openModal(user._id)}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all hover:text-gray-800"
                      >
                        Ver perfil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL — sin cambios */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition duration-200 shadow-sm"
            >✕</button>
            <div className="flex justify-center -mt-12">
              <img src={selectedUser.profilePicture} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-white" />
            </div>
            <div className="text-center mt-2 px-6">
              <h2 className="text-xl font-bold text-gray-800">{selectedUser.name} {selectedUser.apellido}</h2>
              <p className="text-gray-500 text-sm">{selectedUser.email}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 px-8 text-sm text-gray-700">
              <div className="flex gap-3"><span className="text-blue-500">🪪</span><div><p className="text-gray-500">Cédula</p><p className="font-semibold">{selectedUser.cedula}</p></div></div>
              <div className="flex gap-3"><span className="text-blue-500">📞</span><div><p className="text-gray-500">Teléfono</p><p className="font-semibold">{selectedUser.telefono}</p></div></div>
              <div className="flex gap-3"><span className="text-blue-500">🏠</span><div><p className="text-gray-500">Lote</p><p className="font-semibold">{selectedUser.lote}</p></div></div>
              <div className="flex gap-3"><span className="text-blue-500">⚧</span><div><p className="text-gray-500">Género</p><p className="font-semibold">{selectedUser.genero}</p></div></div>
              <div className="flex gap-3"><span className="text-blue-500">🎂</span><div><p className="text-gray-500">Nacimiento</p><p className="font-semibold">{selectedUser.fechaNacimiento?.slice(0, 10)}</p></div></div>
              <div className="flex gap-3 md:col-span-2"><span className="text-blue-500">📍</span><div><p className="text-gray-500">Dirección</p><p className="font-semibold">{selectedUser.direccion}</p></div></div>
            </div>
            <div className="flex justify-end items-center gap-4 px-8 py-4 mt-6 border-t bg-gray-50/60">
              <button title="Editar" className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-yellow-500/90 text-white shadow-md hover:bg-yellow-500 hover:scale-105 transition-all duration-200">
                <FiEdit size={20} />
                <span className="absolute -top-9 scale-0 group-hover:scale-100 rounded-md bg-gray-900 text-white text-xs px-2 py-1 transition-transform">Editar</span>
              </button>
              <button onClick={handleDeleteUser} title="Eliminar" className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-red-500/90 text-white shadow-md hover:bg-red-500 hover:scale-105 transition-all duration-200">
                <FiTrash2 size={20} />
                <span className="absolute -top-9 scale-0 group-hover:scale-100 rounded-md bg-gray-900 text-white text-xs px-2 py-1 transition-transform">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}