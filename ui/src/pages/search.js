import React, { useState } from 'react';
import './search.css'; // Assurez-vous d'avoir un fichier CSS pour les styles

function Search() {
  const [url, setUrl] = useState('');

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logique pour analyser le lien ou l'envoyer à une API
    console.log('URL à analyser:', url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="user-info">
          <img src="https://via.placeholder.com/40" alt="User Icon" className="user-icon" />
          <span className="user-email">user@example.com</span>
        </div>
      </header>
      <main>
        <form onSubmit={handleSubmit} className="url-form">
          <label htmlFor="url">Entrez le lien du site à analyser :</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={handleInputChange}
            placeholder="https://example.com"
            required
          />
          <button type="submit">Analyser</button>
        </form>
      </main>
    </div>
  );
}

export default Search;
