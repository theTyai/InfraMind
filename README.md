# InfraMind — AI System Architecture Workspace

> Describe your project idea. Generate production-ready system designs in seconds.

**InfraMind** is a professional, AI-native system architecture workspace. By describing a product concept and stack preferences, InfraMind generates fully interactive, developer-first blueprints — including system architecture charts, user flow sequence blueprints, REST API interface specs, database schema collections, multi-tier hosting environments, scalability lanes, and phased MVP roadmaps.

---

## Features

- **Project Overview Dashboard** — Clear dashboard summarizing project brief, AI architectural decisions, stack rationale, and key system trade-offs.
- **Visual Blueprints** — Full-screen interactive modals rendering complex Mermaid.js system flowchart diagrams and event sequence flows with custom drag-to-pan, scroll-to-zoom, and reset controls.
- **Node-Level Inspector** — Dynamic right-hand side panel that updates instantly with stack rationales, alternatives, and database column fields when nodes inside the diagram are clicked.
- **API Spec Sheet** — Comprehensive inventory details showing HTTP methods, routing paths, and endpoint operational details.
- **Database Modeler** — Detailed database schema models defining collection tables, field types, and relational metadata.
- **Multi-Stage Deployment** — Strategic blueprints mapped out specifically for Development, Staging, and Production targets.
- **User Authentication** — Secure mock login and logout system allowing personalized workspace blueprints and custom user profiles.
- **Clean PDF Export** — Instant client-side download generating professional, high-contrast light-themed multi-page architecture report documents.

---

## Technical Stack

| Layer | Choice |
|---|---|
| **Core Client** | React 18 + Vite |
| **Styling** | Vanilla CSS Modules (zero-runtime overhead) |
| **Auth System** | Interactive Client-Side Session Provider |
| **Diagram Engine** | Mermaid.js with DOM event callbacks |
| **PDF Compiler** | jsPDF (crisp light-themed report compilation) |
| **Typography** | Inter (sans-serif) & JetBrains Mono (monospace) |

---

## Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourname/inframind.git
cd inframind
npm install
```

### 2. Configure Environment

Copy the environment example file:

```bash
cp .env.example .env
# Open .env and add your active workspace API keys
```

### 3. Running Development Server

Start the development workspace:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

Compile and package for production deployment:

```bash
npm run build
npm run preview
```

---

## Workspace Structure

```
inframind/
├── public/                 # Favicons and static resources
├── src/
│   ├── components/
│   │   ├── layout/         # 3-pane IDE layout components (Sidebar, Topbar, InspectorPanel)
│   │   ├── workspace/      # Dashboard panels (LandingPage, ArchitectureTabs, AuthModal, GenerationStream)
│   │   ├── ui/             # Core UI components (Logo, CommandPalette)
│   │   ├── Footer.jsx      # Rebranded platform footer
│   │   └── MermaidDiagram.jsx # Interactive diagram canvas
│   ├── hooks/
│   │   └── useArchitecture.js # Architecture state machine
│   ├── utils/
│   │   ├── gemini.js       # AI generation client
│   │   └── exportPdf.js    # Clean light-themed PDF exporter
│   ├── styles/
│   │   └── global.css      # Core style tokens & resets
│   ├── App.jsx             # Core orchestrator & Auth router
│   └── main.jsx            # React client mount
├── package.json
└── vite.config.js
```

---

## License

MIT &copy; InfraMind
