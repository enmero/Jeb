
<p align="center">
  <img src="public/logo.png" alt="JEB Logo" width="180"/>
</p>

<h1 align="center">JEB</h1>

<p align="center">
  <strong>An Industrial Modern Browser with a Native AI Shadow Engine</strong>
</p>

<p align="center">
  Browser for You · Browser for Your AI
</p>

## What is JEB?

**JEB is an open-source dual-layer browser.**

It separates:

*  **Human browsing** (clean, high-performance UI)
*  **AI browsing** (a headless semantic engine running in parallel)

While you navigate visually, JEB’s Shadow Engine analyzes the page structure, extracts meaning, and makes it available as structured data.

The web — but machine-readable.


## Why JEB?

Most browsers render pixels.
JEB also extracts intent.

This makes it useful for:

* AI-assisted research
* Automation workflows
* Structured data extraction
* Agent-driven browsing
* Experimental human–AI collaboration


## Core Features

### Human Path

* Minimal, distraction-free interface
* Industrial dark-mode aesthetic
* Smooth motion design
* Fast omnibar navigation

###  Shadow Engine (AI Path)

* Headless Chromium processing
* Semantic DOM parsing
* AI Node ID assignment
* Cognitive compression (removes layout noise & ads)
* Structured JSON output

###  Universal AI Bridge

* Local HTTP server (`localhost:3030`)
* Connect external AI agents
* Navigate, click, extract via Node IDs

###  CLI (Alpha)

Control JEB from your terminal.



## Installation

```bash
git clone https://github.com/enmero/jeb-browser.git
cd jeb-browser
npm install
npm run dev
```



## CLI Usage (Alpha)

Register alias:

```bash
node jeb.js install
```

Run a semantic search:

```bash
jeb search "apple.com"
```

Output includes:

* Page summary
* Extracted entities
* Interactive Node IDs
* Structured semantic data


## Architecture

**Frontend**

* React 18 + Vite
* Electron
* TypeScript

**Shadow Engine**

* Headless Chromium worker
* Semantic extraction protocol
* Local AI Bridge server

Two layers. One synchronized browsing experience.



## Project Status

**Version:** 0.1.0 (Alpha)

### Working

* Headless browsing
* CLI semantic search
* Node extraction
* JSON structured output

### In Progress

* Multi-tab agent coordination
* Persistent memory
* Autonomous navigation layer

Expect rapid iteration.



## Contributing

We welcome:

* Feature improvements
* Performance optimizations
* Protocol experimentation
* Documentation enhancements
* AI agent integrations

Open an issue or submit a pull request.



## License

Apache License 2.0
Commercial use and modification permitted.

Brand identifiers (“JEB”, “Enmero Research”) remain protected.


## Philosophy

we aim to create the next generation browser


Built by **Enmero Research**
[https://www.enmero.in](https://www.enmero.in)



