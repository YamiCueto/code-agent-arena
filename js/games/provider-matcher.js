// Provider Matcher Game - Module 4

let currentScenarioIndex = 0;
let correctCount = 0;
let totalPoints = 0;

const providerScenarios = [
    {
        text: "Startup con presupuesto limitado. Necesitas un chatbot simple para soporte al cliente.",
        correct: "openai",
        reason: "GPT-3.5 de OpenAI es perfecto: barato ($0.50-$1.50/1M tokens), confiable y suficiente calidad.",
        explanation: "OpenAI GPT-3.5 ofrece el mejor balance costo-calidad para casos básicos. 🔵"
    },
    {
        text: "Aplicación médica que maneja datos sensibles de pacientes. Privacidad es crítica.",
        correct: "opensource",
        reason: "Open Source te permite self-host: datos nunca salen de tu infraestructura.",
        explanation: "Open Source garantiza privacidad total al no enviar datos a terceros. 🟢"
    },
    {
        text: "Necesitas analizar contratos legales de 50+ páginas. Contexto muy largo.",
        correct: "anthropic",
        reason: "Claude Sonnet/Opus soporta hasta 200k tokens de contexto.",
        explanation: "Claude de Anthropic es el rey del contexto largo. 🟡"
    },
    {
        text: "Startup buscando máxima calidad en razonamiento complejo. El costo no es problema.",
        correct: "openai",
        reason: "GPT-4 es el mejor modelo para razonamiento avanzado y tareas complejas.",
        explanation: "OpenAI GPT-4 sigue siendo el líder en calidad general. 🔵"
    },
    {
        text: "Empresa que ya usa Google Cloud. Necesitan analizar imágenes y texto juntos.",
        correct: "google",
        reason: "Gemini es multimodal nativo y se integra perfectamente con GCP.",
        explanation: "Google Gemini brilla en multimodal y ecosistema GCP. 🟣"
    },
    {
        text: "Coding assistant que necesita excelente comprensión de código. Budget flexible.",
        correct: "anthropic",
        reason: "Claude es excepcional en código y tiene contexto enorme para codebases grandes.",
        explanation: "Claude Sonnet es el mejor para coding y análisis de código. 🟡"
    },
    {
        text: "Prototipo educativo con 0 presupuesto. Solo para experimentar y aprender.",
        correct: "opensource",
        reason: "Llama o Mistral son gratis. Puedes usar Ollama o Google Colab.",
        explanation: "Open Source es ideal para aprender sin gastar. 🟢"
    },
    {
        text: "App viral con millones de usuarios. Necesitas estabilidad máxima y soporte 24/7.",
        correct: "openai",
        reason: "OpenAI tiene la infraestructura más robusta, mejor uptime y soporte enterprise.",
        explanation: "OpenAI ofrece la mejor estabilidad para producción a escala. 🔵"
    }
];

function initProviderGame() {
    currentScenarioIndex = 0;
    correctCount = 0;
    totalPoints = 0;
    shuffleArray(providerScenarios);
    displayProviderScenario();
    updateProviderStats();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayProviderScenario() {
    if (currentScenarioIndex >= providerScenarios.length) {
        showProviderFinalResults();
        return;
    }

    const scenario = providerScenarios[currentScenarioIndex];
    document.getElementById('provider-scenario-text').textContent = scenario.text;
    
    // Reset button states
    const buttons = document.querySelectorAll('.provider-choice');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
}

function selectProvider(provider) {
    const scenario = providerScenarios[currentScenarioIndex];
    const buttons = document.querySelectorAll('.provider-choice');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);

    // Check if correct
    const isCorrect = provider === scenario.correct;
    
    if (isCorrect) {
        correctCount++;
        totalPoints += 12;
        
        // Highlight correct answer
        event.target.closest('.provider-choice').classList.add('correct');
        
        // Show success message
        showProviderFeedback('✅ ¡Correcto! ' + scenario.explanation + '\n\n💡 ' + scenario.reason, 'success');
    } else {
        // Highlight wrong answer
        event.target.closest('.provider-choice').classList.add('incorrect');
        
        // Highlight correct answer
        buttons.forEach(btn => {
            if (btn.onclick.toString().includes(`'${scenario.correct}'`)) {
                btn.classList.add('correct');
            }
        });
        
        showProviderFeedback('❌ No es la mejor opción. ' + scenario.explanation + '\n\n💡 ' + scenario.reason, 'error');
    }
    
    updateProviderStats();
    
    // Move to next scenario after delay
    setTimeout(() => {
        currentScenarioIndex++;
        displayProviderScenario();
    }, 4000);
}

