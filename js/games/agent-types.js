// Agent Types Game Logic

let score = 0;
let correctAnswers = 0;
const totalItems = 10;

// Quiz correct answers
const quizAnswers = {
    q1: 'a',
    q2: 'a',
    q3: 'a',
    q4: 'a',
    q5: 'a'
};

// Initialize drag and drop
document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
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

// Quiz functions
function checkQuiz() {
    let correct = 0;
    let total = 5;
    
    // Check each question
    for (let i = 1; i <= total; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        const options = document.querySelectorAll(`input[name="q${i}"]`);
        
        options.forEach(option => {
            const label = option.parentElement;
            label.classList.remove('correct', 'incorrect');
            
            if (option.value === quizAnswers[`q${i}`]) {
                label.classList.add('correct');
            } else if (option.checked) {
                label.classList.add('incorrect');
            }
        });
        
        if (selected && selected.value === quizAnswers[`q${i}`]) {
            correct++;
        }
    }
    
    // Show result
    const resultDiv = document.getElementById('quiz-result');
    const percentage = (correct / total) * 100;
    
    resultDiv.classList.add('show');
    
    if (percentage >= 80) {
        resultDiv.className = 'quiz-result show pass';
        resultDiv.innerHTML = `
            🎉 ¡Excelente! ${correct}/${total} correctas (${percentage}%)
            <br><br>
            <strong>¡Has completado el Módulo 1!</strong>
            <br>
            Ahora puedes avanzar al Módulo 2
        `;
        unlockNextModule();
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

function unlockNextModule() {
    const nextBtn = document.getElementById('next-module');
    if (nextBtn) {
        nextBtn.classList.remove('locked');
        nextBtn.href = 'module2.html';
    }
    
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

// Track progress
window.addEventListener('load', () => {
    const progress = JSON.parse(localStorage.getItem('agentesIAProgress') || '{}');
    if (progress.completedModules && progress.completedModules.includes(1)) {
        unlockNextModule();
    }
});
