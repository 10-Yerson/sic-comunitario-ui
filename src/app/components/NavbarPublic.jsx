'use client'
import { useState, useEffect } from 'react';
import { Menu, X, Home, Calendar, Users, Briefcase, Clock, Search, LogIn, ChevronDown } from 'lucide-react';

export default function NavbarPublic() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Inicio', icon: Home, href: '#inicio' },
    { name: 'Reuniones', icon: Calendar, href: '#reuniones' },
    { name: 'Trabajos', icon: Briefcase, href: '#trabajos' },
    { name: 'Historial', icon: Clock, href: '#historial' },
    { name: 'Sobre Nosotros', icon: Users, href: '#sobre-nosotros' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200' 
          : 'bg-white/95 backdrop-blur-md border-b border-white/20'
      }`}
    >
      <nav className=" mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-green-700 tracking-tight leading-none">
              SIC
            </h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Sistema Integral
            </span>
          </div>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-200 group"
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
           <a
            href="#historial"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 group"
          >
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Consultar Historial
          </a>
          <a
            href="/auth/login"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium text-sm hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            Acceder
          </a>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Menu móvil */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 bg-white border-t border-gray-200 shadow-lg">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-green-700 hover:bg-green-50 font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
             <a
              href="#historial"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-center rounded-lg text-green-700 font-medium hover:bg-green-50 transition-all duration-200 border border-green-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="w-5 h-5" />
              Consultar Historial
            </a>
            <a
              href="/auth/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-700 hover:to-emerald-700 shadow-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn className="w-5 h-5" />
              Acceder
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}