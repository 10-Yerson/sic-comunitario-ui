'use client';

import { useEffect, useState, useRef } from 'react';
import axios from '../../../utils/axios';

export default function Usuarios() {
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
    const optionsMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setOptionsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/user/`);
                setUserInfo(response.data);
                console.log('Data uno', response.data)
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                setError('No se pudo cargar la información de los usuarios.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openModal = async (userId) => {
        try {
            const response = await axios.get(`/api/user/${userId}`);
            setSelectedUser(response.data);
            console.log('DATA POR ID', response.data);

            setModalOpen(true);
        } catch (error) {
            console.error('Error al obtener detalles del usuario:', error);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            await axios.delete(`/api/user/${selectedUser._id}`);

            setUserInfo(userInfo.filter(user => user._id !== selectedUser._id));

            setModalOpen(false);

            alert(`Usuario ${selectedUser.name} ${selectedUser.apellido} ha sido eliminado.`);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('No se pudo eliminar el usuario. Intente nuevamente.');
        }
    };


    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5 bg-white">

            {loading ? (
                <div className='grid place-content-center w-full h-screen'>
                    <div className="w-32 h-32 relative flex items-center justify-center">
                        <div
                            className="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl animate-pulse"
                        ></div>

                        <div className="w-full h-full relative flex items-center justify-center">
                            <div
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-spin blur-sm"
                            ></div>

                            <div
                                className="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden"
                            >
                                <div className="flex gap-1 items-center">
                                    <div
                                        className="w-1.5 h-12 bg-cyan-500 rounded-full animate-[bounce_1s_ease-in-out_infinite]"
                                    ></div>
                                    <div
                                        className="w-1.5 h-12 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.1s]"
                                    ></div>
                                    <div
                                        className="w-1.5 h-12 bg-indigo-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]"
                                    ></div>
                                    <div
                                        className="w-1.5 h-12 bg-purple-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.3s]"
                                    ></div>
                                </div>

                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent animate-pulse"
                                ></div>
                            </div>
                        </div>

                        <div
                            className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"
                        ></div>
                        <div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-100"
                        ></div>
                        <div
                            className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-200"
                        ></div>
                        <div
                            className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"
                        ></div>
                    </div>
                </div>

            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-16 py-3">
                                <span className="sr-only">Imagen</span>
                            </th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Correo</th>
                            <th scope="col" className="px-6 py-3">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userInfo.map((user) => (
                            <tr
                                key={user._id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="p-4">
                                    <img
                                        src={user.profilePicture || "/default-avatar.png"}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                                        alt={`Foto de ${user.name}`}
                                    />
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {user.name} {user.apellido}
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => openModal(user._id)} className="text-blue-500 hover:underline">
                                        Mas Informacion
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {modalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition duration-300 text-xl"
                        >
                            ✖
                        </button>

                        <div className="absolute top-3 left-3 font-bold" ref={optionsMenuRef}>
                            <div className="relative">
                                <button
                                    onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
                                    className="text-3xl font-bold hover:text-gray-700"
                                >
                                    ⋮
                                </button>
                                {optionsMenuOpen && (
                                    <div className="absolute left-0 mt-2 w-32 bg-white shadow-lg rounded-lg border z-10">
                                        <button
                                            onClick={handleDeleteUser}
                                            className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-left"
                                        >
                                            🗑 Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                                <img
                                    src={selectedUser.profilePicture || "/default-avatar.png"}
                                    className="w-full h-full object-cover"
                                    alt={selectedUser.name}
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mt-3">
                                {selectedUser.name} {selectedUser.apellido}
                            </h2>
                            <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                        </div>

                        <div className="mt-4 space-y-2 text-gray-700">
                            <p><strong>📌 Género:</strong> {selectedUser.profile.genero}</p>
                            <p><strong>🎂 Fecha de Nacimiento:</strong> {new Date(selectedUser.profile.fechaNacimiento).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
