// Enhanced ReAct Simulator - Improved Interactive Version
// Features: Play/Pause controls, Timeline, Step-by-step animation, Multiple scenarios

class ReactSimulatorEnhanced {
    constructor() {
        this.currentScenario = 0;
        this.currentStep = 0;
        this.isPlaying = false;
        this.playbackSpeed = 2000; // ms between steps
        this.playbackTimer = null;
        this.score = 0;

        this.scenarios = [
            {
                id: 1,
                title: "🍕 Buscar Restaurante Italiano",
                description: "Ayuda al agente a encontrar y reservar un restaurante",
                steps: [
                    {
                        type: 'thought',
                        content: 'Necesito buscar restaurantes italianos en mi ubicación',
                        icon: '💭',
                        color: '#0ea5e9'
                    },
                    {
                        type: 'action',
                        content: 'Buscar en Google Maps "restaurante italiano cerca"',
                        icon: '⚡',
                        color: '#10b981'
                    },
                    {
                        type: 'observation',
                        content: 'Encontré 5 restaurantes. El mejor valorado es "La Bella Italia" con 4.8⭐',
                        icon: '👁️',
                        color: '#f59e0b'
                    },
                    {
                        type: 'thought',
                        content: 'Debo verificar el horario y hacer reservación',
                        icon: '💭',
                        color: '#0ea5e9'
                    },
                    {
                        type: 'action',
                        content: 'Llamar a La Bella Italia para reservar mesa',
                        icon: '⚡',
                        color: '#10b981'
                    },
                    {
                        type: 'observation',
                        content: 'Reservación confirmada para 2 personas a las 8 PM ✅',
                        icon: '👁️',
                        color: '#f59e0b'
                    }
                ]
            },
            {
                id: 2,
                title: "📚 Ayudar con Tarea de Matemáticas",
                description: "El agente debe explicar un problema paso a paso",
                steps: [
                    {
                        type: 'thought',
                        content: 'Necesito entender qué problema matemático tiene el estudiante',
                        icon: '💭',
                        color: '#0ea5e9'
                    },
                    {
                        type: 'action',
                        content: 'Preguntar: "¿Qué tipo de problema necesitas resolver?"',
                        icon: '⚡',
                        color: '#10b981'
                    },
                    {
                        type: 'observation',
                        content: 'Estudiante responde: "Es una ecuación cuadrática: x² + 5x + 6 = 0"',
                        icon: '👁️',
                        color: '#f59e0b'
                    },
                    {
                        type: 'thought',
                        content: 'Debo explicar paso a paso cómo factorizar la ecuación',
                        icon: '💭',
                        color: '#0ea5e9'
                    },
                    {
                        type: 'action',
                        content: 'Explicar: "Busquemos dos números que multiplicados den 6 y sumados den 5"',
                        icon: '⚡',
                        color: '#10b981'
                    },
                    {
                        type: 'observation',
                        content: 'El estudiante encontró: (x+2)(x+3) = 0, entonces x = -2 o x = -3 ✅',
                        icon: '👁️',
                        color: '#f59e0b'
                    }
                ]
            },
            {
                id: 3,
                title: "📅 Planificar Reunión de Equipo",
                description: "Organizar una reunión efectiva con el equipo",
                steps: [
                    {
                        type: 'thought',
                        content: 'Debo identificar los temas a discutir y quién debe asistir',
                        icon: '💭',
                        color: '#0ea5e9'
                    },
                    {
                        type: 'action',
                        content: 'Crear lista de temas y revisar disponibilidad del equipo',
                        icon: '⚡',
                        color: '#10b981'
                    },
                    {
                        type: 'observation',
                        content: '3 temas identificados. Equipo disponible el martes a las 3 PM',
                        icon: '👁️',
                        color: '#f59e0b'
                    },
                    {
                        type: 'thought',
                        content: 'Necesito enviar invitación con agenda clara',
                        icon: '💭',
                        color: '#0ea5e9'
                    },
                    {
                        type: 'action',
                        content: 'Enviar invitación de calendario con agenda detallada',
                        icon: '⚡',
                        color: '#10b981'
                    },
                    {
                        type: 'observation',
                        content: '6/6 miembros confirmaron asistencia. Reunión programada ✅',
                        icon: '👁️',
                        color: '#f59e0b'
                    }
                ]
            }
        ];
    }

