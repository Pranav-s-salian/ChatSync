import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CreateRoom() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [hostName, setHostName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('chatroom_username');
    if (savedName) {
      setHostName(savedName);
    }
  }, []);

  const handleCreateRoom = async () => {
    if (!hostName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/chatroom/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostName: hostName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setRoomCode(data.roomCode);
        localStorage.setItem('chatroom_username', hostName.trim());
      } else {
        setError(data.error || 'Failed to create room');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEnterRoom = () => {
    navigate(`/chat/${roomCode}`);
  };

  if (roomCode) {
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
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] mb-6">
                <Check className="w-8 h-8 text-[var(--text-primary)]" />
              </div>
              <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">Room created</h1>
              <p className="text-[var(--text-tertiary)]">Share this code with others to join</p>
            </div>

            <div className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-2xl p-8 mb-6">
              <p className="text-[var(--text-tertiary)] text-xs uppercase tracking-wider text-center mb-4">Room Code</p>
              <div className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] text-center tracking-[0.2em] mb-6">
                {roomCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:bg-[var(--bg-hover)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied to clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy code
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleEnterRoom}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[var(--accent-bg)] hover:opacity-90 rounded-xl text-[var(--accent-text)] font-medium transition-all duration-200"
            >
              Enter Room
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/"
              className="block text-center text-[var(--text-muted)] hover:text-[var(--text-tertiary)] transition-colors duration-200 mt-6 text-sm"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">Create room</h1>
            <p className="text-[var(--text-tertiary)]">Start a new conversation space</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[var(--text-tertiary)] text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-secondary)] focus:bg-[var(--bg-hover)] transition-all duration-200"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading || !hostName.trim()}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[var(--accent-bg)] hover:opacity-90 rounded-xl text-[var(--accent-text)] font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[var(--accent-text)]/20 border-t-[var(--accent-text)] rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Room
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
