import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import profilePic from '../assets/profil.jpg';
import ParticlesComponent from './particles';

function Navbar() {
  return (
    <div className="navbar">
      <div className="profile-section">
        <div className="particles-container">
          <ParticlesComponent id="particles" />
        </div>
        <div>
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <h3>UserName</h3>
        </div>
        
      </div>
      <div className="menu">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/invoices">Invoices</Link></li>
          <li><Link to="/reports">Reports</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
