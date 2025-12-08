// ReAct Simulator Game Logic

let reactScore = 0;
let cyclesCompleted = 0;
let currentStage = 'thought';

// Tasks for the simulator
const tasks = [
    {
        description: "Buscar un buen restaurante italiano cerca",
        steps: [
            {
                stage: 'thought',
                correct: "Necesito buscar restaurantes italianos en mi ubicación",
                options: [
                    "Necesito buscar restaurantes italianos en mi ubicación",
                    "Voy a ordenar pizza inmediatamente",
                    "Preguntaré a un amigo qué cocinar"
                ]
            },
            {
                stage: 'action',
                correct: "Buscar en Google Maps 'restaurante italiano cerca'",
                options: [
                    "Buscar en Google Maps 'restaurante italiano cerca'",
                    "Llamar a todos los restaurantes de la ciudad",
                    "Caminar por la calle sin rumbo"
                ]
            },
            {
                stage: 'observation',
                result: "Encontré 5 restaurantes italianos. El mejor valorado es 'La Bella Italia' con 4.8 estrellas"
            },
            {
                stage: 'thought',
                correct: "Debo verificar el horario y hacer reservación",
                options: [
                    "Debo verificar el horario y hacer reservación",
                    "Ya terminé, no necesito más información",
                    "Mejor busco comida china"
                ]
            },
            {
                stage: 'action',
                correct: "Llamar a La Bella Italia para reservar",
                options: [
                    "Llamar a La Bella Italia para reservar",
                    "Ir sin reserva y esperar",
                    "Cancelar todo el plan"
                ]
            },
            {
                stage: 'observation',
                result: "Reservación confirmada para 2 personas a las 8 PM"
            }
        ]
    },
    {
        description: "Ayudar a un estudiante con su tarea de matemáticas",
        steps: [
            {
                stage: 'thought',
                correct: "Necesito entender qué problema matemático tiene",
                options: [
                    "Necesito entender qué problema matemático tiene",
                    "Voy a dar la respuesta directamente",
                    "Le diré que busque en internet"
                ]
            },
            {
                stage: 'action',
                correct: "Preguntar qué tipo de problema es",
                options: [
                    "Preguntar qué tipo de problema es",
                    "Resolver todos los problemas del libro",
                    "Ignorar la pregunta"
                ]
            },
            {
                stage: 'observation',
                result: "Es un problema de ecuaciones de segundo grado: x² + 5x + 6 = 0"
            },
            {
                stage: 'thought',
                correct: "Debo explicar paso a paso cómo factorizar",
                options: [
                    "Debo explicar paso a paso cómo factorizar",
                    "Solo daré la respuesta final",
                    "Le diré que es muy difícil"
                ]
            },
            {
                stage: 'action',
                correct: "Explicar: 'Busquemos dos números que multiplicados den 6 y sumados den 5'",
                options: [
                    "Explicar: 'Busquemos dos números que multiplicados den 6 y sumados den 5'",
                    "Escribir solo: x = -2 y x = -3",
                    "Cambiar de tema"
                ]
            },
            {
                stage: 'observation',
                result: "El estudiante entendió y encontró que (x+2)(x+3) = 0, por lo tanto x = -2 o x = -3"
            }
        ]
    },
    {
        description: "Planificar una reunión de equipo efectiva",
        steps: [
            {
                stage: 'thought',
                correct: "Debo identificar los temas a discutir y quién debe asistir",
                options: [
                    "Debo identificar los temas a discutir y quién debe asistir",
                    "Invitaré a toda la empresa",
                    "No hace falta planear nada"
                ]
            },
            {
                stage: 'action',
                correct: "Crear lista de temas y revisar disponibilidad del equipo",
                options: [
                    "Crear lista de temas y revisar disponibilidad del equipo",
                    "Programar reunión sin preguntar a nadie",
                    "Cancelar la idea de la reunión"
                ]
            },
            {
                stage: 'observation',
                result: "Temas identificados: 3 puntos clave. El equipo está disponible el martes a las 3 PM"
            },
            {
                stage: 'thought',
                correct: "Necesito enviar invitación con agenda clara",
                options: [
                    "Necesito enviar invitación con agenda clara",
                    "Avisaré 5 minutos antes",
                    "No es necesario enviar agenda"
                ]
            },
            {
                stage: 'action',
                correct: "Enviar invitación de calendario con agenda detallada",
                options: [
                    "Enviar invitación de calendario con agenda detallada",
                    "Enviar un mensaje vago",
                    "No enviar nada"
                ]
            },
            {
                stage: 'observation',
                result: "6/6 miembros confirmaron asistencia. Reunión programada exitosamente"
            }
        ]
    }
];

