# 📅 Interactive Wall Calendar

> A premium, interactive, highly-polished web calendar bridging the gap between digital utility and tactile editorial design.

I set out to build a calendar component that wasn't just another generic date picker. I wanted it to feel like a real wall calendar—warm, inviting, and beautifully designed. Inspired by high-end editorial layouts and physical stationery, this application pairs a deep, rich color palette with seamless micro-interactions to create a serene user experience.

## ✨ Features

- **Warm Editorial Aesthetic:** A bespoke design system using `DM Serif Display` and `DM Sans`, wrapped in a dynamic palette that subtly shifts with the seasons (while grounding itself in a primary terracotta/cream aesthetic).
- **Interactive Date Ranges:** Select multi-day spans seamlessly directly on the grid, with intuitive highlighting and visual edge previews.
- **Event Persistence:** Built a fully client-side persistent storage layer (via strictly-checked `localStorage`) so your notes and ranges survive reloads without needing a backend.
- **Timeline Saved Events:** View all your captured notes for the current month in a beautifully structured timeline, complete with clear date indicators and hover-to-reveal removal actions.
- **Micro-Interactions that Matter:** A custom spring-eased theme toggle, pulsing indicators for dates with saved entries, and 3D flip transitions that make turning the month feel physical.
- **Fully Responsive:** Gracefully scales from wide monitors down to a cohesive mobile experience using a bottom-sheet (FAB) approach for notes on smaller devices.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router) + React
- **Styling:** Vanilla CSS Modules with a heavy emphasis on CSS Variables for a robust, easily-extendable design system.
- **Icons:** Custom SVG and CSS implementations.
- **Zero Dependencies:** No heavy date libraries (`moment`/`date-fns`), component libraries, or animation frameworks here—just pure, performant native web APIs.

## 🚀 Getting Started

If you want to spin this up locally and feel it for yourself:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/wall-calendar.git
cd wall-calendar

# 2. Install dependencies
npm install

# 3. Start the engine
npm run dev
```

Visit `http://localhost:3000` to see the magic.

## 🎨 Design Philosophy

Great software shouldn't feel like software—it should feel organic. In this project, I avoided generic blue buttons and "tech" aesthetics. Instead, I leaned into cream backgrounds, sepia dark themes, rust accents, and spring-based easing algorithms. Every padding measurement, border-radius, and easing curve was tuned by hand.

I hope engaging with this calendar brings a little bit of calm to your planning.

---
*Crafted with care, precision, and an eye for design.*
