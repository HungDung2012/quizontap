# Lich Su Dang Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local HTML/CSS/JS quiz app for "Lich su Dang" review.

**Architecture:** The app uses static browser files and one pure JavaScript quiz state module. UI rendering is kept separate from scoring so behavior can be tested with Node.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node built-in `assert` for tests.

---

### File Structure

- Create: `quiz-core.test.js` to verify scoring and navigation behavior.
- Create: `quiz-core.js` for pure state transitions.
- Create: `questions.js` for editable question data.
- Create: `index.html` for static page structure.
- Create: `style.css` for responsive UI styling.
- Create: `script.js` for browser rendering and events.
- Create: `README.md` with editing and running instructions.

### Task 1: Core Quiz Logic

**Files:**
- Create: `quiz-core.test.js`
- Create: `quiz-core.js`

- [ ] **Step 1: Write failing tests**

Create `quiz-core.test.js` with assertions for initial state, correct answer scoring, wrong answer scoring, and finishing after the last question.

- [ ] **Step 2: Run tests to verify failure**

Run: `node quiz-core.test.js`

Expected: FAIL because `quiz-core.js` does not exist yet.

- [ ] **Step 3: Implement `quiz-core.js`**

Create functions `createQuizState`, `answerCurrentQuestion`, `goToNextQuestion`, and `getCurrentQuestion`.

- [ ] **Step 4: Run tests to verify pass**

Run: `node quiz-core.test.js`

Expected: PASS.

### Task 2: Static App UI

**Files:**
- Create: `questions.js`
- Create: `index.html`
- Create: `style.css`
- Create: `script.js`

- [ ] **Step 1: Add sample question bank**

Create `questions.js` with sample questions and comments showing how to replace them.

- [ ] **Step 2: Add HTML shell**

Create `index.html` loading `questions.js`, `quiz-core.js`, and `script.js`.

- [ ] **Step 3: Add styling**

Create `style.css` with responsive layout and readable quiz controls.

- [ ] **Step 4: Connect UI**

Create `script.js` that renders question progress, options, feedback, score, next, and restart.

### Task 3: Docs And Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Document usage**

Explain opening `index.html`, editing `questions.js`, and running `node quiz-core.test.js`.

- [ ] **Step 2: Verify**

Run: `node quiz-core.test.js`

Expected: PASS.
