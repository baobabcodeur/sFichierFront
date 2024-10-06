import "./Discussion.css";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Discussion({ selectedGroup }) {
    const [messages, setMessages] = useState([]);
    const [files, setFiles] = useState([]); 
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false); 
    const authId = localStorage.getItem('user_id');
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Fonction pour récupérer les messages
    const fetchMessages = async () => {
        if (!selectedGroup) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`http://192.168.1.160:8000/api/groups/${selectedGroup.id}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessages(response.data || []);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages :', error);
        }
    };

    // Fonction pour récupérer les fichiers
    const fetchFiles = async () => {
        if (!selectedGroup) return;
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`http://192.168.1.160:8000/api/groups/${selectedGroup.id}/files`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setFiles(response.data.files || []); 
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers :', error);
        }
    };

    // Récupérer le nom de l'utilisateur
    const fetchUserName = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('http://192.168.1.160:8000/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserName(response.data.name);
        } catch (error) {
            console.error('Erreur lors de la récupération du nom de l\'utilisateur :', error);
        }
    };

    // Charger les messages et fichiers au démarrage
    useEffect(() => {
        if (selectedGroup) {
            fetchUserName(); 
            fetchMessages();  
            fetchFiles(); 
        }
    }, [selectedGroup]);

    // Mettre en place un intervalle pour charger les messages et fichiers toutes les 5 secondes
    useEffect(() => {
        if (selectedGroup) {
            const intervalId = setInterval(() => {
                fetchMessages();
                fetchFiles();
            }, 5000); // Intervalle de 5 secondes

            // Nettoyage de l'intervalle à la fin
            return () => clearInterval(intervalId);
        }
    }, [selectedGroup]);

    // Défilement automatique vers le bas de la discussion lors de l'ajout de nouveaux messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Fonction pour envoyer un message ou un fichier
    const sendMessage = async () => {
        const token = localStorage.getItem('auth_token');
        
        if (!newMessage.trim() && !file) return;

        setLoading(true); // Activer le chargement avant l'envoi

        try {
            const formData = new FormData();

            if (newMessage.trim() && file) {
                formData.append('content', newMessage);
                formData.append('file', file);

                const response = await axios.post(`http://192.168.1.160:8000/api/groups/${selectedGroup.id}/messages`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const newMessageData = {
                    ...response.data.message,
                    user: {
                        id: authId,
                        name: userName,
                    },
                    file: response.data.message.file || null
                };

                setMessages(prevMessages => [...prevMessages, newMessageData]);

            } else if (file) {
                formData.append('file', file);

                const response = await axios.post(`http://192.168.1.160:8000/api/groups/${selectedGroup.id}/files`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const newFileMessage = {
                    user: {
                        id: authId,
                        name: userName,
                    },
                    content: '', 
                    file: {
                        url: `http://192.168.1.160:8000/${response.data.file.path}`, 
                        name: file.name, 
                    },
                    created_at: new Date().toISOString(),
                };
                setMessages(prevMessages => [...prevMessages, newFileMessage]);
            } else if (newMessage.trim()) {
                formData.append('content', newMessage);

                const response = await axios.post(`http://192.168.1.160:8000/api/groups/${selectedGroup.id}/messages`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const newMessageData = {
                    ...response.data.message,
                    user: {
                        id: authId,
                        name: userName,
                    },
                };
                setMessages(prevMessages => [...prevMessages, newMessageData]);
            }

            setNewMessage('');
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message ou du fichier :', error);
        } finally {
            setLoading(false); // Désactiver le chargement après l'envoi
        }
    };

    // Combiner messages et fichiers dans un tableau unique
    const combineMessagesAndFiles = () => {
        const combined = [...messages, ...files.map(file => ({
            id: file.id,
            user: { id: file.user_id, name: file.user.name }, 
            content: '', 
            file: {
                url: `http://192.168.1.160:8000/${file.path}`,
                name: file.path.split('/').pop(), 
            },
            created_at: file.created_at,
        }))];

        combined.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        return combined;
    };


    

    return (
        <div className="discussion">
            {selectedGroup ? (
                <>
                    <div>
                        <h5>{selectedGroup.name}</h5>
                        <p>{selectedGroup.description}</p>
                    </div>
                    <div className="messages-container">
    {combineMessagesAndFiles().length > 0 ? (
        combineMessagesAndFiles().map((message) => (
            <div
                key={message.id || message.file?.url}
                className={`message ${message.user.name === userName ? 'messageE' : 'messageR'}`}
            >
                <strong>{message.user ? message.user.name : 'Utilisateur inconnu'}</strong>:
                {message.content ? (
                    <>
                        {message.content}
                        {message.file && (
                            <div>
                                <a href={message.file.url} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   download={message.file.name}>
                                   {message.file.name}
                                </a>
                            </div>
                        )}
                    </>
                ) : (
                    message.file && (
                        <a href={message.file.url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           download={message.file.name}>
                            {message.file.name}
                        </a>
                    )
                )}
                <span>{new Date(message.created_at).toLocaleString()}</span>
            </div>
        ))
    ) : (
        <p>Aucun message dans ce groupe</p>
    )}
    <div ref={messagesEndRef} /> 
</div>

                    <div className="message-inputs">
                        {loading ? (
                            <p>Envoi en cours...</p> // Indicateur de chargement
                        ) : (
                            <>
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)} 
                                    placeholder="Écrire un message..." 
                                />
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={(e) => setFile(e.target.files[0])} 
                                />
                                <button onClick={sendMessage}>Envoyer</button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <p>Sélectionnez un groupe pour afficher la discussion</p>
            )}
        </div>
    );
}
