import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './login.css';
import './comment.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesComponent from '../components/particles';
import logo from '../assets/logoblanc2.png';
import image from '../assets/login.png';
import profil from '../assets/profil.jpg';
import RetourButton from '../components/retour';
import GoogleLoginButton from '../components/googleLogin';
import { gapi } from 'gapi-script';
import axios from 'axios';

const clientId = '710711825254-fsi0tt86cb6ehk3d4f0ce7s9pbj3hvv7.apps.googleusercontent.com';

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with', { email, password });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password
      });
      console.log('Response:', response.data);
      if (response.data.message === 'Connexion réussie') {
        localStorage.setItem('user', JSON.stringify({ email: response.data.user.email }));
        navigate('/profile'); // Redirigez vers le profil après la connexion réussie
      } else {
        setErrorMessage(response.data.message);
        console.error('Erreur de connexion:', response.data.message);
      }
    } catch (error) {
      setErrorMessage('Erreur de connexion : ' + (error.response?.data || error.message));
      console.error('Erreur de connexion:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      });
    };
    gapi.load('client:auth2', start);
  }, []);

  const onSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    // Envoyer le token à votre serveur pour vérification
    try {
        const res = await fetch('http://localhost:5000/api/auth/google-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_token: idToken }),
        });
        const data = await res.json();
        if (data.success) {
            console.log('User authenticated successfully:', data.user);
            localStorage.setItem('user', JSON.stringify({ email: data.user.email }));
            navigate('/profile'); // Redirigez vers le profil après la connexion réussie
        } else {
            console.error('Authentication failed:', data.message);
            setErrorMessage(data.message);
        }
    } catch (error) {
        console.error('Error sending token to the server:', error);
    }
};



  const onFailure = (response) => {
    console.log('Login Failed:', response);
  };

  useEffect(() => {
    const inputs = document.querySelectorAll(".input");

    function addcl() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function remcl() {
      let parent = this.parentNode.parentNode;
      if (this.value === "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach(input => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });

    // Cleanup event listeners on component unmount
    return () => {
      inputs.forEach(input => {
        input.removeEventListener("focus", addcl);
        input.removeEventListener("blur", remcl);
      });
    };
  }, []);

  return (
    <div className='loginpage'>
      <ParticlesComponent id="particles" />
      <div className='container'>
        <div className="login-content">
          <RetourButton /> {/* Bouton de retour */}
          <form onSubmit={handleSubmit}>
            <img src={profil} className='profil' alt="Profile" />
            <h2 className="title">Se connecter</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div id='signInButton'>
            <GoogleLoginButton/>
            </div>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user" style={{ color: '#555' }}></i>
              </div>
              <div className="div">
                <h5>mail</h5>
                <input
                  type="text"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock" style={{ color: '#555' }}></i>
              </div>
              <div className="div">
                <h5>mot de passe</h5>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>
            <a href="#" className='question'>mot de passe oublier?</a>
            <div>
              <button type="submit" className="button">Se connecter</button>
            </div>
          </form>
        </div>
        <div className='box'>
          <img src={logo} alt="Logo" className="logo1" />
          <img src={image} alt="Login" className="image1" />
          <div>
            <p className='question'>Pas encore de compte ?</p>
            <Link to="/signup" className="signup btn-secondary">créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
