import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, LogOut, Send, Users, CheckCircle, Sun, Moon } from 'lucide-react';
import SockJS from 'sockjs-client';
import { Stomp, Client } from '@stomp/stompjs';
import { useTheme } from '../context/ThemeContext';

interface Message {
  username: string | { username: string; sessionId?: string };
  content: string | unknown;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
  timestamp: string;
}

interface User {
  username: string;
  online: boolean;
}

export default function Chatroom() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedName = localStorage.getItem('chatroom_username');
    if (!savedName || !roomCode) {
      navigate('/');
      return;
    }
    setUsername(savedName);

    let isSubscribed = true;
    let client: Client | null = null;

    const fetchRoomDetails = async () => {
      if (!isSubscribed) return;
      try {
        const response = await fetch(`http://localhost:8080/api/chatroom/${roomCode}`);
        if (response.ok && isSubscribed) {
          const data = await response.json();
          setUserCount(data.userCount || 0);
          if (data.users) {
            setUsers(data.users.map((u: string | { username: string; sessionId?: string }) => ({
              username: typeof u === 'string' ? u : u.username,
              online: true
            })));
          }
        }
      } catch (err) {
        console.error('Failed to fetch room details:', err);
      }
    };

    fetchRoomDetails();

    const socket = new SockJS('http://localhost:8080/ws');
    client = Stomp.over(socket);
    client.debug = () => {}; // Disable debug logs

    client.connect(
      {},
      () => {
        if (!isSubscribed || !client) {
          client?.disconnect();
          return;
        }
        
        setConnected(true);
        setLoading(false);

        client.subscribe(`/topic/chatroom/${roomCode}`, (message) => {
          if (!isSubscribed) return;
          const receivedMessage: Message = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);

          if (receivedMessage.type === 'JOIN' || receivedMessage.type === 'LEAVE') {
            fetchRoomDetails();
          }
        });

        client.send(
          `/app/chat.addUser/${roomCode}`,
          {},
          JSON.stringify({
            username: savedName,
            type: 'JOIN',
          })
        );
        
        stompClientRef.current = client;
      },
      (error: unknown) => {
        console.error('Connection error:', error);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    );

    return () => {
      isSubscribed = false;
      if (client && client.connected) {
        client.send(
          `/app/chat.sendMessage/${roomCode}`,
          {},
          JSON.stringify({
            username: savedName,
            type: 'LEAVE',
          })
        );
        client.disconnect();
      }
      stompClientRef.current = null;
    };
  }, [roomCode, navigate]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !stompClientRef.current || !connected) return;

    stompClientRef.current.send(
      `/app/chat.sendMessage/${roomCode}`,
      {},
      JSON.stringify({
        username,
        content: messageInput.trim(),
        type: 'CHAT',
      })
    );

    setMessageInput('');
  };

  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[var(--border-primary)] border-t-[var(--text-primary)] rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[var(--text-tertiary)] text-sm font-medium tracking-wide">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-[var(--border-primary)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]">
                <span className="text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wider">Room</span>
                <span className="text-[var(--text-primary)] font-semibold tracking-wider">{roomCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200 group"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">{userCount} online</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[var(--text-tertiary)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--text-tertiary)]" />
              )}
            </button>
            <button
              onClick={handleLeaveRoom}
              className="flex items-center gap-2 px-4 py-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border-primary)] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-[var(--text-tertiary)]" />
            <h3 className="text-[var(--text-tertiary)] text-xs font-semibold uppercase tracking-wider">
              Participants
            </h3>
          </div>
          <div className="space-y-1 flex-1 overflow-y-auto">
            {users.length > 0 ? (
              users.map((user, index) => {
                const displayName = typeof user.username === 'string'
                  ? user.username
                  : (user.username as { username: string })?.username ?? 'Unknown';
                const isYou = displayName === username;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isYou ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] flex items-center justify-center">
                      <span className="text-[var(--text-secondary)] text-sm font-medium">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[var(--text-secondary)] text-sm font-medium truncate block">
                        {displayName}
                      </span>
                      {isYou && (
                        <span className="text-[var(--text-muted)] text-xs">You</span>
                      )}
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                );
              })
            ) : (
              <p className="text-[var(--text-muted)] text-sm px-3">No users online</p>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-muted)] text-sm font-medium">No messages yet</p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">Start the conversation</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
                const senderName =
                  typeof message.username === 'string'
                    ? message.username
                    : message.username?.username ?? 'Unknown';

                if (message.type === 'JOIN' || message.type === 'LEAVE') {
                  return (
                    <div key={index} className="flex justify-center animate-fade-in">
                      <div className="px-4 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                        <p className="text-[var(--text-tertiary)] text-xs font-medium">
                          {senderName} {message.type === 'JOIN' ? 'joined' : 'left'}
                        </p>
                      </div>
                    </div>
                  );
                }

                const isOwnMessage = senderName === username;
                const contentText =
                  typeof message.content === 'string'
                    ? message.content
                    : JSON.stringify(message.content ?? '');

                return (
                  <div
                    key={index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  >
                    <div className={`flex gap-3 max-w-[75%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                      {!isOwnMessage && (
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] flex items-center justify-center flex-shrink-0">
                          <span className="text-[var(--text-secondary)] text-xs font-medium">
                            {senderName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        {!isOwnMessage && (
                          <p className="text-[var(--text-tertiary)] text-xs font-medium mb-1 ml-1">{senderName}</p>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
                            isOwnMessage
                              ? 'bg-[var(--message-own-bg)] text-[var(--message-own-text)] rounded-br-md'
                              : 'bg-[var(--message-other-bg)] text-[var(--message-other-text)] border border-[var(--border-primary)] rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">{contentText}</p>
                        </div>
                        <p className={`text-[var(--text-muted)] text-[10px] mt-1 ${isOwnMessage ? 'text-right mr-1' : 'ml-1'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[var(--border-primary)]">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-secondary)] focus:bg-[var(--bg-hover)] transition-all duration-200"
                  disabled={!connected}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!connected || !messageInput.trim()}
                className="p-3 bg-[var(--accent-bg)] text-[var(--accent-text)] rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
