// src/services/communicationService.js

// Note: Socket.IO will be imported when real backend is implemented
// import io from 'socket.io-client';

class CommunicationService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
  }

  // Initialize connection (mock for now, real backend later)
  connect(userId, userType) {
    // Mock connection - in real implementation, connect to your socket server
    this.socket = {
      emit: (event, data) => console.log('Socket emit:', event, data),
      on: (event, callback) => {
        if (!this.eventListeners.has(event)) {
          this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
      },
      off: (event, callback) => {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
          const index = listeners.indexOf(callback);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
      },
      disconnect: () => {
        this.isConnected = false;
        console.log('Socket disconnected');
      }
    };

    this.isConnected = true;
    this.userId = userId;
    this.userType = userType;

    // Simulate connection events
    setTimeout(() => {
      this.simulateIncomingMessages();
    }, 2000);

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Send message
  sendMessage(chatId, message, messageType = 'text') {
    const messageData = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: this.userId,
      senderType: this.userType,
      content: message,
      type: messageType,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    // Save to localStorage (simulate database)
    this.saveMessage(messageData);

    // Emit to socket (mock)
    if (this.socket) {
      this.socket.emit('sendMessage', messageData);
    }

    // Simulate message delivery
    setTimeout(() => {
      messageData.status = 'delivered';
      this.updateMessageStatus(messageData.id, 'delivered');
    }, 1000);

    return messageData;
  }

  // Get chat history
  getChatHistory(chatId) {
    const allMessages = JSON.parse(localStorage.getItem('tourconnect_messages') || '[]');
    return allMessages.filter(msg => msg.chatId === chatId).sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  }

  // Get all chats for user
  getUserChats(userId) {
    const allChats = JSON.parse(localStorage.getItem('tourconnect_chats') || '[]');
    return allChats.filter(chat => 
      chat.participants.includes(userId)
    ).sort((a, b) => new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0));
  }

  // Create new chat
  createChat(participants, chatType = 'direct', title = null) {
    const chatId = `chat_${Date.now()}`;
    const chatData = {
      id: chatId,
      participants,
      type: chatType,
      title: title || this.generateChatTitle(participants),
      createdAt: new Date().toISOString(),
      lastMessage: null,
      unreadCount: 0
    };

    // Save to localStorage
    const allChats = JSON.parse(localStorage.getItem('tourconnect_chats') || '[]');
    allChats.push(chatData);
    localStorage.setItem('tourconnect_chats', JSON.stringify(allChats));

    return chatData;
  }

  // Mark messages as read
  markAsRead(chatId, userId) {
    const allChats = JSON.parse(localStorage.getItem('tourconnect_chats') || '[]');
    const chatIndex = allChats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex > -1) {
      allChats[chatIndex].unreadCount = 0;
      localStorage.setItem('tourconnect_chats', JSON.stringify(allChats));
    }

    // Update message read status
    const allMessages = JSON.parse(localStorage.getItem('tourconnect_messages') || '[]');
    const updatedMessages = allMessages.map(msg => {
      if (msg.chatId === chatId && msg.senderId !== userId) {
        return { ...msg, status: 'read' };
      }
      return msg;
    });
    localStorage.setItem('tourconnect_messages', JSON.stringify(updatedMessages));
  }

  // Start video call
  startVideoCall(chatId, participants) {
    const callData = {
      id: `call_${Date.now()}`,
      chatId,
      participants,
      type: 'video',
      status: 'calling',
      startedAt: new Date().toISOString(),
      initiator: this.userId
    };

    // Save call data
    const allCalls = JSON.parse(localStorage.getItem('tourconnect_calls') || '[]');
    allCalls.push(callData);
    localStorage.setItem('tourconnect_calls', JSON.stringify(allCalls));

    // Emit call event (mock)
    if (this.socket) {
      this.socket.emit('startCall', callData);
    }

    return callData;
  }

  // Send notification
  sendNotification(userId, notification) {
    const notificationData = {
      id: `notif_${Date.now()}`,
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      timestamp: new Date().toISOString(),
      read: false,
      data: notification.data || {}
    };

    // Save notification
    const allNotifications = JSON.parse(localStorage.getItem('tourconnect_notifications') || '[]');
    allNotifications.push(notificationData);
    localStorage.setItem('tourconnect_notifications', JSON.stringify(allNotifications));

    // Emit notification (mock)
    if (this.socket) {
      this.socket.emit('notification', notificationData);
    }

    return notificationData;
  }

  // Get user notifications
  getUserNotifications(userId) {
    const allNotifications = JSON.parse(localStorage.getItem('tourconnect_notifications') || '[]');
    return allNotifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Private helper methods
  saveMessage(messageData) {
    const allMessages = JSON.parse(localStorage.getItem('tourconnect_messages') || '[]');
    allMessages.push(messageData);
    localStorage.setItem('tourconnect_messages', JSON.stringify(allMessages));

    // Update chat with last message
    this.updateChatLastMessage(messageData.chatId, messageData);
  }

  updateChatLastMessage(chatId, message) {
    const allChats = JSON.parse(localStorage.getItem('tourconnect_chats') || '[]');
    const chatIndex = allChats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex > -1) {
      allChats[chatIndex].lastMessage = {
        content: message.content,
        timestamp: message.timestamp,
        senderId: message.senderId
      };
      localStorage.setItem('tourconnect_chats', JSON.stringify(allChats));
    }
  }

  updateMessageStatus(messageId, status) {
    const allMessages = JSON.parse(localStorage.getItem('tourconnect_messages') || '[]');
    const messageIndex = allMessages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex > -1) {
      allMessages[messageIndex].status = status;
      localStorage.setItem('tourconnect_messages', JSON.stringify(allMessages));
    }
  }

  generateChatTitle(participants) {
    // Simple title generation - in real app, fetch user names
    return `Chat with ${participants.length} participants`;
  }

  // Simulate incoming messages for demo
  simulateIncomingMessages() {
    const demoMessages = [
      {
        content: "Hi! I'm interested in your Ho Chi Minh City tour. Is it available for next weekend?",
        senderId: 'user_tourist_1',
        senderType: 'tourist'
      },
      {
        content: "Hello! Yes, the tour is available. What date specifically were you thinking?",
        senderId: 'user_guide_1',
        senderType: 'guide'
      }
    ];

    // Create demo chat if not exists
    const demoChat = this.createChat(['user_tourist_1', 'user_guide_1'], 'direct', 'Tour Inquiry');

    // Send demo messages with delay
    demoMessages.forEach((msg, index) => {
      setTimeout(() => {
        const messageData = {
          id: `demo_msg_${Date.now()}_${index}`,
          chatId: demoChat.id,
          senderId: msg.senderId,
          senderType: msg.senderType,
          content: msg.content,
          type: 'text',
          timestamp: new Date().toISOString(),
          status: 'delivered'
        };
        this.saveMessage(messageData);

        // Trigger message received event
        const listeners = this.eventListeners.get('messageReceived');
        if (listeners) {
          listeners.forEach(callback => callback(messageData));
        }
      }, (index + 1) * 3000);
    });
  }
}

// Create singleton instance
const communicationService = new CommunicationService();
export default communicationService;
