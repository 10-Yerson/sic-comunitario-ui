'use client';

import { useEffect, useState, useRef } from 'react';
import axios from '@/utils/axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Usuarios() {
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchCedula, setSearchCedula] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
    const optionsMenuRef = useRef(null);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
                setOptionsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchResidents = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/user/');
            setUserInfo(res.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar residentes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    const searchByCedula = async (cedula) => {
        if (!cedula) {
            fetchResidents();
            return;
        }

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

            const res = await axios.get(`/api/user/${userId}`);
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
            await axios.delete(`/api/user/${selectedUser._id}`);
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
            const res = await axios.put(
                `/api/resident/${selectedUser._id}`,
                formData
            );

            // actualizar lista
            setUserInfo(userInfo.map(u =>
                u._id === selectedUser._id ? res.data : u
            ));

            setSelectedUser(res.data);
            setEditMode(false);
            alert('Usuario actualizado correctamente');
        } catch (error) {
            alert('Error al actualizar usuario');
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">

            <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Equipo de gestion
                </h2>

                <input
                    type="text"
                    placeholder="Buscar por cédula..."
                    value={searchCedula}
                    onChange={(e) => {
                        setSearchCedula(e.target.value);
                        searchByCedula(e.target.value);
                    }}
                    className="w-full md:w-72 px-4 py-2 border rounded-xl
            focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {loading && <p className="text-center text-gray-500">Cargando...</p>}

            {error && <p className="text-red-500">{error}</p>}

            {!loading && (
                <table className="w-full border-separate border-spacing-y-3 text-sm">
                    <thead>
                        <tr className="text-gray-500 uppercase text-xs">
                            <th className="px-6 py-3 text-left">Usuario</th>
                            <th className="px-6 py-3">Lote</th>
                            <th className="px-6 py-3">Correo</th>
                            <th className="px-6 py-3 text-center">Estado</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {userInfo.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No se encontraron residentes
                                </td>
                            </tr>
                        )}

                        {userInfo.map((user) => (
                            <tr
                                key={user._id}
                                className="bg-white shadow-sm rounded-xl hover:shadow-md transition"
                            >
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img
                                        src={user.profilePicture}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                                        alt={user.name}
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {user.name} {user.apellido}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            CC: {user.profile.cedula}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-6 py-4">{user.lote}</td>
                                <td className="px-6 py-4">{user.email}</td>

                                <td className="px-6 py-4 text-center">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        Activo
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => openModal(user._id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Ver perfil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-hidden">

                        <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />

                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-white/80 hover:text-red-400 text-xl"
                        >
                            ✖
                        </button>

                        <div className="flex justify-center -mt-12">
                            <img
                                src={selectedUser.profilePicture}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        </div>

                        <div className="text-center mt-2 px-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {selectedUser.name} {selectedUser.apellido}
                            </h2>
                            <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 px-8 text-sm text-gray-700">

                            <div className="flex gap-3">
                                <span className="text-blue-500">🪪</span>
                                <div>
                                    <p className="text-gray-500">Cédula</p>
                                    <p className="font-semibold">{selectedUser.profile.cedula}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="text-blue-500">📞</span>
                                <div>
                                    <p className="text-gray-500">Teléfono</p>
                                    <p className="font-semibold">{selectedUser.profile.telefono || "No Registrado"}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-blue-500">⚧</span>
                                <div>
                                    <p className="text-gray-500">Género</p>
                                    <p className="font-semibold">{selectedUser.profile.genero}</p>
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-end items-center gap-4 px-8 py-4 mt-6 border-t bg-gray-50/60">

                            <button
                                title="Editar"
                                className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-yellow-500/90 text-white shadow-md hover:bg-yellow-500 hover:scale-105 transition-all duration-200">
                                <FiEdit size={20} />

                                <span className="absolute -top-9 scale-0 group-hover:scale-100 rounded-md bg-gray-900 text-white text-xs px-2 py-1 transition-transform">
                                    Editar
                                </span>
                            </button>

                            <button
                                onClick={handleDeleteUser}
                                title="Eliminar"
                                className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-red-500/90 text-white shadow-md hover:bg-red-500 hover:scale-105 transition-all duration-200">
                                <FiTrash2 size={20} />

                                <span className="absolute -top-9 scale-0 group-hover:scale-100 rounded-md bg-gray-900 text-white text-xs px-2 py-1 transition-transform">
                                    Eliminar
                                </span>
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
