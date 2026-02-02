// ============================================
// COMPARISON QUIZ - INTERACTIVE FUNCTIONALITY
// ============================================

class ComparisonQuiz {
    constructor() {
        this.scenarios = [
            {
                id: 1,
                title: "Escenario 1: Búsqueda de Información",
                description: "Necesitas que un agente busque información en internet sobre el clima, luego encuentre restaurantes cercanos basándose en esa información, y finalmente haga una reserva.",
                correctAnswer: "ReAct",
                explanation: "ReAct es ideal aquí porque necesitas alternar entre pensar y actuar múltiples veces. El agente debe: 1) Pensar qué buscar, 2) Buscar clima, 3) Observar resultado, 4) Pensar en restaurantes, 5) Buscar restaurantes, 6) Hacer reserva. Es un ciclo iterativo de acción-observación."
            },
            {
                id: 2,
                title: "Escenario 2: Problema Matemático Complejo",
                description: "Tienes que resolver un problema de matemáticas que requiere múltiples pasos de razonamiento, como calcular el área de una figura geométrica compleja.",
                correctAnswer: "CoT",
                explanation: "Chain-of-Thought es perfecto para problemas que requieren razonamiento paso a paso sin necesidad de acciones externas. El agente puede 'pensar en voz alta' cada paso del cálculo matemático de forma secuencial."
            },
            {
                id: 3,
                title: "Escenario 3: Planificación de Proyecto",
                description: "Necesitas planificar un proyecto de software y quieres explorar diferentes arquitecturas posibles antes de decidir cuál es la mejor opción.",
                correctAnswer: "ToT",
                explanation: "Tree of Thoughts es ideal cuando necesitas explorar múltiples caminos posibles. El agente puede generar varias opciones de arquitectura, evaluarlas, y si una no funciona, hacer backtracking y probar otra rama del árbol de decisiones."
            },
            {
                id: 4,
                title: "Escenario 4: Análisis de Datos",
                description: "Debes analizar un dataset y explicar paso a paso cómo llegaste a tus conclusiones estadísticas.",
                correctAnswer: "CoT",
                explanation: "CoT es excelente para análisis que requieren explicación detallada. Permite mostrar cada paso del razonamiento estadístico de forma clara y transparente."
            },
            {
                id: 5,
                title: "Escenario 5: Agente Autónomo",
                description: "Necesitas un agente que navegue por un sitio web, complete formularios, y ajuste su estrategia basándose en los resultados que va obteniendo.",
                correctAnswer: "ReAct",
                explanation: "ReAct es perfecto para agentes autónomos que necesitan interactuar con el entorno y ajustar su comportamiento basándose en observaciones. El ciclo Thought-Action-Observation permite adaptación continua."
            }
        ];

        this.currentScenario = 0;
        this.score = 0;
        this.init();
    }

    init() {
        this.renderScenario();
        this.attachEventListeners();
    }

    renderScenario() {
        const scenario = this.scenarios[this.currentScenario];
        const container = document.getElementById('comparison-quiz-container');

        if (!container) return;

        container.innerHTML = `
            <div class="quiz-scenario">
                <h4>${scenario.title}</h4>
                <p>${scenario.description}</p>
            </div>

            <div class="quiz-options">
                <button class="quiz-option-btn" data-answer="ReAct">
                    🔄 ReAct
                </button>
                <button class="quiz-option-btn" data-answer="CoT">
                    🧠 Chain-of-Thought
                </button>
                <button class="quiz-option-btn" data-answer="ToT">
                    🌳 Tree of Thoughts
                </button>
            </div>

            <div class="quiz-feedback" id="quiz-feedback"></div>

            <div style="text-align: center; margin-top: 2rem; color: var(--futuristic-text-secondary);">
                <p>Escenario ${this.currentScenario + 1} de ${this.scenarios.length} | Puntaje: ${this.score}/${this.scenarios.length}</p>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const buttons = document.querySelectorAll('.quiz-option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e));
        });
    }

    handleAnswer(event) {
        const selectedAnswer = event.target.dataset.answer;
        const scenario = this.scenarios[this.currentScenario];
        const isCorrect = selectedAnswer === scenario.correctAnswer;

        // Update score
        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        const feedback = document.getElementById('quiz-feedback');
        feedback.className = 'quiz-feedback show';
        feedback.innerHTML = `
            <h5>${isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}</h5>
            <p><strong>Respuesta correcta:</strong> ${scenario.correctAnswer}</p>
            <p>${scenario.explanation}</p>
            ${this.currentScenario < this.scenarios.length - 1
                ? '<button class="btn btn-primary" onclick="comparisonQuiz.nextScenario()" style="margin-top: 1rem;">Siguiente Escenario →</button>'
                : '<button class="btn btn-primary" onclick="comparisonQuiz.showResults()" style="margin-top: 1rem;">Ver Resultados Finales</button>'
            }
        `;

        // Disable all buttons
        const buttons = document.querySelectorAll('.quiz-option-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === scenario.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.dataset.answer === selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
    }

    nextScenario() {
        this.currentScenario++;
        this.renderScenario();
    }

    showResults() {
        const container = document.getElementById('comparison-quiz-container');
        const percentage = Math.round((this.score / this.scenarios.length) * 100);

        let message = '';
        let emoji = '';

        if (percentage === 100) {
            message = '¡Perfecto! Dominas completamente las diferencias entre ReAct, CoT y ToT.';
            emoji = '🏆';
        } else if (percentage >= 80) {
            message = '¡Excelente! Tienes un muy buen entendimiento de cuándo usar cada técnica.';
            emoji = '🎉';
        } else if (percentage >= 60) {
            message = 'Bien hecho. Tienes una buena base, pero revisa los conceptos nuevamente.';
            emoji = '👍';
        } else {
            message = 'Necesitas repasar las diferencias entre las técnicas. ¡Inténtalo de nuevo!';
            emoji = '📚';
        }

        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${emoji}</div>
                <h3 style="color: var(--futuristic-cyan-bright); font-family: 'Orbitron', sans-serif; margin-bottom: 1rem;">
                    Resultados Finales
                </h3>
                <p style="font-size: 2rem; color: var(--futuristic-cyan); margin-bottom: 1rem;">
                    ${this.score} / ${this.scenarios.length}
                </p>
                <p style="font-size: 1.5rem; color: var(--futuristic-text-primary); margin-bottom: 2rem;">
                    ${percentage}%
                </p>
                <p style="color: var(--futuristic-text-secondary); margin-bottom: 2rem;">
                    ${message}
                </p>
                <button class="btn btn-primary" onclick="comparisonQuiz.restart()">
                    🔄 Intentar de Nuevo
                </button>
            </div>
        `;
    }

    restart() {
        this.currentScenario = 0;
        this.score = 0;
        this.renderScenario();
    }
}

// Initialize quiz when DOM is loaded
let comparisonQuiz;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('comparison-quiz-container')) {
        comparisonQuiz = new ComparisonQuiz();
    }
});
