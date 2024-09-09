"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, endpoints } from '../controller/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
    // estado para el correo electrónico y la contraseña
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // manejador de inicio de sesión
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // prevenir el comportamiento por defecto del formulario
        try {
            // enviar credenciales al servidor
            const loginResponse = await api.post(endpoints.login, { email, password });
            if (loginResponse.data && loginResponse.data.token) {
                // guardar token y datos del usuario en sessionStorage
                sessionStorage.setItem('token', loginResponse.data.token);
                sessionStorage.setItem('name', loginResponse.data.user.name);
                sessionStorage.setItem('id', loginResponse.data.user.id.toString());

                // mostrar mensaje de éxito
                toast.success('Inicio de sesión exitoso.');
                router.push('/posts'); // redirigir al inicio u otra página
            } else {
                // mostrar mensaje de error si las credenciales son incorrectas
                toast.error('Credenciales incorrectas. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            // mostrar mensaje de error en caso de problema con el inicio de sesión
            console.error('Error en el login:', error);
            toast.error('Error en el login. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="container">
            <div className="formWrapper">
                <h1>Iniciar sesión</h1>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Iniciar sesión</button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Login;
