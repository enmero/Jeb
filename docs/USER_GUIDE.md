# JEB Browser: The Complete User & Developer Guide
> **Version:** 0.1.0 (Alpha)  
> **Philosophy:** Industrial Modernism x Native Intelligence  
> **Publisher:** Enmero Research ([www.enmero.in](https://www.enmero.in))

---

## 1. Introduction
JEB is not just a browser; it is a **Browsing Engine**. It is designed with a dual-layer architecture that separates human interaction from machine reasoning. 

### The Vision
- **Human Path**: A focused, premium, and distraction-free interface for high-performance browsing.
- **AI Path (Shadow Engine)**: A backgrounded, headless protocol that treats the web as a structured database rather than a visual canvas.

---

## 2. Getting Started (For Humans)

### Installation
1. Clone the repository into your local environment.
2. Navigate to the `jeb/` directory.
3. Run `npm install` to set up the industrial toolkit.
4. Launch with `npm run dev`.

### Navigation & Discovery
- **The Omnibar**: Optimized for speed. Type a URL or a search query globally.
- **Discovery Engine**: When searching for broad topics, JEB initiates a "Journey". It generates context cards that summarize the technical landscape of your query before you even dive into a page.
- **Industrial Aesthetic**: JEB uses a customized dark-mode palette, glassmorphism, and staggered entrance animations to provide a premium, "heavy-duty" feel.

---

## 3. The Shadow Engine (For Developers & AI Agents)

JEB's most powerful feature is the **Beyond Protocol**. This is a headless Chromium instance that runs in parallel with your main window.

### How it Works
When a command is sent via the CLI or the Bridge, the Shadow Engine:
1. Navigates to the target URL in a background worker.
2. Executes a **Semantic Extraction Script**.
3. Identifies interactive nodes (Buttons, Inputs, Links) and assigns them unique **AI Node IDs**.
4. Performs **Cognitive Compression** to strip away visual noise (ads, tracking, layout fluff) and returns a structured JSON payload of the page's intent.

### The JEB CLI
You can control the browser from your terminal. 
- **Install**: `node jeb.js install` (creates the `jeb` alias).
- **Search**: `jeb search "apple.com/store"`
- **Status**: `jeb status`

### The Universal AI Bridge
JEB hosts a local HTTP server on **Port 3030**. Any external AI agent (like a local LLM or a cloud-based GPT) can send POST requests to this port to:
- Navigate the web.
- Click elements via Node IDs.
- Extract prices, technical specs, or documentation.

---

## 4. Technical Specifications

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Human UI / Discovery Layer |
| **Logic** | TypeScript | Type-safe journey management |
| **Engine** | Electron 33 | Native system integration |
| **Agent Bridge** | Node.js HTTP | Universal AI communication |
| **Protocol** | Semantic-DOM Parser | Turning HTML into Knowledge |

---

## 5. Terms & Licensing (Enmero Research)

### Apache License 2.0
JEB is distributed under the **Apache License 2.0**. This means:
- **Commercial Use**: Permitted.
- **Modification**: Permitted (must document changes).
- **Distribution**: Permitted.
- **Patent Grant**: Contributors grant a royalty-free patent license to users.

### Branding Guidelines
- **Enmero Branding**: While the source is open, the name "JEB", "JEB Browser", and "Enmero Research" are proprietary identifiers. 
- **Attribution**: Any derivative works must retain the original copyright notice:  
  `© 2026 Enmero Research (www.enmero.in). All rights reserved.`

---

## 6. Roadmap: The Alpha Release
JEB is currently in **Alpha Release**. 
- **Current State**: Stable headless browsing, CLI search, and CLI node extraction.
- **In Development**: Multi-tab agent coordination, persistent cognitive memory, and the "Beyond" reasoning layer which allows the browser to make its own navigational decisions based on user goals.

---
**Enmero Research**  
*Beyond the Protocol.* — [www.enmero.in](https://www.enmero.in)
