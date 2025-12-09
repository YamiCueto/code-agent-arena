// Agent Types Game Logic

let score = 0;
let correctAnswers = 0;
const totalItems = 10;

// Quiz correct answers (stored by question text to track after shuffling)
const quizCorrectAnswers = {
    q1: 'Un agente puede tomar acciones en el mundo real o digital',
    q2: 'Reactivo Simple',
    q3: 'Percepción, Razonamiento y Acción',
    q4: 'Optimiza para obtener el mejor resultado posible',
    q5: 'Mejora su desempeño con la experiencia'
};

// Initialize drag and drop
document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    shuffleQuizOptions();
});

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-area');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    e.dataTransfer.setData('correct-type', this.dataset.correct);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    const correctType = e.dataTransfer.getData('correct-type');
    const dropZone = this.closest('.drop-zone');
    const zoneType = dropZone.dataset.type;

    const draggedElement = document.querySelector('.dragging');
    
    if (draggedElement) {
        // Check if element was already marked as correct
        const wasAlreadyCorrect = draggedElement.classList.contains('correct');
        
        // Remove previous states
        draggedElement.classList.remove('dragging', 'incorrect');
        
        // Move element to drop zone
        this.appendChild(draggedElement);

        // Only process if not already correct
        if (!wasAlreadyCorrect) {
            // Check if correct
            if (correctType === zoneType) {
                draggedElement.classList.add('correct');
                draggedElement.draggable = false;
                score += 10;
                correctAnswers++;
                showFeedback('¡Correcto! 🎉', 'success');
                playSound('correct');
                updateScore();
                checkGameComplete();
            } else {
                draggedElement.classList.add('incorrect');
                setTimeout(() => {
                    draggedElement.classList.remove('incorrect');
                    // Return to items container
                    const itemsContainer = document.getElementById('items-container');
                    if (itemsContainer) {
                        itemsContainer.appendChild(draggedElement);
                    }
                }, 1000);
                showFeedback('¡Intenta de nuevo! 🤔', 'error');
                playSound('incorrect');
            }
        }
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct').textContent = correctAnswers;
}

function showFeedback(message, type) {
    const feedback = document.getElementById('game-feedback');
    feedback.textContent = message;
    feedback.className = `game-feedback show ${type}`;
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
}

function checkGameComplete() {
    if (correctAnswers === totalItems) {
        setTimeout(() => {
            showFeedback('🎊 ¡Felicidades! Completaste el juego. Puntuación final: ' + score, 'success');
            celebrateWin();
        }, 500);
    }
}

function celebrateWin() {
    // Confetti effect
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 50);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        top: -10px;
        left: ${Math.random() * 100}vw;
        border-radius: 50%;
        animation: fall 3s linear;
        pointer-events: none;
        z-index: 10000;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
}

// Add fall animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

function resetGame() {
    score = 0;
    correctAnswers = 0;
    updateScore();
    
    // Move all items back to container
    const items = document.querySelectorAll('.draggable-item');
    const container = document.getElementById('items-container');
    
    items.forEach(item => {
        item.classList.remove('correct', 'incorrect');
        item.draggable = true;
        container.appendChild(item);
    });
    
    showFeedback('Juego reiniciado 🔄', 'success');
}

// Shuffle quiz options
function shuffleQuizOptions() {
    const questions = document.querySelectorAll('.quiz-question');
    
    questions.forEach((question, index) => {
        const optionsContainer = question.querySelector('.quiz-options');
        const options = Array.from(optionsContainer.querySelectorAll('.quiz-option'));
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        // Clear and re-append in shuffled order
        optionsContainer.innerHTML = '';
        options.forEach(option => {
            optionsContainer.appendChild(option);
        });
    });
}

// Quiz functions
function checkQuiz() {
    let correct = 0;
    let total = 5;
    
    // Check each question
    for (let i = 1; i <= total; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const options = document.querySelectorAll(`input[name="q${i}"]`);
        
        // Remove previous feedback
        options.forEach(option => {
            const label = option.parentElement;
            label.classList.remove('correct', 'incorrect');
        });
        
        // Only mark the selected option as correct or incorrect
        if (selected) {
            const label = selected.parentElement;
            const answerText = label.querySelector('span').textContent.trim();
            const correctAnswer = quizCorrectAnswers[`q${i}`];
            
            if (answerText === correctAnswer) {
                label.classList.add('correct');
                correct++;
            } else {
                label.classList.add('incorrect');
            }
        }
    }
    
    // Use the new centralized quiz system
    evaluateQuizAndUpdateProgress(correct, total, 1);
}

function unlockNextModule() {
    // Save progress
    const progress = JSON.parse(localStorage.getItem('agentesIAProgress') || '{}');
    progress.completedModules = progress.completedModules || [];
    if (!progress.completedModules.includes(1)) {
        progress.completedModules.push(1);
    }
    progress.currentModule = 2;
    localStorage.setItem('agentesIAProgress', JSON.stringify(progress));
}

// Sound effects (simple beep simulation)
function playSound(type) {
    // Using Web Audio API for simple sounds
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

// Track progress (no longer blocks navigation)
window.addEventListener('load', () => {
    const progress = JSON.parse(localStorage.getItem('agentesIAProgress') || '{}');
    // Progress is saved but doesn't lock modules
});