    init() {
        this.renderSimulator();
        this.attachEventListeners();
        this.updateDisplay();
    }

    renderSimulator() {
        const container = document.getElementById('enhanced-react-simulator');
        if (!container) return;

        container.innerHTML = `
            <div class="react-enhanced-container">
                <!-- Scenario Selector -->
                <div class="scenario-selector">
                    <h3>Selecciona un Escenario:</h3>
                    <div class="scenario-buttons">
                        ${this.scenarios.map((scenario, index) => `
                            <button class="scenario-btn ${index === 0 ? 'active' : ''}" 
                                    data-scenario="${index}">
                                ${scenario.title}
                            </button>
                        `).join('')}
                    </div>
                    <p class="scenario-description">${this.scenarios[0].description}</p>
                </div>

                <!-- Timeline Visualization -->
                <div class="react-timeline">
                    <h3>📊 Timeline del Ciclo ReAct</h3>
                    <div class="timeline-track">
                        ${this.renderTimelineSteps()}
                    </div>
                </div>

                <!-- Main Display Area -->
                <div class="react-display-area">
                    <div class="current-step-display">
                        <div class="step-icon" id="step-icon">💭</div>
                        <div class="step-content">
                            <h4 id="step-type">Thought (Pensamiento)</h4>
                            <p id="step-text">Haz clic en Play para comenzar...</p>
                        </div>
                    </div>
                </div>

                <!-- Playback Controls -->
                <div class="playback-controls">
                    <button class="control-btn" id="btn-prev" title="Paso Anterior">
                        <span>⏮️</span>
                    </button>
                    <button class="control-btn primary" id="btn-play" title="Play/Pause">
                        <span id="play-icon">▶️</span>
                    </button>
                    <button class="control-btn" id="btn-next" title="Siguiente Paso">
                        <span>⏭️</span>
                    </button>
                    <button class="control-btn" id="btn-reset" title="Reiniciar">
                        <span>🔄</span>
                    </button>
                    
                    <div class="speed-control">
                        <label>Velocidad:</label>
                        <select id="speed-select">
                            <option value="3000">Lento</option>
                            <option value="2000" selected>Normal</option>
                            <option value="1000">Rápido</option>
                        </select>
                    </div>
                </div>

                <!-- Progress Info -->
                <div class="progress-info">
                    <div class="cycle-counter">
                        <span>Ciclo: <strong id="cycle-number">1</strong>/3</span>
                    </div>
                    <div class="step-counter">
                        <span>Paso: <strong id="step-number">0</strong>/${this.scenarios[0].steps.length}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" id="progress-fill"></div>
                    </div>
                </div>

                <!-- Completion Message -->
                <div class="completion-message" id="completion-message" style="display: none;">
                    <h3>🎉 ¡Escenario Completado!</h3>
                    <p>Has dominado el ciclo ReAct en este escenario</p>
                    <button class="btn btn-primary" onclick="reactEnhanced.nextScenario()">
                        Siguiente Escenario →
                    </button>
                </div>
            </div>
        `;
    }

