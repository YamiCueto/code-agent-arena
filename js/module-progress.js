// Progressive Module Unlock System
// Manages the flow: Theory → Game → Quiz
// Only shows current section, hides previous ones

class ModuleProgressManager {
    constructor() {
        this.currentStep = 'theory'; // theory, game, quiz
        this.completedSteps = []; // Track completed steps
        this.init();
    }

    init() {
        // Hide game and quiz sections initially
        this.hideSection('juego');
        this.hideSection('quiz');

        // Listen for game completion to auto-reveal quiz
        this.setupGameCompletionListener();

        // Add "Continue to Quiz" button after game section
        this.addQuizButton();

        // Add navigation buttons to go back to previous sections
        this.addBackNavigationButtons();

        // Check if there's saved progress
        this.loadProgress();
    }

    hideSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
            section.classList.add('locked-section');
        }
    }

    showSection(sectionId, scrollToSection = true) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            section.classList.remove('locked-section');
            section.classList.add('section-reveal');

            // Smooth scroll to the newly unlocked section
            if (scrollToSection) {
                setTimeout(() => {
                    const yOffset = -80; // Offset for navbar
                    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }, 300);
            }
        }
    }

    setupGameCompletionListener() {
        // Listen for custom event dispatched when game is completed
        document.addEventListener('gameCompleted', (event) => {
            if (event.detail && event.detail.module === 'module1') {
                // When game is completed, automatically unlock the quiz
                this.unlockQuiz();
            }
        });
    }

    addQuizButton() {
        const gameSection = document.getElementById('juego');
        if (!gameSection) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'continue-button-container continue-to-quiz';
        buttonContainer.style.cssText = 'text-align: center; margin: 3rem 0; padding: 2rem;';

        const button = document.createElement('button');
        button.className = 'btn btn-primary continue-btn';
        button.innerHTML = '📝 Continuar al Quiz';
        button.onclick = () => this.unlockQuiz();

        buttonContainer.appendChild(button);
        gameSection.appendChild(buttonContainer);
    }

    addBackNavigationButtons() {
        // Create a stepper component instead of simple back buttons
        this.createStepper();
    }

    createStepper() {
        // Create stepper container
        const stepperContainer = document.createElement('div');
        stepperContainer.className = 'module-stepper';
        stepperContainer.id = 'module-stepper';

        const steps = [
            { id: 'teoria', label: 'Teoría', icon: '📚', step: 'theory' },
            { id: 'juego', label: 'Juego', icon: '🎮', step: 'game' },
            { id: 'quiz', label: 'Quiz', icon: '📝', step: 'quiz' }
        ];

        steps.forEach((stepInfo, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'stepper-step';
            stepElement.dataset.step = stepInfo.step;
            stepElement.dataset.sectionId = stepInfo.id;

            // Step number circle
            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.innerHTML = `<span class="step-icon">${stepInfo.icon}</span>`;

            // Step label
            const stepLabel = document.createElement('div');
            stepLabel.className = 'step-label';
            stepLabel.textContent = stepInfo.label;

            stepElement.appendChild(stepNumber);
            stepElement.appendChild(stepLabel);

            // Add connector line (except for last step)
            if (index < steps.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'step-connector';
                stepElement.appendChild(connector);
            }

            // Add click handler
            stepElement.addEventListener('click', () => {
                this.handleStepClick(stepInfo.step, stepInfo.id);
            });

            stepperContainer.appendChild(stepElement);
        });

        // Insert stepper after module header
        const moduleHeader = document.querySelector('.module-header');
        if (moduleHeader) {
            moduleHeader.parentNode.insertBefore(stepperContainer, moduleHeader.nextSibling);
        }

        // Update stepper state
        this.updateStepper();
    }

    handleStepClick(step, sectionId) {
        // Check if step is accessible
        const stepIndex = ['theory', 'game', 'quiz'].indexOf(step);
        const currentIndex = ['theory', 'game', 'quiz'].indexOf(this.currentStep);

        // Can only go back or to current step
        if (stepIndex <= currentIndex) {
            // Hide current section
            this.hideSection(this.getSectionIdFromStep(this.currentStep));

            // Show clicked section
            this.showSection(sectionId, true);

            // Update stepper visual state
            this.updateStepper();
        } else {
            // Show locked message
            this.showLockedStepMessage(step);
        }
    }

    showLockedStepMessage(step) {
        const messages = {
            'game': 'Primero debes completar la teoría',
            'quiz': 'Primero debes completar el juego'
        };

        this.showUnlockNotification('🔒 Paso Bloqueado', messages[step] || 'Este paso aún no está disponible');
    }

    updateStepper() {
        const stepper = document.getElementById('module-stepper');
        if (!stepper) return;

        const steps = stepper.querySelectorAll('.stepper-step');
        const stepOrder = ['theory', 'game', 'quiz'];

        steps.forEach((stepElement, index) => {
            const step = stepOrder[index];
            const currentIndex = stepOrder.indexOf(this.currentStep);

            // Remove all state classes
            stepElement.classList.remove('completed', 'active', 'locked');

            if (this.completedSteps.includes(step)) {
                // Step is completed
                stepElement.classList.add('completed');
            } else if (step === this.currentStep) {
                // Step is current
                stepElement.classList.add('active');
            } else if (index > currentIndex) {
                // Step is locked
                stepElement.classList.add('locked');
            }

            // Update connector state
            const connector = stepElement.querySelector('.step-connector');
            if (connector) {
                if (this.completedSteps.includes(step)) {
                    connector.classList.add('completed');
                } else {
                    connector.classList.remove('completed');
                }
            }
        });
    }

    showPreviousSection(sectionId) {
        // Hide current section
        this.hideSection(this.getSectionIdFromStep(this.currentStep));

        // Show requested section
        this.showSection(sectionId, true);

        // Update visual state but don't change progress
        // This allows reviewing without losing progress
        this.updateStepper(); // Update stepper when navigating back
    }

    getSectionIdFromStep(step) {
        const mapping = {
            'theory': 'teoria',
            'game': 'juego',
            'quiz': 'quiz'
        };
        return mapping[step] || 'teoria';
    }

    unlockGame() {
        // Prevent multiple unlocks
        if (this.currentStep !== 'theory') return;

        // Mark theory as completed
        if (!this.completedSteps.includes('theory')) {
            this.completedSteps.push('theory');
        }

        // Hide theory section
        this.hideSection('teoria');

        // Show game section
        this.currentStep = 'game';
        this.showSection('juego', true);
        this.saveProgress();
        this.updateStepper();
        this.showUnlockNotification('🎮 Juego Desbloqueado', '¡Has completado la teoría! Ahora puedes jugar.');
    }

    unlockQuiz() {
        // Prevent multiple unlocks
        if (this.currentStep === 'quiz') return;

        // Mark game as completed
        if (!this.completedSteps.includes('game')) {
            this.completedSteps.push('game');
        }

        // Hide game section
        this.hideSection('juego');

        // Show quiz section
        this.currentStep = 'quiz';
        this.showSection('quiz', true);
        this.saveProgress();
        this.updateStepper();
        this.showUnlockNotification('📝 Quiz Desbloqueado', '¡Completaste el juego! Ahora puedes tomar el quiz final.');
    }

    showUnlockNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'section-unlock-notification';
        notification.innerHTML = `
            <h4>${title}</h4>
            <p>${message}</p>
        `;

        // Add to body
        document.body.appendChild(notification);

        // Auto-remove after animation completes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveProgress() {
        const progressData = {
            currentStep: this.currentStep,
            completedSteps: this.completedSteps
        };
        localStorage.setItem('module1_progress', JSON.stringify(progressData));
    }

    loadProgress() {
        const savedData = localStorage.getItem('module1_progress');

        if (!savedData) {
            // No hay progreso guardado - estado inicial
            console.log('No hay progreso guardado, iniciando desde teoría');
            this.currentStep = 'theory';
            this.completedSteps = [];

            // Asegurar que solo teoría esté visible
            this.showSection('teoria', false);
            this.hideSection('juego');
            this.hideSection('quiz');
            return;
        }

        try {
            const progressData = JSON.parse(savedData);
            this.currentStep = progressData.currentStep || 'theory';
            this.completedSteps = progressData.completedSteps || [];

            // Hide all sections first
            this.hideSection('teoria');
            this.hideSection('juego');
            this.hideSection('quiz');

            // Show only the current section (don't scroll on page load)
            const currentSectionId = this.getSectionIdFromStep(this.currentStep);
            this.showSection(currentSectionId, false);
        } catch (e) {
            // If old format, try to migrate
            const oldProgress = savedData;
            if (oldProgress === 'game' || oldProgress === 'quiz') {
                this.currentStep = oldProgress;
                this.completedSteps = ['theory'];
                if (oldProgress === 'quiz') {
                    this.completedSteps.push('game');
                }

                // Hide all and show current
                this.hideSection('teoria');
                this.hideSection('juego');
                this.hideSection('quiz');
                this.showSection(this.getSectionIdFromStep(this.currentStep), false);

                // Save in new format
                this.saveProgress();
            } else {
                // Formato desconocido - resetear a estado inicial
                console.warn('Formato de progreso desconocido, reseteando a teoría');
                this.currentStep = 'theory';
                this.completedSteps = [];
                this.hideSection('juego');
                this.hideSection('quiz');
                this.showSection('teoria', false);
                this.saveProgress();
            }
        }
    }

    resetProgress() {
        localStorage.removeItem('module1_progress');
        location.reload();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.moduleProgress = new ModuleProgressManager();
    });
} else {
    window.moduleProgress = new ModuleProgressManager();
}

// Add reset button to navbar (optional - for testing)
window.addEventListener('load', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.location.pathname.includes('module1')) {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn btn-small';
        resetBtn.innerHTML = '🔄 Reiniciar Progreso';
        resetBtn.style.cssText = 'margin-left: auto; font-size: 0.75rem; padding: 0.5rem 1rem;';
        resetBtn.onclick = () => {
            if (confirm('¿Reiniciar el progreso del módulo?')) {
                window.moduleProgress.resetProgress();
            }
        };
        navbar.querySelector('.nav-links').appendChild(resetBtn);
    }
});
