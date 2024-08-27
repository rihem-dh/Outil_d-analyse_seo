import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser, faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import profilePic from '../assets/profil.jpg';
import ParticlesComponent from '../components/particles';
import LogoutButton from '../components/LogoutButton'; 
import Cursor from '../components/cursor';
import './profile.css';

function Profile() {
  const [url, setUrl] = useState('');
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Récupérer l'email de l'utilisateur depuis le stockage local
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserEmail(user.email); // Assurez-vous que l'e-mail est stocké sous cette clé
    }
  }, []);

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('URL to analyze:', url);
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div className="profile-container">
      
      <div className={`navbar ${navbarOpen ? 'open' : ''}`}>
        <div className="profile-section">
          <div className="profile-details">
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <p>{userEmail || 'Utilisateur non connecté'}</p> {/* Afficher l'email de l'utilisateur */}
            <div className='logout'>
              <LogoutButton />
            </div>
            
          </div>
        </div>
        <hr className="separator" /> 
        <div className="menu">
          <ul>
            <li>
              <Link to="/dashboard">
                <i className="fas fa-tachometer-alt"></i> {/* Icône du tableau de bord */}
                Analyser
              </Link>
            </li>
            <li>
              <Link to="/projects">
                <i className="fas fa-history"></i> {/* Icône de l'historique */}
                Historique
              </Link>
            </li>
            <li className=''>
              <Link to="/invoices">
                <i className="fas fa-cogs"></i> {/* Icône des paramètres */}
                Paramètre
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="menu-icon" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={navbarOpen ? faArrowLeft : faBars} />
      </div>
      <div className="dashbord-content">
        
      </div>
    </div>
  );
}

export default Profile;
