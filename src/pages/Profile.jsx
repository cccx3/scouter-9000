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
  const [showCopied, setShowCopied] = useState(false);
  const cardRef = useRef(null);
  const reportBoxRef = useRef(null);
  const reportTextRef = useRef(null);

  const fitReportText = useCallback(() => {
    if (window.innerWidth > 600) return;
    const box = reportBoxRef.current;
    const text = reportTextRef.current;
    if (!box || !text) return;

    // Reset text size to minimum first so box isn't inflated by previous size
    text.style.fontSize = '0.5rem';

    const title = box.querySelector('.report-title');
    const titleH = title ? title.offsetHeight + parseFloat(getComputedStyle(title).marginBottom || 0) : 0;
    const boxPad = parseFloat(getComputedStyle(box).paddingTop) + parseFloat(getComputedStyle(box).paddingBottom);
    const available = box.offsetHeight - titleH - boxPad - 8; // 8px safety margin

    const minSize = 0.55;
    const maxSize = 0.95;
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
    fitReportText();
    window.addEventListener('resize', fitReportText);
    return () => window.removeEventListener('resize', fitReportText);
  }, [user, fitReportText]);

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

  const capitalizedName = playerName.charAt(0).toUpperCase() + playerName.slice(1);
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

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${user}?name=${encodeURIComponent(playerName)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${capitalizedName} — Scouter 9000`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="vintage-card-container">
      <div className="vintage-card" ref={cardRef}>
        <div className="card-wear-layer"></div>

        <div className="card-header">
          <h1 className="card-name">{capitalizedName.toUpperCase()}</h1>
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
            <button onClick={handleShare} className="vintage-button button-secondary">
              Share
            </button>
          </div>

          {showCopied && (
            <div className="copied-message">Link copied!</div>
          )}
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
