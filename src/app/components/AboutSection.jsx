import { FileText, Wrench, Lock, BarChart3, Users, Search, Download, Zap } from 'lucide-react';

export default function Features() {
  const mainFeatures = [
    {
      icon: FileText,
      title: 'Actas Digitales',
      description: 'Registro estructurado de reuniones con información clara y disponible en cualquier momento.',
      color: 'from-blue-500 to-blue-600',
      benefits: ['Plantillas personalizables', 'Firmas digitales', 'Búsqueda avanzada']
    },
    {
      icon: Wrench,
      title: 'Trabajos Comunitarios',
      description: 'Control y seguimiento de actividades realizadas en beneficio de la comunidad.',
      color: 'from-orange-500 to-orange-600',
      benefits: ['Asignación de tareas', 'Progreso en tiempo real', 'Reportes de avance']
    },
    {
      icon: Lock,
      title: 'Acceso Seguro',
      description: 'Autenticación por roles que protege la información y garantiza un uso responsable.',
      color: 'from-green-500 to-green-600',
      benefits: ['Control de permisos', 'Auditoría completa', 'Encriptación de datos']
    }
  ];

  const additionalFeatures = [
    {
      icon: BarChart3,
      title: 'Estadísticas',
      description: 'Reportes visuales de participación y actividad'
    },
    {
      icon: Users,
      title: 'Multi-usuario',
      description: 'Colaboración en tiempo real entre miembros'
    },
    {
      icon: Search,
      title: 'Búsqueda',
      description: 'Encuentra información rápidamente con filtros'
    },
    {
      icon: Download,
      title: 'Exportación',
      description: 'Descarga reportes en PDF, Excel y otros formatos'
    },
    {
      icon: Zap,
      title: 'Automatización',
      description: 'Flujos de trabajo que ahorran tiempo y esfuerzo'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full mb-6 font-medium text-sm">
            <Zap className="w-4 h-4" />
            Funcionalidades
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Todo lo que necesitas en un solo lugar
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Potentes herramientas diseñadas para simplificar la gestión comunitaria
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
            Y muchas más funcionalidades
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}