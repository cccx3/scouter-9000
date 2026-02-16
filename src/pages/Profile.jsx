import { useLoaderData, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getWriteup } from '../services/prospects';
import { useState, useEffect, useRef, useCallback } from 'react';
import './Profile.css';

function Profile() {
  const writeup = useLoaderData();
  const navigate = useNavigate();
  const { user } = useParams();
  const [searchParams] = useSearchParams();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [playerName, setPlayerName] = useState(
    searchParams.get('name') || 'Unknown Player'
  );
  const [validIds, setValidIds] = useState([]);
  const cardRef = useRef(null);
  const nameRef = useRef(null);
  const reportBoxRef = useRef(null);
  const reportTextRef = useRef(null);

  const fitNameText = useCallback(() => {
    const el = nameRef.current;
    if (!el) return;
    const isMobile = window.innerWidth <= 600;
    const baseSize = isMobile ? 1.15 : 1.7;
    const minSize = isMobile ? 0.65 : 0.9;
    // Temporarily allow overflow so scrollWidth reflects real text width
    el.style.overflow = 'visible';
    el.style.textOverflow = 'clip';
    el.style.fontSize = baseSize + 'rem';
    let size = baseSize;
    while (el.scrollWidth > el.clientWidth && size > minSize) {
      size -= 0.05;
      el.style.fontSize = size + 'rem';
    }
    // Restore overflow as safety net
    el.style.overflow = 'hidden';
    el.style.textOverflow = 'ellipsis';
  }, []);

  const fitReportText = useCallback(() => {
    if (window.innerWidth > 600) return;
    const card = cardRef.current;
    const box = reportBoxRef.current;
    const text = reportTextRef.current;
    if (!card || !box || !text) return;

    // Measure fixed elements to calculate available space for report text
    const header = card.querySelector('.card-header');
    const statsGrid = card.querySelector('.stats-grid');
    const footer = card.querySelector('.card-footer');
    const cardBody = card.querySelector('.card-body');

    const cardH = card.offsetHeight;
    const headerH = header ? header.offsetHeight : 0;
    const statsH = statsGrid ? statsGrid.offsetHeight : 0;
    const footerH = footer ? footer.offsetHeight : 0;
    const bodyPad = cardBody ? parseFloat(getComputedStyle(cardBody).paddingTop) + parseFloat(getComputedStyle(cardBody).paddingBottom) : 0;
    const boxPad = parseFloat(getComputedStyle(box).paddingTop) + parseFloat(getComputedStyle(box).paddingBottom);
    const title = box.querySelector('.report-title');

    // Reset to measure title height accurately
    text.style.fontSize = '0.5rem';
    const titleH = title ? title.offsetHeight + 6 : 0; // 6px gap below title
    const statsMargin = statsGrid ? parseFloat(getComputedStyle(statsGrid).marginBottom) : 0;

    const available = cardH - headerH - statsH - statsMargin - footerH - bodyPad - boxPad - titleH - 12;

    const minSize = 0.55;
    const maxSize = 1.1;
    let lo = minSize, hi = maxSize;

    for (let i = 0; i < 15; i++) {
      const mid = (lo + hi) / 2;
      text.style.fontSize = mid + 'rem';
      if (text.scrollHeight > available) {
        hi = mid;
      } else {
        lo = mid;
      }
    }
    text.style.fontSize = lo + 'rem';
  }, []);

  useEffect(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const photo = localStorage.getItem('playerPhoto');
    const name = localStorage.getItem('playerName');
    if (photo) setPhotoUrl(photo);
    if (name) setPlayerName(name);

    fetch('/valid_ids.json')
      .then(res => res.json())
      .then(ids => setValidIds(ids));
  }, [user]);

  useEffect(() => {
    fitNameText();
    fitReportText();
    const handleResize = () => { fitNameText(); fitReportText(); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, fitNameText, fitReportText]);

  if (!writeup) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1815', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ color: '#6b7280', fontFamily: "'Libre Franklin', sans-serif" }}>Prospect not found.</div>
        <button onClick={() => navigate('/')} style={{
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '0.5rem 1.2rem',
          background: '#2a3038',
          border: '2px solid #1a1a1a',
          borderRadius: '3px',
          color: '#e8e4dc',
          cursor: 'pointer'
        }}>Go Home</button>
      </div>
    );
  }

  const {
    result,
    grade_hit = 50,
    grade_power = 50,
    grade_run = 50,
    grade_throw = 50,
    grade_field = 50
  } = writeup;

  const capitalizedName = (playerName.charAt(0).toUpperCase() + playerName.slice(1)).slice(0, 24);
  const personalizedReport = result.replace(/this player/gi, capitalizedName);

  const getGradeClass = (grade) => {
    if (grade >= 70) return 'grade-elite';       // Solid Blue - Superstar/Outstanding
    if (grade >= 60) return 'grade-excellent';    // Teal/Light Blue - Excellent/Above Average
    if (grade >= 50) return 'grade-good';         // Green - Good/Above Average
    if (grade >= 40) return 'grade-avg';          // Yellow - Average/Major League Average
    if (grade >= 30) return 'grade-below';        // Orange - Below Average
    return 'grade-poor';                          // Red - Poor/Well Below Average
  };

  const handleReroll = () => {
    if (validIds.length === 0) return;
    const randomId = validIds[Math.floor(Math.random() * validIds.length)];
    navigate(`/profile/${randomId}`);
  };

  const handleDownload = async () => {
    const card = cardRef.current;
    if (!card) return;

    const footer = card.querySelector('.card-footer');
    if (footer) footer.style.display = 'none';

    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
      });

      if (footer) footer.style.display = '';

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const fileName = `${capitalizedName.toLowerCase()}-scouter9000.png`;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Mobile: use share sheet so user can save to Photos, AirDrop, etc.
      if (isMobile && navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${capitalizedName} — Scouter 9000`,
            files: [file],
          });
          return;
        }
      }

      // Desktop fallback: direct download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (footer) footer.style.display = '';
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="vintage-card-container">
      <div className="vintage-card" ref={cardRef}>
        <div className="card-wear-layer"></div>

        <div className="card-header">
          <h1 className="card-name" ref={nameRef}>{capitalizedName.toUpperCase()}</h1>
        </div>

        <div className="card-body">

          <div className="stats-grid">

            <div className="photo-frame">
              {photoUrl ? (
                <img src={photoUrl} alt={capitalizedName} />
              ) : (
                <div className="photo-placeholder">
                  <svg style={{width: '3.5rem', height: '3.5rem'}} fill="#666" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="stats-list">
              {[
                { label: 'HIT', grade: grade_hit },
                { label: 'POWER', grade: grade_power },
                { label: 'SPEED', grade: grade_run },
                { label: 'ARM', grade: grade_throw },
                { label: 'FIELD', grade: grade_field }
              ].map(tool => (
                <div key={tool.label} className="stat-row">
                  <span className="stat-label">{tool.label}</span>
                  <div className="stat-bar-container">
                    <div
                      className={`stat-bar ${getGradeClass(tool.grade)}`}
                      style={{ width: `${((tool.grade - 20) / 60) * 100}%` }}
                    />
                  </div>
                  <span className="stat-value">{tool.grade}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="report-box" ref={reportBoxRef}>
            <h2 className="report-title">Scouting Report</h2>
            <p className="report-text" ref={reportTextRef}>{personalizedReport}</p>
          </div>

        </div>

        <div className="card-footer">
          <div className="button-group">
            <button onClick={handleReroll} className="vintage-button button-primary">
              Generate Another
            </button>
            <button onClick={handleDownload} className="vintage-button button-secondary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  try {
    const writeup = await getWriteup(params.user);
    return writeup;
  } catch (error) {
    return null;
  }
}

export default Profile;
