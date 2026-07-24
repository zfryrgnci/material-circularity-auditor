

## 🔗 Explore the App

[**Click here to explore material-circularity-auditor**](https://zfryrgnci.github.io/material-circularity-auditor)

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success.svg?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Architecture-AI_First-purple.svg?style=for-the-badge" alt="Architecture" />

  <h1>♻️ Material Circularity Auditor</h1>
  <p><em>AI-Powered Construction Demolition Lifecycle Analysis</em></p>
</div>

---

## 🚀 Overview

**Material Circularity Auditor** solves the complex problem of commercial demolition waste. By ingesting raw contractor text and unstructured demolition manifests, it uses `gemini-3.5-flash` to structure, analyze, and grade materials based on their "Circularity Potential"—suggesting recycling routes and calculating precise CO2 footprint savings.

## ✨ Key Features
- 🧠 **Circularity AI Pipeline**: Evaluates reuse potential across Timber, Steel, Concrete, Glass, Electrical, HVAC, and more.
- 🎨 **Premium Glassmorphic UI**: High-end React and Tailwind v4 dashboard to visualize saved carbon.
- ⚡ **JSON Schema Enforcement**: Guarantees deterministic grading logic from the Gemini LLM.

## 🛠 Tech Stack
- **Frontend**: React 19, TailwindCSS v4, Vite, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, TypeScript.
- **AI Core**: `@google/genai` (Gemini API)

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v24+)
- A Free [Google Gemini API Key](https://aistudio.google.com/)

### 2. Setup
Clone the repo and configure the environment:
```bash
git clone https://github.com/zfryrgnci/material-circularity-auditor.git
cd material-circularity-auditor
npm install
```

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_free_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

## 🧪 Testing Suite
Backed by a comprehensive `Vitest` testing infrastructure:
```bash
npm run test
```

## 🤝 Open Source
Created by [Zafer Yorganci](https://github.com/zfryrgnci). Built for the future of green architecture!
