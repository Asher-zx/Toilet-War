import { useEffect, useState } from 'react';
import { getTodayToiletSession, recordToiletUse } from '../api';

export function ToiletWar() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadToiletSession() {
      try {
        setLoading(true);
        const data = await getTodayToiletSession();
        setSession(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load toilet session:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    loadToiletSession();
    
    const intervalId = setInterval(loadToiletSession, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleToiletUse = async () => {
    try {
      setLoading(true);
      const updatedSession = await recordToiletUse();
      setSession(updatedSession);
    } catch (err) {
      console.error("Failed to record toilet use:", err);
      setError("Failed to record toilet use. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !session) return <div>Loading toilet war status...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="toilet-war">
      <h1>Toilet War</h1>
      
      <div className="war-status">
        <div className="status-card">
          <h2>Husband's Toilet Uses Today</h2>
          <div className="count-display">{session?.toiletUses || 0}</div>
          <button 
            onClick={handleToiletUse}
            className="toilet-button"
          >
            Record Toilet Use
          </button>
        </div>
        
        <div className="status-card">
          <h2>Wife's Complaints</h2>
          <div className="count-display">{session?.complaints || 0}</div>
          <div className="complaint-level">
            {session?.complaints >= 1 && <div className="complaint level-1">😠</div>}
            {session?.complaints >= 2 && <div className="complaint level-2">😡</div>}
            {session?.complaints >= 3 && <div className="complaint level-3">🤬</div>}
          </div>
        </div>
      </div>
      
      {session?.conflict && (
        <div className="conflict-alert">
          <h2>CONFLICT DETECTED!</h2>
          <div className="explosion-container">
            <img src="/explosion.gif" alt="Nuclear Explosion" className="explosion-gif" />
          </div>
          <p>The wife has complained 3 times. You're in big trouble now!</p>
        </div>
      )}
      
      <div className="rules-box">
        <h3>Toilet War Rules:</h3>
        <ul>
          <li>Your wife starts complaining when you use the toilet 3 times</li>
          <li>Each additional toilet use triggers one more complaint</li>
          <li>When complaints reach 3, CONFLICT ERUPTS!</li>
        </ul>
      </div>
    </div>
  );
}