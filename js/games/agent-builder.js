/**
 * Agent Builder Game - Module 5
 * Users configure agents by selecting LLM, memory, tools, and architecture
 */

// Game state
let currentScenario = 0;
let completedScenarios = 0;
let optimalConfigs = 0;
let userConfig = {
    llm: null,
    memory: null,
    tool: null,
    architecture: null
};

// Scenarios with optimal configurations
const scenarios = [
    {
        title: "Soporte al Cliente E-commerce",
        description: "Necesitas un agente que atienda consultas de clientes sobre pedidos, productos y devoluciones. Debe responder 24/7 y consultar el CRM, inventario y sistema de tickets. Los clientes esperan respuestas en menos de 30 segundos.",
        requirements: [
            "🕐 Disponibilidad 24/7",
            "⚡ Respuesta < 30 segundos",
            "🔗 Integración con CRM, inventario, tickets",
            "💬 Conversación natural",
            "🎯 Alta tasa de resolución automática"
        ],
        optimal: {
            llm: "gpt4",
            memory: "vectordb",
            tool: "api",
            architecture: "react"
        },
        reasoning: {
            llm: "GPT-4 ofrece el mejor balance entre velocidad y calidad para respuestas conversacionales en tiempo real.",
            memory: "Vector DB almacena la base de conocimiento de productos y permite RAG para respuestas precisas sobre catálogo.",
            tool: "APIs externas son esenciales para consultar CRM, inventario y crear tickets en sistemas empresariales.",
            architecture: "ReAct permite razonar sobre la consulta del cliente y usar las herramientas necesarias en cada paso."
        }
    },
    {
        title: "Asistente de Investigación Académica",
        description: "Un investigador necesita un agente que busque papers científicos sobre un tema, lea y resuma los 30 artículos más relevantes, identifique tendencias clave y genere un reporte estructurado con citas. El proceso puede tomar horas.",
        requirements: [
            "🔍 Búsqueda en múltiples fuentes académicas",
            "📚 Procesamiento de 30+ documentos",
            "🧠 Identificación de patrones y tendencias",
            "📝 Reporte estructurado con citas",
            "⏱️ No requiere respuesta inmediata"
        ],
        optimal: {
            llm: "claude",
            memory: "vectordb",
            tool: "web",
            architecture: "multi"
        },
        reasoning: {
            llm: "Claude Opus destaca en análisis profundo, razonamiento complejo y manejo de contextos largos, ideal para investigación académica.",
            memory: "Vector DB almacena embeddings de los 30 papers, permitiendo búsqueda semántica para encontrar información relevante al generar el reporte.",
            tool: "Búsqueda web permite acceder a Google Scholar, PubMed, arXiv y hacer scraping de papers para obtener contenido completo.",
            architecture: "Multi-agente con agentes especializados: uno busca papers, otro los lee y extrae info, otro sintetiza el reporte, y otro verifica citas."
        }
    },
    {
        title: "Asistente de Código para Debugging",
        description: "Un desarrollador tiene un bug en su aplicación de 5,000 líneas. El agente debe leer el código, encontrar el archivo con el error, analizar el stack trace, proponer una solución y opcionalmente ejecutar tests para validar el fix.",
        requirements: [
            "📂 Acceso a codebase completo",
            "🔍 Búsqueda en archivos",
            "🐛 Análisis de stack traces",
            "✏️ Propuesta de código corregido",
            "🧪 Ejecución de tests"
        ],
        optimal: {
            llm: "claude",
            memory: "shortterm",
            tool: "files",
            architecture: "plan"
        },
        reasoning: {
            llm: "Claude 3.5 Sonnet es excepcional en código, puede analizar grandes archivos y generar diffs precisos para fixes.",
            memory: "Memoria de conversación corta es suficiente; el contexto viene de los archivos leídos, no de interacciones previas.",
            tool: "Sistema de archivos permite leer el codebase, buscar con grep, editar archivos y ejecutar tests en terminal.",
            architecture: "Plan-and-Execute primero planifica (1. Leer archivo X, 2. Buscar función Y, 3. Analizar error, 4. Proponer fix) y luego ejecuta cada paso."
        }
    },
    {
        title: "Análisis de Datos Financieros Confidenciales",
        description: "Una empresa de finanzas necesita un agente que analice datos sensibles de transacciones (ingresos, costos, márgenes). Los datos NO pueden salir de la infraestructura de la empresa por regulaciones. Debe generar gráficos y calcular KPIs.",
        requirements: [
            "🔒 Datos 100% privados (no pueden salir de servidores propios)",
            "📊 Análisis estadístico complejo",
            "📈 Generación de gráficos (matplotlib)",
            "💰 Cálculo de KPIs financieros",
            "⚖️ Cumplimiento regulatorio"
        ],
        optimal: {
            llm: "llama",
            memory: "shortterm",
            tool: "code",
            architecture: "react"
        },
        reasoning: {
            llm: "Llama 3 (70B o 405B) se puede ejecutar on-premise, garantizando que datos sensibles nunca salgan de la empresa. Cumple con GDPR y SOC2.",
            memory: "Memoria de conversación es suficiente; los datos están en archivos CSV/DB que el agente carga en cada análisis.",
            tool: "Code Interpreter con Python permite usar pandas para análisis, matplotlib para gráficos y numpy para cálculos estadísticos.",
            architecture: "ReAct permite razonar sobre qué análisis hacer y ejecutar código Python interactivamente para generar resultados."
        }
    },
    {
        title: "Generación de Reportes de Múltiples Fuentes",
        description: "Una consultora necesita un agente que genere reportes semanales sobre tendencias de mercado. Debe buscar noticias en 10 sitios web, extraer datos de redes sociales, consultar APIs de analytics, resumir todo y generar un PDF con insights accionables.",
        requirements: [
            "🌐 Scraping de 10+ sitios web de noticias",
            "📱 Extracción de datos de redes sociales",
            "📊 Consulta a APIs de analytics (Google Analytics, etc.)",
            "📄 Generación de reporte PDF estructurado",
            "🔄 Ejecución automática semanal"
        ],
        optimal: {
            llm: "gpt4",
            memory: "hybrid",
            tool: "web",
            architecture: "multi"
        },
        reasoning: {
            llm: "GPT-4 ofrece excelente capacidad de síntesis de información de múltiples fuentes y generación de texto estructurado para reportes.",
            memory: "Sistema híbrido: vector DB con reportes anteriores (para continuidad) + memoria episódica para recordar tendencias identificadas semanas previas.",
            tool: "Búsqueda web y scraping son esenciales para obtener noticias, datos de redes sociales y llamar APIs de analytics.",
            architecture: "Multi-agente: agente recolector (scraping), agente analista (identifica tendencias), agente escritor (genera reporte), agente verificador (fact-checking)."
        }
    }
];

