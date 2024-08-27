import React, { useEffect, useState } from 'react';
import './signup.css';
import './comment.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesComponent from '../components/particles';
import logo from '../assets/logoblanc2.png';
import image from '../assets/login.png';
import profil from '../assets/profil.jpg';
import RetourButton from '../components/retour';
import GoogleSignInButton from '../components/googleLogin'; 
import axios from 'axios';

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Utilisation du hook useNavigate pour la redirection

    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                firstName: firstName || undefined, // N'envoyer que si la valeur existe
                lastName: lastName || undefined,
                email,
                password,
            });
            console.log('Inscription réussie:', response.data);
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.'); // Alerte de succès
            localStorage.setItem('user', JSON.stringify({ email })); 
            navigate('/profile'); // Redirection vers la page de profil
        } catch (error) {
            console.error('Erreur d\'inscription:', error.response?.data);
            if (error.response?.data.message) {
                alert(error.response.data.message); // Alerte avec le message d'erreur du serveur
            } else {
                alert('Erreur d\'inscription'); // Alerte générique
            }
        }
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
                <div className='box1'>
                    <img src={logo} alt="Logo" className="logo" />  
                    <img src={image} alt="Login" className="image" />
                    <div>
                        <p className='question'>Déjà un compte ?</p>
                        <Link to="/login" className="signup btn-secondary">Se connecter</Link>
                    </div>
                </div>
                <div className="login-content">
                    <RetourButton /> {/* Bouton de retour */}
                    <form onSubmit={handleSubmit}>
                        <img src={profil} className='profil'/>
                        <h2 className="title">Créer un compte</h2>
                        <GoogleSignInButton />
                        <div className="div1">
                            <div className="input-div one">
                                <div className="i">
                                    <i className="fas fa-user" style={{color: '#555'}}></i>
                                </div>
                                <div className="div">
                                    <h5>Nom <span>(facultatif)</span></h5>
                                    <input
                                        type="text"
                                        className="input"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="input-div one">
                                <div className="i">
                                    <i className="fas fa-user" style={{color: '#555'}}></i>
                                </div>
                                <div className="div">
                                    <h5>Prénom <span>(facultatif)</span></h5>
                                    <input
                                        type="text"
                                        className="input"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fas fa-user" style={{color: '#555'}}></i>
                            </div>
                            <div className="div">
                                <h5>Email</h5>
                                <input
                                    type="email" // Utiliser type email pour validation
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="input-div pass">
                            <div className="i"> 
                                <i className="fas fa-lock" style={{color: '#555'}}></i>
                            </div>
                            <div className="div">
                                <h5>Mot de passe</h5>
                                <input
                                    type="password"
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="button">Valider</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
