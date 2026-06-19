# EcoLens — Personal Carbon Footprint Tracker & Reduction Hub

EcoLens is a highly polished, production-ready, client-side personal carbon footprint audit and reduction application. Built using **React, Vite, Tailwind CSS, and Recharts**, EcoLens helps individuals track, model, and actively reduce their daily environmental impacts through high-fidelity rule-based recommendations, interactive widgets, family trackers, and gamified eco-challenges.

---

## 🛑 Problem Statement

People contribute to carbon emissions daily but lack immediate awareness of their exact environmental impact. The correlation between daily activities—such as vehicle use, household power load, and diet choices—and global climate degradation remains abstract. Without standard scientific measurements, actionable reduction suggestions, and an easy mechanism to log habits, transitioning to a sustainable lifestyle is challenging.

## 🌱 Solution Overview

EcoLens empowers users to take ownership of their personal ecological footprint by providing a clear, interactive transition pipeline:

1. **Calculate Carbon Footprint:** Input transportation, energy, and diet habits with scientific precision.
2. **Understand Emission Sources:** Break down complex carbon impacts through rich, visual, real-time charting.
3. **Receive Actionable Recommendations:** Obtain clear, customized carbon reduction actions.
4. **Track Sustainability Progress:** Actively log habits, monitor household emissions, and log daily milestones in a visual audit.

---

## 🗺️ User Journey

Our design provides a seamless transition from onboarding inputs to visible environmental progress:

```
    [ Input ]
        ↓ (Transportation, utilities, diet, and lifestyle)
 [ Calculation ]
        ↓ (Pure deterministic conversion multipliers)
   [ Insights ]
        ↓ (Custom interactive dashboards and bento-grid charts)
    [ Actions ]
        ↓ (Actionable, custom recommendations & What-If simulator)
[ Progress Tracking ]
          (Dynamic daily checklist habits & score calendar)
```

### Feature Mapping

- **Transportation Tracking:** → Understand travel emissions and explore transit offsets.
- **Energy Tracking:** → Reduce household emissions through appliances, solar panels, and smart HVAC operations.
- **Food & Diet Tracker:** → Analyze dietary footprint and meat-reduction impacts.
- **Recommendations Engine:** → Actively encourage and reward sustainable circular habits.

---

## ⚡ Core Features

1. **Detailed Carbon Footprint Calculator:** Multi-step forms modeling monthly vehicle mileage, public transit, HVAC electrical kWh usage, LPG cookers, and solar generation.
2. **What-If Reduction Simulator:** Real-time slider utilities allowing users to model potential carbon reductions (e.g. cutting driving or installing solar) to see potential CO₂ prevented.
3. **Daily Habit Tracker Checklist:** Micro-checklists to record daily environmental achievements with consecutive-day streak calculation multipliers.
4. **Knowledge Explorer:** Educational articles on grid load optimization, nutrition, and preservation, paired with trivia quizzes that reward points.
5. **Score Calendar:** Color-coded weekly calendar grid visualizing logged carbon status (Green, Yellow, Red) and accepting quick daily parameters.
6. **Family Group Mode:** Multi-member manual profiles to calculate household aggregations and map comparative scores without authorization.
7. **Visual Reports:** Immediate comma-separated spreadsheet (.CSV) downloads and printable executive environmental audit summaries.
8. **Admin Diagnostics System:** On-board developer suite executing form checks and boundary equations directly in the interface.

---

## 🏗️ Architecture

```
src/
├── components/       # Pure rendering components only (JSX, styling, UI layouts)
├── services/         # Business logic & state coordination (Storage, Carbon Service, Reports)
├── utils/            # Reusable calculations, constants, list validators & sanitizers
├── types.ts          # Centralized type contracts and domain models
└── main.tsx          # Main Web entry point
```

For more in-depth architectural details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🧪 Testing Instructions

Test suites check logical equations, input field validation boundaries, storage integrity, and accessibility criteria.

### Run Tests:
To execute our end-to-end unit and integration test suite:
```bash
npm test
```

### For Coverage Reports:
```bash
npm run test:coverage
```

---

## 🚀 Execution & Setup

### Local Run:
1. Ensure Node.js is installed.
2. Install node package dependencies:
   ```bash
   npm install
   ```
3. Boot the development hot-reloading server:
   ```bash
   npm run dev
   ```
4. Open the development endpoint: `http://localhost:3000`

### Build & Deploy Steps:
1. Compile and minify bundle:
   ```bash
   npm run build
   ```
2. The bundle compiles cleanly inside the `dist/` directory.
3. Deploy index and static bundles to Vercel or any static file hoster. On Vercel, paths are cleanly rewritten inside `vercel.json` for SPA routing.

---

## 🌎 SDG Alignment

EcoLens supports:

### **SDG 13: Climate Action**
By helping individuals:
- **Measure emissions**: Quantifying personal footprint dynamically using real conversion parameters.
- **Understand impact**: Providing relative visual diagnostics comparing personal consumption to global benchmarks.
- **Reduce footprint**: Suggesting sustainable diet swaps, electricity management patterns, and transit modifications.

---

## 🔮 Future Scope

- **Community Sustainability Challenges**: Live multiplayer carbon tournaments amongst friends or neighbors.
- **City-level Comparison**: Geo-aware averages of utility loads comparing different regional municipality metrics.
- **Renewable Energy Tracking**: Automatic integration of home smart meter and solar battery feeds.
- **Carbon Offset Awareness**: Standard third-party gold-standard certified offset recommendations based on monthly overage totals.

---

*EcoLens — Decarbonizing Daily, One Action at a Time.*
