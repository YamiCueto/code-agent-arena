// Tree of Thoughts Interactive Visualizer
// Shows branching exploration with backtracking

class TreeOfThoughtsVisualizer {
    constructor() {
        this.currentScenario = 0;
        this.exploredPaths = [];
        this.currentPath = [];
        this.isAnimating = false;

        this.scenarios = [
            {
                title: "🎯 Resolver Problema Complejo",
                description: "El agente explora múltiples enfoques para resolver un problema",
                root: {
                    id: 'root',
                    text: 'Problema: Optimizar ruta de entrega',
                    x: 400,
                    y: 50
                },
                branches: [
                    {
                        id: 'branch1',
                        parentId: 'root',
                        text: 'Enfoque 1: Por distancia',
                        score: 6,
                        x: 200,
                        y: 150,
                        children: [
                            { id: 'b1-1', text: 'Ordenar por cercanía', score: 7, x: 100, y: 250 },
                            { id: 'b1-2', text: 'Agrupar por zonas', score: 8, x: 300, y: 250 }
                        ]
                    },
                    {
                        id: 'branch2',
                        parentId: 'root',
                        text: 'Enfoque 2: Por prioridad',
                        score: 8,
                        x: 400,
                        y: 150,
                        children: [
                            { id: 'b2-1', text: 'Urgentes primero', score: 9, x: 400, y: 250, best: true }
                        ]
                    },
                    {
                        id: 'branch3',
                        parentId: 'root',
                        text: 'Enfoque 3: Por tiempo',
                        score: 4,
                        x: 600,
                        y: 150,
                        children: [
                            { id: 'b3-1', text: 'Ventanas horarias', score: 5, x: 600, y: 250 }
                        ]
                    }
                ]
            },
            {
                title: "📝 Escribir Artículo",
                description: "Explorar diferentes estructuras para un artículo",
                root: {
                    id: 'root',
                    text: 'Tarea: Escribir artículo sobre IA',
                    x: 400,
                    y: 50
                },
                branches: [
                    {
                        id: 'branch1',
                        parentId: 'root',
                        text: 'Estructura cronológica',
                        score: 7,
                        x: 200,
                        y: 150,
                        children: [
                            { id: 'b1-1', text: 'Historia → Presente → Futuro', score: 8, x: 200, y: 250, best: true }
                        ]
                    },
                    {
                        id: 'branch2',
                        parentId: 'root',
                        text: 'Estructura por temas',
                        score: 6,
                        x: 400,
                        y: 150,
                        children: [
                            { id: 'b2-1', text: 'Tipos de IA', score: 6, x: 400, y: 250 }
                        ]
                    },
                    {
                        id: 'branch3',
                        parentId: 'root',
                        text: 'Estructura problema-solución',
                        score: 5,
                        x: 600,
                        y: 150,
                        children: [
                            { id: 'b3-1', text: 'Desafíos y respuestas', score: 5, x: 600, y: 250 }
                        ]
                    }
                ]
            }
        ];
    }

    init() {
        this.renderVisualizer();
        this.attachEventListeners();
        this.showScenario(0);
    }

