import React, { useEffect } from 'react';
import './Cursor.css'; // Assurez-vous d'importer votre fichier CSS

const Cursor = () => {
    useEffect(() => {
        const cursor = document.querySelector('.cursor');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.pageX + 'px';
            cursor.style.top = e.pageY + 'px';
        });
    }, []);

    return <div className="cursor"></div>;
};

export default Cursor;
