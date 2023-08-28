import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
      <header className="myheaders">
        <h1>Developpement IA</h1>
        <div className='links'>
        <NavLink to='/' className='Link' >Home</NavLink>
        <NavLink to='/dimension2' className='Link' >Annalyse2D</NavLink>
        <NavLink to='classification' className='Link' >Classification</NavLink>
        <NavLink to='/reconnaissance' className='Link' >Reconnaissance</NavLink>
        </div>
      </header>
    );
}

export default Header;
