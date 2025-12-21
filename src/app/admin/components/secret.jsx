'use client';

import { useEffect, useState, useRef } from 'react';
import axios from '@/utils/axios';

export default function SecretarioUsuarios() {
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


    /* =============================
       CERRAR MENU OPCIONES
    ============================== */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
                setOptionsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* =============================
       LISTAR TODOS
    ============================== */
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

    /* =============================
       BUSCAR POR CÉDULA (API)
    ============================== */
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

    /* =============================
       ABRIR MODAL (SIN BUSCAR POR ID)
    ============================== */
    const openModal = (user) => {
        setSelectedUser(user);
        setFormData(user);
        setEditMode(false);
        setModalOpen(true);
    };

    /* =============================
       ELIMINAR
    ============================== */
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

            {/* HEADER + BUSCADOR */}
            <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Secretario de la comunidad
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

            {/* LOADING */}
            {loading && <p className="text-center text-gray-500">Cargando...</p>}

            {/* ERROR */}
            {error && <p className="text-red-500">{error}</p>}

            {/* TABLA */}
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
                                            CC: {user.cedula}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-6 py-4">{user.lote}</td>
                                <td className="px-6 py-4">{user.email}</td>

                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => openModal(user)}
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

            {/* MODAL (SIN CAMBIOS FUNCIONALES) */}
            {modalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">

                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                        >
                            ✖
                        </button>

                        <div className="absolute top-3 left-3" ref={optionsMenuRef}>
                            <button
                                onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
                                className="text-3xl"
                            >
                                ⋮
                            </button>

                            {optionsMenuOpen && (
                                <div className="absolute mt-2 w-32 bg-white shadow rounded-lg border">
                                    <button
                                        onClick={handleDeleteUser}
                                        className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-left"
                                    >
                                        🗑 Eliminar
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center">
                            <img
                                src={selectedUser.profilePicture}
                                className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                            />
                            <h2 className="text-xl font-bold mt-3">
                                {selectedUser.name} {selectedUser.apellido}
                            </h2>
                            <p className="text-gray-500">{selectedUser.email}</p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
