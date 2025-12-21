export default function CallToAction() {
  return (
    <section className="py-20 bg-green-700 text-white text-center">
      <h3 className="text-3xl font-bold mb-4">
        Empieza a organizar tu comunidad hoy
      </h3>
      <p className="mb-8 text-green-100">
        Accede al sistema y gestiona la información de manera digital.
      </p>
      <a
        href="/auth/login"
        className="px-8 py-3 rounded-full bg-white text-green-700 font-semibold hover:bg-green-100 transition"
      >
        Iniciar sesión
      </a>
    </section>
  );
}
