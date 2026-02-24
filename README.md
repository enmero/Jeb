# JEB
> The Industrial Modern Browser with a Native AI Shadow Engine.

JEB is a minimalist, high-performance browser designed by **Enmero Research** ([www.enmero.in](https://www.enmero.in)). It combines a sleek, premium aesthetic with a powerful background layer known as the **Shadow Engine**, allowing for seamless human-AI collaboration.

![JEB Logo](logo.png)

## ✨ Core Features

- **Industrial Modern Aesthetic**: Deep dark modes, glassmorphism, and cinematic entrance animations.
- **Shadow Engine (AI Path)**: A headless Chromium-based engine that extracts semantic meaning from the web.
- **Background Intelligence**: Discovery context cards that provide deep insights into your searches.
- **Native Extension CLI**: Control your browser from the terminal or connect external AI agents.

## 🛠️ Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/enmero/jeb-browser.git

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Using the CLI (Alpha)

JEB comes with a powerful terminal interface for background browsing:

```bash
# Register the jeb alias
node jeb.js install

# Search semantically in the background
jeb search "apple.com"

# The browser will analyze the page semantically and return:
# - Page Intent
# - Entity extraction (prices, dates, products)
# - Interactive Node IDs (for AI automation)
```

## 🧠 AI Path Notice

**The AI Path (Autonomous Browsing) is currently in Active Development.**

The internal "AI Path" UI has been decentralized in this version to focus on the **Universal AI Bridge**. Developers can now connect any AI agent (Claude, GPT, Gemini) directly to the JEB background server (Port 3030) to automate browsing tasks.

## 📜 License

Distributed under the Apache License 2.0. See `LICENSE` for more information.

---
Created with precision by **Enmero Research**.  
*Journey · Explore · Beyond* — [www.enmero.in](https://www.enmero.in)