    renderVisualizer() {
        const container = document.getElementById('tot-visualizer');
        if (!container) return;

        container.innerHTML = `
            <div class="tot-container">
                <!-- Scenario Selector -->
                <div class="tot-scenario-selector">
                    <h3>Selecciona un Escenario:</h3>
                    <div class="tot-scenario-buttons">
                        ${this.scenarios.map((scenario, index) => `
                            <button class="tot-scenario-btn ${index === 0 ? 'active' : ''}" 
                                    data-scenario="${index}">
                                ${scenario.title}
                            </button>
                        `).join('')}
                    </div>
                    <p class="tot-scenario-description"></p>
                </div>

                <!-- Tree Visualization -->
                <div class="tot-tree-area">
                    <svg id="tot-svg" width="800" height="350" viewBox="0 0 800 350">
                        <!-- Lines will be drawn here -->
                        <g id="tot-lines"></g>
                        <!-- Nodes will be drawn here -->
                        <g id="tot-nodes"></g>
                    </svg>
                </div>

                <!-- Legend -->
                <div class="tot-legend">
                    <div class="legend-item">
                        <div class="legend-color" style="background: #94a3b8;"></div>
                        <span>No explorado</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #0ea5e9;"></div>
                        <span>Explorando</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #10b981;"></div>
                        <span>Mejor opción</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #ef4444;"></div>
                        <span>Descartado</span>
                    </div>
                </div>

                <!-- Controls -->
                <div class="tot-controls">
                    <button class="tot-btn primary" id="tot-explore" onclick="totVisualizer.exploreTree()">
                        🔍 Explorar Árbol
                    </button>
                    <button class="tot-btn" id="tot-reset" onclick="totVisualizer.reset()">
                        🔄 Reiniciar
                    </button>
                </div>

                <!-- Explanation -->
                <div class="tot-explanation" id="tot-explanation">
                    <p>👆 Haz clic en "Explorar Árbol" para ver cómo el agente evalúa diferentes opciones</p>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        document.querySelectorAll('.tot-scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showScenario(parseInt(e.target.dataset.scenario));
            });
        });
    }

    showScenario(index) {
        this.currentScenario = index;
        this.reset();

        // Update buttons
        document.querySelectorAll('.tot-scenario-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        // Update description
        document.querySelector('.tot-scenario-description').textContent =
            this.scenarios[index].description;

        // Draw tree
        this.drawTree();
    }

    drawTree() {
        const scenario = this.scenarios[this.currentScenario];
        const linesGroup = document.getElementById('tot-lines');
        const nodesGroup = document.getElementById('tot-nodes');

        linesGroup.innerHTML = '';
        nodesGroup.innerHTML = '';

        // Draw lines from root to branches
        scenario.branches.forEach(branch => {
            this.drawLine(scenario.root, branch, linesGroup);

            // Draw lines from branch to children
            branch.children.forEach(child => {
                this.drawLine(branch, child, linesGroup);
            });
        });

        // Draw root node
        this.drawNode(scenario.root, nodesGroup, true);

        // Draw branch nodes
        scenario.branches.forEach(branch => {
            this.drawNode(branch, nodesGroup);

            // Draw child nodes
            branch.children.forEach(child => {
                this.drawNode(child, nodesGroup);
            });
        });
    }

    drawLine(from, to, group) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
        line.setAttribute('stroke', '#94a3b8');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.3');
        line.setAttribute('class', 'tot-line');
        line.setAttribute('data-from', from.id);
        line.setAttribute('data-to', to.id);
        group.appendChild(line);
    }

    drawNode(node, group, isRoot = false) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'tot-node-group');
        g.setAttribute('data-node-id', node.id);

        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', isRoot ? 25 : 20);
        circle.setAttribute('fill', isRoot ? '#00d9ff' : '#94a3b8');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('class', 'tot-node');
        g.appendChild(circle);

        // Score badge (if not root)
        if (!isRoot && node.score !== undefined) {
            const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            scoreText.setAttribute('x', node.x);
            scoreText.setAttribute('y', node.y + 5);
            scoreText.setAttribute('text-anchor', 'middle');
            scoreText.setAttribute('fill', '#fff');
            scoreText.setAttribute('font-size', '12');
            scoreText.setAttribute('font-weight', 'bold');
            scoreText.textContent = node.score;
            g.appendChild(scoreText);
        }

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + (isRoot ? 40 : 35));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#f0f9ff');
        text.setAttribute('font-size', '11');
        text.setAttribute('class', 'tot-label');

        // Split text into multiple lines if too long
        const words = node.text.split(' ');
        if (words.length > 3) {
            const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
            const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

            const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan1.setAttribute('x', node.x);
            tspan1.setAttribute('dy', '0');
            tspan1.textContent = line1;
            text.appendChild(tspan1);

            const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan2.setAttribute('x', node.x);
            tspan2.setAttribute('dy', '12');
            tspan2.textContent = line2;
            text.appendChild(tspan2);
        } else {
            text.textContent = node.text;
        }

        g.appendChild(text);
        group.appendChild(g);
    }

    async exploreTree() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const scenario = this.scenarios[this.currentScenario];
        const explanation = document.getElementById('tot-explanation');

        explanation.innerHTML = '<p>🔍 Explorando opciones...</p>';

        // Explore each branch
        for (const branch of scenario.branches) {
            await this.exploreBranch(branch, explanation);
            await this.sleep(1000);
        }

        // Find and highlight best path
        await this.highlightBestPath(scenario, explanation);

        this.isAnimating = false;
    }

    async exploreBranch(branch, explanation) {
        // Highlight branch
        this.highlightNode(branch.id, '#0ea5e9');
        explanation.innerHTML = `<p>💭 Evaluando: "${branch.text}" (Score: ${branch.score}/10)</p>`;
        await this.sleep(1500);

        // Explore children
        for (const child of branch.children) {
            this.highlightNode(child.id, '#0ea5e9');
            explanation.innerHTML = `<p>🔎 Explorando: "${child.text}" (Score: ${child.score}/10)</p>`;
            await this.sleep(1500);

            // Mark as explored (not best)
            if (!child.best) {
                this.highlightNode(child.id, '#ef4444');
            }
        }

        // Mark branch as explored
        if (!branch.children.some(c => c.best)) {
            this.highlightNode(branch.id, '#ef4444');
        }
    }

    async highlightBestPath(scenario, explanation) {
        // Find best node
        let bestNode = null;
        let bestBranch = null;

        scenario.branches.forEach(branch => {
            branch.children.forEach(child => {
                if (child.best) {
                    bestNode = child;
                    bestBranch = branch;
                }
            });
        });

        if (bestNode && bestBranch) {
            explanation.innerHTML = '<p>✨ Encontrando mejor camino...</p>';
            await this.sleep(1000);

            // Highlight best path
            this.highlightNode(bestBranch.id, '#10b981');
            await this.sleep(500);
            this.highlightNode(bestNode.id, '#10b981');

            explanation.innerHTML = `
                <p>🎯 <strong>Mejor opción encontrada:</strong> "${bestNode.text}"</p>
                <p>✅ Score: ${bestNode.score}/10</p>
                <p>💡 El agente puede volver atrás (backtrack) si esta opción falla</p>
            `;
        }
    }

    highlightNode(nodeId, color) {
        const nodeGroup = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeGroup) {
            const circle = nodeGroup.querySelector('.tot-node');
            circle.setAttribute('fill', color);
            circle.style.filter = `drop-shadow(0 0 10px ${color})`;
        }
    }

    reset() {
        this.exploredPaths = [];
        this.currentPath = [];
        this.isAnimating = false;
        this.drawTree();
        document.getElementById('tot-explanation').innerHTML =
            '<p>👆 Haz clic en "Explorar Árbol" para ver cómo el agente evalúa diferentes opciones</p>';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize
let totVisualizer;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tot-visualizer')) {
        totVisualizer = new TreeOfThoughtsVisualizer();
        totVisualizer.init();
    }
});
