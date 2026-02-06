import {Link} from 'react-router-dom'

export default function Header() {
  return (
    <header style={{
      background: '#2a3038',
      borderBottom: '3px solid #1a1a1a',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '0.55rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <Link to="/" style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: '0.95rem',
          fontWeight: '400',
          color: '#e0dcd4',
          textDecoration: 'none',
          letterSpacing: '0.01em',
          transition: 'opacity 0.15s'
        }}
        onMouseEnter={e => e.target.style.opacity = 0.8}
        onMouseLeave={e => e.target.style.opacity = 1}
        >
          Scouter 9000
        </Link>
        
        <nav style={{
          display: 'flex',
          gap: '1.25rem',
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          fontFamily: "'Libre Franklin', sans-serif",
          fontWeight: '700',
          letterSpacing: '0.08em'
        }}>
          <Link to="/" style={{
            color: 'rgba(224,220,212,0.65)',
            textDecoration: 'none',
            transition: 'color 0.15s'
          }}
          onMouseEnter={e => e.target.style.color = '#e0dcd4'}
          onMouseLeave={e => e.target.style.color = 'rgba(224,220,212,0.65)'}
          >
            Home
          </Link>
          <Link to="/about" style={{
            color: 'rgba(224,220,212,0.65)',
            textDecoration: 'none',
            transition: 'color 0.15s'
          }}
          onMouseEnter={e => e.target.style.color = '#e0dcd4'}
          onMouseLeave={e => e.target.style.color = 'rgba(224,220,212,0.65)'}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}