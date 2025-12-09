/**
 * Capstone Projects - Module 7
 * Certificate generation and project tracking
 */

// Estado del módulo
let projectsCompleted = {
    project1: false,
    project2: false,
    project3: false
};

// Inicialización
function initCapstone() {
    loadProgress();
    setupEventListeners();
    setupTabs();
    checkAllProjectsCompleted();
}

// Setup tabs functionality
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                // Smooth scroll to top of content
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Check URL hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const targetBtn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
}

// Cargar progreso guardado
function loadProgress() {
    const saved = localStorage.getItem('module7-progress');
    if (saved) {
        try {
            projectsCompleted = JSON.parse(saved);
            // Marcar checkboxes si ya están completados
            Object.keys(projectsCompleted).forEach(projectId => {
                const checkbox = document.getElementById(projectId);
                if (checkbox) {
                    checkbox.checked = projectsCompleted[projectId];
                }
            });
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
}

// Guardar progreso
function saveProgress() {
    try {
        localStorage.setItem('module7-progress', JSON.stringify(projectsCompleted));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Checkboxes de proyectos
    ['project1', 'project2', 'project3'].forEach(projectId => {
        const checkbox = document.getElementById(projectId);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                projectsCompleted[projectId] = e.target.checked;
                saveProgress();
                checkAllProjectsCompleted();
            });
        }
    });

    // Botones de toggle de proyectos
    document.querySelectorAll('.project-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            toggleProjectDetails(projectId);
        });
    });
}

