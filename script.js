
class AIAssistant {
    constructor() {
        this.isTyping = false;
        this.chatHistory = [];
        this.aiService = new AIService(CONFIG);
        this.initializeElements();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    initializeElements() {
        this.askButton = document.getElementById('askButton');
        this.closeChatButton = document.getElementById('closeChat');
        this.welcomeSection = document.getElementById('welcomeSection');
        this.chatSection = document.getElementById('chatSection');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
    }

    bindEvents() {
        // Ask button click
        this.askButton.addEventListener('click', () => {
            this.showChatInterface();
        });

        // Close chat button
        this.closeChatButton.addEventListener('click', () => {
            this.hideChatInterface();
        });

        // Send message on button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize input
        this.chatInput.addEventListener('input', () => {
            this.autoResizeInput();
        });

        // Focus input when chat opens
        this.chatInput.addEventListener('focus', () => {
            this.chatInput.parentElement.style.borderColor = '#667eea';
        });

        this.chatInput.addEventListener('blur', () => {
            this.chatInput.parentElement.style.borderColor = 'transparent';
        });
    }

    showChatInterface() {
        // Animate welcome section out
        this.welcomeSection.style.animation = 'fadeOut 0.3s ease-out forwards';
        
        setTimeout(() => {
            this.welcomeSection.style.display = 'none';
            this.chatSection.style.display = 'block';
            
            // Focus input after animation
            setTimeout(() => {
                this.chatInput.focus();
            }, 100);
        }, 300);
    }

    hideChatInterface() {
        // Animate chat section out
        this.chatSection.style.animation = 'fadeOut 0.3s ease-out forwards';
        
        setTimeout(() => {
            this.chatSection.style.display = 'none';
            this.welcomeSection.style.display = 'block';
            this.welcomeSection.style.animation = 'fadeInUp 0.5s ease-out forwards';
        }, 300);
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        
        this.chatInput.value = '';
        this.autoResizeInput();
        
        this.showTypingIndicator();
        
        try {
            const response = await this.aiService.sendMessage(message, this.chatHistory);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            
            if (error.message.includes('RapidAPI returned empty result')) {
                this.addMessage("I received your message but the AI service returned an empty response. This might be due to rate limiting or the API being temporarily unavailable. Let me try to help you with a basic response:", 'ai');
                
                setTimeout(() => {
                    const fallbackResponse = this.aiService.getFallbackResponse(message);
                    this.addMessage(fallbackResponse, 'ai');
                }, 1000);
            } else {
                this.addMessage("I'm sorry, I'm having trouble connecting to my AI service right now. Please check your internet connection and try again.", 'ai');
                
                const fallbackResponse = this.aiService.getFallbackResponse(message);
                if (fallbackResponse !== "I'm sorry, I'm having trouble connecting to my AI service at the moment. Please try again in a few moments, or check your internet connection.") {
                    setTimeout(() => {
                        this.addMessage(fallbackResponse, 'ai');
                    }, 1000);
                }
            }
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${this.escapeHtml(content)}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.chatHistory.push({ content, sender, timestamp: new Date() });
    }

    showTypingIndicator() {
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-message';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        typingContent.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    typeResponse(response) {
        let index = 0;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = '<p></p>';
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        
        const typeInterval = setInterval(() => {
            if (index < response.length) {
                messageContent.querySelector('p').textContent += response[index];
                index++;
                this.scrollToBottom();
            } else {
                clearInterval(typeInterval);
                this.chatHistory.push({ content: response, sender: 'ai', timestamp: new Date() });
            }
        }, 30); // Type 30 characters per second
    }

    autoResizeInput() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addWelcomeMessage() {
        setTimeout(() => {
            if (this.chatHistory.length === 0) {
            }
        }, 1000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
    
    const askButton = document.getElementById('askButton');
    

    askButton.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ask-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
