/**
 * ============================================================================
 * Navnit Maurya — Portfolio & Navnit AI Server
 * ============================================================================
 * Production-ready Express server that serves static portfolio assets and
 * powers the Gemini-backed Navnit AI chatbot securely.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildSystemPrompt } = require('./knowledgeBase');

const app = express();
const PORT = process.env.PORT || 8080;

// Security Middleware
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// In-Memory Simple Rate Limiter (Per IP: max 25 requests per 60 seconds)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 25;

function checkRateLimit(ip) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, clientData);
    return { allowed: true };
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  clientData.count += 1;
  rateLimitMap.set(ip, clientData);
  return { allowed: true };
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Whoa, slow down a bit! ⚡ You've sent too many messages. Please wait ${rateCheck.retryAfter}s and try again.`
      });
    }

    const { message, history } = req.body;

    // Validate Input
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a non-empty message.'
      });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long. Please keep your question under 1,000 characters.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: "Navnit AI is ready, but the server is waiting for `GEMINI_API_KEY` to be added in environment variables. Please check the deployment settings! 🔑"
      });
    }

    // Initialize Gemini SDK with supported model
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = buildSystemPrompt();

    // Prepare multi-turn chat history (capped at last 10 turns to conserve context & speed)
    const formattedHistory = [];
    if (Array.isArray(history)) {
      const sanitizedHistory = history.slice(-10);
      for (const turn of sanitizedHistory) {
        if (turn && (turn.role === 'user' || turn.role === 'model') && typeof turn.content === 'string') {
          formattedHistory.push({
            role: turn.role,
            parts: [{ text: turn.content.slice(0, 1000) }]
          });
        }
      }
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7
      }
    });

    const result = await chat.sendMessage(trimmedMessage);
    const response = await result.response;
    const replyText = response.text();

    return res.json({
      success: true,
      reply: replyText
    });

  } catch (error) {
    // Log internally for debugging, never expose secrets to client
    console.error('[Navnit AI Error]:', error && error.message ? error.message : error);

    // Friendly error classification
    const errMsg = String(error && error.message ? error.message : '');

    if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid')) {
      return res.status(500).json({
        success: false,
        error: "The configured Gemini API key seems invalid. Please verify GEMINI_API_KEY on the server."
      });
    }

    if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('429')) {
      return res.status(429).json({
        success: false,
        error: "Navnit AI is getting lots of love right now! 🚀 High traffic limit reached. Please wait a moment and try again."
      });
    }

    return res.status(500).json({
      success: false,
      error: "Oops! Something went wrong while connecting with Navnit AI. Please try again in a few seconds! ✨"
    });
  }
});

// Serve Static Files (index.html, images, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for any unmatched routes (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Navnit Maurya Portfolio & Navnit AI Server Active`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 Gemini Key Configured: ${Boolean(process.env.GEMINI_API_KEY) ? 'YES' : 'NO (Set GEMINI_API_KEY in .env)'}`);
  console.log(`====================================================`);
});
