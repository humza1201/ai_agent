# AI Assistant Setup Guide

## 🚀 Quick Start

**Your RapidAPI ChatGPT is already configured and ready to use!**

1. **Open `index.html`** in your browser
2. **Click "Ask Anything"** to start the chat
3. **Start chatting** with your AI assistant!

*No additional setup needed - your API key is already configured!*

## ✅ Current Configuration

Your AI assistant is currently configured to use:
- **Provider**: FreeGPT (Free alternative)
- **Endpoint**: `https://api.freegpt.one/v1/chat/completions`
- **Status**: Ready to use! (No API key required)

## 🔑 Alternative API Provider Setup

If you want to switch to a different AI provider, here are the options:

### Option 1: OpenAI (Recommended)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. In `config.js`, set:
   ```javascript
   PROVIDER: 'openai',
   OPENAI: {
       API_KEY: 'your-actual-api-key-here',
       MODEL: 'gpt-3.5-turbo', // or 'gpt-4' for better responses
   }
   ```

### Option 2: Anthropic Claude
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account and get your API key
3. In `config.js`, set:
   ```javascript
   PROVIDER: 'anthropic',
   ANTHROPIC: {
       API_KEY: 'your-actual-api-key-here',
   }
   ```

### Option 3: Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. In `config.js`, set:
   ```javascript
   PROVIDER: 'google',
   GOOGLE: {
       API_KEY: 'your-actual-api-key-here',
   }
   ```

### Option 4: FreeGPT (Currently Configured - FREE!)
1. FreeGPT is already configured and ready to use!
2. **No API key required** - completely free!
3. The configuration in `config.js` is set to:
   ```javascript
   PROVIDER: 'freegpt',
   FREEGPT: {
       ENDPOINT: 'https://api.freegpt.one/v1/chat/completions'
   }
   ```
4. **No additional setup needed** - just open `index.html` and start chatting!

### Option 5: RapidAPI ChatGPT
1. Go to [RapidAPI ChatGPT](https://rapidapi.com/chatgpt-42/api/chatgpt-42)
2. **Subscribe to the API** (this is required!)
3. In `config.js`, set:
   ```javascript
   PROVIDER: 'rapidapi',
   RAPIDAPI: {
       API_KEY: 'your-rapidapi-key',
       HOST: 'chatgpt-42.p.rapidapi.com',
       ENDPOINT: 'https://chatgpt-42.p.rapidapi.com/aitohuman'
   }
   ```

### Option 6: Custom API
1. Set up your own AI API endpoint
2. In `config.js`, set:
   ```javascript
   PROVIDER: 'custom',
   CUSTOM: {
       ENDPOINT: 'https://your-api-endpoint.com/chat',
       API_KEY: 'your-api-key',
       HEADERS: {
           'Content-Type': 'application/json',
           'Authorization': 'Bearer your-api-key'
       }
   }
   ```

## ⚙️ Configuration Options

### Chat Settings
```javascript
CHAT: {
    MAX_HISTORY: 10, // Number of previous messages to include
    SYSTEM_PROMPT: "Your custom system prompt here",
    TYPING_DELAY: 1000, // Delay before showing typing indicator
    RESPONSE_DELAY: 500 // Additional delay for natural feel
}
```

### UI Settings
```javascript
UI: {
    SHOW_TYPING_INDICATOR: true,
    ENABLE_MESSAGE_ANIMATIONS: true,
    AUTO_SCROLL: true
}
```

## 🔒 Security Notes

- **Never commit API keys** to version control
- **Use environment variables** in production
- **Consider rate limiting** for public deployments
- **Monitor API usage** to avoid unexpected costs

## 🐛 Troubleshooting

### Common Issues

1. **"You are not subscribed to this API" (RapidAPI)**
   - **Solution**: Subscribe to the ChatGPT API on RapidAPI
   - **Alternative**: Switch to FreeGPT (already configured) by setting `PROVIDER: 'freegpt'` in config.js
   - **Link**: [Subscribe to RapidAPI ChatGPT](https://rapidapi.com/chatgpt-42/api/chatgpt-42)

2. **"API key not configured" error**
   - Make sure you've replaced the placeholder API key in `config.js`
   - Check that your API key is valid and active

3. **"API Error: 401"**
   - Your API key is invalid or expired
   - Check your API key in the provider's dashboard

4. **"API Error: 429"**
   - You've hit the rate limit
   - Wait a moment and try again

5. **"API Error: 500"**
   - Server error on the API provider's side
   - Try again in a few minutes

6. **CORS errors in browser**
   - Some APIs may not work directly from browser
   - Consider using a backend proxy or server

7. **FreeGPT not responding**
   - FreeGPT servers might be temporarily down
   - Try switching to a different provider
   - Check if the endpoint is accessible

8. **RapidAPI returns empty result `{"result":[],"status":true}`**
   - This means the API is working but returning empty responses
   - Could be due to rate limiting or API subscription issues
   - The assistant will provide fallback responses automatically
   - Consider switching to FreeGPT for more reliable responses

### Browser Console
Open your browser's developer tools (F12) and check the Console tab for detailed error messages.

## 💡 Tips

- **Start with GPT-3.5-turbo** for cost-effective testing
- **Use GPT-4** for better quality responses (higher cost)
- **Adjust temperature** in config for more/less creative responses
- **Monitor your usage** to avoid unexpected bills
- **Test with simple questions** first to verify setup

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Test your API key directly with the provider's documentation
4. Check your internet connection

## 🔄 Updates

To update the AI assistant:
1. Keep your `config.js` file with your API keys
2. Replace other files with new versions
3. Test the setup again

---

**Happy chatting with your AI assistant! 🤖✨**
