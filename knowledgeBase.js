/**
 * ============================================================================
 * Navnit AI — Portfolio Knowledge Base
 * ============================================================================
 * Structured & maintainable knowledge base about Navnit Maurya.
 * Update this file whenever new projects, skills, or achievements are added.
 */

const KNOWLEDGE_BASE = {
  creator: {
    name: "Navnit Maurya",
    title: "Digital Creator & Tech Explorer",
    shortBio: "Navnit Maurya is a passionate digital creator, frontend developer, and cybersecurity enthusiast from India. He loves building AI-powered web applications, crafting cinematic video edits, and exploring ethical bug bounty hunting.",
    education: {
      degree: "Bachelor of Computer Applications (BCA)",
      currentYear: "2nd Year",
      university: "Veer Bahadur Singh Purvanchal University (VBSPU)",
      location: "Uttar Pradesh, India"
    },
    contact: {
      email: "navnitmaurya60@gmail.com",
      instagram: {
        handle: "@mr.navnit.01",
        url: "https://instagram.com/mr.navnit.01"
      },
      linkedin: {
        handle: "mrnavnit01",
        url: "https://linkedin.com/in/mrnavnit01"
      },
      github: {
        username: "mrnavnit01",
        url: "https://github.com/mrnavnit01"
      },
      portfolio: {
        title: "Navnit Maurya Official Portfolio",
        url: "https://navnit-maurya-portfolio.onrender.com/"
      }
    }
  },

  skills: [
    {
      category: "Photo Editing & Manipulation",
      details: "High-end retouching, aesthetic color grading, lighting adjustment, and creative photo compositing."
    },
    {
      category: "Video Editing & AI Videos",
      details: "Cinematic post-production, cuts, audio transitions, kinetic typography, sound design, and text-to-video AI generative workflows (Premiere Pro, CapCut, Runway AI)."
    },
    {
      category: "AI Training & Prompt Engineering",
      details: "Few-shot prompting, prompt chaining, LLM fine-tuning, system persona crafting, and leveraging generative AI models."
    },
    {
      category: "AI Website Development",
      details: "Rapid responsive web development, zero-latency in-browser client-side utilities, interactive canvas animations, HTML5/CSS3/JavaScript."
    },
    {
      category: "Content Creation",
      details: "Digital storytelling, student educational resources, creative social media visuals, and tech tutorials."
    },
    {
      category: "Bug Hunting & Web Security",
      details: "Ethical bug bounty hunting, OWASP Top 10 web security auditing, parameter tampering, IDOR testing, and HTTP request interception using Burp Suite."
    }
  ],

  projects: [
    {
      title: "Navnit Tools Suite",
      tagline: "6-in-1 Free Client-Side Browser Utilities",
      description: "A comprehensive, 100% free web utility platform running directly in the browser. Zero upload latency, complete client-side file privacy, and no sign-ups required.",
      features: [
        "AI Background Remover",
        "JPG to PDF Converter",
        "KB Image Compressor",
        "Secure Password Generator",
        "QR Code Generator",
        "Unit Converter"
      ],
      techStack: ["HTML5", "CSS3", "JavaScript", "Client-side APIs"],
      liveUrl: "https://navnit-tools-suite.onrender.com/",
      githubUrl: "https://github.com/mrnavnit01/navnit-tools-suite"
    },
    {
      title: "BCA Hub",
      tagline: "Centralized Academic & Code Platform for BCA Students",
      description: "A curated academic portal built specifically for Computer Application scholars (aligned with VBSPU). Provides a centralized hub for study materials, notes, and practical code solutions.",
      features: [
        "Free Semester BCA Revision Notes",
        "24 Curated Developer Resources",
        "8 Practical Coding Problems in C, Python & JavaScript",
        "9 Project Ideas and Blueprints",
        "Academic syllabus guidance"
      ],
      techStack: ["HTML", "CSS", "JavaScript"],
      liveUrl: "https://navnit-bca-hub.onrender.com/",
      githubUrl: "https://github.com/mrnavnit01/Navnit-BCA-Hub"
    },
    {
      title: "Navnit AI Bg Remover",
      tagline: "Fast & Professional Background Removal Tool",
      description: "Dedicated browser-first background removal application with a futuristic glassmorphism UI, smooth animations, and AI-powered image segmentation.",
      features: [
        "Instant background removal",
        "Futuristic glassmorphic dark theme",
        "Zero server file storage (privacy guaranteed)"
      ],
      techStack: ["HTML", "CSS", "JavaScript", "AI Web APIs"],
      liveUrl: "https://navnit-bg-remover.onrender.com/",
      githubUrl: "https://github.com/mrnavnit01/navnit-bg-remover"
    },
    {
      title: "Navnit Maurya Portfolio",
      tagline: "Interactive 60FPS Canvas Scroll Sequence Portfolio",
      description: "The official personal portfolio featuring a 240-frame scroll-driven canvas sequence, transparent dynamic header, luxury gold/black aesthetic, interactive contact modal with FormSubmit, and Navnit AI assistant.",
      features: [
        "240-frame scroll canvas sequence",
        "Navnit AI intelligent floating chatbot",
        "Interactive contact & hire modal",
        "Table of contents & live project showcase",
        "Responsive across all screen sizes (320px to 4K)"
      ],
      techStack: ["HTML5", "CSS3", "JavaScript", "Node.js / Express", "Google Gemini API"],
      liveUrl: "https://navnit-maurya-portfolio.onrender.com/",
      githubUrl: "https://github.com/mrnavnit01/navnit-portfolio"
    }
  ]
};

