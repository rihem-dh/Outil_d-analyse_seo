import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import profilePic from '../assets/profil.jpg';
import LogoutButton from '../components/LogoutButton';
import './profile.css';
import './parametre.css';
import logo from '../assets/logoblanc2.png';

function Paramètre() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch user email from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Réinitialiser les alertes (vous n'avez plus besoin de ces états)
    setError('');
    setSuccess('');
  
    if (newPassword !== confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          oldPassword,
          newPassword,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Mot de passe modifié avec succès.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.message || 'Erreur lors du changement de mot de passe.');
      }
    } catch (err) {
      alert('Une erreur s\'est produite.');
    }
  };
  
  

  return (
    <div className="parametre">
      <div className={`navbar ${navbarOpen ? 'open' : ''}`}>
        <div>
          <div className="profile-section">
            <div className="profile-details">
              <img src={profilePic} alt="Profile" className="profile-pic" />
              <p>{userEmail || 'Utilisateur non connecté'}</p>
              <div className='logout'>
                <LogoutButton />
              </div>
            </div>
          </div>
          <hr className="separator" />
          <div className="menu">
            <ul>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => isActive ? "active-link" : ""}
                >
                  <i className="fas fa-tachometer-alt"></i> {/* Dashboard Icon */}
                  Analyser
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/historique"
                  className={({ isActive }) => isActive ? "active-link" : ""}
                >
                  <i className="fas fa-history"></i> {/* History Icon */}
                  Historique
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/paramètre"
                  className={({ isActive }) => isActive ? "active-link" : ""}
                >
                  <i className="fas fa-cogs"></i> {/* Settings Icon */}
                  Paramètre
                </NavLink>
              </li>
            </ul>
          </div>
          <div className='logo_container'>
            <hr className="separator" />
            <img src={logo} alt="Logo" className="logo2" />
          </div>
        </div>
      </div>

      <div className="menu-icon" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={navbarOpen ? faArrowLeft : faBars} />
      </div>

      <div className="par-content">
        <div className="settings-content">
          <h2>Paramètres</h2>
          <p>Cette section permet au utilisateur de changer son mot de passe.</p>
          <div className="settings-options">
            <form onSubmit={handlePasswordChange}>
              <div>
                <label>Email:</label>
                <p>{userEmail}</p>
              </div>
              <div>
                <label>Ancien mot de passe:</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Nouveau mot de passe:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Confirmer le nouveau mot de passe:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit">Changer le mot de passe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paramètre;
