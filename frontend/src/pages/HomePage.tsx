import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-300">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
          ) : (
            <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
          )}
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-2xl w-full">
          {/* Logo & Title */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-bg)] mb-8">
              <MessageSquare className="w-8 h-8 text-[var(--accent-text)]" strokeWidth={2} />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight">
              ChatSync
            </h1>
            <p className="text-[var(--text-tertiary)] text-lg font-light">
              Real-time conversations, beautifully simple
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/create')}
              className="group w-full flex items-center justify-between p-6 rounded-2xl border border-[var(--border-primary)] hover:border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-300"
            >
              <div className="text-left">
                <h2 className="text-xl font-medium text-[var(--text-primary)] mb-1">Create a room</h2>
                <p className="text-[var(--text-tertiary)] text-sm">Start a new conversation space</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--accent-bg)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-5 h-5 text-[var(--accent-text)]" />
              </div>
            </button>

            <button
              onClick={() => navigate('/join')}
              className="group w-full flex items-center justify-between p-6 rounded-2xl border border-[var(--border-primary)] hover:border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all duration-300"
            >
              <div className="text-left">
                <h2 className="text-xl font-medium text-[var(--text-primary)] mb-1">Join a room</h2>
                <p className="text-[var(--text-tertiary)] text-sm">Enter with a room code</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-[var(--border-secondary)] flex items-center justify-center group-hover:bg-[var(--accent-bg)] group-hover:border-[var(--accent-bg)] transition-all duration-300">
                <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent-text)] transition-colors duration-300" />
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-[var(--text-muted)] text-xs tracking-wider uppercase">
              Secure • Fast • Minimal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
