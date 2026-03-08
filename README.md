# JustLanded

JustLanded is a personalized settlement companion for newcomers to Canada. By learning about each user through a short onboarding quiz, the app generates a tailored checklist, tracks settlement progress through an Arrival Score, surfaces nearby community services on a map, and provides multilingual chatbot support — all in one place.

## Overview

Built during Hack Canada 2026, JustLanded addresses the overwhelming and fragmented experience of immigrating to Canada. Rather than forcing newcomers to navigate dozens of government websites in an unfamiliar language, JustLanded consolidates everything into a single, personalized dashboard that meets each user where they are.

The project was completed by a team of four.

## Technical Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Authentication:** Auth0
- **Database:** Firebase Firestore
- **Mapping:** Google Maps API
- **Chatbot:** Gemini API
- **Font:** Jost (Google Fonts)

## Key Features

- **Personalized Onboarding Quiz:** Collects information about the user's province, purpose, language, family situation, and more to tailor the entire experience.
- **Settlement Checklist:** A dynamic, province-aware task list organized by urgency — from getting a SIN number on Day 1 to building credit history over six months. Tasks are specific to the user's province, purpose, and personal situation.
- **Arrival Score:** A visual progress tracker that scores settlement completion out of 100, weighted by task importance, and surfaces the highest-impact incomplete tasks.
- **Community Service Map:** A satellite-integrated map that surfaces nearby settlement agencies, places of worship, schools, daycares, and other relevant services based on the user's profile.
- **Multilingual Chatbot:** Powered by the Gemini API, the chatbot helps users navigate the platform in their primary language, removing language as a barrier to settlement support.

## Architecture

JustLanded uses a clean, component-driven architecture designed for rapid iteration during the hackathon:

1. **Auth Flow:** Auth0 handles Google login. On first login, users are directed to the onboarding quiz. Returning users are routed directly to their dashboard.
2. **Data Layer:** Firebase Firestore stores all user profile data and checklist completion state, enabling persistence across sessions and devices.
3. **Personalization Engine:** A rule-based task generator reads the user's Firebase profile and produces a fully tailored checklist with province-specific descriptions and resources.
4. **Dashboard:** Displays the Arrival Score, top recommended tasks, and quick access to all features. Updates in real time as users complete checklist items.

## Demo

_Live demo URL coming soon._

## Development and Contributions

Work was divided across four team members to ensure all core systems were delivered.

- **Frontend, Checklist & Arrival Score:** Designed and built the full JustLanded UI system including the beige/red design language, component library, personalized settlement checklist, Arrival Score gauge, and Firebase integration across all pages.
- **Quiz, Auth & Firebase:** Built the onboarding quiz, Auth0 login flow, and Firebase data pipeline that powers user personalization across the entire app.
- **Map & Chatbot:** Integrated the Google Maps satellite view with profile-aware community service queries, and built the Gemini-powered multilingual chatbot.
- **Chatbot Support & Project Planning:** Contributed to chatbot development and led project planning, scoping, and pitch preparation. All four members collaborated on the final pitch.

---

Developed for Hack Canada 2026
