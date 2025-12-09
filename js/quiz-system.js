/**
 * Quiz System with Progress Tracking
 * Shared functionality for all module quizzes
 */

// Mínimo de aciertos requeridos para completar (80%)
const PASSING_SCORE = 0.8;

/**
 * Evaluar quiz y actualizar progreso
 * @param {number} correctAnswers - Número de respuestas correctas
 * @param {number} totalQuestions - Total de preguntas
 * @param {number} moduleNumber - Número del módulo actual
 */
function evaluateQuizAndUpdateProgress(correctAnswers, totalQuestions, moduleNumber) {
    const score = correctAnswers / totalQuestions;
    const passed = score >= PASSING_SCORE;
    
    if (passed) {
        // Marcar módulo como completado
        completeModuleInLocalStorage(moduleNumber);
        
        // Guardar mejor puntaje
        saveBestScore(moduleNumber, score);
        
        return {
            passed: true,
            score: score,
            percentage: Math.round(score * 100),
            message: `¡Excelente! Has completado el Módulo ${moduleNumber} con ${Math.round(score * 100)}%`
        };
    } else {
        return {
            passed: false,
            score: score,
            percentage: Math.round(score * 100),
            message: `Necesitas al menos 80% para aprobar. Obtuviste ${Math.round(score * 100)}%. ¡Inténtalo de nuevo!`
        };
    }
}

/**
 * Marcar módulo como completado en localStorage
 */
function completeModuleInLocalStorage(moduleNumber) {
    const completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');
    const moduleId = `module${moduleNumber}`;
    
    if (!completedModules.includes(moduleId)) {
        completedModules.push(moduleId);
        localStorage.setItem('completedModules', JSON.stringify(completedModules));
        
        // Disparar evento personalizado para que main.js lo detecte
        window.dispatchEvent(new CustomEvent('moduleCompleted', {
            detail: { moduleNumber: moduleNumber }
        }));
    }
}

/**
 * Guardar mejor puntaje del módulo
 */
function saveBestScore(moduleNumber, score) {
    const scores = JSON.parse(localStorage.getItem('moduleScores') || '{}');
    const moduleKey = `module${moduleNumber}`;
    
    if (!scores[moduleKey] || score > scores[moduleKey]) {
        scores[moduleKey] = score;
        localStorage.setItem('moduleScores', JSON.stringify(scores));
    }
}

/**
 * Obtener mejor puntaje del módulo
 */
function getBestScore(moduleNumber) {
    const scores = JSON.parse(localStorage.getItem('moduleScores') || '{}');
    const moduleKey = `module${moduleNumber}`;
    return scores[moduleKey] || 0;
}

/**
 * Verificar si el módulo está completado
 */
function isModuleCompleted(moduleNumber) {
    const completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');
    return completedModules.includes(`module${moduleNumber}`);
}

/**
 * Mostrar modal de resultados del quiz
 */
function showQuizResults(result, moduleNumber) {
    const modal = document.createElement('div');
    modal.className = 'quiz-results-modal';
    
    const emoji = result.passed ? '🎉' : '💪';
    const statusClass = result.passed ? 'passed' : 'failed';
    
    modal.innerHTML = `
        <div class="quiz-results-content ${statusClass}">
            <div class="quiz-icon">${emoji}</div>
            <h2>${result.passed ? '¡Aprobado!' : 'Casi lo logras'}</h2>
            <div class="quiz-score">
                <div class="score-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                        <circle cx="50" cy="50" r="45" fill="none" 
                                stroke="${result.passed ? '#10b981' : '#f59e0b'}" 
                                stroke-width="8"
                                stroke-dasharray="${result.percentage * 2.827}, 282.7"
                                stroke-dashoffset="70.675"
                                transform="rotate(-90 50 50)"/>
                    </svg>
                    <div class="score-text">${result.percentage}%</div>
                </div>
            </div>
            <p class="quiz-message">${result.message}</p>
            ${result.passed ? 
                `<div class="next-module-hint">
                    <p>✨ Has desbloqueado el <strong>Módulo ${moduleNumber + 1}</strong></p>
                </div>` : 
                `<div class="retry-hint">
                    <p>💡 Revisa la teoría y vuelve a intentarlo</p>
                </div>`
            }
            <div class="quiz-actions">
                ${result.passed ? 
                    `<button onclick="goToNextModule(${moduleNumber})" class="btn btn-primary">
                        Siguiente Módulo →
                    </button>` : 
                    `<button onclick="retryQuiz()" class="btn btn-primary">
                        Reintentar Quiz
                    </button>`
                }
                <button onclick="closeQuizResults()" class="btn btn-secondary">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Confetti si aprobó
    if (result.passed) {
        setTimeout(() => createQuizConfetti(), 300);
    }
}

function closeQuizResults() {
    const modal = document.querySelector('.quiz-results-modal');
    if (modal) {
        modal.remove();
    }
}

function goToNextModule(currentModule) {
    closeQuizResults();
    const nextModule = currentModule + 1;
    if (nextModule <= 7) {
        window.location.href = `module${nextModule}.html`;
    } else {
        window.location.href = '../index.html';
    }
}

function retryQuiz() {
    closeQuizResults();
    location.reload();
}

function createQuizConfetti() {
    const colors = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                z-index: 10001;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

// Escuchar evento de completación de módulo
if (typeof window !== 'undefined') {
    window.addEventListener('moduleCompleted', (event) => {
        const { moduleNumber } = event.detail;
        console.log(`Module ${moduleNumber} completed!`);
        
        // Llamar a función de celebración si existe
        if (typeof showCompletionCelebration === 'function') {
            showCompletionCelebration(moduleNumber);
        }
    });
}
