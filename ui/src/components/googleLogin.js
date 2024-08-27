import React from 'react';
import { GoogleLogin } from 'react-google-login';
import googleIcon from '../assets/GoogleIcon.svg'; 
import './googleLogin.css'; 

const CLIENT_ID = '710711825254-fsi0tt86cb6ehk3d4f0ce7s9pbj3hvv7.apps.googleusercontent.com';

const GoogleSignInButton = () => {
  const onSuccess = async (response) => {
    console.log('Login Success: currentUser:', response);

    const idToken = response.credential; // Utilisez `credential` pour obtenir le token

    // Envoyer le token à votre serveur pour vérification
    try {
      const res = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }), // Envoyer le token d'identification
      });
      const data = await res.json();
      if (data.success) {
        console.log('User authenticated successfully:', data.user);
        localStorage.setItem('user', JSON.stringify({ email: data.user.email })); // Stocker l'email
        // Rediriger ou gérer l'état utilisateur ici
      } else {
        console.error('Authentication failed:', data.message);
      }
    } catch (error) {
      console.error('Error sending token to the server:', error);
    }
  };

  const onFailure = (response) => {
    console.log('Login failed: res:', response);
  };
  
  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      render={renderProps => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className='googlebutton'
        >
          <img
            src={googleIcon}
            alt="Google SSO"
            style={{ marginRight: '10px', width: '20px', height: '20px' }}
          />
          Se connecter avec Google
        </button>
      )}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleSignInButton;
