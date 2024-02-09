import React from 'react';
import './navbar.css'


function Navbar() {
  return (
    <nav>
        <a href="#">Foto Album</a>

            <ul >
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/fotos">Fotos</a>
                </li>
            </ul>

    </nav>
  );
}

export default Navbar;