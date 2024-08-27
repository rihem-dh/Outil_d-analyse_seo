import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './custom.scss';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Home from './pages/home.js';
import Login from './pages/login.js';
import Signup from './pages/signup.js';
import Profile from './pages/profile.js';
import Search from './pages/search.js';
import Historique from './pages/historique.js';
import Paramètre from './pages/parametre.js';






function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/paramètre" element={<Paramètre />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
