export default function NavbarPublic() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        
        <h1 className="text-2xl font-bold text-green-700 tracking-wide">
          SIC
        </h1>

        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <li className="hover:text-green-700 cursor-pointer">Inicio</li>
          <li className="hover:text-green-700 cursor-pointer">Reuniones</li>
          <li className="hover:text-green-700 cursor-pointer">Trabajos</li>
          <li className="hover:text-green-700 cursor-pointer">Historial</li>
        </ul>

      </nav>
    </header>
  );
}