/**
 * Initializes the agent builder game
 */
function initAgentBuilder() {
    currentScenario = 0;
    completedScenarios = 0;
    optimalConfigs = 0;
    
    // Shuffle scenarios for variety
    shuffleArray(scenarios);
    
    displayScenario();
    setupEventListeners();
    updateStats();
}

/**
 * Sets up event listeners for config options
 */
function setupEventListeners() {
    const optionButtons = document.querySelectorAll('.config-option');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => selectOption(button));
    });
    
    document.getElementById('submitConfig').addEventListener('click', submitConfiguration);
}

/**
 * Displays current scenario
 */
function displayScenario() {
    const scenario = scenarios[currentScenario];
    
    document.getElementById('scenarioTitle').textContent = scenario.title;
    document.getElementById('scenarioNumber').textContent = currentScenario + 1;
    document.getElementById('scenarioDescription').textContent = scenario.description;
    
    // Display requirements
    const reqContainer = document.getElementById('scenarioRequirements');
    reqContainer.innerHTML = '<h4>Requisitos:</h4><ul>' + 
        scenario.requirements.map(req => `<li>${req}</li>`).join('') + 
        '</ul>';
    
    // Reset selections
    resetSelections();
    
    // Hide feedback
    document.getElementById('configFeedback').style.display = 'none';
}

/**
 * Handles option selection
 */
function selectOption(button) {
    const type = button.dataset.type;
    const value = button.dataset.value;
    
    // Remove previous selection of same type
    const siblings = button.parentElement.querySelectorAll('.config-option');
    siblings.forEach(sib => sib.classList.remove('selected'));
    
    // Select current option
    button.classList.add('selected');
    userConfig[type] = value;
    
    // Enable submit if all options selected
    checkSubmitEnabled();
}

/**
 * Checks if submit button should be enabled
 */
