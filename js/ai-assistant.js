// client/js/ai-assistant.js - AI Chat Assistant

// AI Assistant configuration
const AI_CONFIG = {
    enabled: true,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150
};

// Initialize AI assistant
document.addEventListener('DOMContentLoaded', function() {
    addAIAssistant();
});

// Add AI assistant to page
function addAIAssistant() {
    // Only add on relevant pages
    const currentPath = window.location.pathname;
    if (!currentPath.includes('dashboard/mother')) {
        return;
    }

    const chatHTML = `
        <div id="aiAssistant" style="position:fixed; bottom:20px; right:20px; z-index:1000;">
            <div id="chatButton" onclick="toggleChat()" style="background:linear-gradient(135deg, #0d9488, #0f766e); color:white; width:60px; height:60px; border-radius:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 4px 15px rgba(13,148,136,0.3);">
                <span style="font-size:24px;">🤖</span>
            </div>
            
            <div id="chatWindow" style="display:none; position:absolute; bottom:80px; right:0; width:350px; background:white; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.2); overflow:hidden;">
                <div style="background:linear-gradient(135deg, #0d9488, #0f766e); color:white; padding:15px; display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>🌸 MamaCare Assistant</strong></span>
                    <button onclick="toggleChat()" style="background:transparent; border:none; color:white; font-size:20px; cursor:pointer;">✕</button>
                </div>
                
                <div id="chatMessages" style="height:300px; overflow-y:auto; padding:15px; background:#f8fafc;">
                    <div style="background:white; padding:10px; border-radius:15px; margin-bottom:10px; max-width:80%;">
                        Hello! I'm your MamaCare assistant. How can I help you today?
                    </div>
                </div>
                
                <div style="padding:15px; border-top:1px solid #e2e8f0; display:flex; gap:10px;">
                    <input type="text" id="chatInput" placeholder="Type your question..." style="flex:1; padding:10px; border:2px solid #e2e8f0; border-radius:10px; outline:none;">
                    <button onclick="sendMessage()" style="background:#0d9488; color:white; border:none; width:40px; height:40px; border-radius:20px; cursor:pointer;">➤</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
}

// Toggle chat window
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
}

// Send message
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    addTypingIndicator();

    // Simulate AI response
    setTimeout(() => {
        removeTypingIndicator();
        generateResponse(message);
    }, 1500);
}

// Add message to chat
function addMessage(text, sender) {
    const messages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');

    messageDiv.style.cssText = `
        margin-bottom: 15px;
        display: flex;
        ${sender === 'user' ? 'justify-content: flex-end;' : ''}
    `;

    messageDiv.innerHTML = `
        <div style="
            background: ${sender === 'user' ? '#0d9488' : 'white'};
            color: ${sender === 'user' ? 'white' : '#334155'};
            padding: 12px 15px;
            border-radius: ${sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px'};
            max-width: 80%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        ">
            ${text}
        </div>
    `;

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Add typing indicator
function addTypingIndicator() {
    const messages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.style.cssText = 'margin-bottom:15px;';
    typingDiv.innerHTML = `
        <div style="background:white; padding:12px 15px; border-radius:20px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            <span style="opacity:0.7;">🤖 Thinking</span>
            <span style="animation:dots 1.5s infinite;">...</span>
        </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// Generate AI response
function generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    let response = '';

    // Simple response logic (in production, this would call an AI API)
    if (message.includes('headache')) {
        response = "Headaches during pregnancy can be common. Try resting in a quiet, dark room and staying hydrated. If the headache is severe or persistent, please contact your healthcare provider.";
    } else if (message.includes('swelling')) {
        response = "Some swelling is normal, especially in later pregnancy. Try elevating your feet and avoiding standing for long periods. If swelling is sudden or severe, mention it to your provider.";
    } else if (message.includes('bp') || message.includes('blood pressure')) {
        response = "Monitoring blood pressure is important during pregnancy. If you're seeing consistently high readings, please discuss with your healthcare provider.";
    } else if (message.includes('movement') || message.includes('kick')) {
        response = "If you're concerned about your baby's movements, try lying on your left side and counting kicks. You should feel at least 10 movements in 2 hours. Contact your provider if movements decrease significantly.";
    } else if (message.includes('nausea')) {
        response = "Nausea is common, especially in the first trimester. Try eating small, frequent meals and avoiding spicy foods. Ginger tea or crackers might help settle your stomach.";
    } else if (message.includes('due date')) {
        response = "Your due date is calculated as 40 weeks from the first day of your last menstrual period. Every baby comes on their own schedule!";
    } else {
        response = "Thank you for your question. For personalized medical advice, please consult with your healthcare provider who knows your history best. Is there anything else I can help with?";
    }

    addMessage(response, 'assistant');
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes dots {
        0%, 20% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);