'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';

export default function CreateEvent() {
  const [type, setType] = useState('reunion');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    observations: ''
  });

  const [agenda, setAgenda] = useState([{ punto: '', descripcion: '' }]);
  const [decisions, setDecisions] = useState([{ decision: '', responsable: '' }]);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // estilos
  const input =
    'w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition';
  const section =
    'bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4';
  const label = 'text-sm font-semibold text-gray-700';
  const button =
    'flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition';

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('type', type);

      if (type === 'reunion') {
        agenda.forEach((a, i) => {
          fd.append(`agenda[${i}][punto]`, a.punto);
          fd.append(`agenda[${i}][descripcion]`, a.descripcion);
        });
        decisions.forEach((d, i) => {
          fd.append(`decisions[${i}][decision]`, d.decision);
          fd.append(`decisions[${i}][responsable]`, d.responsable);
        });
      }

      if (media) fd.append('media', media);

      await axios.post('/api/event', fd);
      alert('Evento creado');
    } catch {
      alert('Error al crear evento');
    } finally {
      setLoading(false);
    }
  };

  const handleMedia = (file) => {
    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Crear Evento</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATOS */}
          <div className={section}>
            <h2 className="font-semibold text-lg">Información general</h2>

            <input name="title" placeholder="Título" className={input} onChange={handleChange} />
            <textarea name="description" placeholder="Descripción" className={input} onChange={handleChange} />

            <div className="grid md:grid-cols-2 gap-4">
              <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="reunion">Reunión</option>
                <option value="trabajo">Trabajo comunitario</option>
              </select>
              <input name="location" placeholder="Ubicación" className={input} onChange={handleChange} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input type="date" name="date" className={input} onChange={handleChange} />
              <input type="time" name="startTime" className={input} onChange={handleChange} />
              <input type="time" name="endTime" className={input} onChange={handleChange} />
            </div>
          </div>

          {/* AGENDA */}
          {type === 'reunion' && (
            <div className={section}>
              <h2 className="font-semibold text-lg">Agenda</h2>
              {agenda.map((a, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <input placeholder="Punto" className={input} onChange={(e) => {
                    const c = [...agenda]; c[i].punto = e.target.value; setAgenda(c);
                  }} />
                  <input placeholder="Descripción" className={input} onChange={(e) => {
                    const c = [...agenda]; c[i].descripcion = e.target.value; setAgenda(c);
                  }} />
                </div>
              ))}
              <button type="button" className={button} onClick={() => setAgenda([...agenda, { punto: '', descripcion: '' }])}>
                <FiPlus /> Agregar punto
              </button>
            </div>
          )}

          {/* MEDIA */}
          <div className={section}>
            <h2 className="font-semibold text-lg">Imagen / Video</h2>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:bg-gray-100">
              <FiImage size={32} />
              <span className="text-sm text-gray-500 mt-2">Subir archivo</span>
              <input type="file" hidden accept="image/*,video/*" onChange={(e) => handleMedia(e.target.files[0])} />
            </label>

            {preview && (
              <div className="rounded-xl overflow-hidden">
                {media?.type.startsWith('video') ? (
                  <video src={preview} controls className="w-full max-h-64 object-cover" />
                ) : (
                  <img src={preview} className="w-full max-h-64 object-cover" />
                )}
              </div>
            )}
          </div>

          {/* OBS */}
          <textarea name="observations" placeholder="Observaciones" className={input} onChange={handleChange} />

          <button disabled={loading} className={button}>
            {loading ? 'Creando...' : 'Crear evento'}
          </button>
        </form>
      </div>
    </div>
  );
}
