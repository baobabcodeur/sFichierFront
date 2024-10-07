import React, { useEffect, useState } from 'react';
import AsideBar from "../../components/AsideBar/AsideBar";
import Discussion from "../../components/Discussion/Discussion";
import Invite from "../../components/Invite/Invite";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedInvite, setSelectedInvite] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour vérifier l'authentification
    const [showAsideBar, setShowAsideBar] = useState(false); // Contrôler l'affichage de l'AsideBar sur mobile
    const [showInvite, setShowInvite] = useState(false); // Contrôler l'affichage de l'Invite sur mobile

    // Vérifiez l'authentification à chaque chargement du composant
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            navigate('/'); // Redirigez vers la page de connexion si non connecté
        } else {
            setIsAuthenticated(true); // L'utilisateur est connecté
        }
    }, [navigate]);

    const Deconexion = async () => {
        try {
            const token = localStorage.getItem('auth_token'); // Récupérer le token du stockage local

            if (!token) {
                console.error('Non autorisé. Vous devez vous connecter pour accéder à cette page.');
                return;
            }

            // Effectuer la déconnexion
            const response = await axios({
                url: "http://192.168.1.160:8000/api/logout",
                method: "post",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Si la déconnexion réussie
            if (response.status === 200) {
                console.log("Déconnexion réussie");
                localStorage.removeItem('auth_token'); // Retirer le token
                setSelectedGroup(null); // Nettoyer l'état du groupe sélectionné
                navigate('/'); // Rediriger vers la page de connexion
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    if (!isAuthenticated) {
        return null; // ou vous pouvez afficher un loader pendant que la vérification se fait
    }

    return (
        <div className='dashboard'>
            <div className="entete">
                <img src="./public/securite.png" alt="" />
                <img src="./public/message.png" alt="" />
                <img src="./public/rapelle.png" alt="" />
                <Button
                    type={"button"} // Modifier le type en button pour éviter le rechargement
                    text={"Déconnexion"}
                    onClick={Deconexion} // Passer la fonction Deconexion directement
                />
            </div>

            <div className="select">
                <h4 className="vert">Groupes</h4>
                <h4>Messages privés</h4>
            </div>
            <div className="contenu">

                {/* Boutons visibles sur mobile pour afficher AsideBar et Invite */}
                <div className="mobile-buttons">
                    <Button
                        type="button"
                        text={showAsideBar ? "Cacher Groupes" : "Afficher Groupes"}
                        onClick={() => setShowAsideBar(!showAsideBar)}
                    />
                    <Button
                        type="button"
                        text={showInvite ? "Cacher Inviter" : "Afficher Inviter"}
                        onClick={() => setShowInvite(!showInvite)}
                    />
                </div>

                {/* AsideBar visible uniquement si showAsideBar est true (sur mobile) */}
                <div className={`aside-bar ${showAsideBar ? "visible" : ""}`}>
                    <AsideBar onSelectGroup={setSelectedGroup} />
                </div>

                <Discussion selectedGroup={selectedGroup} />

                {/* Invite visible uniquement si showInvite est true (sur mobile) */}
                <div className={`invite ${showInvite ? "visible" : ""}`}>
                    <Invite selectedGroup={selectedGroup} />
                </div>

            </div>
        </div>
    );
}
