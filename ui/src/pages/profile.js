import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import profilePic from '../assets/profil.jpg';
import LogoutButton from '../components/LogoutButton'; 
import './profile.css';
import logo from '../assets/logoblanc2.png';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Profile() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Suppression de l'URL précédente si elle existe
    sessionStorage.removeItem('analyzedUrl');
    
    if (url) {
      sessionStorage.setItem('analyzedUrl', url); // Stocker la nouvelle URL
      setIsSubmitted(true);
      analyzeSite();
    }
  };
  

  const analyzeSite = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setResult({ success: false, error: 'Une erreur s\'est produite.' });
      setIsLoading(false);
    }
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const tfidfData = result?.tfidf_scores
    ? {
        labels: Object.keys(result.tfidf_scores),
        datasets: [
          {
            label: 'Scores TF-IDF',
            data: Object.values(result.tfidf_scores),
            backgroundColor: 'rgba(255, 116, 37, 0.5)',
            borderColor: 'rgba(255, 116, 37, 0.8)',
            borderWidth: 1,
          },
        ],
      }
    : null;
  

    const BigramChart = ({ bigrams }) => {
      const labels = bigrams.map(bigram => bigram[0].join(' ')); // Labels pour les bigrammes
      const data = bigrams.map(bigram => bigram[1]); // Fréquences des bigrammes
    
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Fréquence des Bigrammes',
            data: data,
            backgroundColor: 'rgba(255, 116, 37, 0.5)',
            borderColor: 'rgba(255, 116, 37, 0.8)',
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    
      return <Bar data={chartData} options={options} />;
    };

    const generatePDF = () => {
      // Récupérer l'URL stockée dans la session
      const storedUrl = sessionStorage.getItem('analyzedUrl');
    
      // Vérifie si l'URL est disponible
      if (!storedUrl) {
        alert("L'URL n'est pas disponible pour nommer le fichier PDF.");
        return;
      }
    
      // Sanitize the URL to create a valid filename
      const sanitizedUrl = storedUrl.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${sanitizedUrl}.pdf`;
    
      // Log du nom du fichier pour déboguer
      console.log('Nom du fichier PDF généré:', filename);
    
      const element = document.getElementById('pdf-content');
      if (!element) {
        alert("L'élément pour la génération du PDF est introuvable.");
        return;
      }
    
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { type: 'png', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
    
      html2pdf().from(element).set(options).output('blob').then(async (pdfBlob) => {
        const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
    
        console.log('Nom du fichier lors de l\'upload:', pdfFile.name);
    
        const saveToHistory = window.confirm('Souhaitez-vous conserver ce PDF dans votre historique ?');
        if (saveToHistory) {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user && user.email) {
            await handleFileUpload(pdfFile, user.email);
          } else {
            alert('Utilisateur non authentifié. Veuillez vous connecter.');
          }
        }
      }).catch((error) => {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Une erreur s\'est produite lors de la génération du PDF.');
      });
    };
    
  
  
  
    
    


    const handleFileUpload = async (file, userEmail) => {
      const formData = new FormData();
      formData.append('file', file);
    
      try {
        // Envoi du fichier au serveur
        const uploadResponse = await fetch('http://localhost:5000/api/auth/upload', {
          method: 'POST',
          body: formData,
        });
    
        if (!uploadResponse.ok) {
          throw new Error('Échec du téléchargement du fichier');
        }
    
        const uploadData = await uploadResponse.json();
    
        if (uploadData.filePath) {
          // Une fois le fichier téléchargé avec succès, sauvegarder les métadonnées
          const pdfName = uploadData.filePath.split('/').pop(); // Extraire le nom du fichier
          const saveResponse = await fetch('http://localhost:5000/api/auth/save-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail,
              pdfName,
              date: new Date().toISOString(),
            }),
          });
    
          if (!saveResponse.ok) {
            throw new Error('Échec de l\'enregistrement du PDF');
          }
    
          const saveData = await saveResponse.json();
          if (saveData.message === 'PDF sauvegardé dans l\'historique.') {
            alert('Le PDF a été enregistré dans votre historique.');
          } else {
            alert('Erreur lors de l\'enregistrement du PDF: ' + saveData.message);
          }
        } else {
          alert('Erreur lors du téléchargement du fichier: Pas de chemin de fichier reçu.');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur s\'est produite lors du téléchargement du fichier: ' + error.message);
      }
    };
    
    
    
  
  
  

  return (
    <div className={`profile-container ${isSubmitted ? 'submitted' : ''}`}>
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

      <div className={`profile-content ${isSubmitted ? 'submitted' : ''}`}>
        <div className={`form-content ${isSubmitted ? 'submitted' : ''}`}>
          <form onSubmit={handleSubmit} className="url-form">
            {!isSubmitted && (
              <label htmlFor="url">Entrez le lien URL du site à analyser:</label>
            )}
            <div className={`input-group ${isSubmitted ? 'submitted' : ''}`}>
              <input
                type="url"
                id="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                required
              />
              <button type="submit">Analyser</button>
            </div>
          </form>
        </div>

        <div className="analyse_container">
          {isLoading && (
            <div className="dots-spinner-container">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <p>Analyse en cours...</p>
            </div>
          )}

          <div className="dashboard-container">
            {result && !isLoading && (
              <div className="dashboard-content" id="pdf-content">
                <h2 className="dashboard-title">Résultats de l'analyse</h2>

                <div className="dashboard-section">
                  <h4>URL Analysée</h4>
                  <p className="dashboard-item">{result.url || 'Non spécifiée'}</p>
                </div>

                <div className="dashboard-section">
                  <h4>Analyse SEO onpage</h4>
                  <div className="seo-cards">
                    {result.seo_analysis && Object.entries(result.seo_analysis).length > 0 ? (
                      Object.entries(result.seo_analysis).map(([key, value]) => (
                        <div key={key} className="seo-card">
                          <h5>{key}</h5>
                          <ul>
                            {Array.isArray(value) ? (
                              value.map((item, index) => <li key={index}>{item}</li>)
                            ) : (
                              <li>{value}</li>
                            )}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p>Aucune analyse SEO disponible</p>
                    )}
                  </div>
                </div>

                <div className="dashboard-section">
                  <h4>Les top mots clés :</h4>
                  <div className="keyword-container">
                    {result.tfidf_scores && Object.entries(result.tfidf_scores).length > 0 ? (
                      Object.entries(result.tfidf_scores).map(([word, _]) => (
                        <div key={word} className="keyword-card">
                          <span className="keyword-text">{word}</span>
                        </div>
                      ))
                    ) : (
                      <p>Aucun mot-clé disponible</p>
                    )}
                  </div>
                </div>

                {tfidfData && (
                  <div className="dashboard-section">
                    <h4>Graphique des Scores TF-IDF</h4>
                    <Bar data={tfidfData} options={{ responsive: true }} />
                  </div>
                )}

                <div className="dashboard-section">
                  <h4>Mots-clés Comparés</h4>
                  <ul className="dashboard-list">
                    {result.compared_keywords ? (
                      <li className="dashboard-list-item">
                        {typeof result.compared_keywords === 'string'
                          ? result.compared_keywords
                          : JSON.stringify(result.compared_keywords)}
                      </li>
                    ) : (
                      <li>Aucun mot-clé comparé disponible</li>
                    )}
                  </ul>
                </div>

                <div className="dashboard-section">
                  <h4>Clusters de Mots-Clés</h4>
                  <div className="cluster-container">
                    {result.clusters && Object.keys(result.clusters).length > 0 ? (
                      Object.entries(result.clusters).map(([key, cluster]) => (
                        <div key={key} className="cluster-card">
                          <h5>Cluster {key}</h5>
                          <div className="cluster-keywords">
                            {cluster.length > 0 ? (
                              cluster.map((keyword, index) => (
                                <span key={index} className="cluster-keyword">{keyword}</span>
                              ))
                            ) : (
                              <p>Aucun mot-clé</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Aucun cluster disponible</p>
                    )}
                  </div>
                </div>
                 {/* Section pour les bigrammes */}
                <div className="dashboard-section">
                  <h4>Bigrammes les plus fréquents</h4>
                  {result.bigrams && result.bigrams.length > 0 ? (
                    <BigramChart bigrams={result.bigrams} />
                  ) : (
                    <p>Aucun bigramme disponible</p>
                  )}
                </div>
                


                <div className="dashboard-section">
                  <h4>Images à optimiser : extensions recommandées ".avif" ou ".webp"</h4>
                  {result.image_extensions && result.image_extensions.length > 0 ? (
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>URL de l'image</th>
                          <th>Extension</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.image_extensions.map(([imgUrl, imgExtension], index) => (
                          <tr key={index}>
                            <td>
                              <a href={imgUrl} target="_blank" rel="noopener noreferrer">{imgUrl}</a>
                            </td>
                            <td>{imgExtension}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-extension-message">Aucune extension d'image disponible</p>
                  )}
                </div>




              {/* Section pour les tailles d'image */}
              <div className="dashboard-section">
                <h4>Images de taille supérieure à 100KB</h4>
                <p className="compression-note">Il est préférable de les compresser pour améliorer les performances.</p>
                {result.images_sizes && result.images_sizes.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>URL de l'image</th>
                        <th>Taille (KB)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.images_sizes.map(([imgUrl, sizeKb], index) => (
                        <tr key={index}>
                          <td>
                            <a href={imgUrl} target="_blank" rel="noopener noreferrer">{imgUrl}</a>
                          </td>
                          <td>{sizeKb} KB</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-size-message">Aucune image de taille supérieure à 100 KB disponible</p>
                )}
              </div>





              <button onClick={generatePDF} className="pdf-button">Télécharger PDF</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
