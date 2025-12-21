'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { FiUpload, FiCheckCircle, FiXCircle, FiFileText } from 'react-icons/fi';

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
    <div className="max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Importar usuarios
        </h1>
        <p className="text-gray-500 mt-1">
          Carga un archivo Excel para registrar múltiples usuarios
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md border p-6"
      >
        {/* DROPZONE */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-[#31DCB7] transition">
          <FiFileText className="text-4xl text-[#31DCB7]" />
          <p className="mt-3 text-sm text-gray-600">
            {file ? file.name : 'Arrastra tu archivo Excel o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Formatos permitidos: .xlsx, .xls</p>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="
            mt-6 w-full flex items-center justify-center gap-2
            bg-[#31DCB7] text-white font-semibold
            px-4 py-3 rounded-xl
            hover:opacity-90
            disabled:opacity-50
            transition
          "
        >
          <FiUpload />
          {loading ? 'Importando usuarios...' : 'Importar Excel'}
        </button>
      </form>

      {/* ERROR */}
      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
          <FiXCircle />
          <span>{error}</span>
        </div>
      )}

      {/* RESULTADO */}
      {result && (
        <div className="mt-8 bg-white rounded-2xl shadow-md border p-6">
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <FiCheckCircle />
            <h2 className="font-semibold text-gray-800">
              {result.msg}
            </h2>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Total procesados</p>
              <p className="text-2xl font-bold text-gray-800">{result.total}</p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs text-green-600">Importados</p>
              <p className="text-2xl font-bold text-green-700">
                {result.imported}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs text-red-600">Fallidos</p>
              <p className="text-2xl font-bold text-red-700">
                {result.failed}
              </p>
            </div>
          </div>

          {/* ERRORES */}
          {result.errors?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-red-600 mb-3">
                Registros no importados
              </h3>

              <ul className="space-y-3 text-sm">
                {result.errors.map((err, index) => (
                  <li
                    key={index}
                    className="border rounded-xl p-4 bg-red-50"
                  >
                    <p className="font-medium">{err.name}</p>
                    <p className="text-xs text-gray-600">
                      Cédula: {err.cedula}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
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
