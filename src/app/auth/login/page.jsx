'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from '../../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('/api/auth/check-auth', { withCredentials: true });
                const { role } = response.data;
                router.push(role === 'admin' ? '/admin' : '/client');
            } catch (error) {
                // No autenticado, permanece en login
            }
        };

        checkAuthStatus();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataForm = { email, password };

        try {
            const response = await axios.post('/api/auth/login', dataForm, { withCredentials: true });
            const { role } = response.data;
            toast.success('¡Bienvenido!');
            setTimeout(() => {
                router.push(role === 'admin' ? '/admin' : '/client');
            }, 500);
        } catch (error) {
            console.error('Error:', error.response?.data?.msg || error.message);
            toast.error(error.response?.data?.msg || 'Verifica tus datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            
            {/* Panel Izquierdo - Imagen de fondo completa */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
                
                {/* Patrón decorativo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" 
                         style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                         }}
                    ></div>
                </div>

                {/* Contenido del panel izquierdo */}
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    
                    {/* Logo y título */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Volver al inicio</span>
                        </Link>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">S</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">SIC</h1>
                                    <p className="text-xs text-white/80">Sistema Integral Comunitario</p>
                                </div>
                            </div>

                            <h2 className="text-5xl font-bold leading-tight max-w-lg">
                                Gestiona tu comunidad de forma inteligente
                            </h2>

                            <p className="text-xl text-white/90 max-w-md">
                                La plataforma completa para administrar reuniones, eventos y participación comunitaria
                            </p>
                        </div>
                    </div>

                    {/* Características */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-medium">Acceso seguro y encriptado</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-medium">Disponible 24/7 desde cualquier dispositivo</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-medium">Soporte técnico especializado</span>
                        </div>
                    </div>

                </div>

                {/* Decoración de ondas */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
                    </svg>
                </div>
            </div>

            {/* Panel Derecho - Formulario */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    
                    {/* Logo móvil */}
                    <div className="lg:hidden mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Volver</span>
                        </Link>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">SIC</h1>
                                <p className="text-xs text-gray-500">Sistema Integral Comunitario</p>
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            ¡Bienvenido!
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tus credenciales para acceder a tu cuenta
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="space-y-5">
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-lg
                                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                                             transition-all text-gray-900 placeholder-gray-400
                                             hover:border-gray-400"
                                    placeholder="ejemplo@correo.com"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-lg
                                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                                             transition-all text-gray-900 placeholder-gray-400
                                             hover:border-gray-400"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botón de login */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 
                                     bg-gradient-to-r from-green-600 to-emerald-600 
                                     hover:from-green-700 hover:to-emerald-700
                                     text-white font-semibold rounded-lg
                                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                                     shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Ingresando...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Iniciar Sesión</span>
                                </>
                            )}
                        </button>

                        {/* Separador */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">¿Primera vez aquí?</span>
                            </div>
                        </div>

                        {/* Link de registro */}
                        <div className="text-center">
                            <p className="text-gray-600">
                                ¿No tienes una cuenta?{' '}
                                <Link 
                                    href="/auth/register" 
                                    className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                                >
                                    Contáctanos
                                </Link>
                            </p>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-center text-gray-500">
                            Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad
                        </p>
                    </div>

                </div>
            </div>

            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}