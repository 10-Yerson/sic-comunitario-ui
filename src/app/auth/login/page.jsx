'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from '../../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('/api/auth/check-auth', { withCredentials: true });
                const { role } = response.data;
                router.push(role === 'admin' ? '/admin' : '/client');
            } catch (error) {
               // console.log('No autenticado, permanece en login');
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
            router.push(role === 'admin' ? '/admin' : '/client');
        } catch (error) {
            console.error('Error:', error.response?.data?.msg || error.message);
            toast.error(error.response?.data?.msg || 'Verifica tus datos');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-screen">
            <div className="md:w-[50%] flex justify-center items-center w-full h-full">
                <form className="flex flex-col bg-white p-5 md:p-7 w-[90%] rounded-lg md:w-[70%] gap-3" onSubmit={handleLogin}>
                    <div className="flex flex-col">
                        <label className="font-semibold text-center text-2xl">Momentary</label>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold">Email</label>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg h-12 px-2 transition duration-200 focus-within:border-blue-500">
                        <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                            <g id="Layer_3" data-name="Layer 3">
                                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                            </g>
                        </svg>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="text"
                            className="ml-2 rounded-lg border-none w-full h-full focus:outline-none"
                            placeholder="Ingresa tu correo electrónico"
                            autoComplete="username"
                        />
                    </div>

                    <div className="flex flex-col mt-4">
                        <label className="text-gray-800 font-semibold">Contraseña</label>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg h-12 px-2 transition duration-200 focus-within:border-blue-500">
                        <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                        </svg>
                        <input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="ml-2 rounded-lg border-none w-full h-full focus:outline-noe"
                            placeholder="Ingresa tu contraseña"
                            type="password"
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <span className="text-blue-600 text-sm font-medium cursor-pointer">Olvide mi contraseña?</span>
                    </div>

                    <button
                        className="mt-4 bg-gray-800 text-white font-medium text-sm rounded-lg h-12 w-full transition duration-200 hover:bg-gray-900" type="submit"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>

                    <p className="text-center text-gray-800 text-sm mt-4">¿No tienes una cuenta?{" "}
                        <Link href="/auth/sign-up">
                            <span className="ml-1 text-blue-600 font-medium cursor-pointer">Registrarme</span>
                        </Link>
                    </p>
                </form>
            </div>

            <div className="hidden md:flex justify-center items-center md:w-[50%] h-full">
                <img className="bg-cover bg-center w-[70%]" src="\img\login-img.svg" alt="img" />
            </div>

            <ToastContainer />
        </div>


    );
}

