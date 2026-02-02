// Chain-of-Thought Interactive Demonstrator
// Shows step-by-step reasoning with animations

class ChainOfThoughtDemo {
    constructor() {
        this.currentExample = 0;
        this.currentStep = 0;

        this.examples = [
            {
                title: "🧮 Problema Matemático",
                problem: "María tiene 3 manzanas. Compra 5 más y regala 2. ¿Cuántas tiene?",
                withoutCoT: "María tiene 6 manzanas",
                steps: [
                    {
                        label: "Paso 1",
                        content: "María comienza con 3 manzanas",
                        calculation: "Inicial: 3",
                        icon: "📝"
                    },
                    {
                        label: "Paso 2",
                        content: "Compra 5 más",
                        calculation: "3 + 5 = 8",
                        icon: "➕"
                    },
                    {
                        label: "Paso 3",
                        content: "Regala 2 manzanas",
                        calculation: "8 - 2 = 6",
                        icon: "➖"
                    },
                    {
                        label: "Respuesta",
                        content: "María tiene 6 manzanas",
                        calculation: "✅ 6 manzanas",
                        icon: "🎯"
                    }
                ]
            },
            {
                title: "🔍 Razonamiento Lógico",
                problem: "Si todos los gatos son mamíferos y Fluffy es un gato, ¿qué podemos concluir?",
                withoutCoT: "Fluffy es un mamífero",
                steps: [
                    {
                        label: "Premisa 1",
                        content: "Todos los gatos son mamíferos",
                        calculation: "Gatos → Mamíferos",
                        icon: "📋"
                    },
                    {
                        label: "Premisa 2",
                        content: "Fluffy es un gato",
                        calculation: "Fluffy = Gato",
                        icon: "🐱"
                    },
                    {
                        label: "Deducción",
                        content: "Si Fluffy es un gato, y todos los gatos son mamíferos...",
                        calculation: "Aplicar regla",
                        icon: "💡"
                    },
                    {
                        label: "Conclusión",
                        content: "Entonces Fluffy es un mamífero",
                        calculation: "✅ Fluffy es mamífero",
                        icon: "🎯"
                    }
                ]
            },
            {
                title: "📅 Planificación",
                problem: "Necesito preparar una presentación para el viernes. Hoy es lunes. ¿Cuánto tiempo tengo?",
                withoutCoT: "Tengo 4 días",
                steps: [
                    {
                        label: "Paso 1",
                        content: "Identificar día actual",
                        calculation: "Hoy: Lunes",
                        icon: "📅"
                    },
                    {
                        label: "Paso 2",
                        content: "Identificar fecha límite",
                        calculation: "Límite: Viernes",
                        icon: "🎯"
                    },
                    {
                        label: "Paso 3",
                        content: "Contar días entre lunes y viernes",
                        calculation: "Lunes → Martes → Miércoles → Jueves → Viernes",
                        icon: "🔢"
                    },
                    {
                        label: "Respuesta",
                        content: "Tengo 4 días completos para preparar",
                        calculation: "✅ 4 días",
                        icon: "⏰"
                    }
                ]
            }
        ];
    }

    init() {
        this.renderDemo();
        this.attachEventListeners();
        this.showExample(0);
    }