function showProviderFeedback(message, type) {
    // Create or get feedback element
    let feedback = document.querySelector('.provider-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'provider-feedback';
        document.querySelector('.provider-game').appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.className = `provider-feedback ${type}`;
    feedback.style.display = 'block';
    feedback.style.whiteSpace = 'pre-line';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 4000);
}

function updateProviderStats() {
    document.getElementById('provider-correct').textContent = correctCount;
    document.getElementById('provider-score').textContent = totalPoints;
}

function showProviderFinalResults() {
    const scenarioDisplay = document.getElementById('provider-scenario');
    const percentage = (correctCount / providerScenarios.length) * 100;
    
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = '¡PERFECTO! 🏆 ¡Eres un experto en elegir LLM providers!';
        emoji = '🏆';
    } else if (percentage >= 75) {
        message = '¡Excelente! 🌟 Entiendes muy bien las fortalezas de cada proveedor.';
        emoji = '🌟';
    } else if (percentage >= 50) {
        message = '¡Bien hecho! 👍 Vas por buen camino.';
        emoji = '👍';
    } else {
        message = 'Sigue practicando. 📚 Revisa las ventajas de cada proveedor.';
        emoji = '📚';
    }
    
    scenarioDisplay.innerHTML = `
        <div class="final-results">
            <div class="final-emoji">${emoji}</div>
            <h3>${message}</h3>
            <div class="final-stats">
                <p>Respuestas correctas: ${correctCount}/${providerScenarios.length}</p>
                <p>Puntuación final: ${totalPoints} puntos</p>
                <p>Porcentaje: ${percentage.toFixed(0)}%</p>
            </div>
        </div>
    `;
    
    // Hide options
    document.querySelector('.provider-options').style.display = 'none';
    
    // Save progress
    saveModuleProgress('module4', {
        completed: percentage >= 50,
        score: totalPoints,
        correctAnswers: correctCount,
        totalQuestions: providerScenarios.length
    });
}

function resetProviderGame() {
    document.querySelector('.provider-options').style.display = 'block';
    initProviderGame();
}

// Quiz functions
const quizAnswersM4 = {
    q1: 'a', // Claude 200k tokens
    q2: 'a', // Búsqueda semántica
    q3: 'a', // Chroma para principiantes
    q4: 'a', // LangSmith observability
    q5: 'a'  // Open Source privacidad
};

function shuffleQuizOptions() {
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach(question => {
        const optionsContainer = question.querySelector('.quiz-options');
        const options = Array.from(optionsContainer.querySelectorAll('.quiz-option'));
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            optionsContainer.insertBefore(options[j], options[i]);
        }
    });
}

function checkQuizModule4() {
    let correctQuizCount = 0;
    let totalQuestions = Object.keys(quizAnswersM4).length;
    
    // Check each answer
    for (let questionId in quizAnswersM4) {
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        const correctAnswer = quizAnswersM4[questionId];
        
        if (selectedOption) {
            const isCorrect = selectedOption.value === correctAnswer;
            
            // Mark the selected option
            selectedOption.parentElement.classList.remove('correct', 'incorrect');
            selectedOption.parentElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            if (isCorrect) {
                correctQuizCount++;
            }
        }
    }
    
    // Use the new centralized quiz system
    evaluateQuizAndUpdateProgress(correctQuizCount, totalQuestions, 4);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initProviderGame();
        shuffleQuizOptions();
    });
} else {
    initProviderGame();
    shuffleQuizOptions();
}
