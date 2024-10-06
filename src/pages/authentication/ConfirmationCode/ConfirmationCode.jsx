import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import axios from 'axios';
import './ConfirmationCode.css';

export default function ConfirmationCode() {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate for redirection
    const email = location.state?.email || ''; // Get the email from location state
    const [otp_code, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input validation
        if (!otp_code) {
            setErrorMessage('Le code OTP est requis.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(''); // Clear any previous error messages

        try {
            const response = await axios.post('http://192.168.1.160:8000/api/verify-otp', {
                email,
                otp_code,
            });

            if (response.status === 200) {
                setSuccessMessage('Code de confirmation vérifié avec succès !');
                // Redirect the user to another page, for example, the login page
                navigate('/'); // Uncomment this if you want to redirect
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du code OTP:', error);
            if (error.response) {
                // Adjust error messages based on the backend response
                setErrorMessage(error.response.data.message || 'Une erreur est survenue lors de la vérification du code.');
            } else {
                setErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
            }
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='Appbar'>
                    <h2>AMEK INFORMATIQUE</h2>
                </div>

                <div className='container'>
                    <h3><span>S</span>-fichier</h3>
                    <p>Saisir le code de confirmation envoyé à votre e-mail: {email}</p>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <Input
                        type="text"
                        value={otp_code}
                        placeholder="Saisir le code ici"
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button
                        disabled={isLoading}
                        type="submit"
                        text={isLoading ? "Chargement ..." : "Soumettre"}
                    />
                    <a href="/registration">Créer un compte</a>
                </div>
                <footer>
                    <p>Copyright 2024 - Tous droits réservés.</p>
                    <p>Powered and designed by jeanamekpod@gmail.com</p>
                </footer>
            </form>
        </div>
    );
}
