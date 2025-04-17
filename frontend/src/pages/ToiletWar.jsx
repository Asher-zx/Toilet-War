import { useEffect, useState } from 'react';
import { getTodayToiletSession, recordToiletUse, getToiletSessionByDate, decreaseToiletUse, deleteToiletSession } from '../api';

export function ToiletWar() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showConflictAlert, setShowConflictAlert] = useState(false);

  const formattedDate = selectedDate.toISOString().split('T')[0];
  
  useEffect(() => {
    loadToiletSession();

    let intervalId;
    if (isToday(selectedDate)) {
      intervalId = setInterval(loadToiletSession, 60000);
    }
      return () => {
        if (intervalId) clearInterval(intervalId);
      }; 
  }, [selectedDate]);

  useEffect(() => {
    if (session?.conflict) {
      setShowConflictAlert(true);
    }
  }, [session?.conflict]);
  

  function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  async function loadToiletSession() {
    try {
      setLoading(true);
      let data;
      if (isToday(selectedDate)) {
        data = await getTodayToiletSession();
      } else {
        data = await getToiletSessionByDate(selectedDate);
      }
      setSession(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load toilet session:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

/*   useEffect(() => {
    async function loadToiletSession() {
      try {
        setLoading(true);
        let data;
        if (isToday(selectedDate)) {
          data = await getTodayToiletSession();
        } else {
          data = await getToiletSessionByDate(selectedDate);
        }
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
  }, []); */
  
  //handle date change
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };


  const handleToiletUse = async () => {
    try {
      setLoading(true);
      let updatedSession;

      if (isToday(selectedDate)) {
        updatedSession = await recordToiletUse();
      } else {
        updatedSession = await recordToiletUse(selectedDate);
      }

      setSession(updatedSession); 
    } catch (err) {
      console.error("Failed to record toilet use:", err);
      setError("Failed to record toilet use. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //decrease toilet use
  const handleDecreaseToiletUse = async () => {
    try {
      setLoading(true);
      let updatedSession = await decreaseToiletUse(selectedDate);
      setSession(updatedSession);
    } catch (err) {
      console.error('Failed to decrease toilet use:', err);
      setError('Failed to decrease toilet use. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //Delete toilet session 
  const handleDeleteSession = async () => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      setLoading(true);
      await deleteToiletSession(selectedDate);
      setSession({
        userId: session?.userId || "",
        date: selectedDate,
        toiletUses: 0,
        complaints: 0,
        conflict: false
      });
    } catch (err) {
      console.error("Failed to delete session:", err);
      setError("Failed to delete session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConflictAlert = () => {
    setShowConflictAlert(false);
  }
  
  if (loading && !session) return <div>Loading toilet war status...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="toilet-war">
      <h1>Toilet War</h1>
      
      {/* date select */}
      <div className='date-selector'>
        <label htmlFor="date-select">Select Date: </label>
        <input type="date"
               id='date-select'
               value={formattedDate}
               onChange={handleDateChange}
               max={new Date().toISOString().split('T')[0]} />
        {!isToday(selectedDate) && (
          <span className='history-badge'>Historical Date</span>
        )}
      </div>

      <div className="war-status">
        <div className="status-card">
          <h2>Husband's PooPoo Time {isToday(selectedDate) ? 'Today' : 'on Selected Date'}</h2>
          <div className="count-display" data-emoji="🚽">{session?.toiletUses || 0}</div>
          <div className='button-group'>
            <button 
            onClick={handleToiletUse}
            className="toilet-button"
            >
            Add Use (+1)
            </button>
            {session?.toiletUses > 0 && (
              <button 
              onClick={handleDecreaseToiletUse}
              className="toilet-button decrease"
              >
              Decrease (-1)
              </button>
            )}

            {session && session._id && (
              <button 
                onClick={handleDeleteSession}
                className="toilet-button delete">
                Delete Session
              </button>
            )}
          </div>
        </div>
        
        <div className="status-card">
          <h2>Wife's Complaints</h2>
          <div className="count-display" data-emoji="😤">{session?.complaints || 0}</div>
          <div className="complaint-level">
            {session?.complaints >= 1 && <div className="complaint level-1">😠</div>}
            {session?.complaints >= 2 && <div className="complaint level-2">😡</div>}
            {session?.complaints >= 3 && <div className="complaint level-3">🤬</div>}
          </div>
        </div>
      </div>
      
      {showConflictAlert && (
        <div className="conflict-modal-overlay">
          <div className='conflict-modal'>
            <h2>CONFLICT DETECTED!</h2>
            <div className="explosion-container">
              <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGxybWZrcGVlY2sycHl0Z3A3czdqbW5lcGM1ZXhlNHR3N21kY2k1NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/YA6dmVW0gfIw8/giphy.gif" alt="Nuclear Explosion" className="explosion-gif" />
            </div>
            <p>Your wife has complained 3 times. You're in big trouble now! Happy Time Gone!!!</p>
            <button onClick={handleCloseConflictAlert} className='close-conflict-btn'>Close</button>
          </div>
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