/**
 * ============================================================================
 * NAVNIT AI — SMART NEURAL PORTFOLIO ASSISTANT (POWERED BY REAL AI)
 * ============================================================================
 * Intelligent, context-aware chatbot for Navnit Maurya.
 */

(function () {
  'use strict';

  // Cute Mascot SVG
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
      <line x1="50" y1="18" x2="50" y2="7" stroke="#e5c158" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="50" cy="6" r="5" fill="#00f2fe" filter="url(#eyeGlow)"/>
      <rect x="14" y="38" width="8" height="24" rx="4" fill="#00f2fe"/>
      <rect x="78" y="38" width="8" height="24" rx="4" fill="#00f2fe"/>
      <rect x="20" y="18" width="60" height="62" rx="18" fill="url(#robotBodyGrad)" stroke="#e5c158" stroke-width="2.5"/>
      <rect x="27" y="27" width="46" height="38" rx="12" fill="url(#visorGrad)" stroke="rgba(0, 242, 254, 0.4)" stroke-width="1.5"/>
      <path d="M 36 44 Q 41 38 46 44" stroke="#00f2fe" stroke-width="3.8" stroke-linecap="round" fill="none" filter="url(#eyeGlow)"/>
      <path d="M 54 44 Q 59 38 64 44" stroke="#00f2fe" stroke-width="3.8" stroke-linecap="round" fill="none" filter="url(#eyeGlow)"/>
      <circle cx="33" cy="53" r="3.5" fill="#ff69b4" opacity="0.85"/>
      <circle cx="67" cy="53" r="3.5" fill="#ff69b4" opacity="0.85"/>
      <path d="M 45 54 Q 50 58 55 54" stroke="#e5c158" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    </svg>
  `;

  const MINI_AVATAR_SVG = `
    <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#9d4edd,#00f2fe);padding:2px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(157,78,221,0.5)">
      ${MASCOT_SVG.replace('width="42"', 'width="24"').replace('height="42"', 'height="24"')}
    </div>
  `;

  const QUICK_PROMPTS = [
    { label: "About Navnit 👋", query: "Tell me about Navnit Maurya and what he does." },
    { label: "Instagram 📸", query: "Share Navnit's Instagram ID" },
    { label: "Projects 🚀", query: "What projects has Navnit built?" },
    { label: "Skills 💻", query: "What are Navnit's key skills?" },
    { label: "GitHub 🔗", query: "Where is Navnit's GitHub profile?" },
    { label: "Contact ✉️", query: "How can I contact or hire Navnit?" }
  ];

  let chatHistory = [];
  const SESSION_STORAGE_KEY = 'navnit_ai_history_v1';

  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) chatHistory = JSON.parse(saved);
  } catch (e) {
    chatHistory = [];
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
    escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');
    escaped = escaped.replace(/(^|[^"])((https?:\/\/[^\s<]+))/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2 ↗</a>');

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
        if (trimmed) formattedLines.push(`<p>${line}</p>`);
      }
    }
    if (inList) formattedLines.push('</ul>');
    return formattedLines.join('');
  }

  function initWidget() {
    const launcher = document.createElement('div');
    launcher.className = 'navnit-ai-launcher';
    launcher.id = 'navnitAiLauncher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('tabindex', '0');
    launcher.innerHTML = `
      <div class="navnit-ai-mascot-wrapper">
        ${MASCOT_SVG}
        <span class="navnit-ai-online-dot"></span>
      </div>
      <div class="navnit-ai-label">
        <span class="navnit-ai-name">Navnit AI <span class="navnit-ai-sparkle">✨</span></span>
        <span class="navnit-ai-tagline">Ask me anything</span>
      </div>
    `;

    const panel = document.createElement('div');
    panel.className = 'navnit-ai-panel';
    panel.id = 'navnitAiPanel';
    panel.setAttribute('role', 'dialog');
    panel.innerHTML = `
      <div class="navnit-ai-header">
        <div class="navnit-ai-header-left">
          <div class="navnit-ai-header-mascot">${MASCOT_SVG}</div>
          <div class="navnit-ai-header-info">
            <span class="navnit-ai-header-title">Navnit AI <span style="font-size:0.75rem;color:#e5c158">🤖💜</span></span>
            <span class="navnit-ai-header-status">
              <span class="navnit-ai-status-pulse"></span> Online • Portfolio Guide
            </span>
          </div>
        </div>
        <div class="navnit-ai-header-actions">
          <button class="navnit-ai-btn-ctrl" id="navnitAiMinimizeBtn" title="Minimize">—</button>
          <button class="navnit-ai-btn-ctrl" id="navnitAiClearBtn" title="Clear">🗑️</button>
          <button class="navnit-ai-btn-ctrl" id="navnitAiCloseBtn" title="Close">✕</button>
        </div>
      </div>

      <div class="navnit-ai-quick-pills" id="navnitAiPills">
        ${QUICK_PROMPTS.map(p => `<button class="navnit-ai-pill" data-query="${p.query}">${p.label}</button>`).join('')}
      </div>

      <div class="navnit-ai-body" id="navnitAiBody">
        <div class="navnit-ai-msg assistant">
          <div class="navnit-ai-msg-avatar">${MINI_AVATAR_SVG}</div>
          <div class="navnit-ai-msg-bubble">
            <p>Hey there! 👋 I'm <strong>Navnit AI</strong>. Ask me anything about Navnit Maurya, his projects, skills, or social links! ✨</p>
          </div>
        </div>
      </div>

      <div class="navnit-ai-footer">
        <form class="navnit-ai-input-form" id="navnitAiForm">
          <input
            type="text"
            id="navnitAiInput"
            class="navnit-ai-input"
            placeholder="Ask anything about Navnit..."
            autocomplete="off"
            maxlength="1000"
          />
          <button type="submit" id="navnitAiSendBtn" class="navnit-ai-send-btn" title="Send message">
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

    const bodyEl = document.getElementById('navnitAiBody');
    const inputEl = document.getElementById('navnitAiInput');
    const formEl = document.getElementById('navnitAiForm');
    const sendBtn = document.getElementById('navnitAiSendBtn');
    const closeBtn = document.getElementById('navnitAiCloseBtn');
    const minimizeBtn = document.getElementById('navnitAiMinimizeBtn');
    const clearBtn = document.getElementById('navnitAiClearBtn');
    const pillsContainer = document.getElementById('navnitAiPills');

    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => appendMessage(msg.role, msg.content, false));
    }

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

    clearBtn.addEventListener('click', () => {
      chatHistory = [];
      try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch(e) {}
      bodyEl.innerHTML = `
        <div class="navnit-ai-msg assistant">
          <div class="navnit-ai-msg-avatar">${MINI_AVATAR_SVG}</div>
          <div class="navnit-ai-msg-bubble">
            <p>Chat cleared! 🧹 What would you like to know next? ✨</p>
          </div>
        </div>
      `;
    });

    pillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.navnit-ai-pill');
      if (pill && pill.dataset.query) {
        handleUserSend(pill.dataset.query);
      }
    });

    function scrollToBottom() {
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function appendMessage(role, text, save = true) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `navnit-ai-msg ${role}`;

      if (role === 'assistant') {
        msgDiv.innerHTML = `
          <div class="navnit-ai-msg-avatar">${MINI_AVATAR_SVG}</div>
          <div class="navnit-ai-msg-bubble">${formatMarkdown(text)}</div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="navnit-ai-msg-bubble"><p>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p></div>
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

    // REAL AI CALL WITH KNOWLEDGE CONTEXT
    async function handleUserSend(rawText) {
      const message = rawText || inputEl.value.trim();
      if (!message) return;

      inputEl.value = '';
      appendMessage('user', message);

      inputEl.disabled = true;
      sendBtn.disabled = true;
      showTypingIndicator();

      const systemPrompt = `You are Navnit AI (🤖💜), personal AI assistant for Navnit Maurya.
Respond naturally to greetings (e.g., if user says "aur bhai", say "Badhiya bhai! Batao Navnit ke baare mein kya janna chahte ho? 😊").

=== ABOUT NAVNIT MAURYA ===
- Profession: Digital Creator, Full-Stack Web Developer, UI/UX Designer & Ethical Bug Hunter
- Education: BCA 2nd Year at VBSPU University, India
- Instagram: [@mr.navnit.01](https://instagram.com/mr.navnit.01) (ALWAYS give this link when user asks for Insta!)
- GitHub: [github.com/mrnavnit01](https://github.com/mrnavnit01)
- LinkedIn: [linkedin.com/in/mrnavnit01](https://linkedin.com/in/mrnavnit01)
- Email: [navnitmaurya60@gmail.com](mailto:navnitmaurya60@gmail.com)
- Portfolio: [navnit-tech.onrender.com](https://navnit-tech.onrender.com)

=== PROJECTS ===
1. [Navnit Tools Suite](https://navnit-tools-suite.onrender.com/) - 6-in-1 browser tools (Bg remover, PDF, compressor)
2. [BCA Hub](https://navnit-bca-hub.onrender.com/) - Academic study portal for BCA students
3. [AI Bg Remover](https://navnit-bg-remover.onrender.com/) - Instant AI image background remover

=== RULES ===
1. Keep replies SHORT & CRISP (max 2-3 lines or bullet points).
2. Answer in the same language as user (Hindi, Hinglish, or English).
3. Always provide real links when asked for Instagram, GitHub, or Projects.`;

      try {
        // Direct reliable AI request
        const res = await fetch("https://text.pollinations.ai/" + encodeURIComponent(message) + "?system=" + encodeURIComponent(systemPrompt) + "&model=mistral");

        removeTypingIndicator();

        if (res.ok) {
          const reply = await res.text();
          if (reply && reply.trim()) {
            appendMessage('assistant', reply.trim());
          } else {
            appendMessage('assistant', "Main Navnit ka AI assistant hoon! Bataiye unke projects ya social links ke baare mein kya janna hai? ✨");
          }
        } else {
          appendMessage('assistant', "Navnit Maurya ek Full-Stack Developer aur Creator hain! Unka Instagram: [@mr.navnit.01](https://instagram.com/mr.navnit.01) check karein! 🚀");
        }
      } catch (err) {
        removeTypingIndicator();
        console.error("AI error:", err);
        appendMessage('assistant', "Navnit Maurya se connect karne ke liye unka Instagram [@mr.navnit.01](https://instagram.com/mr.navnit.01) check karein! ✨");
      } finally {
        inputEl.disabled = false;
        sendBtn.disabled = false;
        setTimeout(() => inputEl.focus(), 50);
      }
    }

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSend();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
