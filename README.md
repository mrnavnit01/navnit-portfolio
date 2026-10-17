# Navnit Maurya — Portfolio & Navnit AI 🤖💜

A high-performance, production-ready portfolio website featuring a 60FPS canvas-based scroll sequence animation with 240 frames, live web project showcases, and **Navnit AI** — a cute, intelligent, floating portfolio assistant powered by Google Gemini.

---

## 🌟 Key Features
- 🎬 **240-Frame Scroll Sequence**: Smooth canvas sequence (cover mode, zero black bars).
- 🤖 **Navnit AI Assistant**: Cute floating robot mascot powered securely by Google Gemini 1.5 Flash through an Express backend.
- 🚀 **Live Projects Showcase**: Direct links to Navnit Tools Suite, BCA Hub, and Navnit AI Bg Remover.
- ✉️ **Interactive Contact Modal**: Integrated with FormSubmit AJAX and animated confetti confirmation.
- 🎨 **Luxury Aesthetic**: Deep black with champagne gold (#e5c158), neon cyan (#00f2fe), and electric purple (#9d4edd).
- 📱 **100% Responsive**: Seamless from 320px mobile screens to 4K displays.

---

## 🛠️ Quick Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   PORT=8080
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

3. **Start the Server**:
   ```bash
   npm start
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🚀 Deploying to Render (with Navnit AI)

Because Navnit AI securely communicates with the Gemini API through the Express backend, deploy this project on Render as a **Web Service**:

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `https://github.com/mrnavnit01/navnit-portfolio`.
4. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `Your Gemini API Key from Google AI Studio`
6. Click **Deploy Web Service**!

---

## 👨‍💻 Author
**Navnit Maurya** — Digital Creator & Tech Explorer  
BCA 2nd Year, VBSPU (Veer Bahadur Singh Purvanchal University), India  
- **Email**: navnitmaurya60@gmail.com  
- **Instagram**: [@mr.navnit.01](https://instagram.com/mr.navnit.01)  
- **LinkedIn**: [mrnavnit01](https://linkedin.com/in/mrnavnit01)  
- **GitHub**: [mrnavnit01](https://github.com/mrnavnit01)  
