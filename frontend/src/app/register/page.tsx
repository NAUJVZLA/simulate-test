"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, endpoints } from '../controller/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userResponse = await api.get(`${endpoints.users}?email=${email}`);
            if (userResponse.data.length > 0) {
                toast.error('Esta cuenta ya existe. Por favor, utiliza otro correo electrónico.');
                return;
            }

            const response = await api.post(endpoints.register, { name, email, password });
            if (response.data && response.data.success) {
                toast.success('Registro exitoso. Por favor, inicia sesión.');
                router.push('/login');
            } else {
                throw new Error('Respuesta del servidor no válida');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            toast.error('Error en el registro. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="formWrapper">
                <h1>Registrarse</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Register;
