import React, { useState } from "react";
import  "./Login.css"
import Input from "../../../components/Input/Input"
import Button from "../../../components/Button/Button"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer} from "react-toastify";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.set("email", email);
    formData.set("password", password);

    const response = await axios.post(
      "http://192.168.1.160:8000/api/login",
      formData
    );
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_id', response.data.user.id); 
      setIsLoading(false);
      setTimeout(function () {
        navigate("/dashboard");
      }, 3000);
    } else {
      console.log(response.data);
      toast.error(response.data.message);
      setIsLoading(false);
    }
  };

    return <div>
       <form onSubmit={handleSubmit}>
        <div className='Appbar'>
        <h2>AMEK INFORMATIQUE</h2>
      </div>
      <ToastContainer />
      <div className='container'>
        <h3><span>S</span>-fichier</h3>
        <Input
          
          reference={"email"}
          type={"email"}
          value={email}
          placeholder={"Saisir l'adresse e-mail ici"}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Input
          
          reference={"password"}
          type={"password"}
          value={password}
          placeholder={"Saisir le mod de passe ici"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}/>
        <a href="http://">Mot de passe oublié?</a>
        <Button
            disabled={isLoading}
            type={"submit"}
            text={isLoading ? "Chargement ..." : "Soumettre"}
          />
        <a href="registration">Créer un compte</a>
      </div>
      <footer>
        <p>Copyright 2024 - Tous droits réservés.</p>
        <p>Powered and designed by jeanamekpod@gmail.com</p>
      </footer>
      </form>
    </div>
}