# EcoLens — Personal Carbon Footprint Tracker

EcoLens is a highly polished, production-ready, client-side personal carbon footprint audit and reduction application. Built entirely inside a reactive workspace using React, Vite, Tailwind CSS, and Recharts, EcoLens helps individuals track, model, and actively reduce their daily environmental impacts through high-fidelity rule-based recommendations, interactive widgets, family trackers, and gamified eco-challenges.

---

## 🎨 Visual System & Product Pairing

- **Theme Choices**: Sophisticated dark forest accents and warm cream card layers combined with high-contrast neutral slate boards representing premium environmental product branding.
- **Typography Pairing**: Elegant display headers set in `Space Grotesk` paired with standard, highly readable `Inter` font files for dashboard details, and `JetBrains Mono` for stats and points tracking.
- **Durable Persistence**: Leverages secure, non-tracking client-side `localStorage` to insulate private logs and habits within the user's browser, bypassing the need for cloud databases, API keys, or authentication layers.

---

## ⚡ Core Capabilities

1. **Carbon Footprint Calculator**: Multi-step forms modeling monthly vehicle mileage, plane transit, HVAC electrical kWh usage, LPG cookers, and renewable solar panel off-setting credits.
2. **Local Emission Factor Dataset**: Pure scientific conversion parameters modeled strictly client-side to evaluate emissions instantly.
3. **What-If Reduction Simulator**: Real-time slider utilities allowing users to model potential carbon reductions (e.g. cutting driving by 50% or installing solar) and verify CO₂ prevented.
4. **Daily Habit Tracker**: Micro-checklists to record daily environment achievements with consecutive-day streak calculation multipliers.
5. **Ecology Library & Quiz Hub**: Educational articles on renewable energy, grid load optimization, and nutrition paired with interactive expert explainers that reward user points.
6. **Carbon Intensity Calendar**: Color-coded weekly calendar grid visualizing logged carbon status (Green, Yellow, Red) and accepting quick daily parameters.
7. **Family & Group Mode**: Multi-member manual logs to calculate household aggregations and map comparative scores without authentication.
8. **Ecology Challenge**: 7-Day Guided Green challenges designed to establish sustainable habits sequentially.
9. **Visual Reports**: Immediate comma-separated spreadsheet (.CSV) downloads and printable executive environmental audit summaries.
10. **Admin Diagnostics System**: On-board testing suite executing formal regression test cases directly inside the client interface.

---

## 🚀 Execution & Setup

### Local Run:
1. Ensure Node.js is installed.
2. Execute the package installer:
   ```bash
   npm install
   ```
3. Boot the development hot reloading server:
   ```bash
   npm run dev
   ```
4. Access in browser: `http://localhost:3000`

### Build & Deploy:
- Compiled build commands will bundle static assets using standard build runners:
  ```bash
  npm run build
  ```
- **Vercel Deployments**: Triggering `vercel deploy` at the root will compile and deploy automatically under standard SPA rewrites mapped in `vercel.json`.

---

*EcoLens — Decarbonizing Daily, One Action at a Time.*