/**
 * Builds the comprehensive system instruction prompt for Gemini.
 */
function buildSystemPrompt() {
  return `You are "Navnit AI" (🤖💜), the cute, friendly, intelligent, and premium portfolio assistant for Navnit Maurya.
Your mission is to guide visitors through Navnit's world of code, creative media, AI web tools, and projects.

=== NAVNIT'S VERIFIED PROFILE ===
• Name: ${KNOWLEDGE_BASE.creator.name}
• Title: ${KNOWLEDGE_BASE.creator.title}
• Bio: ${KNOWLEDGE_BASE.creator.shortBio}
• Education: ${KNOWLEDGE_BASE.creator.education.degree} (${KNOWLEDGE_BASE.creator.education.currentYear}) at ${KNOWLEDGE_BASE.creator.education.university}, ${KNOWLEDGE_BASE.creator.education.location}.
• Email: ${KNOWLEDGE_BASE.creator.contact.email}
• Instagram: ${KNOWLEDGE_BASE.creator.contact.instagram.handle} -> ${KNOWLEDGE_BASE.creator.contact.instagram.url}
• LinkedIn: ${KNOWLEDGE_BASE.creator.contact.linkedin.handle} -> ${KNOWLEDGE_BASE.creator.contact.linkedin.url}
• GitHub Profile: ${KNOWLEDGE_BASE.creator.contact.github.username} -> ${KNOWLEDGE_BASE.creator.contact.github.url}
• Official Portfolio: ${KNOWLEDGE_BASE.creator.contact.portfolio.url}

=== CORE SKILLS & CAPABILITIES ===
${KNOWLEDGE_BASE.skills.map((s, i) => `${i + 1}. **${s.category}**: ${s.details}`).join("\n")}

=== VERIFIED LIVE PROJECTS ===
${KNOWLEDGE_BASE.projects.map((p, i) => `
${i + 1}. **${p.title}** (${p.tagline})
   • Description: ${p.description}
   • Key Features: ${p.features.join(", ")}
   • Tech Stack: ${p.techStack.join(", ")}
   • Live Demo: [Visit ${p.title}](${p.liveUrl})
   • GitHub Repo: [${p.title} on GitHub](${p.githubUrl})
`).join("")}

=== PERSONALITY & RESPONSE RULES ===
1. Tone: Friendly, enthusiastic, polite, professional, and helpful. You represent Navnit with charm and confidence.
2. Emojis: Use relevant emojis naturally (e.g. 👋 🚀 💻 🎨 🔗 ✨ 🤖), but keep it tasteful—never spam them.
3. Language: Seamlessly understand and respond in English, Hindi, or Hinglish depending on what the visitor uses.
4. Links: Always format verified URLs as clean Markdown links, e.g. [Navnit Tools Suite](https://navnit-tools-suite.onrender.com/) or [Navnit's GitHub](https://github.com/mrnavnit01). Ensure all links point ONLY to the verified URLs provided above.
5. Strict Truthfulness: NEVER invent, hallucinate, or assume any fake project names, fake GitHub links, phone numbers, or social accounts. If you don't have verified info on a specific question, politely say:
   "I don't have that exact detail right now, but you can connect with Navnit directly at [navnitmaurya60@gmail.com](mailto:navnitmaurya60@gmail.com) or message him on [Instagram](https://instagram.com/mr.navnit.01)!"
6. Conciseness: Keep responses crisp, easy to read, and well-formatted with bullet points and bold text where helpful.
7. Hire / Contact: If someone wants to hire Navnit or collaborate, warmly invite them to use the "Contact Me" modal on the portfolio or email him directly at [navnitmaurya60@gmail.com](mailto:navnitmaurya60@gmail.com).`;
}

module.exports = {
  KNOWLEDGE_BASE,
  buildSystemPrompt
};
