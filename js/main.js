// Main JavaScript for Agentes IA Academy

// Smooth scrolling
function scrollToModules() {
    document.getElementById('modulos').scrollIntoView({ behavior: 'smooth' });
}

function scrollToRoadmap() {
    document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth' });
}

// Navigation to modules - Free access to all modules
function goToModule(moduleNumber) {
    // Determinar la ruta correcta basándose en la ubicación actual
    const currentPath = window.location.pathname;
    const targetPath = currentPath.includes('/pages/') 
        ? `module${moduleNumber}.html` 
        : `pages/module${moduleNumber}.html`;
    
    // Navegar directamente sin restricciones
    window.location.href = targetPath;
}

// Lock system removed - all modules are freely accessible

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
    const moduleCards = document.querySelectorAll('.module-card');
    const completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');
    
    roadmapItems.forEach((item, index) => {
        const moduleNum = index + 1;
        const badge = item.querySelector('.progress-badge');
        const button = item.querySelector('.btn');
        
        if (completedModules.includes(`module${moduleNum}`)) {
            badge.textContent = '✅';
            item.classList.add('completed');
            item.classList.remove('locked');
            if (button) button.disabled = false;
        } else if (moduleNum === 1 || completedModules.includes(`module${moduleNum - 1}`)) {
            badge.textContent = '🔓';
            item.classList.remove('locked', 'completed');
            item.classList.add('available');
            if (button) button.disabled = false;
        } else {
            badge.textContent = '🔒';
            item.classList.add('locked');
            item.classList.remove('completed', 'available');
            if (button) button.disabled = true;
        }
    });
    
    // Actualizar tarjetas de módulos - todos los módulos accesibles
    moduleCards.forEach((card, index) => {
        const moduleNum = index + 1;
        
        if (completedModules.includes(`module${moduleNum}`)) {
            card.classList.add('completed');
            card.classList.remove('locked');
            
            // Remover overlay de candado si existe
            const overlay = card.querySelector('.lock-overlay');
            if (overlay) {
                overlay.remove();
            }
        } else {
            card.classList.remove('locked', 'completed');
            
            // Remover overlay de candado si existe
            const overlay = card.querySelector('.lock-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    });
    
    // Actualizar estadísticas de progreso
    updateProgressStats(completedModules.length);
}

// Actualizar estadísticas de progreso
function updateProgressStats(completedCount) {
    const totalModules = 7;
    const percentage = Math.round((completedCount / totalModules) * 100);
    
    // Actualizar en la página principal si existe
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${completedCount}/${totalModules} módulos completados (${percentage}%)`;
    }
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

// Marcar módulo como completado
function completeModule(moduleNumber) {
    const completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');
    const moduleId = `module${moduleNumber}`;
    
    if (!completedModules.includes(moduleId)) {
        completedModules.push(moduleId);
        localStorage.setItem('completedModules', JSON.stringify(completedModules));
        
        // Mostrar celebración
        showCompletionCelebration(moduleNumber);
        
        // Actualizar UI
        if (typeof updateProgressUI === 'function') {
            updateProgressUI();
        }
    }
}

// Mostrar celebración de completación
function showCompletionCelebration(moduleNumber) {
    const modal = document.createElement('div');
    modal.className = 'celebration-modal';
    modal.innerHTML = `
        <div class="celebration-content">
            <div class="celebration-icon">🎉</div>
            <h2>¡Módulo ${moduleNumber} Completado!</h2>
            <p>Excelente trabajo. Has desbloqueado el siguiente módulo.</p>
            <div class="celebration-stats">
                <div class="stat-item">
                    <div class="stat-value">${moduleNumber}/7</div>
                    <div class="stat-label">Módulos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round((moduleNumber/7)*100)}%</div>
                    <div class="stat-label">Progreso</div>
                </div>
            </div>
            <button onclick="closeCelebrationModal()" class="btn btn-primary">Continuar</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Confetti effect
    createConfetti();
}

function closeCelebrationModal() {
    const modal = document.querySelector('.celebration-modal');
    if (modal) {
        modal.remove();
    }
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

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

// ========== Export/Import Progress System ==========

/**
 * Export user progress as JSON file
 */
function exportProgress() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        completedModules: localStorage.getItem('completedModules') || '[]',
        moduleScores: localStorage.getItem('moduleScores') || '{}',
        appName: 'Code Agent Arena'
    };
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-agent-arena-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('✅ Progreso exportado exitosamente', 'success');
    trackEvent('Progress', 'Export', 'Success');
}

/**
 * Import user progress from JSON file
 */
function importProgress(file) {
    if (!file) {
        showNotification('❌ No se seleccionó ningún archivo', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.completedModules || !data.moduleScores) {
                throw new Error('Formato de archivo inválido');
            }
            
            // Validate it's from Code Agent Arena
            if (data.appName !== 'Code Agent Arena') {
                throw new Error('Este archivo no es de Code Agent Arena');
            }
            
            // Restore data
            localStorage.setItem('completedModules', data.completedModules);
            localStorage.setItem('moduleScores', data.moduleScores);
            
            // Update UI
            updateProgressUI();
            
            const completedCount = JSON.parse(data.completedModules).length;
            showNotification(`🎉 Progreso restaurado: ${completedCount} módulos completados`, 'success');
            trackEvent('Progress', 'Import', 'Success');
            
        } catch (error) {
            console.error('Error importing progress:', error);
            showNotification('❌ Error al importar: ' + error.message, 'error');
            trackEvent('Progress', 'Import', 'Error');
        }
    };
    
    reader.onerror = () => {
        showNotification('❌ Error al leer el archivo', 'error');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    document.getElementById('import-file').value = '';
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
