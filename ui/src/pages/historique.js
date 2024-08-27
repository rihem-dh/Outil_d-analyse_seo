import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import profilePic from '../assets/profil.jpg';
import LogoutButton from '../components/LogoutButton';
import './profile.css';
import './historique.css';
import logo from '../assets/logoblanc2.png';

function History() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserEmail(user.email);

      // Fetch PDF history associated with the user
      fetch(`http://localhost:5000/api/auth/history?userEmail=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Historique des PDF:', data);
          setHistory(data);
        })
        .catch((error) => console.error('Error fetching history:', error));
    }
  }, []);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const handleDownload = (fileName) => {
    window.open(`http://localhost:5000/${fileName}`, '_blank');
  };

  

  const formatURL = (fileName) => {
    // Extraire la partie URL du nom du fichier en supprimant le chemin et l'extension
    const urlPart = fileName.split('-')[1].replace('.pdf', ''); // On suppose que l'URL est après le premier tiret et avant '.pdf'
    
    // Remplacer les underscores (_) par des barres obliques (/) pour reformater l'URL
    let formattedURL = urlPart.replace(/_/g, '/');
    
    // Supprimer les préfixes HTTPS/HTTP si présents
    if (formattedURL.startsWith('https///')) {
      formattedURL = formattedURL.slice(8); // Supprimer 'https://'
    } else if (formattedURL.startsWith('http///')) {
      formattedURL = formattedURL.slice(7); // Supprimer 'http://'
    }
    
    // Remplacer les barres obliques (/) par des points (.)
    formattedURL = formattedURL.replace(/\//g, '.');
  
    // Retourner l'URL correctement formatée
    return formattedURL;
  };
  

  return (
    <div className="history">
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
                  <i className="fas fa-tachometer-alt"></i>
                  Analyser
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/historique"
                  className={({ isActive }) => isActive ? "active-link" : ""}
                >
                  <i className="fas fa-history"></i>
                  Historique
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/paramètre"
                  className={({ isActive }) => isActive ? "active-link" : ""}
                >
                  <i className="fas fa-cogs"></i>
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

      <div className="profile-content ">
        <div className="history-content">
          <h2>Historique des Fichiers PDF</h2>
          {history.length > 0 ? (
            <table className="pdf-history-table">
              <thead>
                <tr>
                  <th>Nom du PDF</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>{formatURL(entry.pdfName)}</td>
                    <td>{new Date(entry.date).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleDownload(entry.pdfName)}>
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun historique disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
