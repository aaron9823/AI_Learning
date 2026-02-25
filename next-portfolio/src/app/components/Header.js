'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [homeHover, setHomeHover] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);

  return (
    <header style={{
      backgroundColor: '#333',
      padding: '20px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <nav style={{
        display: 'flex',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link 
          href="/" 
          style={{
            color: homeHover ? '#00d4ff' : 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'color 0.3s',
          }}
          onMouseEnter={() => setHomeHover(true)}
          onMouseLeave={() => setHomeHover(false)}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          style={{
            color: aboutHover ? '#00d4ff' : 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'color 0.3s',
          }}
          onMouseEnter={() => setAboutHover(true)}
          onMouseLeave={() => setAboutHover(false)}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
