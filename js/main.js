// Main JavaScript for Agentes IA Academy

// Smooth scrolling
function scrollToModules() {
    document.getElementById('modulos').scrollIntoView({ behavior: 'smooth' });
}

function scrollToRoadmap() {
    document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth' });
}

// Navigation to modules
function goToModule(moduleNumber) {
    // All modules are accessible
    window.location.href = `pages/module${moduleNumber}.html`;
}

// Locked message removed - all modules are now accessible

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -40%);
        }
    }
`;
document.head.appendChild(style);

// Progress tracking
const progress = {
    currentModule: 1,
    completedModules: [],
    scores: {}
};

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('agentesIAProgress');
    if (saved) {
        const savedProgress = JSON.parse(saved);
        Object.assign(progress, savedProgress);
        updateProgressUI();
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('agentesIAProgress', JSON.stringify(progress));
}

// Update progress UI
function updateProgressUI() {
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    roadmapItems.forEach((item, index) => {
        const moduleNum = index + 1;
        const badge = item.querySelector('.progress-badge');
        
        if (progress.completedModules.includes(moduleNum)) {
            badge.textContent = '✅';
            item.classList.add('completed');
        } else if (moduleNum === progress.currentModule) {
            badge.textContent = '▶️';
            item.classList.add('current');
        } else if (moduleNum < progress.currentModule) {
            badge.textContent = '✅';
        } else {
            badge.textContent = '🔒';
        }
    });
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const robots = ['🤖', '🦾', '🦿', '👾', '🛸'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const robot = document.createElement('div');
            robot.textContent = robots[Math.floor(Math.random() * robots.length)];
            robot.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                font-size: 3rem;
                animation: spin 2s linear;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(robot);
            setTimeout(() => robot.remove(), 2000);
        }, i * 100);
    }
}

const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(2); }
        to { transform: rotate(360deg) scale(1); opacity: 0; }
    }
`;
document.head.appendChild(spinStyle);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    
    // Add entrance animation
    document.querySelectorAll('.roadmap-item, .module-card, .stat-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 100);
    });
});

// Analytics (placeholder for future implementation)
function trackEvent(category, action, label) {
    console.log(`Event: ${category} - ${action} - ${label}`);
    // Here you can add Google Analytics or similar
}

// Track module clicks
document.querySelectorAll('.module-card, .roadmap-item button').forEach(el => {
    el.addEventListener('click', () => {
        trackEvent('Navigation', 'Module Click', el.textContent);
    });
});
