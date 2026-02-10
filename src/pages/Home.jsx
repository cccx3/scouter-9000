import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [name, setName] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validIds, setValidIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('playerPhoto');
    localStorage.removeItem('playerName');
    
    fetch('/valid_ids.json')
      .then(res => res.json())
      .then(ids => setValidIds(ids));
  }, []);

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files[0]) handlePhotoUpload(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handlePhotoUpload(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || validIds.length === 0) return;
    localStorage.setItem('playerName', name);
    if (photoPreview) {
      localStorage.setItem('playerPhoto', photoPreview);
    }
    const randomId = validIds[Math.floor(Math.random() * validIds.length)];
    navigate(`/profile/${randomId}`);
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-header">
          <h1 className="home-title">Scouter 9000</h1>
          <p className="home-subtitle">AI Scouting Reports</p>
        </div>
        <div className="home-body">
          <form onSubmit={handleSubmit} className="scout-form">
            <div className="input-group">
              <label className="input-label">Player Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name..." required className="vintage-input" />
            </div>
            <div className="input-group">
              <label className="input-label">Photo (Optional)</label>
              <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`photo-dropzone ${isDragging ? 'dragging' : ''} ${photoPreview ? 'has-photo' : ''}`}>
                {photoPreview ? (
                  <div className="photo-preview-row">
                    <div className="preview-thumb"><img src={photoPreview} alt="Preview" /></div>
                    <span className="preview-text">Photo added</span>
                    <button type="button" onClick={() => { setPhotoPreview(null); }} className="remove-photo">×</button>
                  </div>
                ) : (
                  <label className="dropzone-label">
                    <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>Drop photo or click</span>
                    <input type="file" accept="image/*" onChange={handleFileInput} className="hidden-input" />
                  </label>
                )}
              </div>
            </div>
            <button type="submit" className="generate-btn">Generate Report</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home;
