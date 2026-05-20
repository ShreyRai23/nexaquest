# 🌟 MindBloom AI — Gamified Learning Adventure

![MindBloom AI](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-19.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.3-purple) ![TanStack](https://img.shields.io/badge/TanStack_Router-1.0-red)

**MindBloom AI** is a next-generation, AI-powered aptitude and learning discovery platform built for children aged 8–16. It replaces boring traditional assessments with an interactive, gamified web experience full of daily missions, real-time AI mentoring, achievements, and pixel-art aesthetics.

## ✨ Key Features
- **🎮 Gamified UI:** Retro pixel-art styling, smooth micro-animations, and a responsive layout that looks great on any device.
- **🗺️ Daily Missions & Quizzes:** Dynamic tasks that adapt to the child's skill levels, tracking real-time progress using circular and linear progress bars.
- **🤖 AI Mentor (Bloomy):** An integrated Gemini-powered AI chat system that provides hints, emotional support, and engaging feedback.
- **🏆 XP & Achievements:** An immersive gamification loop where users earn XP, level up their hero, and unlock badges automatically.
- **👨‍👩‍👧 Parent Portal:** A dedicated dashboard for parents to monitor progress, read AI-generated psychometric reports, and link multiple child accounts.

## 🛠️ Tech Stack
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router) (fully type-safe)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS properties
- **Components:** Radix UI primitives + Lucide React icons
- **State/Data Fetching:** [TanStack Query](https://tanstack.com/query) + Axios

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ShreyRai23/mindbloom-adventure.git
   cd mindbloom-adventure
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Ensure it contains the URL of your MindBloom Laravel backend:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Production Deployment (Vercel)

This frontend is configured as a pure Client-Side SPA (Single Page Application) optimized for instant deployment on **Vercel**.

1. Connect this GitHub repository to a new Vercel project.
2. Vercel will automatically detect the **Vite** framework preset.
3. In the Vercel dashboard, add the production backend API URL:
   - `VITE_API_URL` = `https://your-production-api-url.com/api`
4. The included `vercel.json` will automatically handle client-side routing rewrites.
5. Deploy!

## 🔗 Associated Backend
The API backend for this project is built with **Laravel 12** and **MySQL**. It handles the core game logic, JWT authentication, and Google Gemini AI API integration. 

---
*Built with ❤️ for the future of learning.*