// Toggle detalles de proyecto
function toggleProjectDetails(projectId) {
    const projectCard = document.getElementById(projectId);
    if (!projectCard) return;

    const content = projectCard.querySelector('.project-content');
    const btn = projectCard.querySelector('.project-toggle-btn');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        btn.textContent = 'Ver Detalles Completos ↓';
    } else {
        content.classList.add('expanded');
        btn.textContent = 'Ocultar Detalles ↑';
        
        // Smooth scroll al proyecto
        projectCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Verificar si todos los proyectos están completados
function checkAllProjectsCompleted() {
    const allCompleted = Object.values(projectsCompleted).every(completed => completed);
    
    if (allCompleted) {
        // Marcar módulo como completado usando el sistema centralizado
        if (typeof completeModuleInLocalStorage === 'function') {
            completeModuleInLocalStorage(7);
        }
    }
    
    return allCompleted;
}

// Generar certificado
function generateCertificate() {
    const studentName = document.getElementById('studentName').value.trim();
    
    if (!studentName) {
        alert('Por favor ingresa tu nombre completo');
        return;
    }
    
    // Verificar que todos los proyectos estén marcados
    const project1 = document.getElementById('project1').checked;
    const project2 = document.getElementById('project2').checked;
    const project3 = document.getElementById('project3').checked;
    
    if (!project1 || !project2 || !project3) {
        alert('Debes marcar los 3 proyectos como completados para generar el certificado');
        return;
    }
    
    // Actualizar certificado
    document.getElementById('certName').textContent = studentName;
    
    // Fecha actual
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('es-ES', options);
    document.getElementById('certDate').textContent = dateStr;
    
    // Mostrar certificado
    document.getElementById('certificatePreview').classList.remove('hidden');
    
    // Guardar info del certificado
    const certificateData = {
        name: studentName,
        date: dateStr,
        projects: [project1, project2, project3]
    };
    localStorage.setItem('certificate', JSON.stringify(certificateData));
    
    // Scroll al certificado
    document.getElementById('certificatePreview').scrollIntoView({ behavior: 'smooth' });
    
    // Confetti effect (opcional)
    showConfetti();
}

// Descargar certificado como imagen
function downloadCertificate() {
    // Usar html2canvas para convertir el certificado a imagen
    const certificate = document.querySelector('.certificate');
    
    // Verificar si html2canvas está disponible
    if (typeof html2canvas === 'undefined') {
        // Si no está cargado, usar método alternativo
        alert('Para descargar el certificado como imagen, toma una captura de pantalla (Print Screen) del certificado mostrado arriba.');
        return;
    }
    
    html2canvas(certificate, {
        scale: 2,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'certificado-code-agent-arena.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Compartir certificado en LinkedIn
function shareCertificate() {
    const studentName = document.getElementById('certName').textContent;
    const courseUrl = 'https://yamicueto.github.io/code-agent-arena/';
    
    const text = `¡Acabo de completar el curso "Agentes de IA: De Fundamentos a Proyectos" en Code Agent Arena! 🤖🎓

✅ 7 Módulos completos
✅ 15+ juegos interactivos
✅ 3 proyectos capstone

Aprendí sobre arquitecturas de agentes, RAG, multi-agente, evaluación y más.

#IA #AgentesIA #Aprendizaje #CodeAgentArena`;
    
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}`;
    
    // Abrir ventana de LinkedIn
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
    
    // Copiar texto al clipboard para que lo peguen
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Texto copiado al portapapeles. Pégalo en tu post de LinkedIn junto con el link que se abrió.');
    }).catch(() => {
        alert('Comparte en LinkedIn con este texto:\n\n' + text);
    });
}

// Efecto confetti
function showConfetti() {
    // Crear confetti simple con emojis
    const emojis = ['🎉', '🎊', '🎓', '🤖', '⭐', '✨'];
    const colors = ['#667eea', '#764ba2', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfettiPiece(emojis, colors);
        }, i * 30);
    }
}

function createConfettiPiece(emojis, colors) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = Math.random() * 100 + '%';
    piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
    piece.style.fontSize = (Math.random() * 20 + 20) + 'px';
    
    document.body.appendChild(piece);
    
    // Remover después de la animación
    setTimeout(() => {
        piece.remove();
    }, 5000);
}

// Tracking de proyecto iniciado
function markProjectStarted(projectNumber) {
    const startedProjects = JSON.parse(localStorage.getItem('startedProjects') || '[]');
    if (!startedProjects.includes(projectNumber)) {
        startedProjects.push(projectNumber);
        localStorage.setItem('startedProjects', JSON.stringify(startedProjects));
    }
}

// Tracking de proyecto completado (llamar cuando el usuario termine)
function markProjectCompleted(projectNumber) {
    projectsCompleted[`project${projectNumber}`] = true;
    saveProgress();
    
    // Actualizar checkbox
    const checkbox = document.getElementById(`project${projectNumber}`);
    if (checkbox) {
        checkbox.checked = true;
    }
    
    checkAllProjectsCompleted();
    
    // Mostrar mensaje de éxito
    showNotification(`¡Felicidades! Completaste el Proyecto ${projectNumber} 🎉`);
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Exportar estadísticas del curso
function exportCourseStats() {
    const stats = {
        modulesCompleted: JSON.parse(localStorage.getItem('completedModules') || '[]'),
        projectsCompleted: projectsCompleted,
        certificate: JSON.parse(localStorage.getItem('certificate') || 'null'),
        completionDate: new Date().toISOString()
    };
    
    // Crear JSON descargable
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'code-agent-arena-stats.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Ayuda contextual
function showProjectHelp(projectNumber) {
    const helpMessages = {
        1: `💡 Proyecto 1: FAQ Agent
        
Recursos útiles:
- LangChain RAG Tutorial: https://python.langchain.com/docs/tutorials/rag/
- Chroma DB Docs: https://docs.trychroma.com/
- OpenAI Embeddings: https://platform.openai.com/docs/guides/embeddings

Tips:
• Usa text-embedding-3-small (más barato y rápido)
• Experimenta con chunk_size (500-1500 tokens)
• Threshold de confianza ajustable según tu caso`,
        
        2: `💡 Proyecto 2: Data Analysis Agent
        
Recursos útiles:
- LangGraph Plan-Execute: https://github.com/langchain-ai/langgraph
- Docker Python SDK: https://docker-py.readthedocs.io/
- E2B Sandbox: https://e2b.dev/

Tips:
• Valida código ANTES de ejecutar (whitelist de imports)
• Usa timeouts (30s máx por ejecución)
• Limita memoria/CPU del container`,
        
        3: `💡 Proyecto 3: Research Agent
        
Recursos útiles:
- LangGraph Multi-Agent: https://github.com/langchain-ai/langgraph
- SerpAPI: https://serpapi.com/
- arXiv API: https://arxiv.org/help/api

Tips:
• Paraleliza lectura de fuentes (ThreadPoolExecutor)
• Clustering para agrupar findings (K-means)
• Fact-checking: claim debe aparecer en 2+ fuentes`
    };
    
    const message = helpMessages[projectNumber];
    if (message) {
        alert(message);
    }
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCapstone);
} else {
    initCapstone();
}
