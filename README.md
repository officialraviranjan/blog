# Euro Travels Guide (eurotravelsguide.eu.org)

An elegant, high-performance, SEO-optimized travel blog and destination guide built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## 🌍 Overview

**Euro Travels Guide** provides curated itineraries, budget travel tips, hidden gems, and cultural guides across top destinations in Europe. Built for fast page loads, dark mode accessibility, and seamless mobile responsiveness.

---

## ✨ Key Features

- **30+ SEO-Optimized Travel Articles**: Complete guides covering Iceland's Ring Road, Amalfi Coast, Swiss Alps, Parisian hidden spots, Santorini wineries, and more.
- **Instant Search & Filtering**: Client-side search modal with real-time keyword, tag, and category filtering.
- **Rich Article View**:
  - Estimated reading time & publish dates
  - Dynamic Table of Contents based on headings
  - Social sharing links (X/Twitter, Facebook, LinkedIn, WhatsApp, Copy Link)
  - Author bio card with social profiles
  - Disqus comment section integration
- **Google AdSense & Monitization Ready**: Configured ad units and `ads.txt` support.
- **Dark Mode Support**: Seamless toggle between light and dark themes with local storage persistence.
- **Responsive & Accessible**: Desktop and mobile layouts powered by Tailwind CSS and Lucide React icons.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)

---

## 📁 Project Structure

```text
├── public/                # Static assets, robots.txt, ads.txt
├── src/
│   ├── components/        # UI components (Header, Footer, PostCard, PostView, SearchModal, etc.)
│   ├── data/              # Article data batches and author profiles
│   ├── types.ts           # Shared TypeScript interfaces (Post, Author, etc.)
│   ├── App.tsx            # Main application router and state manager
│   ├── index.css          # Global Tailwind CSS imports
│   └── main.tsx           # Entry point
├── metadata.json          # Applet metadata
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **bun**

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd eurotravelsguide
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

### Build for Production

Compile the production bundle to the `dist` directory:
```bash
npm run build
```

---

## 📜 License

Distributed under the MIT License.
