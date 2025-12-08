# GitHub Copilot Instructions for Code Agent Arena

## 📋 Project Overview
**Code Agent Arena** is an interactive educational platform teaching AI agent concepts through games. Built with vanilla HTML5, CSS3, and JavaScript (no frameworks) for maximum accessibility and simplicity.

## 🎯 Core Principles

### 1. Clean Code
- **Functions:** Single responsibility, max 50 lines
- **Variables:** Descriptive names in camelCase (JS) or kebab-case (CSS)
- **Comments:** Explain WHY, not WHAT
- **DRY:** Extract repeated code into reusable functions
- **KISS:** Keep solutions simple, avoid over-engineering

### 2. File Organization

#### CSS Structure
**IMPORTANT:** When `games.css` exceeds 1500 lines, split into:
- `css/games/memory-challenge.css` - Module 3 specific styles
- `css/games/provider-matcher.css` - Module 4 specific styles
- `css/games/agent-builder.css` - Module 5 specific styles
- `css/games/shared.css` - Common game styles (buttons, animations, feedback)
- Keep `css/games.css` only for Module 1 & 2

#### JavaScript Structure
- **One game = One file** in `js/games/`
- Shared utilities in `js/utils.js` (if needed)
- Module-specific logic stays in its game file
- Global functions in `js/main.js`

#### HTML Structure
- One module = One HTML file in `pages/`
- Consistent structure across all modules
- Semantic HTML5 tags
- Accessibility attributes (aria-labels, alt texts)

### 3. Naming Conventions

#### CSS Classes
```css
/* Block-Element-Modifier pattern */
.module-card {}
.module-card__title {}
.module-card--locked {}

/* Game-specific prefixes */
.memory-game {}
.provider-game {}
.agent-builder {}

/* State classes */
.is-active, .is-hidden, .is-loading
.correct, .incorrect, .disabled
```

#### JavaScript Functions
```javascript
// Verbs for actions
initGame(), startTimer(), checkAnswer()

// Getters return values
getScore(), getCurrentModule()

// Boolean functions start with is/has/can
isCorrect(), hasCompleted(), canProceed()

// Event handlers with 'handle' or 'on'
handleClick(), onSubmit()
```

### 4. Code Style

#### JavaScript
```javascript
// Use const by default, let only if reassignment needed
const maxScore = 100;
let currentScore = 0;

// Arrow functions for callbacks
array.map(item => item.value);

// Template literals for strings
const message = `Score: ${score}/100`;

// Destructuring when useful
const { name, age } = user;

// Early returns to avoid nesting
if (!isValid) return;
processData();

// Async/await over promises
async function loadData() {
    try {
        const data = await fetch(url);
        return data.json();
    } catch (error) {
        console.error('Error:', error);
    }
}
```

#### CSS
```css
/* Mobile-first responsive design */
.element {
    /* Base styles for mobile */
    width: 100%;
}

@media (min-width: 768px) {
    .element {
        /* Tablet styles */
        width: 50%;
    }
}

/* CSS custom properties for theming */
:root {
    --primary-color: #667eea;
    --spacing-sm: 0.5rem;
}

/* Logical properties over physical */
margin-inline: 1rem; /* Instead of margin-left + margin-right */
padding-block: 2rem; /* Instead of padding-top + padding-bottom */
```

### 5. Accessibility

```html
<!-- Always include -->
<button aria-label="Start game">▶️</button>
<img src="icon.png" alt="AI agent icon">

<!-- Form labels -->
<label for="answer">Your answer:</label>
<input id="answer" type="text">

<!-- Semantic HTML -->
<nav>, <main>, <article>, <section>, <aside>
<h1> to <h6> in proper order

<!-- Keyboard navigation -->
tabindex="0" for interactive elements
Focus states visible with :focus-visible
```

### 6. Performance

```javascript
// Debounce expensive operations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Use event delegation
document.querySelector('.game-board')
    .addEventListener('click', (e) => {
        if (e.target.matches('.answer-btn')) {
            handleAnswer(e.target);
        }
    });

// Lazy load images
<img loading="lazy" src="image.jpg" alt="Description">
```

### 7. Error Handling

```javascript
// Always handle errors gracefully
function saveProgress(data) {
    try {
        localStorage.setItem('progress', JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save progress:', error);
        showNotification('Progress not saved. Check storage permissions.');
    }
}

// Validate user input
function checkAnswer(answer) {
    if (!answer || answer.trim() === '') {
        showError('Please provide an answer');
        return false;
    }
    // Process valid answer
}
```

### 8. Git Commit Messages

```bash
# Format: <type>: <description>

# Types:
feat: Add new feature
fix: Bug fix
style: CSS/formatting changes
refactor: Code restructure without behavior change
docs: Documentation updates
perf: Performance improvements
test: Add tests
chore: Build/config changes

# Examples:
feat: Add Module 5 agent builder game
fix: Correct quiz answer validation in Module 3
style: Split games.css into modular files
refactor: Extract common game utilities
docs: Update README with deployment instructions
```

### 9. Browser Compatibility

