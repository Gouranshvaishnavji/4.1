# EduFlow AI: Platform Technical Documentation

## Overview
EduFlow AI is an agentic learning platform designed to transform static documents (PDFs) into personalized, evolving learning journeys.

## Components Fixed & Improved

### 1. Stability & Core Infrastructure
- **Prisma Engine**: Reverted from v7 to v6.4.1 to ensure compatibility with the sandbox environment while maintaining full ORM capabilities.
- **Strict Typing**: Eliminated `any` types in core AI logic (Mastery, Memory, Processor) and ensured clean production builds.
- **Database Schema**: Implemented a comprehensive schema covering Users, Documents, Modules, Topics, Concepts, Quizzes, Progress, and Sessions.

### 2. AI Logic Refinement
- **Intent Engine**: Improved accuracy by adjusting keyword priority (e.g., "exam" now prioritizes REVISE over TEST) and adding natural language variants for difficulty detection (e.g., "5 year old").
- **Contextual Memory**: Enhanced with session-based struggle tracking and spaced repetition logic. The system now detects "Struggle Patterns" across multiple sessions to identify cognitive overload.
- **Study Plans**: Developed an automated scheduling module that distributes topics across a user-defined timeframe.

### 3. User Experience
- **Guided Onboarding**: Added a multi-step overlay to reduce friction for first-time users.
- **Proactive Suggestions**: The dashboard now serves actionable "AI Recommendations" based on real progress data (e.g., "You struggled with Semaphores...").
- **Deep Focus Mode**: Created a minimalist, distraction-free reading environment with integrated AI mentor insights.

## Trade-offs & Decisions
- **Rule-based vs LLM**: While the platform is designed for LLM integration, core logic (intent, memory) was implemented with robust rule-based heuristics to ensure high performance and reliability in the sandbox environment without external API latency.
- **Local Storage**: Opted for SQLite for zero-config persistence, making the platform easily portable and self-contained.
- **Mocking**: Document parsing is fully simulated for verification purposes, but the underlying chunking logic using `@langchain/textsplitters` is production-ready.

## How to Run
1. `npm install`
2. `npx prisma generate`
3. `npm run build`
4. `npm run dev`
