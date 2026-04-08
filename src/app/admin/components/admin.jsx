'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { Users, Trash2, Shield, Mail, CreditCard, User, Search, Loader2, AlertCircle } from 'lucide-react';

export default function AdminInfo() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const getAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin');
      setAdmins(data);
      console.log(data)
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Estás seguro de eliminar al administrador ${name}?`)) return;

    setDeletingId(id);
    try {
      await axios.delete(`/api/admin/${id}`);
      toast.success('Administrador eliminado correctamente');
      getAdmins();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar administrador');
    } finally {
      setDeletingId(null);
    }
  };

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const handleView = async (id) => {
    try {
      setLoadingAdmin(true);
      const { data } = await axios.get(`/api/admin/${id}`);
      setSelectedAdmin(data);
      console.log('data id admin', data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener información');
    } finally {
      setLoadingAdmin(false);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.cedula && admin.cedula.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando administradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4 font-medium text-sm">
            <Shield className="w-4 h-4" />
            Gestión de Administradores
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Administradores del Sistema</h1>
          <p className="text-gray-600">Gestiona los usuarios con privilegios administrativos</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Administradores</p>
                <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Activos</p>
                <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Resultados</p>
                <p className="text-3xl font-bold text-gray-900">{filteredAdmins.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Lista de Administradores */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {filteredAdmins.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron administradores</h3>
              <p className="text-gray-600">Intenta con otro término de búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Administrador</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contacto</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Información</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rol</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={admin.profileUrl}
                            alt={admin.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {admin.name} {admin.apellido || ''}
                            </p>
                            <p className="text-sm text-gray-500">{admin._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span>{admin.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4 text-purple-500" />
                            <span>{admin.cedula || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-green-500" />
                            <span>{admin.genero || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
                          <Shield className="w-4 h-4" />
                          {admin.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleView(admin._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
                            title="Ver administrador"
                          >
                            {loadingAdmin && selectedAdmin?._id === admin._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Mostrando {filteredAdmins.length} de {admins.length} administradores
        </div>

      </div>

      {showModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4">

          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedAdmin.profileUrl}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedAdmin.name} {selectedAdmin.apellido}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedAdmin.email}</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card */}
              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Nombre</p>
                <p className="font-medium text-gray-900">{selectedAdmin.name}</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Apellido</p>
                <p className="font-medium text-gray-900">{selectedAdmin.apellido}</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Cédula</p>
                <p className="font-medium text-gray-900">{selectedAdmin.cedula}</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Género</p>
                <p className="font-medium text-gray-900">{selectedAdmin.genero}</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Rol</p>
                <p className="font-medium text-gray-900 uppercase">{selectedAdmin.role}</p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">ID</p>
                <p className="font-medium text-gray-900 text-xs break-all">
                  {selectedAdmin._id}
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}