export default function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <h3 className="text-3xl font-bold text-center mb-14">
          Beneficios del sistema
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          
          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">📄</div>
            <h4 className="text-xl font-semibold mb-2">
              Actas Digitales
            </h4>
            <p className="text-gray-600">
              Registro estructurado de reuniones con información clara
              y disponible en cualquier momento.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">🛠️</div>
            <h4 className="text-xl font-semibold mb-2">
              Trabajos Comunitarios
            </h4>
            <p className="text-gray-600">
              Control y seguimiento de actividades realizadas en beneficio
              de la comunidad.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔐</div>
            <h4 className="text-xl font-semibold mb-2">
              Acceso Seguro
            </h4>
            <p className="text-gray-600">
              Autenticación por roles que protege la información
              y garantiza un uso responsable.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
