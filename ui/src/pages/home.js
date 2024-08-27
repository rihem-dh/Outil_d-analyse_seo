
import React from 'react';
import './home.css';
import ParticlesComponent from '../components/particles'; 
import logo from '../assets/logoblanc2.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <ParticlesComponent id="particles" />
      <img src={logo} alt="Logo" className="logo" /> 
      
      <div className='homeContent'> 
        <h1 >Bienvenue!</h1>
        <p >
          Notre analyseur des sites web offre plusieurs services pour améliorer votre présence en ligne, 
          y compris une analyse approfondie du SEO, l'optimisation des mots-clés, le suivi des performances 
          du site, des recommandations pour améliorer le contenu, et une analyse de la concurrence.
        </p>
        <Link to="/login" className="cta-button">commencer maintenant</Link>
      </div>
      
      
    </div>
  );
}

export default Home;
