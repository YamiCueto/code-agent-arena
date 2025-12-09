# Sistema de Progreso - Code Agent Arena

## 📋 Descripción General

El sistema de progreso implementa un **aprendizaje secuencial** donde los estudiantes deben completar cada módulo antes de avanzar al siguiente. Se requiere aprobar con **80%** o más en cada quiz para desbloquear el módulo siguiente.

## 🎯 Características Principales

### 1. **Desbloqueo Progresivo**
- ✅ **Módulo 1**: Siempre desbloqueado (punto de entrada)
- 🔒 **Módulos 2-7**: Bloqueados hasta completar el anterior
- Los módulos bloqueados muestran un overlay con candado
- Click en módulo bloqueado muestra modal explicativo

### 2. **Sistema de Evaluación**
- **Umbral de aprobación**: 80% de respuestas correctas
- **Intentos ilimitados**: Puedes reintentar cuantas veces necesites
- **Mejor puntaje guardado**: Se guarda tu mejor resultado por módulo
- **Feedback visual**: Respuestas correctas (verde) e incorrectas (rojo)

### 3. **Persistencia con LocalStorage**
```javascript
// Estructura de datos guardados
{
  completedModules: [1, 2, 3],        // Array de módulos completados
  moduleScores: {                     // Mejores puntajes por módulo
    1: { correct: 5, total: 5, percentage: 100 },
    2: { correct: 4, total: 5, percentage: 80 }
  }
}
```

### 4. **Indicadores Visuales**
- **Barra de progreso** en página principal: "X/7 módulos completados"
- **Badges en módulos**:
  - 🔒 Bloqueado (gris con candado)
  - 📖 En progreso (sin badge)
  - ✅ Completado (verde con checkmark)
- **Porcentaje general**: Se actualiza dinámicamente

### 5. **Celebraciones y Feedback**
- **Modal de resultados**: Muestra puntaje con progreso circular animado
- **Modal de celebración**: Confetti animado al completar un módulo
- **Mensajes personalizados**:
  - 100%: "¡Perfecto! Puntaje impecable"
  - 80-99%: "¡Excelente! Dominas el tema"
  - <80%: "¡Sigue intentando! Necesitas 80%"

## 🏗️ Arquitectura del Sistema

### Archivos Principales

#### 1. `js/quiz-system.js` (216 líneas)
Sistema centralizado de evaluación de quizzes.

**Funciones clave:**
```javascript
// Evalúa quiz y actualiza progreso automáticamente
evaluateQuizAndUpdateProgress(correct, total, moduleNum)

// Guarda módulo como completado y dispara evento
completeModuleInLocalStorage(moduleNum)

// Muestra modal con resultados animados
showQuizResults(result, moduleNum)

// Guarda/obtiene mejor puntaje por módulo
saveBestScore(moduleNum, score)
getBestScore(moduleNum)

// Verifica si un módulo está completado
isModuleCompleted(moduleNum)
```

**Constantes:**
```javascript
const PASSING_SCORE = 0.8;  // 80% requerido
```

**Eventos personalizados:**
```javascript
// Dispara cuando se completa un módulo
window.dispatchEvent(new CustomEvent('moduleCompleted', { 
  detail: { moduleNumber: 1 } 
}));
```

#### 2. `js/main.js` (240+ líneas)
Control de navegación y UI de progreso.

**Funciones clave:**
```javascript
// Navega a módulo con validación de prerequisitos
goToModule(moduleNumber)

// Muestra modal bloqueando acceso a módulo
showLockedMessage(moduleNumber)

// Actualiza todos los indicadores visuales
updateProgressUI()

// Escucha evento y muestra celebración
completeModule(moduleNumber)

// Modal animado con confetti
showCompletionCelebration(moduleNumber)

// Actualiza estadísticas de progreso
updateProgressStats()

// Genera partículas de confetti
createConfetti()
```

**Event listeners:**
```javascript
// Escucha completación de módulos
window.addEventListener('moduleCompleted', (e) => {
  completeModule(e.detail.moduleNumber);
});

// Actualiza UI al cargar página
document.addEventListener('DOMContentLoaded', updateProgressUI);
```

#### 3. `css/styles.css` (680+ líneas)
Estilos para todos los componentes del sistema.

**Nuevos componentes:**
- `.quiz-results-modal` - Modal de resultados con progreso circular
- `.celebration-modal` - Modal de celebración con animaciones
- `.locked-modal` - Modal de advertencia para módulos bloqueados
- `.progress-container` - Barra de progreso principal
- `.progress-bar-fill` - Relleno animado de la barra
- `.module-card.locked` - Estado bloqueado (grayscale + candado)
- `.module-card.completed` - Estado completado (borde verde + checkmark)
- `.confetti` - Partículas animadas de celebración