function checkSubmitEnabled() {
    const allSelected = userConfig.llm && userConfig.memory && 
                       userConfig.tool && userConfig.architecture;
    document.getElementById('submitConfig').disabled = !allSelected;
}

/**
 * Submits and evaluates configuration
 */
function submitConfiguration() {
    const scenario = scenarios[currentScenario];
    const feedback = document.getElementById('configFeedback');
    
    // Check if configuration is optimal
    const isOptimal = 
        userConfig.llm === scenario.optimal.llm &&
        userConfig.memory === scenario.optimal.memory &&
        userConfig.tool === scenario.optimal.tool &&
        userConfig.architecture === scenario.optimal.architecture;
    
    // Count correct choices
    let correctCount = 0;
    const results = [];
    
    if (userConfig.llm === scenario.optimal.llm) {
        correctCount++;
        results.push({ type: 'LLM', status: 'correct', reason: scenario.reasoning.llm });
    } else {
        results.push({ type: 'LLM', status: 'incorrect', reason: scenario.reasoning.llm });
    }
    
    if (userConfig.memory === scenario.optimal.memory) {
        correctCount++;
        results.push({ type: 'Memoria', status: 'correct', reason: scenario.reasoning.memory });
    } else {
        results.push({ type: 'Memoria', status: 'incorrect', reason: scenario.reasoning.memory });
    }
    
    if (userConfig.tool === scenario.optimal.tool) {
        correctCount++;
        results.push({ type: 'Herramientas', status: 'correct', reason: scenario.reasoning.tool });
    } else {
        results.push({ type: 'Herramientas', status: 'incorrect', reason: scenario.reasoning.tool });
    }
    
    if (userConfig.architecture === scenario.optimal.architecture) {
        correctCount++;
        results.push({ type: 'Arquitectura', status: 'correct', reason: scenario.reasoning.architecture });
    } else {
        results.push({ type: 'Arquitectura', status: 'incorrect', reason: scenario.reasoning.architecture });
    }
    
    // Generate feedback HTML
    let feedbackHTML = '';
    if (isOptimal) {
        feedbackHTML += `
            <div class="feedback-header success">
                <span class="feedback-icon">✅</span>
                <h3>¡Configuración Óptima!</h3>
                <p>Has creado la configuración ideal para este escenario.</p>
            </div>`;
        optimalConfigs++;
    } else {
        feedbackHTML += `
            <div class="feedback-header partial">
                <span class="feedback-icon">⚠️</span>
                <h3>Configuración Funcional (${correctCount}/4 óptimas)</h3>
                <p>Tu agente funcionaría, pero hay mejores opciones para este caso de uso.</p>
            </div>`;
    }
    
    // Add detailed feedback for each component
    feedbackHTML += '<div class="feedback-details">';
    results.forEach(result => {
        const icon = result.status === 'correct' ? '✅' : '❌';
        const className = result.status === 'correct' ? 'correct' : 'incorrect';
        feedbackHTML += `
            <div class="feedback-item ${className}">
                <div class="feedback-item-header">
                    <span class="feedback-item-icon">${icon}</span>
                    <strong>${result.type}</strong>
                </div>
                <p class="feedback-reason">${result.reason}</p>
            </div>`;
    });
    feedbackHTML += '</div>';
    
    // Add next button
    completedScenarios++;
    if (currentScenario < scenarios.length - 1) {
        feedbackHTML += '<button onclick="nextScenario()" class="btn btn-primary">Siguiente Escenario →</button>';
    } else {
        feedbackHTML += '<button onclick="showFinalResults()" class="btn btn-primary">Ver Resultados Finales 🎉</button>';
    }
    
    feedback.innerHTML = feedbackHTML;
    feedback.style.display = 'block';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Disable submit button
    document.getElementById('submitConfig').disabled = true;
    
    updateStats();
    saveProgress();
}

/**
 * Moves to next scenario
 */
function nextScenario() {
    currentScenario++;
    displayScenario();
}

/**
 * Shows final results
 */
