// Memory Challenge Game - Module 3

let currentScenario = 0;
let correctAnswers = 0;
let totalScore = 0;

const scenarios = [
    {
        text: "El usuario acaba de decir: 'Me llamo Carlos'. El agente debe recordar esto para la conversación.",
        correct: "short-term",
        explanation: "Short-term memory es perfecta para la conversación actual. ⚡"
    },
    {
        text: "El usuario dice que le gusta el jazz cada vez que chatea. El agente debe recordarlo para siempre.",
        correct: "long-term",
        explanation: "Long-term memory guarda preferencias del usuario permanentemente. 📚"
    },
    {
        text: "El agente está calculando: '¿Cuánto es 25% de 340?'. Necesita mantener números temporalmente.",
        correct: "working",
        explanation: "Working memory es ideal para cálculos intermedios. 🎯"
    },
    {
        text: "Hace 3 meses el usuario mencionó su dirección de correo. El agente debe poder consultarla.",
        correct: "long-term",
        explanation: "Long-term memory almacena información histórica importante. 📚"
    },
    {
        text: "Usuario: '¿Y qué opinas de lo que te dije antes?' - Refiriéndose a 2 mensajes atrás.",
        correct: "short-term",
        explanation: "Short-term memory mantiene el contexto de la conversación actual. ⚡"
    },
    {
        text: "El agente está escribiendo un ensayo. Debe recordar qué párrafos ya escribió mientras trabaja.",
        correct: "working",
        explanation: "Working memory mantiene el estado de la tarea en curso. 🎯"
    },
    {
        text: "El usuario siempre pide reportes en formato PDF. El agente debe recordar esta preferencia.",
        correct: "long-term",
        explanation: "Long-term memory guarda patrones de comportamiento del usuario. 📚"
    },
    {
        text: "Usuario: 'Suma 45 + 67 + 23 + 89'. El agente procesa los números paso a paso.",
        correct: "working",
        explanation: "Working memory es esencial para operaciones en progreso. 🎯"
    },
    {
        text: "El usuario está contando una historia larga. El agente sigue el hilo de los últimos 5 mensajes.",
        correct: "short-term",
        explanation: "Short-term memory mantiene la coherencia de conversaciones recientes. ⚡"
    },
    {
        text: "El sistema debe recordar el nombre de usuario, email y zona horaria para futuras sesiones.",
        correct: "long-term",
        explanation: "Long-term memory es para datos persistentes del perfil del usuario. 📚"
    }
];

function initMemoryGame() {
    currentScenario = 0;
    correctAnswers = 0;
    totalScore = 0;
    shuffleArray(scenarios);
    displayScenario();
    updateStats();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayScenario() {
    if (currentScenario >= scenarios.length) {
        showFinalResults();
        return;
    }

    const scenario = scenarios[currentScenario];
    document.getElementById('scenario-text').textContent = scenario.text;
    
    // Reset button states
    const buttons = document.querySelectorAll('.memory-choice');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
}

function selectMemory(memoryType) {
    const scenario = scenarios[currentScenario];
    const buttons = document.querySelectorAll('.memory-choice');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);

    // Check if correct
    const isCorrect = memoryType === scenario.correct;
    
    if (isCorrect) {
        correctAnswers++;
        totalScore += 10;
        
        // Highlight correct answer
        event.target.closest('.memory-choice').classList.add('correct');
        
        // Show success message
        showFeedback('✅ ¡Correcto! ' + scenario.explanation, 'success');
    } else {
        // Highlight wrong answer
        event.target.closest('.memory-choice').classList.add('incorrect');
        
        // Highlight correct answer
        buttons.forEach(btn => {
            if (btn.onclick.toString().includes(scenario.correct)) {
                btn.classList.add('correct');
            }
        });
        
        showFeedback('❌ Incorrecto. ' + scenario.explanation, 'error');
    }
    
    updateStats();
    
    // Move to next scenario after delay
    setTimeout(() => {
        currentScenario++;
        displayScenario();
    }, 2500);
}

function showFeedback(message, type) {
    // Create or get feedback element
    let feedback = document.querySelector('.game-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'game-feedback';
        document.querySelector('.memory-game').appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.className = `game-feedback ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 2500);
}

function updateStats() {
    document.getElementById('correct-count').textContent = correctAnswers;
    document.getElementById('memory-score').textContent = totalScore;
}

function showFinalResults() {
    const scenarioDisplay = document.getElementById('scenario-display');
    const percentage = (correctAnswers / scenarios.length) * 100;
    
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = '¡PERFECTO! 🏆 ¡Eres un experto en memoria de agentes!';
        emoji = '🏆';
    } else if (percentage >= 80) {
        message = '¡Excelente! 🌟 Dominas muy bien los tipos de memoria.';
        emoji = '🌟';
    } else if (percentage >= 60) {
        message = '¡Bien hecho! 👍 Estás entendiendo los conceptos.';
        emoji = '👍';
    } else {
        message = 'Sigue practicando. 📚 Revisa la teoría y vuelve a intentar.';
        emoji = '📚';
    }
    
    scenarioDisplay.innerHTML = `
        <div class="final-results">
            <div class="final-emoji">${emoji}</div>
            <h3>${message}</h3>
            <div class="final-stats">
                <p>Respuestas correctas: ${correctAnswers}/${scenarios.length}</p>
                <p>Puntuación final: ${totalScore} puntos</p>
                <p>Porcentaje: ${percentage.toFixed(0)}%</p>
            </div>
        </div>
    `;
    
    // Hide options
    document.querySelector('.memory-options').style.display = 'none';
    
    // Save progress
    saveModuleProgress('module3', {
        completed: percentage >= 60,
        score: totalScore,
        correctAnswers: correctAnswers,
        totalQuestions: scenarios.length
    });
}

function resetMemoryGame() {
    document.querySelector('.memory-options').style.display = 'block';
    initMemoryGame();
}

// Quiz functions
const quizAnswers = {
    q1: 'a', // Short-term memory
    q2: 'a', // Búsqueda por significado
    q3: 'a', // Usar herramientas
    q4: 'a', // Manager coordina
    q5: 'a'  // CrewAI
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

function checkQuizModule3() {
    let correctCount = 0;
    let totalQuestions = Object.keys(quizAnswers).length;
    
    // Check each answer
    for (let questionId in quizAnswers) {
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        const correctAnswer = quizAnswers[questionId];
        const options = document.querySelectorAll(`input[name="${questionId}"]`);
        
        if (selectedOption) {
            const isCorrect = selectedOption.value === correctAnswer;
            
            // Mark the selected option
            selectedOption.parentElement.classList.remove('correct', 'incorrect');
            selectedOption.parentElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            if (isCorrect) {
                correctCount++;
            }
        }
    }
    
    // Use the new centralized quiz system
    evaluateQuizAndUpdateProgress(correctCount, totalQuestions, 3);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMemoryGame();
        shuffleQuizOptions();
    });
} else {
    initMemoryGame();
    shuffleQuizOptions();
}
