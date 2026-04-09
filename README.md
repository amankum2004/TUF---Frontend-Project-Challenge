# README.md

# Interactive Wall Calendar

A beautifully crafted, fully responsive interactive calendar component built with Next.js, React, and TypeScript. This component emulates a physical wall calendar with a seasonal hero image, intuitive date range selection, and integrated notes functionality.

## ✨ Features

### Core Requirements
- **Wall Calendar Aesthetic**: Physical calendar look with seasonal hero images that change monthly
- **Date Range Selector**: Click to select start date, click again to complete range with visual highlighting
- **Integrated Notes Section**: 
  - Monthly memo for general reminders (auto-saved to localStorage)
  - Range-specific notes attached to selected date ranges
- **Fully Responsive Design**: 
  - Desktop: Side-by-side layout (calendar + notes panel)
  - Mobile: Vertically stacked layout with touch-optimized controls

### Creative Enhancements
- **Seasonal Hero Images**: Dynamic Unsplash images matching each month's theme
- **Hover Range Preview**: Visual feedback while selecting date ranges
- **Persistent Storage**: Notes automatically saved in browser localStorage
- **Today Highlight**: Current date visually distinguished
- **Smooth Animations**: Transitions for hover states and selection changes
- **Accessibility**: Keyboard navigation support, proper ARIA labels

## 🚀 Live Demo

[View Live Demo](https://your-deployed-url.vercel.app)

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns
- **State Management**: React Hooks (useState, useContext)
- **Persistence**: localStorage API

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interactive-calendar.git
   cd interactive-calendar
   npm run dev