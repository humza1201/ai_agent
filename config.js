// AI Assistant Configuration
const CONFIG = {
    // API Configuration
    API: {
        // Choose your preferred API service
        PROVIDER: 'rapidapi', // Options: 'openai', 'anthropic', 'google', 'rapidapi', 'freegpt', 'huggingface', 'alternative', 'local', 'custom'
        
        // OpenAI Configuration
        OPENAI: {
            API_KEY: 'YOUR_OPENAI_API_KEY_HERE', // Replace with your actual API key
            MODEL: 'gpt-3.5-turbo', // or 'gpt-4' for better responses
            MAX_TOKENS: 500,
            TEMPERATURE: 0.7
        },
        
        // Anthropic Claude Configuration
        ANTHROPIC: {
            API_KEY: 'YOUR_ANTHROPIC_API_KEY_HERE',
            MODEL: 'claude-3-sonnet-20240229',
            MAX_TOKENS: 500
        },
        
        // Google Gemini Configuration
        GOOGLE: {
            API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
            MODEL: 'gemini-pro',
            MAX_TOKENS: 500
        },
        
        // RapidAPI ChatGPT Configuration (Advanced)
        RAPIDAPI: {
            API_KEY: 'b977700d16msheab3b2e8d5b183cp12fd86jsn3f3d8b5fd34f',
            HOST: 'chatgpt-42.p.rapidapi.com',
            ENDPOINT: 'https://chatgpt-42.p.rapidapi.com/matag2',
            HEADERS: {
                'x-rapidapi-key': 'b977700d16msheab3b2e8d5b183cp12fd86jsn3f3d8b5fd34f',
                'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            PARAMETERS: {
                temperature: 0.9,
                top_k: 5,
                top_p: 0.9,
                max_tokens: 256
            }
        },
        
        // FreeGPT Configuration (No API key required)
        FREEGPT: {
            ENDPOINT: 'https://api.freegpt.one/v1/chat/completions',
            HEADERS: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        },
        
        // Hugging Face Free AI (CORS-friendly)
        HUGGINGFACE: {
            ENDPOINT: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
            HEADERS: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hf_your_token_here' // Optional, works without token too
            }
        },
        
        // Alternative Free AI (CORS-friendly)
        ALTERNATIVE: {
            ENDPOINT: 'https://api.deepai.org/api/text-generator',
            HEADERS: {
                'Content-Type': 'application/json',
                'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' // Free tier key
            }
        },
        
        // Local AI (No external API calls, works offline)
        LOCAL: {
            ENABLED: true,
            RESPONSE_DELAY: 1000 // Simulate AI thinking time
        },
        
        // Custom API Configuration
        CUSTOM: {
            ENDPOINT: 'YOUR_CUSTOM_API_ENDPOINT',
            API_KEY: 'YOUR_CUSTOM_API_KEY',
            HEADERS: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_CUSTOM_API_KEY'
            }
        }
    },
    
    // Chat Configuration
    CHAT: {
        MAX_HISTORY: 10, // Number of previous messages to include in context
        SYSTEM_PROMPT: "You are a helpful AI assistant. Be friendly, informative, and concise in your responses. Keep responses under 200 words unless specifically asked for more detail.",
        TYPING_DELAY: 1000, // Minimum delay before showing typing indicator (ms)
        RESPONSE_DELAY: 500 // Additional delay for natural feel (ms)
    },
    
    // UI Configuration
    UI: {
        SHOW_TYPING_INDICATOR: true,
        ENABLE_MESSAGE_ANIMATIONS: true,
        AUTO_SCROLL: true
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
