import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import communicationService from '../../services/communicationService';
// import EmojiPicker from 'emoji-picker-react';
import './ChatInterface.css';

const ChatInterface = ({ isOpen, onClose, selectedChat, onChatSelect }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers] = useState(['user_guide_1', 'user_tourist_1']);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadChats = useCallback(() => {
    const userChats = communicationService.getUserChats(user.id);
    setChats(userChats);
  }, [user.id]);

  const handleNewMessage = useCallback((message) => {
    if (selectedChat && message.chatId === selectedChat.id) {
      setMessages(prev => [...prev, message]);
    }
    loadChats(); // Refresh chat list to update last message
  }, [selectedChat, loadChats]);

  const handleUserTyping = useCallback((data) => {
    if (data.chatId === selectedChat?.id && data.userId !== user.id) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  }, [selectedChat?.id, user.id]);

  useEffect(() => {
    if (isOpen && user) {
      // Connect to communication service
      communicationService.connect(user.id, user.userType);
      
      // Load user chats
      loadChats();

      // Listen for new messages
      communicationService.socket?.on('messageReceived', handleNewMessage);
      communicationService.socket?.on('userTyping', handleUserTyping);

      return () => {
        communicationService.socket?.off('messageReceived', handleNewMessage);
        communicationService.socket?.off('userTyping', handleUserTyping);
      };
    }
  }, [isOpen, user, handleNewMessage, handleUserTyping, loadChats]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      communicationService.markAsRead(selectedChat.id, user.id);
    }
  }, [selectedChat, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = (chatId) => {
    const chatMessages = communicationService.getChatHistory(chatId);
    setMessages(chatMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = communicationService.sendMessage(
      selectedChat.id,
      newMessage.trim(),
      'text'
    );

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojiPicker(false);
    loadChats(); // Refresh chat list
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedChat) {
      // Mock file upload
      const fileMessage = communicationService.sendMessage(
        selectedChat.id,
        `📁 ${file.name}`,
        'file'
      );
      setMessages(prev => [...prev, fileMessage]);
      loadChats();
    }
  };

  const startVideoCall = () => {
    if (selectedChat) {
      const call = communicationService.startVideoCall(
        selectedChat.id,
        selectedChat.participants
      );
      alert(`Video call started! Call ID: ${call.id}`);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const createNewChat = () => {
    // Mock creating new chat
    const newChat = communicationService.createChat(
      [user.id, 'user_guide_1'],
      'direct',
      'New Conversation'
    );
    setChats(prev => [newChat, ...prev]);
    onChatSelect(newChat);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-interface">
      <div className="chat-container">
        {/* Chat Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-header">
            <h3>Messages</h3>
            <div className="chat-actions">
              <button className="btn-new-chat" onClick={createNewChat}>
                ➕
              </button>
              <button className="btn-close" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>

          <div className="chat-search">
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="search-input"
            />
          </div>

          <div className="chat-list">
            {chats.map(chat => (
              <div 
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => onChatSelect(chat)}
              >
                <div className="chat-avatar">
                  <div className="avatar-circle">
                    {chat.type === 'group' ? '👥' : '👤'}
                  </div>
                  {chat.participants.some(p => isOnline(p)) && (
                    <div className="online-indicator"></div>
                  )}
                </div>
                <div className="chat-info">
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-preview">
                    {chat.lastMessage?.content || 'No messages yet'}
                  </div>
                </div>
                <div className="chat-meta">
                  <div className="chat-time">
                    {chat.lastMessage?.timestamp && formatTime(chat.lastMessage.timestamp)}
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="unread-badge">{chat.unreadCount}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Content */}
        <div className="chat-content">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="chat-content-header">
                <div className="chat-participant-info">
                  <div className="participant-avatar">
                    <div className="avatar-circle">👤</div>
                    {selectedChat.participants.some(p => isOnline(p)) && (
                      <div className="online-indicator"></div>
                    )}
                  </div>
                  <div className="participant-details">
                    <h4>{selectedChat.title}</h4>
                    <span className="participant-status">
                      {selectedChat.participants.some(p => isOnline(p)) ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="chat-tools">
                  <button className="tool-btn" onClick={startVideoCall}>
                    📹
                  </button>
                  <button className="tool-btn">
                    📞
                  </button>
                  <button className="tool-btn">
                    ℹ️
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-area">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-text">
                        {message.type === 'file' ? (
                          <div className="file-message">
                            <span className="file-icon">📁</span>
                            {message.content}
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className="message-meta">
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.senderId === user.id && (
                          <span className={`message-status ${message.status}`}>
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && '✓✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="typing-text">Someone is typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-area">
                <div className="input-tools">
                  <button 
                    className="tool-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎
                  </button>
                  <button 
                    className={`tool-btn ${showEmojiPicker ? 'active' : ''}`}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    😊
                  </button>
                </div>
                
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="message-input"
                  rows="1"
                />
                
                <button 
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  📤
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept="image/*,.pdf,.doc,.docx"
                />

                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <div className="simple-emoji-picker">
                      <div className="emoji-grid">
                        {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓'].map(emoji => (
                          <button
                            key={emoji}
                            className="emoji-btn"
                            onClick={() => handleEmojiClick(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <h3>Select a conversation</h3>
                <p>Choose from your existing conversations or start a new one</p>
                <button className="btn-primary" onClick={createNewChat}>
                  Start New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
