// LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './logoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate(); // Initialiser useNavigate

  const handleLogout = () => {
    localStorage.removeItem('user'); // Supprimer les informations de l'utilisateur
    // Suppression de l'URL stockée
    sessionStorage.removeItem('analyzedUrl');
    navigate('/'); // Rediriger vers la page d'accueil
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      <FontAwesomeIcon icon={faSignOutAlt} className="fa-icon" /> Se déconnecter
    </button>
  );
};

export default LogoutButton;
