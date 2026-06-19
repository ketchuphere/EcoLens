# EcoLens Architectural Design Blueprint

This document outlines the engineering hierarchy, modular design, data flows, and coding standards of **EcoLens**, a high-precision, client-authoritative carbon footprint auditing application.

---

## 1. Project Overview

**EcoLens** is a modern React + TypeScript single-screen application designed to help users calculate, analyze, and systematically reduce their dynamic household carbon footprint. By capturing transportation habits, utility power consumption, dietary patterns, and lifestyle choices, EcoLens quantifies environmental impacts into actionable insights and progress logs.

---

## 2. Core Architecture

The architecture is designed to enforce a strict separation of concerns, eliminating complex rendering cycles and guaranteeing data security.

```
src/
├── components/       # Pure rendering components only (JSX, styling, UI layouts)
├── services/         # Business logic & state coordination (Storage, Carbon Service, Reports)
├── utils/            # Reusable algorithmic equations, constants, list validators & sanitizers
├── types.ts          # Centralized type contracts and domain models
└── main.tsx          # Main Web entry point
```

### Modular Directory Breakdown

| Directory Scope | Conceptual Purpose | Key Modules |
| :--- | :--- | :--- |
| `src/components/` | Visual layout nodes, responsive cards, charts, and user event controllers. | `CarbonCalculatorForm.tsx`, `WhatIfSimulator.tsx`, `ScoreDashboard.tsx` |
| `src/services/` | Wrappers that coordinate calculations, storage syncs, and text summaries. | `carbonService.ts`, `storageService.ts`, `reportService.ts` |
| `src/utils/` | Reusable pure utility code, validations, formulas, and centralized safe error handling. | `calculations.ts`, `validators.ts`, `errorHandler.ts`, `logger.ts` |
| `src/types/` | Centralized domain typescript contracts. | `src/types.ts` |

---

## 3. Data Flow & Calculations Engine

The application processes inputs through a clean, linear pipeline, ensuring visual changes don't corrupt underlying business formulas.

```
[ User Input Data ]
        ↓
  [ Input Validation & Bounds Clamping ] (utils/validators.ts)
        ↓
  [ Carbon Calculations Formulae ] (utils/calculations.ts)
        ↓
  [ State/Insight Dispatch ] (services/carbonService.ts)
        ↓
  [ Cache Sync ] (services/storageService.ts)
        ↓
  [ Live Chart / Rec Render ] (components/)
```

- **Calculations Logic:** Pure carbon equations (e.g. converting car mileage, electricity bills, food intake, and shopping into kg CO₂ equivalents) are implemented in pure reusable formats in `src/utils/calculations.ts`. They are 100% deterministic, side-effect-free, and protected by comprehensive test suites.
- **Safety Boundaries:** Input fields are validated by custom strict schemas inside `src/utils/validators.ts` supporting healthy clamps which prevent overflow or negative numbers.

---

## 4. Testing Suite

Robust verify coverage is executed via **Vitest** and **Testing Library**. It targets:
- **Mathematical Integrity:** High/low boundary combinations, vegan offsets, and heavy-car transit equations.
- **Form Safety:** Validation handlers reject negative values, bad strings, and parsing crashes.
- **Accessibility Check:** Validates tab navigation, accessible aria levels, and high-contrast visuals.

---

## 5. Deployment Specs

- **Local Development:** Vite dynamic proxy on port `3000`.
- **Production Build:** `npm run build` produces compressed static bundles under the `dist/` directory.
- **Vercel Integration:** Zero-configuration deployment with fully optimized edge delivery.
