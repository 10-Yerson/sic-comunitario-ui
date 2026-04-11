'use client';

import { useEffect, useState, useRef } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiSearch, FiUsers, FiX } from 'react-icons/fi';

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
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) { }
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
      setFormData(res.data);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar el perfil');
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
      toast.success('Residente eliminado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'No se pudo eliminar el residente');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async () => {
    try {
      const res = await axios.put(`/api/resident/${selectedUser._id}`, formData);
      const updatedResident = res.data.resident;
      setUserInfo(userInfo.map(u => u._id === selectedUser._id ? updatedResident : u));
      setSelectedUser(updatedResident);
      setFormData(updatedResident);
      setEditMode(false);
      toast.success('Residente actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el residente');
    }
  };

  const inputCls = 'w-full px-3 py-2.5 text-sm border-2 border-gray-100 bg-gray-50 rounded-xl focus:outline-none focus:border-green-300 focus:bg-white transition-all placeholder:text-gray-300';

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-6 py-8">

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

      {/* TABLE / CARDS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading && !modalOpen ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        ) : userInfo.length === 0 ? (
          <div className="text-center py-14">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">👥</span>
              <p className="text-gray-400 text-sm font-medium">No se encontraron residentes</p>
            </div>
          </div>
        ) : (
          <>
            {/* CARDS — móvil */}
            <div className="md:hidden divide-y divide-gray-50">
              {userInfo.map((user) => (
                <div key={user._id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                  <img
                    src={user.profilePicture}
                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0 ring-2 ring-gray-100"
                    alt={user.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{user.name} {user.apellido}</p>
                    <p className="text-xs text-gray-400 font-mono">CC: {user.cedula}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">{user.lote}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded-md">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Activo
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(user._id)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>

            {/* TABLE — desktop */}
            <table className="hidden md:table w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Residente</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lote</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Correo</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Teléfono</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {userInfo.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.profilePicture} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-2 ring-gray-100" alt={user.name} />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{user.name} {user.apellido}</p>
                          <p className="text-xs text-gray-400 font-mono">CC: {user.cedula}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">{user.lote}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs">{user.email}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs font-mono">{user.telefono}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Activo
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => openModal(user._id)}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                      >
                        Ver perfil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* MODAL VER */}
      {modalOpen && selectedUser && !editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Perfil del residente</p>
                  <h2 className="text-white text-xl font-bold">{selectedUser.name} {selectedUser.apellido}</h2>
                  <p className="text-slate-400 text-xs mt-1">{selectedUser.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <img src={selectedUser.profilePicture} className="w-12 h-12 rounded-xl object-cover" />
                  <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Info grid — scroll */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: '🪪', label: 'Cédula', value: selectedUser.cedula },
                  { icon: '📞', label: 'Teléfono', value: selectedUser.telefono },
                  { icon: '🏠', label: 'Lote', value: selectedUser.lote },
                  { icon: '⚧', label: 'Género', value: selectedUser.genero },
                  { icon: '🎂', label: 'Nacimiento', value: selectedUser.fechaNacimiento?.slice(0, 10) },
                  { icon: '📍', label: 'Dirección', value: selectedUser.direccion },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{item.icon}</span>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              </span>
              <div className="flex gap-2">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                  Cerrar
                </button>
                <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                  <FiEdit size={13} /> Editar
                </button>
                <button onClick={handleDeleteUser} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-100">
                  <FiTrash2 size={13} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalOpen && selectedUser && editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-5 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Modo edición</p>
                  <h2 className="text-white text-xl font-bold">{selectedUser.name} {selectedUser.apellido}</h2>
                  <p className="text-slate-400 text-xs mt-1">Modifica los datos del residente</p>
                </div>
                <div className="flex items-center gap-3">
                  <img src={selectedUser.profilePicture} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/20" />
                  <button onClick={() => setEditMode(false)} className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Form — scroll */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Nombre', type: 'text' },
                  { name: 'apellido', label: 'Apellido', type: 'text' },
                  { name: 'cedula', label: 'Cédula', type: 'text' },
                  { name: 'telefono', label: 'Teléfono', type: 'text' },
                  { name: 'lote', label: 'Lote', type: 'text' },
                  { name: 'fechaNacimiento', label: 'Nacimiento', type: 'date' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.name === 'fechaNacimiento' ? formData[field.name]?.slice(0, 10) || '' : formData[field.name] || ''}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Género</label>
                  <select name="genero" value={formData.genero || ''} onChange={handleChange} className={inputCls}>
                    <option value="">Seleccione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Dirección</label>
                  <input type="text" name="direccion" value={formData.direccion || ''} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-2 flex-shrink-0">
              <button onClick={() => setEditMode(false)} className="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                Cancelar
              </button>
              <button onClick={handleUpdateUser} className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-500 rounded-xl transition-all">
                ✓ Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}