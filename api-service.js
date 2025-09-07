// AI API Service Module
class AIService {
    constructor(config) {
        this.config = config;
        this.provider = config.API.PROVIDER;
    }

    async sendMessage(message, chatHistory = []) {
        try {
            switch (this.provider) {
                case 'openai':
                    return await this.callOpenAI(message, chatHistory);
                case 'anthropic':
                    return await this.callAnthropic(message, chatHistory);
                case 'google':
                    return await this.callGoogle(message, chatHistory);
                case 'rapidapi':
                    return await this.callRapidAPI(message, chatHistory);
                case 'freegpt':
                    return await this.callFreeGPT(message, chatHistory);
                case 'huggingface':
                    return await this.callHuggingFace(message, chatHistory);
                case 'alternative':
                    return await this.callAlternative(message, chatHistory);
                case 'local':
                    return await this.callLocalAI(message, chatHistory);
                case 'custom':
                    return await this.callCustomAPI(message, chatHistory);
                default:
                    throw new Error(`Unsupported API provider: ${this.provider}`);
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async callOpenAI(message, chatHistory) {
        const apiKey = this.config.API.OPENAI.API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
            throw new Error('OpenAI API key not configured. Please add your API key to config.js');
        }

        // Prepare messages for OpenAI format
        const messages = [
            { role: 'system', content: this.config.CHAT.SYSTEM_PROMPT }
        ];

        // Add recent chat history
        const recentHistory = chatHistory.slice(-this.config.CHAT.MAX_HISTORY);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });

        // Add current message
        messages.push({ role: 'user', content: message });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: this.config.API.OPENAI.MODEL,
                messages: messages,
                max_tokens: this.config.API.OPENAI.MAX_TOKENS,
                temperature: this.config.API.OPENAI.TEMPERATURE,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    async callAnthropic(message, chatHistory) {
        const apiKey = this.config.API.ANTHROPIC.API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_ANTHROPIC_API_KEY_HERE') {
            throw new Error('Anthropic API key not configured. Please add your API key to config.js');
        }

        // Prepare messages for Anthropic format
        const messages = [];
        
        // Add recent chat history
        const recentHistory = chatHistory.slice(-this.config.CHAT.MAX_HISTORY);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });

        // Add current message
        messages.push({ role: 'user', content: message });

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.config.API.ANTHROPIC.MODEL,
                max_tokens: this.config.API.ANTHROPIC.MAX_TOKENS,
                system: this.config.CHAT.SYSTEM_PROMPT,
                messages: messages
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Anthropic API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text.trim();
    }

    async callGoogle(message, chatHistory) {
        const apiKey = this.config.API.GOOGLE.API_KEY;
        
        if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
            throw new Error('Google API key not configured. Please add your API key to config.js');
        }

        // Prepare context from chat history
        let context = this.config.CHAT.SYSTEM_PROMPT + '\n\n';
        const recentHistory = chatHistory.slice(-this.config.CHAT.MAX_HISTORY);
        
        recentHistory.forEach(msg => {
            context += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        
        context += `User: ${message}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.API.GOOGLE.MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: context
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: this.config.API.GOOGLE.MAX_TOKENS,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Google API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }

    async callRapidAPI(message, chatHistory) {
        const apiKey = this.config.API.RAPIDAPI.API_KEY;
        const endpoint = this.config.API.RAPIDAPI.ENDPOINT;
        const headers = this.config.API.RAPIDAPI.HEADERS;
        const parameters = this.config.API.RAPIDAPI.PARAMETERS;
        
        if (!apiKey || apiKey === 'YOUR_RAPIDAPI_KEY_HERE') {
            throw new Error('RapidAPI key not configured. Please add your API key to config.js');
        }

        // Prepare messages array with chat history
        const messages = [];
        
        // Add recent chat history
        const recentHistory = chatHistory.slice(-this.config.CHAT.MAX_HISTORY);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });
        
        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        // Prepare the request body with the new format
        const requestBody = {
            messages: messages,
            system_prompt: this.config.CHAT.SYSTEM_PROMPT,
            temperature: parameters.temperature,
            top_k: parameters.top_k,
            top_p: parameters.top_p,
            image: '',
            max_tokens: parameters.max_tokens
        };

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === this.DONE) {
                    try {
                        if (this.status === 200) {
                            const response = JSON.parse(this.responseText);
                            
                            // Handle the response format
                            if (response.choices && response.choices.length > 0) {
                                resolve(response.choices[0].message.content.trim());
                            } else if (response.content) {
                                resolve(response.content.trim());
                            } else if (response.text) {
                                resolve(response.text.trim());
                            } else if (response.result) {
                                resolve(response.result.trim());
                            } else {
                                reject(new Error('Unexpected response format from RapidAPI'));
                            }
                        } else {
                            const errorText = this.responseText || 'Unknown error';
                            
                            // Handle specific RapidAPI subscription error
                            if (this.status === 403 && errorText.includes('not subscribed')) {
                                reject(new Error('RapidAPI Subscription Required: You need to subscribe to the ChatGPT API on RapidAPI. Please visit https://rapidapi.com/chatgpt-42/api/chatgpt-42 to subscribe, or switch to a different provider in config.js'));
                            } else {
                                reject(new Error(`RapidAPI Error: ${this.status} - ${errorText}`));
                            }
                        }
                    } catch (parseError) {
                        reject(new Error(`Failed to parse RapidAPI response: ${parseError.message}`));
                    }
                }
            });

            xhr.open('POST', endpoint);
            xhr.setRequestHeader('x-rapidapi-key', headers['x-rapidapi-key']);
            xhr.setRequestHeader('x-rapidapi-host', headers['x-rapidapi-host']);
            xhr.setRequestHeader('Content-Type', headers['Content-Type']);

            xhr.send(JSON.stringify(requestBody));
        });
    }

    async callFreeGPT(message, chatHistory) {
        const endpoint = this.config.API.FREEGPT.ENDPOINT;
        const headers = this.config.API.FREEGPT.HEADERS;

        // Prepare messages for OpenAI-compatible format
        const messages = [
            { role: 'system', content: this.config.CHAT.SYSTEM_PROMPT }
        ];

        // Add recent chat history
        const recentHistory = chatHistory.slice(-this.config.CHAT.MAX_HISTORY);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });

        // Add current message
        messages.push({ role: 'user', content: message });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`FreeGPT API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    async callHuggingFace(message, chatHistory) {
        const endpoint = this.config.API.HUGGINGFACE.ENDPOINT;
        const headers = this.config.API.HUGGINGFACE.HEADERS;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                inputs: message,
                parameters: {
                    max_length: 100,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Hugging Face API Error: ${response.status} - ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        return data[0].generated_text || data.generated_text || 'No response generated';
    }

    async callAlternative(message, chatHistory) {
        const endpoint = this.config.API.ALTERNATIVE.ENDPOINT;
        const headers = this.config.API.ALTERNATIVE.HEADERS;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                text: message
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Alternative API Error: ${response.status} - ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        return data.output || data.text || 'No response generated';
    }

    async callLocalAI(message, chatHistory) {
        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, this.config.API.LOCAL.RESPONSE_DELAY));
        
        // Generate intelligent responses based on the message
        return this.generateIntelligentResponse(message, chatHistory);
    }

    generateIntelligentResponse(message, chatHistory) {
        const msg = message.toLowerCase().trim();
        
        // Time-related questions
        if (msg.includes('time') || msg.includes('what time') || msg.includes('current time')) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. Is there anything specific you'd like to know about time or scheduling?`;
        }
        
        // Date questions
        if (msg.includes('date') || msg.includes('today') || msg.includes('what date')) {
            const now = new Date();
            return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. How can I help you with date-related questions?`;
        }
        
        // Greetings
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good afternoon') || msg.includes('good evening')) {
            const greetings = [
                "Hello! It's great to meet you! I'm here to help with any questions or tasks you might have. What can I assist you with today?",
                "Hi there! I'm excited to help you with whatever you need. How can I make your day better?",
                "Hey! Welcome! I'm your AI assistant and I'm ready to help. What would you like to know or do?",
                "Good day! I'm here and ready to assist you. What can I help you with today?",
                "Hello! I'm doing well, thank you for asking! I'm here to help with any questions or tasks. How can I assist you?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // How are you questions
        if (msg.includes('how are you') || msg.includes('how do you feel') || msg.includes('how\'s it going')) {
            const responses = [
                "I'm doing fantastic! I love helping people and having conversations. How are you doing today?",
                "I'm wonderful! Being helpful and engaging in conversations makes me happy. What about you?",
                "I'm great, thank you for asking! I'm always excited to help and learn. How's your day going?",
                "I'm doing excellent! I enjoy chatting and helping with various tasks. How can I assist you today?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Weather questions
        if (msg.includes('weather') || msg.includes('temperature') || msg.includes('rain') || msg.includes('sunny')) {
            return "I don't have access to real-time weather data, but I can help you understand weather patterns, suggest weather apps, or discuss climate topics. For current weather, I'd recommend checking a reliable weather service or app.";
        }
        
        // Help questions
        if (msg.includes('help') || msg.includes('assist') || msg.includes('what can you do')) {
            return "I can help with a wide range of tasks! I can answer questions, provide explanations, help with creative writing, solve problems, discuss various topics, and engage in meaningful conversations. I can also help with time/date questions, general knowledge, and much more. What interests you most?";
        }
        
        // Thank you responses
        if (msg.includes('thank') || msg.includes('thanks')) {
            const thanks = [
                "You're very welcome! I'm always happy to help. Is there anything else you'd like to know?",
                "My pleasure! That's what I'm here for. Feel free to ask me anything else!",
                "You're welcome! I enjoy helping out. What else can I assist you with today?",
                "Happy to help! I'm here whenever you need assistance. What else can I do for you?"
            ];
            return thanks[Math.floor(Math.random() * thanks.length)];
        }
        
        // Math questions
        if (msg.includes('calculate') || msg.includes('math') || msg.includes('+') || msg.includes('-') || msg.includes('*') || msg.includes('/')) {
            return "I can help with mathematical calculations and concepts! Please provide the specific numbers and operation you'd like me to help with, and I'll do my best to assist you.";
        }
        
      
        if (msg.includes('code') || msg.includes('programming') || msg.includes('javascript') || msg.includes('python') || msg.includes('html') || msg.includes('css')) {
            return "I'd be happy to help with programming questions! I can assist with code explanations, debugging, best practices, and various programming languages. What specific programming topic would you like to explore?";
        }
        
      
        if (msg.includes('story') || msg.includes('write') || msg.includes('creative') || msg.includes('poem')) {
            return "I love creative writing! I can help you with stories, poems, creative prompts, character development, plot ideas, and various writing techniques. What kind of creative writing would you like to work on?";
        }
        
        if (msg.includes('science') || msg.includes('physics') || msg.includes('chemistry') || msg.includes('biology')) {
            return "I enjoy discussing scientific topics! I can help explain scientific concepts, discuss theories, and explore various fields of science. What scientific topic would you like to learn about?";
        }
   
        if (msg.includes('history') || msg.includes('historical') || msg.includes('past')) {
            return "History is fascinating! I can help discuss historical events, figures, periods, and their significance. What historical topic interests you?";
        }
        
     
        if (msg.includes('technology') || msg.includes('tech') || msg.includes('computer') || msg.includes('ai') || msg.includes('artificial intelligence')) {
            return "Technology is an exciting field! I can help discuss various tech topics, explain concepts, and explore the latest developments. What aspect of technology would you like to explore?";
        }
        
    
        const defaultResponses = [
            "That's an interesting question! I'd be happy to help you with that. Could you provide a bit more detail so I can give you the best possible answer?",
            "I understand what you're asking about. Let me think about the best way to help you with this topic.",
            "Great question! I'm here to help you explore this topic. What specific aspect would you like to focus on?",
            "I'd love to help you with that! Could you tell me more about what you're looking for?",
            "That sounds like something I can definitely help with! What would you like to know more about?",
            "Interesting topic! I'm ready to dive into this with you. What's your main question or goal?",
            "I'm here to help with that! Could you provide more context so I can give you a more detailed and helpful response?",
            "That's a great question! I'd be happy to assist you. What specific information are you looking for?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    async callCustomAPI(message, chatHistory) {
        const endpoint = this.config.API.CUSTOM.ENDPOINT;
        const headers = this.config.API.CUSTOM.HEADERS;
        
        if (!endpoint || endpoint === 'YOUR_CUSTOM_API_ENDPOINT') {
            throw new Error('Custom API endpoint not configured. Please add your endpoint to config.js');
        }

        const payload = {
            message: message,
            chatHistory: chatHistory.slice(-this.config.CHAT.MAX_HISTORY),
            systemPrompt: this.config.CHAT.SYSTEM_PROMPT
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Custom API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.response || data.message || data.text || 'No response received';
    }

    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! I'm having trouble connecting to my AI service right now, but I'm still here to help! How can I assist you?";
        }
        
        if (message.includes('help')) {
            return "I'm experiencing some technical difficulties with my AI service, but I can still try to help! What do you need assistance with?";
        }
        
        return "I'm sorry, I'm having trouble connecting to my AI service at the moment. Please try again in a few moments, or check your internet connection.";
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
}