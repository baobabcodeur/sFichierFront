import React, { useState } from 'react';
import Input from "../../../components/Input/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registration.css";

export default function Registration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        // Extraire le token de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token'); // Récupérer le token depuis l'URL

        try {
            const response = await axios.post('http://192.168.1.160:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
                ...(token && { token }) // N'inclure le token que s'il existe
            });

            if (response.status === 200) {
                // On suppose que l'inscription est réussie, redirigez vers la page de confirmation
                navigate('/otp', { state: { email } }); // Passer l'email à la page de confirmation
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setErrorMessage('Une erreur est survenue lors de l\'inscription.'); // Gérer les erreurs ici
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className='Appbar'>
                <h2>AMEK INFORMATIQUE</h2>
            </div>
            <div className='container'>
                <h3><span>S</span>-fichier</h3>
                <Input type="text" placeholder="nom" value={name} onChange={(e) => setName(e.target.value)} />
                <Input type="email" placeholder="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input type="password" placeholder="confirmer mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button onClick={handleRegistration} disabled={isLoading}>{isLoading ? "Chargement ..." : "Créer le compte"}</button>
                <a href="/">Se connecter</a>
            </div>
            <footer>
                <p>Copyright 2024 - Tous droits réservés.</p>
                <p>Powered and designed by jeanamekpod@gmail.com</p>
            </footer>
        </div>
    );
}