**Animaciones:**
```css
@keyframes fadeIn { /* Entrada suave */ }
@keyframes slideInUp { /* Desliza desde abajo */ }
@keyframes bounceIn { /* Rebote al entrar */ }
@keyframes rotateScale { /* Rotación con escala */ }
@keyframes confettiFall { /* Caída de confetti */ }
```

## 🔄 Flujo de Usuario

### Escenario 1: Usuario Nuevo
```
1. Llega a index.html
   └─> updateProgressUI() detecta 0 módulos completados
   └─> Barra muestra "0/7 módulos completados (0%)"
   └─> Solo Módulo 1 desbloqueado

2. Click en Módulo 2-7
   └─> goToModule() detecta prerequisito no cumplido
   └─> showLockedMessage() muestra modal:
       "🔒 Primero debes completar el Módulo X"

3. Entra a Módulo 1
   └─> Estudia teoría
   └─> Completa juegos
   └─> Toma quiz

4. Envía quiz con 4/5 correctas (80%)
   └─> evaluateQuizAndUpdateProgress(4, 5, 1)
   └─> showQuizResults() muestra modal:
       "¡Excelente! 4/5 correctas (80%)"
   └─> completeModuleInLocalStorage(1) guarda progreso
   └─> Dispara evento 'moduleCompleted'
   └─> completeModule(1) escucha evento
   └─> showCompletionCelebration(1) muestra confetti
   └─> updateProgressUI() actualiza cards y barra

5. Regresa a index.html
   └─> Módulo 1 muestra ✅ "Completado"
   └─> Módulo 2 ahora desbloqueado
   └─> Barra muestra "1/7 módulos completados (14%)"
```

### Escenario 2: Usuario Repetidor
```
1. Usuario reprueba quiz (3/5 = 60%)
   └─> showQuizResults() muestra:
       "¡Sigue intentando! 3/5 correctas (60%)"
       "Necesitas al menos 80% para continuar"
   └─> NO se completa módulo
   └─> Puede reintentar inmediatamente

2. Segundo intento: 5/5 correctas (100%)
   └─> Módulo se completa
   └─> saveBestScore(1, 100) guarda mejor resultado
   └─> Celebración y desbloqueo de siguiente módulo
```

### Escenario 3: Usuario Persistente
```
1. LocalStorage con datos previos:
   completedModules: [1, 2, 3]
   
2. Al cargar index.html:
   └─> updateProgressUI() lee localStorage
   └─> Marca Módulos 1-3 como completados
   └─> Desbloquea Módulo 4
   └─> Muestra "3/7 módulos completados (43%)"
   
3. Progreso persiste entre sesiones
```

## 🎮 Integración por Módulo

Cada módulo sigue este patrón:

### HTML (todas las páginas de módulos)
```html
<!-- Importar sistema de quiz -->
<script src="../js/main.js"></script>
<script src="../js/quiz-system.js"></script>
<script src="../js/games/[module-game].js"></script>
```

### JavaScript (archivos de juegos)
```javascript
// Antes (código antiguo):
function checkQuiz() {
  let correct = 0;
  // ... lógica de evaluación ...
  
  // Código custom de resultados
  if (percentage >= 80) {
    resultDiv.innerHTML = '¡Aprobado!';
    unlockNextModule();
  } else {
    resultDiv.innerHTML = '¡Reprobado!';
  }
}

// Después (nuevo sistema centralizado):
function checkQuiz() {
  let correct = 0;
  let total = 5;
  
  // ... lógica de evaluación (marca correctas/incorrectas) ...
  
  // Delega todo al sistema centralizado
  evaluateQuizAndUpdateProgress(correct, total, MODULE_NUMBER);
}
```

### Módulo 7 (Proyectos Capstone)
```javascript
// No tiene quiz tradicional, se completa al marcar 3 proyectos
function checkAllProjectsCompleted() {
  const allCompleted = Object.values(projectsCompleted)
    .every(completed => completed);
  
  if (allCompleted) {
    // Usa el sistema centralizado
    completeModuleInLocalStorage(7);
  }
}
```

## 📊 Análisis de Datos

### Consultar Progreso desde Consola
```javascript
// Ver módulos completados
JSON.parse(localStorage.getItem('completedModules'))
// Output: [1, 2, 3]

// Ver puntajes guardados
JSON.parse(localStorage.getItem('moduleScores'))
// Output: { "1": { correct: 5, total: 5, percentage: 100 }, ... }

// Verificar si módulo específico está completo
isModuleCompleted(3)
// Output: true/false

// Obtener mejor puntaje de un módulo
getBestScore(2)
// Output: { correct: 4, total: 5, percentage: 80 }
```

