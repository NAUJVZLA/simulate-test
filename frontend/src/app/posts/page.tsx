"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, endpoints } from '../controller/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

// interfaz para un post
interface Post {
    id: number;
    title: string;
    description: string;
    user_id: number;
    likes: number;
}

// interfaz para un usuario
interface User {
    id: number;
    name: string;
}

const PostsHome: React.FC = () => {
    const router = useRouter();
    // estado para posts, usuarios, y el post que se está editando
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [newPost, setNewPost] = useState({ title: '', description: '' });
    const [showPosts, setShowPosts] = useState(false);
    const [editPost, setEditPost] = useState<Post | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            router.push('/login'); // redirigir al login si no hay token
        } else {
            fetchUsers(); // cargar usuarios si el token está presente
        }
    }, [router]);

    // función para obtener los posts
    const fetchPosts = async () => {
        try {
            const response = await api.get(endpoints.posts);
            console.log('Posts fetched:', response.data); // imprimir la respuesta para depurar
            setPosts(response.data.posts || []); // actualizar el estado con los posts recibidos
        } catch (error) {
            console.error('Error al obtener los posts:', error);
            toast.error('Error al obtener los posts.');
        }
    };

    // función para obtener los usuarios
    const fetchUsers = async () => {
        try {
            const response = await api.get(endpoints.users);
            console.log('Users fetched:', response.data); // imprimir la respuesta para depurar
            const userMap = response.data.reduce((acc: Record<number, User>, user: User) => {
                acc[user.id] = user;
                return acc;
            }, {});
            setUsers(userMap); // actualizar el estado con los usuarios recibidos
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            toast.error('Error al obtener los usuarios.');
        }
    };

    // función para crear un nuevo post
    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault(); // prevenir el comportamiento por defecto del formulario
        try {
            await api.post(endpoints.posts, {
                ...newPost,
                user_id: parseInt(sessionStorage.getItem('id') || '0')
            });
            setNewPost({ title: '', description: '' }); // limpiar el formulario
            fetchPosts(); // actualizar posts después de crear uno nuevo
            toast.success('Post creado con éxito!');
        } catch (error) {
            console.error('Error al crear el post:', error);
            toast.error('Error al crear el post. Por favor, inténtalo de nuevo.');
        }
    };

    // función para dar like a un post
    const handleLike = async (postId: number, currentLikes: number) => {
        try {
            await api.post(endpoints.likes, { post_id: postId });
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, likes: currentLikes + 1 } // incrementar el número de likes
                        : post
                )
            );
        } catch (error) {
            console.error('Error al dar like al post:', error);
            toast.error('Error al dar like al post.');
        }
    };

    // función para establecer un post para editar
    const handleEdit = (post: Post) => {
        setEditPost(post); // establecer el post actual para editar
    };

    // función para actualizar un post
    const handleUpdatePost = async (e: React.FormEvent) => {
        e.preventDefault(); // prevenir el comportamiento por defecto del formulario
        if (editPost) {
            try {
                // verificar que el endpoint sea correcto y que esté configurado para actualizar
                const response = await api.put(`${endpoints.posts}/${editPost.id}`, editPost);
                if (response.status === 200) {
                    setEditPost(null); // limpiar el post que se está editando
                    fetchPosts(); // actualizar la lista de posts
                    toast.success('Post actualizado con éxito!');
                } else {
                    toast.error('Error al actualizar el post.');
                }
            } catch (error) {
                console.error('Error al actualizar el post:', error);
                toast.error('Error al actualizar el post. Por favor, inténtalo de nuevo.');
            }
        }
    };

    // función para eliminar un post
    const handleDelete = async (postId: number) => {
        try {
            await api.delete(`${endpoints.posts}/${postId}`);
            fetchPosts(); // actualizar la lista de posts
            toast.success('Post eliminado con éxito!');
        } catch (error) {
            console.error('Error al eliminar el post:', error);
            toast.error('Error al eliminar el post. Por favor, inténtalo de nuevo.');
        }
    };

    // función para cerrar sesión
    const handleLogout = () => {
        sessionStorage.removeItem('token'); // eliminar el token
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('id');
        router.push('/login'); // redirigir a la página de login
    };

    // función para mostrar todos los posts
    const handleShowPosts = () => {
        setShowPosts(true);
        fetchPosts(); // obtener los posts al mostrar
    };

    return (
        <div className='container'>
            <div className='formWrapper'>
                <h1>Hola, Bienvenido {sessionStorage.getItem('name')}</h1>
                <button className='button' onClick={handleLogout}>Cerrar Sesión</button>

                <form onSubmit={handleCreatePost}>
                    <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Título"
                        required
                    />
                    <textarea
                        value={newPost.description}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                        placeholder="Descripción"
                        required
                    />
                    <button type="submit">Crear post</button>
                </form>

                {editPost && (
                    <form onSubmit={handleUpdatePost}>
                        <input
                            type="text"
                            value={editPost.title}
                            onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                            placeholder="Título"
                            required
                        />
                        <textarea
                            value={editPost.description}
                            onChange={(e) => setEditPost({ ...editPost, description: e.target.value })}
                            placeholder="Descripción"
                            required
                        />
                        <button type="submit">Actualizar post</button>
                    </form>
                )}

                <button className='button' onClick={handleShowPosts}>Mostrar Todos los Posts</button>

                {showPosts && (
                    <div className='posts-container'>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className='card'>
                                    <h2>{post.title}</h2>
                                    <p>{post.description}</p>
                                    <p>Publicado por: {users[post.user_id]?.name || 'Cargando...'}</p>
                                    <div className='actions'>
                                        <button onClick={() => handleLike(post.id, post.likes)}>
                                            <FontAwesomeIcon icon={faThumbsUp} /> Like ({post.likes})
                                        </button>
                                        <button onClick={() => handleEdit(post)}>
                                            <FontAwesomeIcon icon={faEdit} /> Editar
                                        </button>
                                        <button onClick={() => handleDelete(post.id)}>
                                            <FontAwesomeIcon icon={faTrash} /> Borrar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay posts disponibles</p>
                        )}
                    </div>
                )}

                <ToastContainer />
            </div>
        </div>
    );
};

export default PostsHome;