```javascript
// Support last 2 versions of major browsers
// Chrome, Firefox, Safari, Edge

// Use modern JS with fallbacks
const userAgent = navigator.userAgent ?? 'Unknown';

// Avoid very new features without polyfills
// Check caniuse.com for feature support
```

### 10. Testing Checklist

Before committing:
- ✅ Test on mobile (responsive)
- ✅ Test keyboard navigation
- ✅ Test with screen reader (basic)
- ✅ Check console for errors
- ✅ Verify all links work
- ✅ Test quiz randomization
- ✅ Test game completion flow
- ✅ Verify LocalStorage works
- ✅ Check cross-browser (Chrome, Firefox)

## 🎨 Design System

### Colors
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--text-dark: #1f2937;
--text-light: #6b7280;
```

### Typography
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Courier New', monospace;

/* Scale */
font-size: 0.875rem; /* Small */
font-size: 1rem;     /* Base */
font-size: 1.125rem; /* Large */
font-size: 1.5rem;   /* Heading 3 */
font-size: 2rem;     /* Heading 2 */
font-size: 2.5rem;   /* Heading 1 */
```

### Spacing
```css
/* Use rem units, multiples of 0.25rem */
0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem, 4rem
```

### Animations
```css
/* Keep under 300ms for snappy feel */
transition: all 0.3s ease;

/* Use transform for performance */
transform: translateY(-5px);
transform: scale(1.05);

/* Named keyframes for complex animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

## 🎮 Game Development Pattern

Each game follows this structure:

```javascript
// 1. State variables
let currentQuestion = 0;
let score = 0;
const questions = [...];

// 2. Initialization
function initGame() {
    resetState();
    shuffleQuestions();
    displayQuestion();
}

// 3. Core logic
function checkAnswer(answer) {
    const isCorrect = validate(answer);
    updateScore(isCorrect);
    showFeedback(isCorrect);
    moveToNext();
}

// 4. UI updates
function displayQuestion() {
    // Update DOM
}

function showFeedback(type) {
    // Visual feedback
}

// 5. State management
function saveProgress() {
    localStorage.setItem('module-X', JSON.stringify(state));
}

// 6. Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile first */
/* Base styles: 320px - 767px */

@media (min-width: 768px) {
    /* Tablet: 768px - 1023px */
}

@media (min-width: 1024px) {
    /* Desktop: 1024px+ */
}

@media (min-width: 1440px) {
    /* Large desktop: 1440px+ */
}
```

## 🔒 Security Best Practices

```javascript
// Sanitize user input (even though no backend)
function sanitize(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// No eval() or innerHTML with user data
// Use textContent or createElement

// Validate on client (UX) even if no server
```

## 🌟 User Experience Principles

1. **Immediate Feedback:** Show result within 300ms
2. **Progress Indicators:** Always show where user is
3. **Error Recovery:** Allow retries, show helpful messages
4. **Consistency:** Same patterns across all modules
5. **Delight:** Smooth animations, encouraging messages
6. **Accessibility:** Works with keyboard, screen readers
7. **Performance:** < 3s page load, < 100ms interactions

## 📝 Documentation Standards

```javascript
/**
 * Checks if the user's answer is correct
 * @param {string} userAnswer - The answer provided by the user
 * @param {string} correctAnswer - The correct answer
 * @returns {boolean} True if answers match
 */
function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer.trim().toLowerCase() === 
           correctAnswer.trim().toLowerCase();
}
```

## 🚀 Deployment Checklist

Before pushing to main:
- ✅ All games tested and working
- ✅ No console errors
- ✅ All links functional
- ✅ Mobile responsive verified
- ✅ Quiz randomization works
- ✅ Progress saving works
- ✅ Navigation between modules works
- ✅ Attribution footer present
- ✅ README updated if needed
- ✅ Commit message follows convention

## 🎓 Educational Content Guidelines

1. **Language:** Simple Spanish, avoid jargon
2. **Examples:** Real-world, relatable scenarios
3. **Progression:** Easy → Medium → Hard
4. **Feedback:** Encouraging, educational
5. **Visuals:** Emojis for engagement, diagrams when helpful
6. **Length:** Theory sections 5-8 min read
7. **Interactivity:** Games 5-10 min to complete

## 🔧 Code Review Focus Areas

When reviewing code, check:
1. **Readability:** Can someone else understand it?
2. **Maintainability:** Easy to modify/extend?
3. **Performance:** No unnecessary loops/DOM queries?
4. **Accessibility:** Keyboard + screen reader friendly?
5. **Consistency:** Matches project patterns?
6. **Edge cases:** Handles empty/invalid input?
7. **Browser compat:** Works on target browsers?

---

**Remember:** This is an educational project for ALL ages. Code should be:
- ✨ Simple and readable
- 🎮 Fun and engaging
- 📚 Educational and clear
- 🚀 Fast and responsive
- ♿ Accessible to everyone
- 💚 Easy to maintain and extend

**Attribution:** Always include "Hecho con ❤️ por Yamid Cueto" in footer
