import { Users, Calendar, Shield, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-800 via-green-700 to-teal-600 text-white overflow-hidden">
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Gestión Segura y Eficiente</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Sistema Integral
              <span className="block text-emerald-200">Comunitario</span>
            </h1>

            <p className="text-lg md:text-xl text-green-50 mb-8 max-w-xl">
              Digitaliza la gestión de reuniones y trabajos comunitarios,
              garantizando organización, seguridad y acceso a la información en tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-green-700 font-semibold text-lg hover:bg-green-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Acceder al sistema
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-lg hover:bg-white/20 border border-white/30 transition-all duration-300"
              >
                Conocer más
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-emerald-200">500+</div>
                <div className="text-sm text-green-100 mt-1">Comunidades</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-200">15K+</div>
                <div className="text-sm text-green-100 mt-1">Usuarios</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-200">98%</div>
                <div className="text-sm text-green-100 mt-1">Satisfacción</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gestión de Miembros</h3>
              <p className="text-sm text-green-100">
                Administra perfiles, roles y permisos de forma centralizada
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl mt-8">
              <div className="w-12 h-12 bg-teal-400 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Calendario Unificado</h3>
              <p className="text-sm text-green-100">
                Planifica reuniones y eventos con notificaciones automáticas
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Seguridad Total</h3>
              <p className="text-sm text-green-100">
                Protección de datos y control de acceso avanzado
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl mt-8">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reportes en Vivo</h3>
              <p className="text-sm text-green-100">
                Estadísticas y análisis de participación comunitaria
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}