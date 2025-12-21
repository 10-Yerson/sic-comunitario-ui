export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white">
      
      {/* Decoración */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 max-w-4xl text-center px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Sistema Integral <br /> Comunitario
        </h2>

        <p className="text-lg md:text-xl text-green-100 mb-10">
          Digitaliza la gestión de reuniones y trabajos comunitarios,
          garantizando organización, seguridad y acceso a la información.
        </p>

        <a
          href="/auth/login"
          className="inline-block px-8 py-4 rounded-full bg-white text-green-700 font-semibold text-lg hover:bg-green-100 transition"
        >
          Acceder al sistema
        </a>
      </div>
    </section>
  );
}