let currentTask = null;
let currentStepIndex = 0;

// Quiz correct answers
const quizCorrectAnswersM2 = {
    q1: 'Reasoning and Acting (Razonamiento y Actuación)',
    q2: 'Thought → Action → Observation',
    q3: 'Hace que el agente piense paso a paso en voz alta',
    q4: 'Explorar múltiples soluciones posibles antes de elegir',
    q5: 'Criticar y mejorar su propio trabajo'
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('thought-stage')) {
        initReactGame();
        shuffleQuizOptions();
    }
});

function initReactGame() {
    currentTask = tasks[Math.floor(Math.random() * tasks.length)];
    currentStepIndex = 0;
    cyclesCompleted = 0;
    reactScore = 0;
    updateReactScore();
    
    document.getElementById('current-task').textContent = currentTask.description;
    showStage('thought');
}

function showStage(stage) {
    // Hide all stages
    document.getElementById('thought-stage').style.display = 'none';
    document.getElementById('action-stage').style.display = 'none';
    document.getElementById('observation-stage').style.display = 'none';
    document.getElementById('completion-stage').style.display = 'none';
    
    const currentStep = currentTask.steps[currentStepIndex];
    
    if (stage === 'thought') {
        document.getElementById('thought-stage').style.display = 'block';
        populateOptions('thought-options', currentStep.options, currentStep.correct, 'thought');
    } else if (stage === 'action') {
        document.getElementById('action-stage').style.display = 'block';
        populateOptions('action-options', currentStep.options, currentStep.correct, 'action');
    } else if (stage === 'observation') {
        document.getElementById('observation-stage').style.display = 'block';
        document.getElementById('observation-result').innerHTML = `
            <div class="observation-box">
                <p>${currentStep.result}</p>
            </div>
        `;
    } else if (stage === 'completion') {
        document.getElementById('completion-stage').style.display = 'block';
        const finalScore = reactScore;
        const perfection = finalScore >= 180 ? '¡Perfecto!' : finalScore >= 120 ? '¡Muy bien!' : '¡Bien hecho!';
        document.getElementById('completion-message').innerHTML = `
            <p class="completion-score">${perfection}</p>
            <p>Completaste la tarea con ${reactScore} puntos</p>
            <p>Has dominado el ciclo ReAct 🎉</p>
        `;
    }
    
    updateProgress();
}

function populateOptions(containerId, options, correctOption, stage) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    // Shuffle options
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(option => {
        const button = document.createElement('button');
        button.className = 'react-option';
        button.textContent = option;
        button.onclick = () => selectOption(option, correctOption, stage);
        container.appendChild(button);
    });
}

function selectOption(selected, correct, stage) {
    const isCorrect = selected === correct;
    
    if (isCorrect) {
        reactScore += 30;
        showFeedbackReact('¡Correcto! 🎉', 'success');
        playSound('correct');
        
        // Move to next stage
        if (stage === 'thought') {
            currentStepIndex++;
            setTimeout(() => showStage('action'), 1000);
        } else if (stage === 'action') {
            currentStepIndex++;
            setTimeout(() => showStage('observation'), 1000);
        }
    } else {
        showFeedbackReact('Intenta de nuevo 🤔', 'error');
        playSound('incorrect');
    }
    
    updateReactScore();
}