    renderTimelineSteps() {
        const scenario = this.scenarios[this.currentScenario];
        return scenario.steps.map((step, index) => `
            <div class="timeline-step ${index === 0 ? 'active' : ''}" 
                 data-step="${index}"
                 style="border-color: ${step.color}">
                <div class="timeline-icon">${step.icon}</div>
                <div class="timeline-label">${step.type}</div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Scenario selection
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeScenario(parseInt(e.target.dataset.scenario));
            });
        });

        // Playback controls
        document.getElementById('btn-play')?.addEventListener('click', () => this.togglePlay());
        document.getElementById('btn-prev')?.addEventListener('click', () => this.previousStep());
        document.getElementById('btn-next')?.addEventListener('click', () => this.nextStep());
        document.getElementById('btn-reset')?.addEventListener('click', () => this.reset());

        // Speed control
        document.getElementById('speed-select')?.addEventListener('change', (e) => {
            this.playbackSpeed = parseInt(e.target.value);
        });

        // Timeline click
        document.querySelectorAll('.timeline-step').forEach(step => {
            step.addEventListener('click', (e) => {
                const stepIndex = parseInt(e.currentTarget.dataset.step);
                this.goToStep(stepIndex);
            });
        });
    }

    changeScenario(index) {
        this.currentScenario = index;
        this.reset();

        // Update scenario buttons
        document.querySelectorAll('.scenario-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        // Update description
        document.querySelector('.scenario-description').textContent =
            this.scenarios[index].description;

        // Re-render timeline
        document.querySelector('.timeline-track').innerHTML = this.renderTimelineSteps();
        this.attachTimelineListeners();
    }

    attachTimelineListeners() {
        document.querySelectorAll('.timeline-step').forEach(step => {
            step.addEventListener('click', (e) => {
                const stepIndex = parseInt(e.currentTarget.dataset.step);
                this.goToStep(stepIndex);
            });
        });
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playIcon = document.getElementById('play-icon');

        if (this.isPlaying) {
            playIcon.textContent = '⏸️';
            this.play();
        } else {
            playIcon.textContent = '▶️';
            this.pause();
        }
    }

    play() {
        if (this.currentStep >= this.scenarios[this.currentScenario].steps.length) {
            this.reset();
        }

        this.playbackTimer = setInterval(() => {
            this.nextStep();

            if (this.currentStep >= this.scenarios[this.currentScenario].steps.length) {
                this.pause();
                this.showCompletion();
            }
        }, this.playbackSpeed);
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('play-icon').textContent = '▶️';
        if (this.playbackTimer) {
            clearInterval(this.playbackTimer);
            this.playbackTimer = null;
        }
    }

    nextStep() {
        const scenario = this.scenarios[this.currentScenario];
        if (this.currentStep < scenario.steps.length) {
            this.currentStep++;
            this.updateDisplay();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateDisplay();
        }
    }

    goToStep(stepIndex) {
        this.pause();
        this.currentStep = stepIndex;
        this.updateDisplay();
    }

    reset() {
        this.pause();
        this.currentStep = 0;
        this.updateDisplay();
        document.getElementById('completion-message').style.display = 'none';
    }

    updateDisplay() {
        const scenario = this.scenarios[this.currentScenario];

        if (this.currentStep === 0) {
            // Initial state
            document.getElementById('step-icon').textContent = '🎯';
            document.getElementById('step-type').textContent = 'Listo para Comenzar';
            document.getElementById('step-text').textContent = 'Haz clic en Play para ver el ciclo ReAct en acción';
        } else {
            const step = scenario.steps[this.currentStep - 1];

            // Update main display
            document.getElementById('step-icon').textContent = step.icon;
            document.getElementById('step-type').textContent = this.getStepTypeName(step.type);
            document.getElementById('step-text').textContent = step.content;

            // Add animation
            const displayArea = document.querySelector('.current-step-display');
            displayArea.style.animation = 'none';
            setTimeout(() => {
                displayArea.style.animation = 'slideInUp 0.5s ease-out';
            }, 10);
        }

        // Update timeline
        document.querySelectorAll('.timeline-step').forEach((el, index) => {
            el.classList.toggle('active', index < this.currentStep);
            el.classList.toggle('current', index === this.currentStep - 1);
        });

        // Update counters
        const totalSteps = scenario.steps.length;
        const cycleNumber = Math.floor((this.currentStep - 1) / 3) + 1;

        document.getElementById('cycle-number').textContent = Math.min(cycleNumber, 3);
        document.getElementById('step-number').textContent = this.currentStep;

        // Update progress bar
        const progress = (this.currentStep / totalSteps) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    getStepTypeName(type) {
        const names = {
            'thought': '💭 Thought (Pensamiento)',
            'action': '⚡ Action (Acción)',
            'observation': '👁️ Observation (Observación)'
        };
        return names[type] || type;
    }

    showCompletion() {
        document.getElementById('completion-message').style.display = 'block';
        document.getElementById('completion-message').style.animation = 'bounceIn 0.6s ease-out';
    }

    nextScenario() {
        const nextIndex = (this.currentScenario + 1) % this.scenarios.length;
        this.changeScenario(nextIndex);
    }
}

// Initialize when DOM is ready
let reactEnhanced;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('enhanced-react-simulator')) {
        reactEnhanced = new ReactSimulatorEnhanced();
        reactEnhanced.init();
    }
});
