import "./AsideBar.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function AsideBar({ onSelectGroup }) {
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [loading, setLoading] = useState(true); // État pour gérer le chargement
    const [errorMessage, setErrorMessage] = useState(''); // État pour gérer les erreurs

    // Récupérer les groupes auxquels l'utilisateur appartient
    const fetchGroups = async () => {
        setLoading(true); // Commencer le chargement
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('http://192.168.1.160:8000/api/user/groups', { // Changez ce point de terminaison
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data && Array.isArray(response.data.groups)) {
                setGroups(response.data.groups);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des groupes :', error);
            setErrorMessage('Erreur lors de la récupération des groupes.'); // Définir le message d'erreur
        } finally {
            setLoading(false); // Fin du chargement
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setGroupName(''); // Réinitialiser le nom du groupe
        setGroupDescription(''); // Réinitialiser la description
        setErrorMessage(''); // Réinitialiser le message d'erreur
    };

    const createGroup = async (e) => {
        e.preventDefault();
        if (!groupName) {
            setErrorMessage('Le nom du groupe est requis.'); // Validation simple
            return;
        }
        
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post('http://192.168.1.160:8000/api/groups', {
                name: groupName,
                description: groupDescription
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setGroups(prevGroups => [...prevGroups, response.data.group]);
            closeModal();
        } catch (error) {
            console.error('Erreur lors de la création du groupe :', error);
            setErrorMessage('Erreur lors de la création du groupe.'); // Définir le message d'erreur
        }
    };

    return (
        <div className="sidebar">
            <div className="groups-container"> {/* Conteneur des groupes avec défilement */}
                {loading ? (
                    <p>Chargement des groupes...</p> // Indicateur de chargement
                ) : (
                    groups.length > 0 ? (
                        groups.map((group) => (
                            <div className="group" key={group.id} onClick={() => onSelectGroup(group)}>
                                <h5>{group.name}</h5>
                                <p>{group.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>Aucun groupe disponible</p>
                    )
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Affichage du message d'erreur */}
            </div>

            <button className="creer" onClick={openModal}>
                Créer Group
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Créer un Groupe"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Créer un nouveau groupe</h2>
                <form onSubmit={createGroup}>
                    <div>
                        <label>Nom du groupe</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            type="text"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit">Créer</button>
                    <button type="button" onClick={closeModal}>Annuler</button>
                </form>
            </Modal>
        </div>
    );
}
