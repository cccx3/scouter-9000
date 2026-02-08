import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { getWriteup } from '../services/prospects';
import { useState, useEffect } from 'react';
import './Profile.css';

function Profile() {
  const writeup = useLoaderData();
  const navigate = useNavigate();
  const { user } = useParams();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [playerName, setPlayerName] = useState('Unknown Player');
  const [validIds, setValidIds] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const photo = localStorage.getItem('playerPhoto');
    const name = localStorage.getItem('playerName');
    if (photo) setPhotoUrl(photo);
    if (name) setPlayerName(name);

    fetch('/valid_ids.json')
      .then(res => res.json())
      .then(ids => setValidIds(ids));
  }, [user]);

  if (!writeup) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1815' }}>
        <div style={{ color: '#6b7280' }}>Prospect not found. Redirecting...</div>
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="vintage-card-container">
      <div className="vintage-card">
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

          <div className="report-box">
            <h2 className="report-title">Scouting Report</h2>
            <p className="report-text">{personalizedReport}</p>
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
