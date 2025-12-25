'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiImage } from 'react-icons/fi';

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
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🎨 NUEVOS ESTILOS
  const input =
    'w-full px-3 py-1.5 text-sm rounded-xl border border-gray-300 bg-gray-50 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ' +
    'hover:border-gray-400 transition shadow-sm';

  const textarea =
    'w-full px-3 py-2 text-sm rounded-xl border border-gray-300 bg-gray-50 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ' +
    'hover:border-gray-400 transition shadow-sm min-h-[90px]';

  const section =
    'bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm';

  const button =
    'flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm ' +
    'bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow hover:shadow-md';

  const label = 'text-xs font-semibold text-gray-600';

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMedia = (file) => {
    if (!file) return;
    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.title) return 'El título es obligatorio';
    if (!form.description) return 'La descripción es obligatoria';
    if (!form.location) return 'La ubicación es obligatoria';
    if (!form.date) return 'Debes elegir una fecha';
    if (!form.startTime) return 'Debes indicar hora de inicio';
    if (!form.endTime) return 'Debes indicar hora de fin';
    if (form.startTime >= form.endTime)
      return 'La hora de fin debe ser mayor a la de inicio';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return toast.error(error);

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
      }

      if (media) fd.append('media', media);

      await axios.post('/api/event', fd);

      toast.success('Evento creado correctamente');

      setForm({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        observations: ''
      });

      setAgenda([{ punto: '', descripcion: '' }]);
      setMedia(null);
      setPreview(null);
    } catch {
      toast.error('No se pudo crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-4">
      <div className="bg-white rounded-3xl shadow-xl px-4 py-6 max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Crear Evento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Información general
              </h2>

              <input
                name="title"
                placeholder="Título del evento *"
                className={input}
                value={form.title}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Descripción *"
                className={textarea}
                value={form.description}
                onChange={handleChange}
              />

              <select
                className={input}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="reunion">Reunión</option>
                <option value="trabajo">Trabajo comunitario</option>
              </select>

              <input
                name="location"
                placeholder="Ubicación *"
                className={input}
                value={form.location}
                onChange={handleChange}
              />

              <div className="flex flex-col gap-1">
                <label className={label}>Fecha del evento *</label>
                <input
                  type="date"
                  name="date"
                  className={input}
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="flex flex-col gap-1">
                  <label className={label}>Inicio *</label>
                  <input
                    type="time"
                    name="startTime"
                    className={input}
                    value={form.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={label}>Fin *</label>
                  <input
                    type="time"
                    name="endTime"
                    className={input}
                    value={form.endTime}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>

            <div className="space-y-4">

              {type === 'reunion' && (
                <div className={section}>
                  <h2 className="font-semibold text-sm text-gray-700">
                    Agenda
                  </h2>

                  {agenda.map((a, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Punto"
                        className={input}
                        value={a.punto}
                        onChange={(e) => {
                          const c = [...agenda];
                          c[i].punto = e.target.value;
                          setAgenda(c);
                        }}
                      />
                      <input
                        placeholder="Descripción"
                        className={input}
                        value={a.descripcion}
                        onChange={(e) => {
                          const c = [...agenda];
                          c[i].descripcion = e.target.value;
                          setAgenda(c);
                        }}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className={button}
                    onClick={() =>
                      setAgenda([...agenda, { punto: '', descripcion: '' }])
                    }
                  >
                    <FiPlus /> Agregar punto
                  </button>
                </div>
              )}

              <div className={section}>
                <h2 className="font-semibold text-sm text-gray-700">
                  Imagen / Video
                </h2>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-5 cursor-pointer hover:bg-gray-50 transition">
                  <FiImage size={28} className="text-gray-500" />
                  <span className="text-xs text-gray-500 mt-1">
                    Subir archivo
                  </span>

                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={(e) => handleMedia(e.target.files[0])}
                  />
                </label>

                {preview && (
                  <div className="rounded-xl overflow-hidden shadow">
                    {media?.type.startsWith('video') ? (
                      <video src={preview} controls className="w-full max-h-60 object-cover" />
                    ) : (
                      <img src={preview} className="w-full max-h-60 object-cover" />
                    )}
                  </div>
                )}
              </div>

              <textarea
                name="observations"
                placeholder="Observaciones"
                className={textarea}
                value={form.observations}
                onChange={handleChange}
              />
            </div>
          </div>

          <button disabled={loading} className={button}>
            {loading ? 'Creando...' : 'Crear evento'}
          </button>
        </form>
      </div>
    </div>
  );
}
