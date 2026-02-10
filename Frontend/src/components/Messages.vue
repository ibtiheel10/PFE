<template>
  <div class="messages-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Messages</h2>
        <button class="new-msg-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
      </div>
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Rechercher..." v-model="searchQuery">
      </div>
      
      <div class="conversations-list">
        <div 
          v-for="conv in filteredConversations" 
          :key="conv.id" 
          class="conversation-item"
          :class="{ active: activeConvId === conv.id }"
          @click="activeConvId = conv.id"
        >
          <div class="avatar-wrapper">
            <img :src="conv.avatar" alt="" class="avatar">
            <span v-if="conv.online" class="online-dot"></span>
          </div>
          <div class="conv-info">
            <div class="conv-top">
              <span class="conv-name">{{ conv.name }}</span>
              <span class="conv-time">{{ conv.time }}</span>
            </div>
            <p class="conv-preview" :class="{ unread: conv.unread }">{{ conv.lastMessage }}</p>
          </div>
          <div v-if="conv.unreadCount" class="unread-badge">{{ conv.unreadCount }}</div>
        </div>
      </div>
    </div>

    <div class="chat-area">
      <div v-if="activeConversation" class="chat-header">
        <div class="header-user">
          <img :src="activeConversation.avatar" alt="" class="header-avatar">
          <div>
            <h3>{{ activeConversation.name }}</h3>
            <span class="status-text">{{ activeConversation.online ? 'En ligne' : 'Hors ligne' }}</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </button>
          <button class="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
          </button>
        </div>
      </div>

      <div v-if="activeConversation" class="messages-list">
        <div class="date-divider"><span>Aujourd'hui</span></div>
        <div 
          v-for="(msg, index) in currentMessages" 
          :key="index"
          class="message-bubble"
          :class="{ 'sent': msg.isMe, 'received': !msg.isMe }"
        >
          <div class="msg-content">
            {{ msg.text }}
            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeConversation" class="chat-input-area">
        <button class="attach-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
        </button>
        <input 
          type="text" 
          v-model="newMessage" 
          placeholder="Écrivez votre message..." 
          @keyup.enter="sendMessage"
        >
        <button class="send-btn" @click="sendMessage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>

      <div v-else class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3>Vos Messages</h3>
          <p>Sélectionnez une conversation pour commencer à discuter avec des recruteurs ou des candidats.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Message {
  text: string;
  time: string;
  isMe: boolean;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  unreadCount?: number;
  online: boolean;
  messages: Message[];
}

const searchQuery = ref('');
const activeConvId = ref<number | null>(1);
const newMessage = ref('');

const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: 'Sophie Martin (RH)',
    avatar: 'https://i.pravatar.cc/150?u=sophie',
    lastMessage: 'Bonjour, êtes-vous disponible demain pour un entretien ?',
    time: '10:30',
    unread: true,
    unreadCount: 2,
    online: true,
    messages: [
      { text: "Bonjour, j'ai bien reçu votre candidature pour le poste de Développeur Vue.js.", time: "10:00", isMe: false },
      { text: "Bonjour Sophie, merci pour votre retour rapide !", time: "10:15", isMe: true },
      { text: "Bonjour, êtes-vous disponible demain pour un entretien ?", time: "10:30", isMe: false }
    ]
  },
  {
    id: 2,
    name: 'Tech Corp Recrutement',
    avatar: 'https://i.pravatar.cc/150?u=tech',
    lastMessage: 'Merci pour votre test technique.',
    time: 'Hier',
    unread: false,
    online: false,
    messages: [
      { text: "Nous avons bien reçu vos résultats.", time: "Hier", isMe: false },
      { text: "Merci pour votre test technique.", time: "Hier", isMe: false }
    ]
  },
  {
    id: 3,
    name: 'Jean Dupont',
    avatar: 'https://i.pravatar.cc/150?u=jean',
    lastMessage: 'Le poste est basé à Paris ?',
    time: 'Lun',
    unread: false,
    online: true,
    messages: [
      { text: "Le poste est basé à Paris ?", time: "Lun", isMe: false }
    ]
  }
]);

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;
  return conversations.value.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const activeConversation = computed(() => {
  return conversations.value.find(c => c.id === activeConvId.value);
});

const currentMessages = computed(() => activeConversation.value?.messages || []);

const sendMessage = () => {
  if (!newMessage.value.trim() || !activeConversation.value) return;
  
  activeConversation.value.messages.push({
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMe: true
  });
  
  newMessage.value = '';
  
  // Simulate reply
  setTimeout(() => {
    if (activeConversation.value) {
        activeConversation.value.messages.push({
            text: "Ceci est une réponse automatique de démonstration.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
        });
    }
  }, 2000);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.messages-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #F9FAFB;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.new-msg-btn {
  background: #EFF6FF;
  color: #2563EB;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.new-msg-btn:hover {
  background: #2563EB;
  color: white;
}

.search-box {
  margin: 0 1.5rem 1rem;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.25rem;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
}

.search-box input:focus {
  outline: 2px solid #2563EB;
  background: white;
}

.search-box svg {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}

.conversation-item:hover {
  background: #F9FAFB;
}

.conversation-item.active {
  background: #EFF6FF;
}

.conversation-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #2563EB;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #10B981;
  border: 2px solid white;
  border-radius: 50%;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.conv-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

.conv-time {
  font-size: 0.75rem;
  color: #9CA3AF;
}

.conv-preview {
  margin: 0;
  font-size: 0.85rem;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-preview.unread {
  color: #111827;
  font-weight: 600;
}

.unread-badge {
  background: #2563EB;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  height: 18px;
  min-width: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* Chat Area */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
}

.chat-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.header-user h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.status-text {
  font-size: 0.8rem;
  color: #10B981;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  color: #6B7280;
  cursor: pointer;
  border-radius: 6px;
}

.icon-btn:hover {
  background: #F3F4F6;
  color: #111827;
}

.messages-list {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #F9FAFB;
}

.date-divider {
  text-align: center;
  margin: 1rem 0;
  position: relative;
}

.date-divider span {
  background: #E5E7EB;
  color: #6B7280;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.message-bubble {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.message-bubble.sent {
  align-self: flex-end;
  align-items: flex-end;
}

.message-bubble.received {
  align-self: flex-start;
  align-items: flex-start;
}

.msg-content {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.95rem;
  position: relative;
  line-height: 1.5;
}

.sent .msg-content {
  background: #2563EB;
  color: white;
  border-bottom-right-radius: 2px;
}

.received .msg-content {
  background: white;
  border: 1px solid #E5E7EB;
  color: #1F2937;
  border-bottom-left-radius: 2px;
}

.msg-time {
  font-size: 0.65rem;
  margin-top: 0.25rem;
  opacity: 0.7;
  display: block;
  text-align: right;
}

.sent .msg-time { color: rgba(255, 255, 255, 0.9); }
.received .msg-time { color: #9CA3AF; }

.chat-input-area {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #E5E7EB;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.chat-input-area input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
}

.chat-input-area input:focus {
  outline: none;
  border-color: #2563EB;
}

.attach-btn, .send-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.attach-btn {
  background: #F3F4F6;
  color: #6B7280;
}

.attach-btn:hover {
  background: #E5E7EB;
}

.send-btn {
  background: #2563EB;
  color: white;
}

.send-btn:hover {
  background: #1D4ED8;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFBFC;
}

.empty-content {
  text-align: center;
  max-width: 400px;
  color: #6B7280;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #EFF6FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #2563EB;
}

.empty-content h3 {
  color: #111827;
  margin-bottom: 0.5rem;
}
</style>
