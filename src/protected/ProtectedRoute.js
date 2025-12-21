'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../utils/axios'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/check-auth', { withCredentials: true }); // Ruta en el backend para verificar sesión
                const { role } = response.data;

                if (allowedRoles && !allowedRoles.includes(role)) {
                    router.push('/auth/login');
                } else {
                    setAuthorized(true);
                }
            } catch (error) {
                router.push('/auth/login');
            } 
        };

        checkAuth();
    }, [router, allowedRoles]);

    if (!authorized) return null;

    return <>{children}</>;
};

export default ProtectedRoute;
