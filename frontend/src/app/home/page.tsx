"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
    const router = useRouter();
    // Estado para almacenar los posts obtenidos
    const [posts, setPosts] = useState<{ id: number; title: string; description: string; user_id?: number }[]>([]);
    // Estado para manejar la carga de posts (cargando o no)
    const [loading, setLoading] = useState(false);
    // Nombre del usuario desde sessionStorage
    const name = sessionStorage.getItem('name');

    useEffect(() => {
        // Verifica si hay un token en sessionStorage
        const token = sessionStorage.getItem('token');
        if (!token) {
            // Si no hay token, redirige al login
            router.push('/login');
        } else {
            // Si hay token, obtiene los posts al cargar la página
            fetchPosts();
        }
    }, [router]);

    // Función para obtener los posts desde la API
    const fetchPosts = async () => {
        setLoading(true); // Indica que la carga ha comenzado
        try {
            // Realiza la solicitud para obtener los posts
            const response = await fetch("http://localhost:3060/api/posts");
            const data = await response.json();
            // Actualiza el estado con los posts obtenidos
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error al obtener los posts:', error);
        } finally {
            setLoading(false); // Indica que la carga ha terminado
        }
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        // Elimina los datos del usuario de sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('id');
        // Redirige a la página de login
        router.push('/login');
    };

    return (
        <div className='container'>
            <h1 className='formWrapper'>Hola, bienvenido {name}</h1>
            <button className='button' onClick={handleLogout}>Cerrar Sesión</button>

            <button className='button' onClick={fetchPosts} disabled={loading}>
                {loading ? 'Cargando...' : 'Ver Posts'}
            </button>

            <div className='formWrapper'>
                {posts.length > 0 ? (
                    // Muestra los posts si hay alguno
                    posts.map((post) => (
                        <div key={post.id} className='card'>
                            <h2>{post.title}</h2>
                            <p>{post.description}</p>
                        </div>
                    ))
                ) : (
                    // Muestra un mensaje si no hay posts
                    <p>No hay posts disponibles</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
