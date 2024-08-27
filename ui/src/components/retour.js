import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; 

function RetourButton() {
    return (
        <Link to="/" className="retour-button">
            <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
    );
}

export default RetourButton;
