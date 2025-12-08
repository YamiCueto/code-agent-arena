# 🤖 Code Agent Arena

## Aprende sobre Agentes de Inteligencia Artificial ¡Jugando! 🎮

**🎮 [VER DEMO EN VIVO](https://yamicueto.github.io/code-agent-arena/)**

Un sitio web interactivo y educativo para aprender todos los conceptos sobre agentes de IA a través de juegos y actividades interactivas. Diseñado para todas las edades.

### ✨ Características

- 🎯 **7 Módulos** siguiendo un plan de estudio estructurado (4 completados)
- 🎮 **15+ juegos interactivos** para aprender jugando
- 📚 **Contenido teórico visual** y fácil de entender
- 📝 **Quizzes randomizados** para evaluar tu progreso
- 🆓 **Navegación libre** - Explora cualquier módulo sin restricciones
- 📱 **Diseño responsive** para móviles y tablets
- 🎨 **Interfaz moderna** con animaciones suaves
- ♿ **Accesible** con soporte para teclado y lectores de pantalla
- 🧩 **CSS modular** - Arquitectura escalable y mantenible

### 📋 Módulos

| Módulo | Estado | Descripción | Juego Interactivo |
|--------|--------|-------------|-------------------|
| 🎯 **Módulo 1: Fundamentos** | ✅ Completo | ¿Qué es un agente? Tipos y componentes | Drag & Drop: Clasifica Agentes |
| 🏗️ **Módulo 2: Arquitectura** | ✅ Completo | ReAct, Chain-of-Thought, Tree of Thoughts | ReAct Simulator |
| 🛠️ **Módulo 3: Técnicas** | ✅ Completo | Memory Systems, Tool Use, Multi-Agent | Memory Challenge |
| 🚀 **Módulo 4: Herramientas** | ✅ Completo | LLM Providers, Vector DBs, Observability | Provider Matcher |
| 💼 **Módulo 5: Casos de Uso** | ✅ Completo | Aplicaciones reales de agentes | Agent Builder |
| 🔬 **Módulo 6: Avanzado** | ✅ Completo | Evaluación, Safety, Optimization | Safety Challenge |
| 🎓 **Módulo 7: Capstone** | ✅ Completo | Proyectos finales completos | 3 Proyectos Prácticos |

### 🚀 Comenzar

Simplemente abre `index.html` en tu navegador. No requiere instalación ni dependencias.

```bash
# Clona el repositorio
git clone [tu-repo]

# Abre el archivo
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

O usa un servidor local:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

Luego visita `http://localhost:8000`

### 📁 Estructura del Proyecto

```plaintext
code-agent-arena/
├── index.html                    # Página principal
├── .github/
│   └── copilot-instructions.md  # Guía completa de Clean Code y mejores prácticas
├── css/
│   ├── styles.css                # Estilos principales del sitio
│   ├── games.css                 # Importa módulos CSS + estilos compartidos
│   └── games/                    # CSS modular por juego
│       ├── shared.css            # Estilos comunes (botones, animaciones, feedback)
│       ├── agent-types.css       # Módulo 1 & 2
│       ├── memory-challenge.css  # Módulo 3
│       ├── provider-matcher.css  # Módulo 4
│       ├── agent-builder.css     # Módulo 5
│       ├── safety-challenge.css  # Módulo 6
│       └── capstone-projects.css # Módulo 7
├── js/
│   ├── main.js                   # Navegación y funciones globales
│   └── games/                    # JavaScript por juego (un archivo = un juego)
│       ├── agent-types.js        # Drag & Drop - Módulo 1
│       ├── react-simulator.js    # ReAct Simulator - Módulo 2
│       ├── memory-challenge.js   # Memory Challenge - Módulo 3
│       ├── provider-matcher.js   # Provider Matcher - Módulo 4
│       ├── agent-builder.js      # Agent Builder - Módulo 5
│       ├── safety-challenge.js   # Safety Challenge - Módulo 6
│       └── capstone-projects.js  # Capstone Projects - Módulo 7
└── pages/
    ├── module1.html              # Fundamentos
    ├── module2.html              # Arquitectura
    ├── module3.html              # Técnicas y Frameworks
    ├── module4.html              # Herramientas y Plataformas
    ├── module5.html              # Casos de Uso
    ├── module6.html              # Tópicos Avanzados
    └── module7.html              # Proyectos Capstone
```

### 🎮 Juegos Disponibles

**Módulo 1: Fundamentos**
- **Clasifica los Agentes** - Drag & drop para identificar tipos de agentes (Reactivos, BDI, Reflexivos, etc.)

**Módulo 2: Arquitectura**
- **Simulador ReAct** - Visualiza ciclos thought → action → observation en 3 escenarios diferentes

**Módulo 3: Técnicas**
- **Memory Challenge** - 10 situaciones para elegir el tipo correcto de memoria (short-term, long-term, working)

**Módulo 4: Herramientas**
- **Provider Matcher** - 8 escenarios para elegir el mejor LLM provider (OpenAI, Anthropic, Google, Open Source)

**Módulo 5: Casos de Uso**
- **Agent Builder** - 5 escenarios reales donde configuras el agente ideal (LLM, memoria, herramientas, arquitectura)

**Módulo 6: Tópicos Avanzados**
- **Safety Challenge** - 6 escenarios sobre vulnerabilidades de seguridad y mitigación (prompt injection, tool injection, data leakage, hallucinations, bias, alignment)

**Módulo 7: Proyectos Capstone**
- **FAQ Agent** - Agente de soporte con RAG y base de conocimiento
- **Data Analysis Agent** - Agente que ejecuta código Python para análisis de datos
- **Research Agent** - Sistema multi-agente para investigación exhaustiva

### 🎨 Tecnologías

- **HTML5** - Estructura semántica con tags apropiados
- **CSS3** - Diseño modular, animaciones, CSS Grid/Flexbox
- **JavaScript ES6+** - Vanilla JS sin frameworks
- **Web APIs** - Drag & Drop, Local Storage, Web Audio (opcional)

### 🌟 Características Técnicas

- ✅ **Sin dependencias externas** - 100% standalone
- ✅ **Arquitectura CSS modular** - Fácil mantenimiento y escalabilidad
- ✅ **Clean Code** - Siguiendo principios SOLID, DRY, KISS
- ✅ **Accesibilidad (a11y)** - ARIA labels, navegación por teclado
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Progressive Enhancement** - Funciona en todos los navegadores
- ✅ **Offline Capable** - Todo el contenido disponible localmente
- ✅ **Local Storage** - Guarda progreso del usuario
- ✅ **BEM Methodology** - Convención de nombres CSS consistente

### 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### 🎯 Objetivos de Aprendizaje

Al completar todos los módulos podrás:

- Explicar qué son los agentes y sus tipos
- Implementar patrones como ReAct y Chain-of-Thought
- Diseñar sistemas multi-agente
- Integrar herramientas y memoria
- Evaluar y optimizar agentes
- Construir casos de uso reales

### 🏗️ Mejores Prácticas Implementadas

Este proyecto sigue estrictos estándares de calidad documentados en `.github/copilot-instructions.md`:

- **Clean Code**: Funciones de máx 50 líneas, single responsibility
- **Naming Conventions**: BEM para CSS, camelCase para JS
- **CSS Modular**: Archivos separados por módulo (max 500 líneas/archivo)
- **Accesibilidad**: Semántica HTML5, ARIA labels, navegación por teclado
- **Performance**: Event delegation, lazy loading, debouncing
- **Error Handling**: Try-catch, validación de inputs, mensajes amigables
- **Git Conventions**: Commits semánticos (feat, fix, refactor, docs, style)
- **Responsive**: Mobile-first con breakpoints en 768px, 1024px, 1440px
- **Browser Support**: Últimas 2 versiones de Chrome, Firefox, Safari, Edge

### 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor revisa `.github/copilot-instructions.md` antes de contribuir.

**Áreas de contribución:**

- 🎮 Nuevos juegos interactivos para módulos 5-7
- 📚 Contenido educativo y ejemplos
- 🐛 Reportes de bugs con steps to reproduce
- 🎨 Mejoras de diseño UI/UX
- 🌍 Traducciones a otros idiomas
- ♿ Mejoras de accesibilidad
- 📱 Optimizaciones mobile

**Proceso:**

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit con convención semántica (`git commit -m 'feat: Add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📄 Licencia

MIT License - Este proyecto es de código abierto y está disponible para uso educativo y comercial.

### 🙏 Créditos

- **Autor:** [Yamid Cueto](https://github.com/YamiCueto)
- **Inspiración:** Plan de estudio de 16 semanas sobre Agentes de IA
- **Comunidad:** Gracias a todos los que aprenden y contribuyen

---

**Hecho con ❤️ por [Yamid Cueto](https://github.com/YamiCueto) para la comunidad**

## 🚀 Comienza tu aventura en el mundo de los agentes de IA
