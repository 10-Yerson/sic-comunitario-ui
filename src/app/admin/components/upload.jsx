'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { FiUpload, FiCheckCircle, FiXCircle, FiFileText, FiInfo, FiDownload } from 'react-icons/fi';

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
        if (!file) { setError('Selecciona un archivo Excel'); return; }
        const formData = new FormData();
        formData.append('file', file);
        try {
            setLoading(true);
            const res = await axios.post('/api/import/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al importar usuarios');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="max-w-3xl++ mx-auto">

                {/* HEADER */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">Panel de administración</p>
                    <h1 className="text-2xl font-bold text-gray-800">Importar Habitantes</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Carga un archivo Excel para registrar múltiples usuarios de forma masiva</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* COLUMNA IZQUIERDA */}
                    <div className="md:col-span-1 space-y-4">

                        {/* Instrucciones */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FiInfo className="text-blue-500" size={15} />
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Instrucciones</p>
                            </div>
                            <ol className="space-y-3">
                                {[
                                    'Descarga la plantilla Excel con el formato requerido',
                                    'Llena los datos de cada habitante en las columnas',
                                    'Guarda el archivo en formato .xlsx o .xls',
                                    'Sube el archivo y haz clic en Importar',
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <p className="text-xs text-gray-500 leading-relaxed">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Descargar plantilla */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
                            <a
                                href="/plantilla-habitantes.xlsx"
                                download
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                    <FiDownload className="text-green-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Descargar plantilla</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Formato Excel (.xlsx)</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="md:col-span-2 space-y-5">

                        {/* Upload form */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Subir archivo</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all group ${file ? 'border-green-300 bg-green-50/30' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/20'
                                    }`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${file ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-green-100'
                                        }`}>
                                        <FiFileText size={26} className={file ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'} />
                                    </div>
                                    {file ? (
                                        <>
                                            <p className="text-sm font-semibold text-green-700">{file.name}</p>
                                            <p className="text-xs text-green-500 mt-1">{(file.size / 1024).toFixed(1)} KB · Listo para importar</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold text-gray-500">Arrastra tu archivo o haz clic aquí</p>
                                            <p className="text-xs text-gray-300 mt-1">Formatos permitidos: .xlsx, .xls</p>
                                        </>
                                    )}
                                    <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
                                </label>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                                        <FiXCircle size={15} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Importando...</>
                                    ) : (
                                        <><FiUpload size={16} />Importar Excel</>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Resultado */}
                        {result && (
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-5">
                                    <FiCheckCircle className="text-green-500" size={16} />
                                    <p className="text-sm font-bold text-gray-700">{result.msg}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    {[
                                        { label: 'Total procesados', value: result.total, color: 'bg-gray-50 text-gray-700', bar: 'bg-gray-400' },
                                        { label: 'Importados', value: result.imported, color: 'bg-green-50 text-green-700', bar: 'bg-green-500' },
                                        { label: 'Fallidos', value: result.failed, color: 'bg-red-50 text-red-700', bar: 'bg-red-400' },
                                    ].map(s => (
                                        <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
                                            <p className="text-xs font-medium opacity-70 mb-1">{s.label}</p>
                                            <p className="text-2xl font-bold">{s.value}</p>
                                            <div className="mt-2 h-1 bg-black/10 rounded-full overflow-hidden">
                                                <div className={`h-full ${s.bar} rounded-full`}
                                                    style={{ width: result.total > 0 ? `${(s.value / result.total) * 100}%` : '0%', transition: 'width 0.8s ease' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {result.errors?.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <FiXCircle className="text-red-500" size={14} />
                                            <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Registros no importados</p>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {result.errors.map((err, index) => (
                                                <div key={index} className="bg-red-50 border border-red-100 rounded-xl p-3">
                                                    <p className="text-sm font-semibold text-gray-700">{err.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">Cédula: {err.cedula}</p>
                                                    <p className="text-xs text-red-500 mt-1">{err.msg}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
