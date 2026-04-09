# Interactive Wall Calendar

A tactile, wall-style calendar UI built with Next.js, React, and TypeScript. It pairs a seasonal hero image with a date range selector, a notes area, and a full planner for day, week, month, and range tasks.

## ✨ Features

### Core Experience
- **Wall Calendar Aesthetic**: Paper textures, binder rings, tape accents, and a dedicated hero image pane.
- **Date Range Selector**: Click to pick a start and end date, with hover previews and distinct start/end styling.
- **Integrated Notes**:
  - Monthly memo saved in localStorage.
  - Range-specific notes attached to the selected date span.
- **Planner Mode**:
  - Add tasks for **Day**, **Week**, **Month**, or **Range**.
  - Optional reminders with time.
  - Persisted locally in localStorage.
- **Calendar Indicators**:
  - Task dots, week/range span bars, reminder bell icons.
  - Lightweight holiday labels (New Year, Valentine, Halloween, Holiday).
- **Fully Responsive**:
  - Desktop: side-by-side layout.
  - Mobile: stacked layout with touch-friendly controls.

### Creative Touches
- **Offline Hero Images**: All seasonal images are stored locally in `public/images/hero`.
- **Subtle Motion**: Page-flip animation on month changes and a gentle sway on the hero image.
- **Quick Actions**: Jump to Today and Clear Range controls.

## 🚀 Live Demo

[View Live Demo](https://tuf-frontend-project-challenge.vercel.app/)

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns
- **Persistence**: localStorage

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interactive-calendar.git
   cd interactive-calendar
   npm install
   npm run dev
   ```

2. **Production build**
   ```bash
   npm run build
   npm run start
   ```

## 📂 Notes on Assets

- Seasonal images live in `public/images/hero`.
- To swap imagery, replace the files and update the mapping in `components/HeroImage.tsx`.

## 🧠 Data Persistence

Notes and planner items are stored locally in the browser via localStorage. No backend is required.
