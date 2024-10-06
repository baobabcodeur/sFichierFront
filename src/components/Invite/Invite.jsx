import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Assurez-vous d'importer Modal
import './Invite.css'; // Assurez-vous d'importer le CSS

Modal.setAppElement('#root'); // Cela aide à gérer l'accessibilité

export default function Invite({ selectedGroup }) {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inviteEmail, setInviteEmail] = useState(''); // État pour l'email de l'utilisateur à inviter
    const [inviteMessage, setInviteMessage] = useState(''); // État pour les messages d'invitation
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour contrôler l'ouverture de la modal

    // Récupérer les utilisateurs qui ne sont pas membres du groupe
    const fetchUsers = async () => {
        if (!selectedGroup) return; // Assurez-vous qu'un groupe est sélectionné
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`http://192.168.1.160:8000/api/groups/${selectedGroup.id}/non-members`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data); // Mettez à jour l'état des utilisateurs
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Appeler la fonction au démarrage
    }, [selectedGroup]);

    // Fonction pour ajouter un utilisateur au groupe
    const addUserToGroup = async (userId) => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`http://192.168.1.160:8000/api/groups/${selectedGroup.id}/members`, {
                user_id: userId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Recharger les utilisateurs après ajout
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        }
    };

    // Fonction pour inviter un utilisateur non inscrit
    const inviteUser = async () => {
        if (!inviteEmail) {
            setInviteMessage('Veuillez entrer un e-mail valide.'); // Vérification de l'email
            return;
        }
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`http://192.168.1.160:8000/api/invite`, {
                email: inviteEmail,
                group_id: selectedGroup.id // Inclure l'ID du groupe
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setInviteMessage('Invitation envoyée avec succès !'); // Message de succès
            setInviteEmail(''); // Réinitialiser le champ d'email
            closeModal(); // Fermer la modal après l'envoi
        } catch (error) {
            console.error('Erreur lors de l\'invitation :', error);
            setInviteMessage('Erreur lors de l\'envoi de l\'invitation.'); // Message d'erreur
        }
    };

    const openModal = () => {
        setInviteMessage(''); // Réinitialiser les messages avant d'ouvrir la modal
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setInviteEmail(''); // Réinitialiser le champ d'email
        setInviteMessage(''); // Réinitialiser le message d'invitation
    };

    return (
        <div className="invite">
            <div>
                <input 
                    type="text" 
                    placeholder="Rechercher un utilisateur..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <div className="listeM"> {/* Conteneur avec défilement */}
                    {users
                        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filtrer les utilisateurs par le terme de recherche
                        .map(user => (
                            <div key={user.id} className="userItem">
                                <p>{user.name}</p>
                                <button onClick={() => addUserToGroup(user.id)}>Ajouter</button>
                            </div>
                        ))}
                    {users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <p>Aucun utilisateur trouvé.</p> // Message si aucun utilisateur ne correspond à la recherche
                    )}
                </div>
            </div>
            <button onClick={openModal}>Ajouter un non-inscrit</button> {/* Ouvre la modal pour inviter un utilisateur */}
            
            {/* Modal pour inviter un utilisateur non inscrit */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Inviter un utilisateur"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Inviter un utilisateur</h2>
                <input 
                    type="email" 
                    placeholder="Email de l'utilisateur à inviter..." 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)} 
                />
                <button onClick={inviteUser}>Inviter</button> {/* Bouton pour envoyer l'invitation */}
                {inviteMessage && <p>{inviteMessage}</p>} {/* Affichage du message d'invitation */}
                <button onClick={closeModal}>Annuler</button> {/* Ferme la modal */}
            </Modal>
        </div>
    );
}
