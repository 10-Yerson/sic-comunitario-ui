'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function ImportUsers() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Selecciona un archivo Excel');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);

            const res = await axios.post('/api/import/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            setResult(res.data);
        } catch (err) {
            setError(
                err.response?.data?.msg || 'Error al importar usuarios'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Importar Usuarios desde Excel
            </h1>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow border space-y-4"
            >
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#31DCB7] text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                    <FiUpload />
                    {loading ? 'Importando...' : 'Importar Excel'}
                </button>
            </form>

            {/* ERROR */}
            {error && (
                <div className="mt-4 flex items-center gap-2 text-red-600">
                    <FiXCircle />
                    <span>{error}</span>
                </div>
            )}

            {/* RESULTADO */}
            {result && (
                <div className="mt-6 bg-white border rounded-xl p-5 shadow">
                    <h2 className="font-semibold text-gray-800 mb-3">
                        {result.msg}
                    </h2>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xl font-bold">{result.total}</p>
                        </div>

                        <div className="bg-green-50 p-3 rounded">
                            <p className="text-sm text-green-600">Importados</p>
                            <p className="text-xl font-bold text-green-700">
                                {result.imported}
                            </p>
                        </div>

                        <div className="bg-red-50 p-3 rounded">
                            <p className="text-sm text-red-600">Fallidos</p>
                            <p className="text-xl font-bold text-red-700">
                                {result.failed}
                            </p>
                        </div>
                    </div>

                    {/* ERRORES */}
                    {result.errors?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium text-red-600 mb-2">
                                Registros no importados
                            </h3>

                            <ul className="text-sm text-gray-700 space-y-2">
                                {result.errors.map((err, index) => (
                                    <li
                                        key={index}
                                        className="border rounded-lg p-3 bg-red-50"
                                    >
                                        <p><b>{err.name}</b></p>
                                        <p className="text-xs text-gray-600">
                                            Cédula: {err.cedula}
                                        </p>
                                        <p className="text-xs text-red-600">
                                            {err.msg}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