function nextCycle() {
    cyclesCompleted++;
    currentStepIndex++;
    
    if (currentStepIndex >= currentTask.steps.length) {
        showStage('completion');
    } else {
        showStage('thought');
    }
}

function updateProgress() {
    const progress = (cyclesCompleted / 3) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('cycles-count').textContent = cyclesCompleted;
}

function updateReactScore() {
    document.getElementById('react-score').textContent = reactScore;
}

function showFeedbackReact(message, type) {
    // Create temporary feedback
    const feedback = document.createElement('div');
    feedback.className = `react-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1.5rem 3rem;
        border-radius: 0.5rem;
        font-size: 1.2rem;
        font-weight: 600;
        z-index: 10000;
        animation: fadeInOut 1s ease-in-out;
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function resetReactGame() {
    initReactGame();
}

// Quiz functions
function checkQuizModule2() {
    let correct = 0;
    let total = 5;
    
    for (let i = 1; i <= total; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const options = document.querySelectorAll(`input[name="q${i}"]`);
        
        options.forEach(option => {
            const label = option.parentElement;
            label.classList.remove('correct', 'incorrect');
        });
        
        if (selected) {
            const label = selected.parentElement;
            const answerText = label.querySelector('span').textContent.trim();
            const correctAnswer = quizCorrectAnswersM2[`q${i}`];
            
            if (answerText === correctAnswer) {
                label.classList.add('correct');
                correct++;
            } else {
                label.classList.add('incorrect');
            }
        }
    }
    
    const resultDiv = document.getElementById('quiz-result-m2');
    const percentage = (correct / total) * 100;
    
    resultDiv.classList.add('show');
    
    if (percentage >= 80) {
        resultDiv.className = 'quiz-result show pass';
        resultDiv.innerHTML = `
            🎉 ¡Excelente! ${correct}/${total} correctas (${percentage}%)
            <br><br>
            <strong>¡Has completado el Módulo 2!</strong>
            <br>
            Ahora puedes avanzar al Módulo 3
        `;
        unlockNextModuleM2();
    } else {
        resultDiv.className = 'quiz-result show fail';
        resultDiv.innerHTML = `
            💪 Sigue intentando: ${correct}/${total} correctas (${percentage}%)
            <br><br>
            Necesitas al menos 80% para continuar.
            <br>
            Revisa la teoría y vuelve a intentarlo.
        `;
    }
}

function unlockNextModuleM2() {
    const nextBtn = document.getElementById('next-module');
    if (nextBtn) {
        nextBtn.classList.remove('locked');
        nextBtn.href = 'module3.html';
    }
    
    const progress = JSON.parse(localStorage.getItem('agentesIAProgress') || '{}');
    progress.completedModules = progress.completedModules || [];
    if (!progress.completedModules.includes(2)) {
        progress.completedModules.push(2);
    }
    progress.currentModule = 3;
    localStorage.setItem('agentesIAProgress', JSON.stringify(progress));
}

// Shuffle quiz options
function shuffleQuizOptions() {
    const questions = document.querySelectorAll('.quiz-question');
    
    questions.forEach((question) => {
        const optionsContainer = question.querySelector('.quiz-options');
        if (!optionsContainer) return;
        
        const options = Array.from(optionsContainer.querySelectorAll('.quiz-option'));
        
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        optionsContainer.innerHTML = '';
        options.forEach(option => {
            optionsContainer.appendChild(option);
        });
    });
}

// Check progress on load
window.addEventListener('load', () => {
    const progress = JSON.parse(localStorage.getItem('agentesIAProgress') || '{}');
    if (progress.completedModules && progress.completedModules.includes(2)) {
        unlockNextModuleM2();
    }
});

// Sound effect
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
    } else {
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.05;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}
