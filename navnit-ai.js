/**
 * ============================================================================
 * NAVNIT AI — CUTE & PREMIUM PORTFOLIO ASSISTANT (FRONTEND CLIENT)
 * ============================================================================
 * Self-contained, accessible, non-blocking floating chatbot client for Navnit Maurya.
 */

(function () {
  'use strict';

  // SVG for Cute Robot Mascot (Friendly curved eyes, glowing antenna, pink cheeks)
  const MASCOT_SVG = `
    <svg viewBox="0 0 100 100" class="navnit-ai-mascot-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="50%" stop-color="#9d4edd"/>
          <stop offset="100%" stop-color="#6b21a8"/>
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#090a14"/>
          <stop offset="100%" stop-color="#141829"/>
        </linearGradient>
        <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Antenna -->
      <line x1="50" y1="18" x2="50" y2="7" stroke="#e5c158" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="50" cy="6" r="5" fill="#00f2fe" filter="url(#eyeGlow)"/>

      <!-- Robot Ears / Headphones -->
      <rect x="14" y="38" width="8" height="24" rx="4" fill="#00f2fe"/>
      <rect x="78" y="38" width="8" height="24" rx="4" fill="#00f2fe"/>

      <!-- Robot Head Base -->
      <rect x="20" y="18" width="60" height="62" rx="18" fill="url(#robotBodyGrad)" stroke="#e5c158" stroke-width="2.5"/>

      <!-- Glossy Visor Screen -->
      <rect x="27" y="27" width="46" height="38" rx="12" fill="url(#visorGrad)" stroke="rgba(0, 242, 254, 0.4)" stroke-width="1.5"/>

      <!-- Cute Glowing Cyan Eyes (Happy Curves) -->
      <path d="M 36 44 Q 41 38 46 44" stroke="#00f2fe" stroke-width="3.8" stroke-linecap="round" fill="none" filter="url(#eyeGlow)"/>
      <path d="M 54 44 Q 59 38 64 44" stroke="#00f2fe" stroke-width="3.8" stroke-linecap="round" fill="none" filter="url(#eyeGlow)"/>

      <!-- Cute Blushing Pink Cheeks -->
      <circle cx="33" cy="53" r="3.5" fill="#ff69b4" opacity="0.85"/>
      <circle cx="67" cy="53" r="3.5" fill="#ff69b4" opacity="0.85"/>

      <!-- Cute Smile -->
      <path d="M 45 54 Q 50 58 55 54" stroke="#e5c158" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    </svg>
  `;

  // Mini Avatar SVG for messages
  const MINI_AVATAR_SVG = `
    <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#9d4edd,#00f2fe);padding:2px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(157,78,221,0.5)">
      ${MASCOT_SVG.replace('width="42"', 'width="24"').replace('height="42"', 'height="24"')}
    </div>
  `;

  const QUICK_PROMPTS = [
    { label: "About Navnit 👋", query: "Tell me about Navnit Maurya and what he does." },
    { label: "Explore Projects 🚀", query: "What projects has Navnit built? Show me his live works and tools!" },
    { label: "Tech Stack 💻", query: "What are Navnit's key skills and technical capabilities?" },
    { label: "GitHub 🔗", query: "Where can I find Navnit's GitHub profile and repositories?" },
    { label: "Social Profiles 🌐", query: "What are Navnit's Instagram, LinkedIn, and social profiles?" },
    { label: "Hire / Contact ✉️", query: "How can I contact or hire Navnit for projects?" }
  ];

  // Store session history
  let chatHistory = [];
  const SESSION_STORAGE_KEY = 'navnit_ai_history_v1';

  // Load from session storage if available
  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      chatHistory = JSON.parse(saved);
    }
  } catch (e) {
    chatHistory = [];
  }

  // Safe Markdown Formatter (XSS-safe: escapes HTML, parses markdown to safe tags)
  function formatMarkdown(text) {
    if (!text) return '';

    // 1. HTML Escape
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // 2. Bold: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Italic: *text*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 4. Inline code: `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 5. Links: [Label](https://...) -> safe external links with target="_blank"
    escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');

    // 6. Direct URLs: https://...
    escaped = escaped.replace(/(^|[^"])((https?:\/\/[^\s<]+))/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2 ↗</a>');

    // 7. Bullet lists: lines starting with * or -
    const lines = escaped.split('\n');
    let inList = false;
    let formattedLines = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        if (!inList) {
          formattedLines.push('<ul>');
          inList = true;
        }
        formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        if (trimmed) {
          formattedLines.push(`<p>${line}</p>`);
        }
      }
    }
    if (inList) formattedLines.push('</ul>');

    return formattedLines.join('');
  }

  // Build and inject Widget DOM
  function initWidget() {
    // 1. Launcher Bubble
    const launcher = document.createElement('div');
    launcher.className = 'navnit-ai-launcher';
    launcher.id = 'navnitAiLauncher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('tabindex', '0');
    launcher.setAttribute('aria-label', 'Open Navnit AI Assistant');
    launcher.innerHTML = `
      <div class="navnit-ai-mascot-wrapper">
        ${MASCOT_SVG}
        <span class="navnit-ai-online-dot" title="Navnit AI Online"></span>
      </div>
      <div class="navnit-ai-label">
        <span class="navnit-ai-name">Navnit AI <span class="navnit-ai-sparkle">✨</span></span>
        <span class="navnit-ai-tagline">Ask me anything</span>
      </div>
    `;

    // 2. Chat Panel
    const panel = document.createElement('div');
    panel.className = 'navnit-ai-panel';
    panel.id = 'navnitAiPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Navnit AI Chat Window');
    panel.innerHTML = `
      <!-- Header -->
      <div class="navnit-ai-header">
        <div class="navnit-ai-header-left">
          <div class="navnit-ai-header-mascot">
            ${MASCOT_SVG}
          </div>
          <div class="navnit-ai-header-info">
            <span class="navnit-ai-header-title">Navnit AI <span style="font-size:0.75rem;color:#e5c158">🤖💜</span></span>
            <span class="navnit-ai-header-status">
              <span class="navnit-ai-status-pulse"></span> Online • Portfolio Guide
            </span>
          </div>
        </div>
        <div class="navnit-ai-header-actions">
          <button class="navnit-ai-btn-ctrl" id="navnitAiMinimizeBtn" title="Minimize Chat" aria-label="Minimize Chat">—</button>
          <button class="navnit-ai-btn-ctrl" id="navnitAiClearBtn" title="Clear Chat History" aria-label="Clear Chat History">🗑️</button>
          <button class="navnit-ai-btn-ctrl" id="navnitAiCloseBtn" title="Close Chat" aria-label="Close Chat">✕</button>
        </div>
      </div>

      <!-- Quick Suggestion Pills -->
      <div class="navnit-ai-quick-pills" id="navnitAiPills">
        ${QUICK_PROMPTS.map(p => `
          <button class="navnit-ai-pill" data-query="${p.query}">${p.label}</button>
        `).join('')}
      </div>

      <!-- Chat Body / Messages -->
      <div class="navnit-ai-body" id="navnitAiBody">
        <!-- Initial Greeting -->
        <div class="navnit-ai-msg assistant">
          <div class="navnit-ai-msg-avatar">
            ${MINI_AVATAR_SVG}
          </div>
          <div class="navnit-ai-msg-bubble">
            <p>Hey there! 👋 I'm <strong>Navnit AI</strong>, your personal guide to Navnit's world of code, creativity &amp; projects! ✨</p>
            <p style="margin-top:6px;font-size:0.83rem;color:rgba(255,255,255,0.75)">
              Feel free to ask about Navnit's skills, live tools, background, or social links below!
            </p>
          </div>
        </div>
      </div>

      <!-- Footer / Input Form -->
      <div class="navnit-ai-footer">
        <form class="navnit-ai-input-form" id="navnitAiForm">
          <input
            type="text"
            id="navnitAiInput"
            class="navnit-ai-input"
            placeholder="Ask about Navnit's projects, skills..."
            autocomplete="off"
            maxlength="1000"
          />
          <button type="submit" id="navnitAiSendBtn" class="navnit-ai-send-btn" title="Send message" aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div class="navnit-ai-badge"> ✦ Navnit AI • Click any link to visit live</div>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    // Grab elements
    const bodyEl = document.getElementById('navnitAiBody');
    const inputEl = document.getElementById('navnitAiInput');
    const formEl = document.getElementById('navnitAiForm');
    const sendBtn = document.getElementById('navnitAiSendBtn');
    const closeBtn = document.getElementById('navnitAiCloseBtn');
    const minimizeBtn = document.getElementById('navnitAiMinimizeBtn');
    const clearBtn = document.getElementById('navnitAiClearBtn');
    const pillsContainer = document.getElementById('navnitAiPills');

    // Render any saved chat history from session
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        appendMessage(msg.role, msg.content, false);
      });
    }

    // Toggle Open/Close
    function openPanel() {
      panel.classList.remove('minimized');
      panel.classList.add('active');
      launcher.classList.add('hidden');
      setTimeout(() => inputEl.focus(), 200);
      scrollToBottom();
    }

    function closePanel() {
      panel.classList.remove('active');
      panel.classList.remove('minimized');
      launcher.classList.remove('hidden');
    }

    function toggleMinimize() {
      panel.classList.toggle('minimized');
    }

    launcher.addEventListener('click', openPanel);
    launcher.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel();
      }
    });

    closeBtn.addEventListener('click', closePanel);
    minimizeBtn.addEventListener('click', toggleMinimize);

    // Clear history
    clearBtn.addEventListener('click', () => {
      chatHistory = [];
      try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch(e) {}
      bodyEl.innerHTML = `
        <div class="navnit-ai-msg assistant">
          <div class="navnit-ai-msg-avatar">
            ${MINI_AVATAR_SVG}
          </div>
          <div class="navnit-ai-msg-bubble">
            <p>Chat cleared! 🧹 What else would you like to know about Navnit's work? ✨</p>
          </div>
        </div>
      `;
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('active')) {
        closePanel();
      }
    });

    // Quick suggestion pills click
    pillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.navnit-ai-pill');
      if (pill && pill.dataset.query) {
        handleUserSend(pill.dataset.query);
      }
    });

    // Scroll chat to bottom
    function scrollToBottom() {
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    // Append a message bubble to the chat
    function appendMessage(role, text, save = true) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `navnit-ai-msg ${role}`;

      if (role === 'assistant') {
        msgDiv.innerHTML = `
          <div class="navnit-ai-msg-avatar">
            ${MINI_AVATAR_SVG}
          </div>
          <div class="navnit-ai-msg-bubble">
            ${formatMarkdown(text)}
          </div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="navnit-ai-msg-bubble">
            <p>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
        `;
      }

      bodyEl.appendChild(msgDiv);
      scrollToBottom();

      if (save) {
        chatHistory.push({ role, content: text });
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(chatHistory.slice(-20)));
        } catch(e) {}
      }
    }

    // Show typing indicator
    function showTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'navnit-ai-typing';
      indicator.id = 'navnitAiTyping';
      indicator.innerHTML = `
        <span class="navnit-ai-typing-dot"></span>
        <span class="navnit-ai-typing-dot"></span>
        <span class="navnit-ai-typing-dot"></span>
      `;
      bodyEl.appendChild(indicator);
      scrollToBottom();
    }

    function removeTypingIndicator() {
      const el = document.getElementById('navnitAiTyping');
      if (el) el.remove();
    }

    // Send Message to Backend API
    async function handleUserSend(rawText) {
      const message = rawText || inputEl.value.trim();
      if (!message) return;

      inputEl.value = '';
      appendMessage('user', message);

      // Disable inputs during wait
      inputEl.disabled = true;
      sendBtn.disabled = true;
      showTypingIndicator();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            history: chatHistory.slice(-10).map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              content: m.content
            }))
          })
        });

        removeTypingIndicator();

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error || `Server responded with error ${response.status}`;
          appendMessage('assistant', `⚠️ ${errMsg}`);
          return;
        }

        const data = await response.json();
        if (data && data.success && data.reply) {
          appendMessage('assistant', data.reply);
        } else {
          appendMessage('assistant', data.error || "Sorry, I couldn't generate a response. Please try again! ✨");
        }

      } catch (err) {
        removeTypingIndicator();
        // Friendly offline or connection error message
        appendMessage(
          'assistant',
          "Hmm, I couldn't connect to the server backend. 📡 If running locally, make sure you started `node server.js` with your `GEMINI_API_KEY`. You can also explore Navnit's works directly on this page!"
        );
      } finally {
        inputEl.disabled = false;
        sendBtn.disabled = false;
        setTimeout(() => inputEl.focus(), 50);
      }
    }

    // Form submit listener
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSend();
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