function showFinalResults() {
    const feedback = document.getElementById('configFeedback');
    const percentage = (optimalConfigs / scenarios.length * 100).toFixed(0);
    
    let message = '';
    let emoji = '';
    if (percentage === 100) {
        emoji = '🏆';
        message = '¡Perfecto! Eres un experto en diseño de agentes.';
    } else if (percentage >= 80) {
        emoji = '🌟';
        message = '¡Excelente! Tienes muy buen criterio para elegir componentes.';
    } else if (percentage >= 60) {
        emoji = '👍';
        message = 'Bien hecho. Con más práctica dominarás el diseño de agentes.';
    } else {
        emoji = '📚';
        message = 'Sigue practicando. Revisa la teoría sobre cada componente.';
    }
    
    feedback.innerHTML = `
        <div class="final-results">
            <div class="final-icon">${emoji}</div>
            <h2>¡Juego Completado!</h2>
            <p class="final-message">${message}</p>
            <div class="final-stats">
                <div class="final-stat">
                    <div class="final-stat-value">${optimalConfigs}/${scenarios.length}</div>
                    <div class="final-stat-label">Configuraciones Óptimas</div>
                </div>
                <div class="final-stat">
                    <div class="final-stat-value">${percentage}%</div>
                    <div class="final-stat-label">Precisión</div>
                </div>
            </div>
            <button onclick="restartGame()" class="btn btn-secondary">Reintentar 🔄</button>
            <a href="#quizModule5" class="btn btn-primary">Continuar al Quiz →</a>
        </div>`;
    
    feedback.style.display = 'block';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Restarts the game
 */
function restartGame() {
    currentScenario = 0;
    completedScenarios = 0;
    optimalConfigs = 0;
    shuffleArray(scenarios);
    displayScenario();
    updateStats();
}

/**
 * Resets all selections
 */
function resetSelections() {
    userConfig = {
        llm: null,
        memory: null,
        tool: null,
        architecture: null
    };
    
    document.querySelectorAll('.config-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.getElementById('submitConfig').disabled = true;
}

/**
 * Updates game statistics display
 */
function updateStats() {
    document.getElementById('scenariosCompleted').textContent = `${completedScenarios}/${scenarios.length}`;
    document.getElementById('optimalConfigs').textContent = optimalConfigs;
}

/**
 * Saves progress to localStorage
 */
function saveProgress() {
    const progress = {
        completedScenarios,
        optimalConfigs,
        totalScenarios: scenarios.length,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('module5-progress', JSON.stringify(progress));
}

/**
 * Shuffles array in place (Fisher-Yates algorithm)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Quiz validation for Module 5
 */
function checkQuizModule5() {
    const answers = {
        q1: 'b', // ReAct con herramientas
        q2: 'b', // Vector database
        q3: 'c', // Sistema de archivos
        q4: 'c', // Llama 3 on-premise
        q5: 'b'  // Code Interpreter con Python
    };
    
    let correct = 0;
    let feedback = [];
    
    for (let i = 1; i <= 5; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === answers[`q${i}`]) {
            correct++;
            feedback.push(`<p class="correct">✅ Pregunta ${i}: Correcta</p>`);
        } else {
            feedback.push(`<p class="incorrect">❌ Pregunta ${i}: Incorrecta</p>`);
        }
    }
    
    const percentage = (correct / 5 * 100).toFixed(0);
    let message = '';
    
    if (percentage === 100) {
        message = '🏆 ¡Perfecto! Dominas la selección de componentes para casos de uso.';
    } else if (percentage >= 80) {
        message = '🌟 ¡Muy bien! Tienes buen entendimiento de casos de uso.';
    } else if (percentage >= 60) {
        message = '👍 Bien. Revisa los casos que fallaste.';
    } else {
        message = '📚 Repasa la teoría sobre cada caso de uso y sus requisitos.';
    }
    
    const resultDiv = document.getElementById('quizResultModule5');
    resultDiv.innerHTML = `
        <h3>${message}</h3>
        <p><strong>Puntuación: ${correct}/5 (${percentage}%)</strong></p>
        ${feedback.join('')}
        ${percentage >= 80 ? '<p class="success-message">✅ ¡Has completado el Módulo 5!</p>' : ''}
    `;
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Save quiz result
    if (percentage >= 80) {
        localStorage.setItem('module5-quiz-passed', 'true');
    }
}

/**
 * Shuffle quiz options for variety
 */
function shuffleQuizOptions() {
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach(question => {
        const optionsContainer = question.querySelector('.quiz-options');
        const options = Array.from(optionsContainer.children);
        shuffleArray(options);
        options.forEach(option => optionsContainer.appendChild(option));
    });
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAgentBuilder();
        shuffleQuizOptions();
    });
} else {
    initAgentBuilder();
    shuffleQuizOptions();
}
