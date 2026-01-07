import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function JoinRoom() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('chatroom_username');
    if (savedName) {
      setUsername(savedName);
    }
  }, []);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/chatroom/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode: roomCode.trim().toUpperCase(),
          username: username.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('chatroom_username', username.trim());
        navigate(`/chat/${roomCode.trim().toUpperCase()}`);
      } else {
        setError(data.error || 'Failed to join room');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-300">
      <div className="fixed inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
          ) : (
            <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
          )}
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] mb-12 transition-colors duration-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">Join room</h1>
            <p className="text-[var(--text-tertiary)]">Enter a room code to join the conversation</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[var(--text-tertiary)] text-sm font-medium mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                className="w-full px-4 py-3.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] text-center placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-secondary)] focus:bg-[var(--bg-hover)] transition-all duration-200 uppercase tracking-[0.3em] text-xl font-medium"
                disabled={loading}
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-[var(--text-tertiary)] text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-secondary)] focus:bg-[var(--bg-hover)] transition-all duration-200"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={loading || !roomCode.trim() || !username.trim()}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[var(--accent-bg)] hover:opacity-90 rounded-xl text-[var(--accent-text)] font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[var(--accent-text)]/20 border-t-[var(--accent-text)] rounded-full animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Room
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