### Resetear Progreso (Testing)
```javascript
// Borrar todo el progreso
localStorage.removeItem('completedModules');
localStorage.removeItem('moduleScores');
location.reload();

// Completar múltiples módulos (testing)
completeModuleInLocalStorage(1);
completeModuleInLocalStorage(2);
completeModuleInLocalStorage(3);
location.reload();
```

## 🎨 Personalización

### Cambiar Umbral de Aprobación
```javascript
// En js/quiz-system.js
const PASSING_SCORE = 0.8;  // Cambiar a 0.7 para 70%, etc.
```

### Modificar Mensajes
```javascript
// En js/quiz-system.js, función evaluateQuizAndUpdateProgress()
if (result.percentage === 100) {
  result.message = 'Tu mensaje personalizado para 100%';
} else if (result.passed) {
  result.message = 'Tu mensaje para aprobados';
} else {
  result.message = 'Tu mensaje para reprobados';
}
```

### Ajustar Colores
```css
/* En css/styles.css */
:root {
  --success: #10b981;   /* Verde para aprobados */
  --warning: #f59e0b;   /* Naranja para reprobados */
  --primary-color: #667eea;  /* Morado para UI principal */
}
```

### Deshabilitar Confetti
```javascript
// En js/main.js, función showCompletionCelebration()
// Comentar o eliminar la línea:
createConfetti();
```

## 🐛 Troubleshooting

### Problema: Modal no se cierra
**Solución:**
```javascript
// Verificar que event listeners estén correctos
document.querySelector('.close-locked-modal').onclick = closeLockedModal;
```

### Problema: Progreso no persiste
**Solución:**
```javascript
// Verificar que localStorage esté habilitado
if (typeof(Storage) !== "undefined") {
  console.log('LocalStorage disponible');
} else {
  console.error('LocalStorage NO disponible');
}

// Verificar permisos en navegador (cookies/storage)
```

### Problema: Módulos no se desbloquean
**Solución:**
```javascript
// Verificar que el evento se dispare
window.addEventListener('moduleCompleted', (e) => {
  console.log('Módulo completado:', e.detail.moduleNumber);
});

// Verificar que quiz-system.js esté importado
if (typeof evaluateQuizAndUpdateProgress === 'function') {
  console.log('Sistema de quiz cargado correctamente');
} else {
  console.error('quiz-system.js NO cargado');
}
```

### Problema: Confetti no aparece
**Solución:**
```javascript
// Verificar que createConfetti() esté definida
if (typeof createConfetti === 'function') {
  createConfetti();
} else {
  console.error('createConfetti() no definida');
}
```

## 📈 Métricas de Éxito

El sistema permite trackear:
- **Tasa de completación**: % usuarios que completan todos los módulos
- **Puntos de abandono**: Módulos donde más usuarios se detienen
- **Intentos promedio**: Cuántos intentos toma aprobar cada quiz
- **Puntajes promedio**: Nivel de dominio por módulo
- **Tiempo de progreso**: Velocidad de avance por módulo

### Implementar Analytics (opcional)
```javascript
// Agregar en evaluateQuizAndUpdateProgress()
if (result.passed) {
  // Enviar evento a Google Analytics, Mixpanel, etc.
  gtag('event', 'module_completed', {
    module_number: moduleNum,
    score: result.percentage,
    attempts: getAttempts(moduleNum)
  });
}
```

## 🚀 Próximas Mejoras

### Ideas para v2:
1. **Sistema de logros/insignias**
   - Badges por puntaje perfecto
   - Racha de días consecutivos
   - Completar todos los módulos en X tiempo

2. **Modo práctica**
   - Repetir quizzes sin afectar progreso
   - Banco de preguntas adicionales
   - Timer opcional para desafío

3. **Estadísticas detalladas**
   - Dashboard personal de progreso
   - Gráficas de desempeño
   - Comparación con otros usuarios (anónimo)

4. **Gamificación**
   - Sistema de puntos XP
   - Niveles de usuario
   - Tabla de líderes (opcional)

5. **Accesibilidad**
   - Modo alto contraste
   - Soporte para lectores de pantalla
   - Atajos de teclado

## 📝 Notas Técnicas

- **Compatibilidad**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **LocalStorage límite**: ~5MB (suficiente para este proyecto)
- **Sin backend**: Todo en frontend, no requiere servidor
- **Sin autenticación**: Progreso local por navegador/dispositivo
- **Responsive**: Funciona en mobile, tablet, desktop
- **Performance**: <100ms tiempo de respuesta en evaluaciones

---

**Autor:** Yamid Cueto  
**Versión:** 1.0.0  
**Fecha:** Enero 2025  
**Licencia:** MIT
