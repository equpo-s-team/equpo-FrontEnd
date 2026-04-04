import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <div className="logo">
        <div className="logo-dot"></div>
        Orbit
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span className="live-dot">En vivo</span>
        <span className="header-meta">Actualizado hace 2 min</span>
      </div>
    </header>
  );
};

export default Header;
