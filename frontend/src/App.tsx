import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Chatroom from './pages/Chatroom';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/chat/:roomCode" element={<Chatroom />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
