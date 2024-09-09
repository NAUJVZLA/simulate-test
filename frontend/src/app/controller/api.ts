import axios from 'axios';

// Configura Axios con la URL base y el tipo de contenido predeterminado
const api = axios.create({
    baseURL: 'http://localhost:3060',
    headers: {
        'Content-Type': 'application/json',
    },
});

// anade el token JWT a las solicitudes para autenticación
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token'); // Obtén el token del almacenamiento
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Añade el token al encabezado
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// define los endpoints para registro, inicio de sesión, posts, likes y usuarios
const endpoints = {
    register: '/api/auth/register',
    login: '/api/auth/login',
    posts: '/api/posts',
    likes: '/api/likes',
    users: '/api/users',
};

export { api, endpoints };