    renderDemo() {
        const container = document.getElementById('cot-interactive-demo');
        if (!container) return;

        container.innerHTML = `
            <div class="cot-demo-container">
                <!-- Example Selector -->
                <div class="cot-example-selector">
                    <h3>Selecciona un Ejemplo:</h3>
                    <div class="example-buttons">
                        ${this.examples.map((ex, index) => `
                            <button class="example-btn ${index === 0 ? 'active' : ''}" 
                                    data-example="${index}">
                                ${ex.title}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Step Controls - MOVED TO TOP -->
                <div class="cot-step-controls">
                    <button class="cot-control-btn" id="cot-prev" title="Paso Anterior">
                        ⏮️ Anterior
                    </button>
                    <button class="cot-control-btn primary" id="cot-play" title="Reproducir">
                        <span id="cot-play-icon">▶️</span> <span id="cot-play-text">Reproducir</span>
                    </button>
                    <button class="cot-control-btn" id="cot-next" title="Siguiente Paso">
                        Siguiente ⏭️
                    </button>
                    <button class="cot-control-btn" id="cot-reset" title="Reiniciar">
                        🔄 Reiniciar
                    </button>
                </div>

                <!-- Progress Indicator - MOVED TO TOP -->
                <div class="cot-progress">
                    <span>Paso: <strong id="cot-current-step">0</strong>/<strong id="cot-total-steps">4</strong></span>
                    <div class="cot-progress-bar">
                        <div class="cot-progress-fill" id="cot-progress-fill"></div>
                    </div>
                </div>

                <!-- Problem Display -->
                <div class="cot-problem-display">
                    <h4>🎯 Problema:</h4>
                    <p id="cot-problem"></p>
                </div>

                <!-- Comparison View -->
                <div class="cot-comparison">
                    <div class="comparison-side without-cot">
                        <h4>❌ Sin Chain-of-Thought</h4>
                        <div class="comparison-content">
                            <p class="direct-answer" id="without-cot-answer">
                                Respuesta directa sin explicación
                            </p>
                            <p class="comparison-note">
                                ⚠️ No sabemos cómo llegó a esta respuesta
                            </p>
                        </div>
                    </div>

                    <div class="comparison-divider">
                        <span>VS</span>
                    </div>

                    <div class="comparison-side with-cot">
                        <h4>✅ Con Chain-of-Thought</h4>
                        <div class="comparison-content">
                            <div class="cot-steps-container" id="cot-steps">
                                <!-- Steps will be rendered here -->
                            </div>
                            <p class="comparison-note">
                                ✨ Podemos seguir el razonamiento paso a paso
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Example selection
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showExample(parseInt(e.target.dataset.example));
            });
        });

        // Step controls
        document.getElementById('cot-prev')?.addEventListener('click', () => this.previousStep());
        document.getElementById('cot-next')?.addEventListener('click', () => this.nextStep());
        document.getElementById('cot-play')?.addEventListener('click', () => this.togglePlay());
        document.getElementById('cot-reset')?.addEventListener('click', () => this.reset());
    }

    showExample(index) {
        this.currentExample = index;
        this.currentStep = 0;
        this.isPlaying = false;

        // Update example buttons
        document.querySelectorAll('.example-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        const example = this.examples[index];

        // Update problem
        document.getElementById('cot-problem').textContent = example.problem;

        // Update without CoT answer
        document.getElementById('without-cot-answer').textContent = example.withoutCoT;

        // Update total steps
        document.getElementById('cot-total-steps').textContent = example.steps.length;

        // Render steps
        this.renderSteps();
        this.updateDisplay();
    }

    renderSteps() {
        const example = this.examples[this.currentExample];
        const container = document.getElementById('cot-steps');

        container.innerHTML = example.steps.map((step, index) => `
            <div class="cot-step ${index === 0 ? 'visible' : ''}" data-step="${index}">
                <div class="step-icon">${step.icon}</div>
                <div class="step-details">
                    <div class="step-label">${step.label}:</div>
                    <div class="step-content">${step.content}</div>
                    <div class="step-calculation">${step.calculation}</div>
                </div>
            </div>
        `).join('');
    }

    nextStep() {
        const example = this.examples[this.currentExample];
        if (this.currentStep < example.steps.length) {
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

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playIcon = document.getElementById('cot-play-icon');
        const playText = document.getElementById('cot-play-text');

        if (this.isPlaying) {
            playIcon.textContent = '⏸️';
            playText.textContent = 'Pausar';
            this.play();
        } else {
            playIcon.textContent = '▶️';
            playText.textContent = 'Reproducir';
            this.pause();
        }
    }

    play() {
        const example = this.examples[this.currentExample];

        if (this.currentStep >= example.steps.length) {
            this.reset();
        }

        this.playInterval = setInterval(() => {
            this.nextStep();

            if (this.currentStep >= example.steps.length) {
                this.pause();
            }
        }, 1500);
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('cot-play-icon').textContent = '▶️';
        document.getElementById('cot-play-text').textContent = 'Reproducir';

        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    reset() {
        this.pause();
        this.currentStep = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        const steps = document.querySelectorAll('.cot-step');

        steps.forEach((step, index) => {
            if (index < this.currentStep) {
                step.classList.add('visible');
                step.classList.remove('current');
            } else if (index === this.currentStep) {
                step.classList.add('visible', 'current');
            } else {
                step.classList.remove('visible', 'current');
            }
        });

        // Update progress
        const example = this.examples[this.currentExample];
        const progress = (this.currentStep / example.steps.length) * 100;

        document.getElementById('cot-current-step').textContent = this.currentStep;
        document.getElementById('cot-progress-fill').style.width = `${progress}%`;
    }
}

// Initialize
let cotDemo;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cot-interactive-demo')) {
        cotDemo = new ChainOfThoughtDemo();
        cotDemo.init();
    }
});
