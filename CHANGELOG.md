# Changelog

Todas las versiones notables de NexForge están documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.7.0] — 2026-05-05

### 📋 Consola de Logs y UX Mejorada

Versión enfocada en visibilidad del proceso y control del usuario. Consola de logs en tiempo real, preview parcial del código, regeneración con un clic y copia rápida.

### ✨ Añadido

- **Consola de Logs Simple**: Panel de logs en tiempo real que muestra mensajes secuenciales: "Conectando...", "Generando estructura...", "Escribiendo CSS...", "Verificando calidad...", etc. Los logs tienen colores por tipo (info, success, warning, error) y timestamps
- **Preview Parcial**: La vista previa del código se actualiza durante el streaming, mostrando bloques de código incompletos cada 20 palabras en lugar de esperar al 100% de la generación
- **Botón "Regenerar"**: Botón en cada respuesta del asistente y en la cabecera que reenvía automáticamente el último prompt sin necesidad de recargar la página ni copiar/pegar manualmente
- **Copiar Código**: Botón de copia rápida en 3 ubicaciones: (1) junto a cada mensaje con código, (2) en la cabecera de la vista previa para copiar todo, (3) dentro de cada archivo individual en la vista previa. Feedback visual al copiar

### 🐛 Corregido

- **Auto-scroll eliminado**: Se ha eliminado el scroll automático que ocurría al enviar un prompt a la IA. Ahora el usuario mantiene el control total de su posición de scroll y puede leer mensajes anteriores sin ser interrumpido

### 🔧 Mejoras

- **Iconos mejorados**: Añadidos iconos `Terminal` y `ClipboardCopy` de Lucide para la consola de logs y el botón de copiar código
- **Regeneración automática**: El botón de reintentar ya no solo coloca el texto en el input, sino que reenvía automáticamente el mensaje
- **Log entries con feedback**: Mensajes de log durante la generación, al recibir la respuesta del servidor y al completar o fallar

---

## [0.6.0] — 2026-05-05

### 🛡️ Estabilidad Básica (Fix & Polish)

Versión enfocada en hacer que la herramienta sea usable sin frustración. Errores claros, loading states reales, validación de input y UI limpia.

### ✨ Añadido

- **Manejo de Errores Silenciosos**: Mensajes de error claros y amigables en lugar de pantallas blancas o crashes. Clasificación de errores: timeout, red, respuesta vacía, error de agente
- **Error Boundary**: Componente React ErrorBoundary que captura crashes inesperados y muestra un mensaje amigable con botón de reintento
- **Loading States Reales**: Todos los botones ahora tienen estados de loading visibles (spinner + texto cambiante): Reintentar, Guardar Edición, Copiar
- **Validación de Input**: Bloqueo de prompts vacíos y menores de 5 caracteres con mensaje de error animado. Contador de caracteres mínimo visible
- **Validación en Edición**: La edición de mensajes también valida que el texto tenga al menos 5 caracteres
- **Botón Enviar Deshabilitado**: El botón de enviar se deshabilita cuando el input tiene menos de 5 caracteres

### 🔧 Mejoras

- **Mensajes de Error Clasificados**: Errores de red, timeout, respuesta vacía y errores de agente tienen mensajes distintos y específicos con emojis
- **API Route Mejorada**: Validación de mensajes vacíos en el servidor, errores clasificados (rate limit, timeout, red), mensajes user-friendly
- **Botones con Estado**: Reintentar muestra spinner, Guardar Editado muestra "Guardando...", Copiar deshabilita durante la operación
- **UI Limpia**: Eliminados enlaces muertos (#) del footer (Documentación, Tutoriales, API Reference, Blog, Discord, Twitter, Privacidad, Términos) reemplazados con enlaces reales a GitHub
- **CTA Limpio**: Botón "Leer documentación" (enlace muerto) reemplazado por "Ver en GitHub" (enlace real)
- **Botones Funcionales**: "Empezar Gratis" y "Empezar a Crear" ahora navegan al chat. "Ver Demo" navega a la sección demo
- **Versión Actualizada**: v0.6.0 en navbar, hero, footer, chat, API routes, demo

### 🗑️ Eliminado

- **Enlaces Muertos**: Eliminados todos los enlaces `#` que no llevaban a ningún sitio
- **Placeholders**: Eliminados enlaces a páginas no existentes (Discord, Twitter, Blog, Tutoriales, API Reference)
- **Twitter/Messages Icons**: Eliminados iconos de redes sociales sin presencia real

---

## [0.5.0] — 2026-05-01

### ✨ Añadido

- **4 Agentes IA Especializados en Tiempo Real**: ARQ (Arquitecto), CODE (Programador), QA (Calidad) y UX (Diseño) trabajan coordinados para crear aplicaciones web completas
- **Vista Previa del Código**: Panel lateral con syntax highlighting (react-syntax-highlighter), navegación entre archivos generados y visualización en tiempo real
- **Botón Publicar**: Despliega tu app directamente en Vercel con un solo clic. Progreso animado en tiempo real y URL pública instantánea
- **Sugerencias de Mejora IA**: Después de generar cada app, la IA sugiere 3-5 mejoras específicas: nuevas features, optimizaciones de rendimiento, mejoras de UX y más
- **Fases Adaptativas por Complejidad**: La duración de cada fase se adapta automáticamente a la complejidad del prompt del usuario
- **Analizador de Complejidad**: Detecta automáticamente si el proyecto es `simple`, `medium`, `complex` o `enterprise` y ajusta el número y duración de las fases
- **Auto-estabilidad del Servidor**: Sistema de health-check y auto-restart que mantiene el servidor activo automáticamente
- **Contador de Tiempo Transcurrido**: Muestra el tiempo real durante la generación de cada app
- **Badges de Agentes**: Indicadores visuales de qué agente está activo en cada fase del plan
- **8 Prompts Sugeridos**: Más opciones de prompts predefinidos en el chat
- **Extracción de Code Blocks**: Detección automática de bloques de código en respuestas de la IA

### 📈 Modelos Actualizados

| Modelo | Versión Anterior | Versión Nueva | Parámetros | Contexto | Velocidad |
|--------|-----------------|---------------|------------|----------|-----------|
| KODA   | 1.1             | **1.3**       | 28B        | 320K     | 72 tok/s  |
| NOVA   | 0.9             | **1.1**       | 16B        | 160K     | 135 tok/s |
| FLUX   | 0.7             | **0.9**       | 9B         | 96K      | 245 tok/s |

### 🏗️ Arquitectura de Agentes

```
ARQ (Arquitecto)  → Diseña arquitectura, modelos de datos, API
CODE (Programador) → Implementa código, componentes, lógica
QA (Calidad)       → Verifica, testea, auto-corrige errores
UX (Diseño)        → Optimiza UI/UX, accesibilidad, responsive
```

### ⏱️ Complejidad y Duración

| Nivel      | Fases | Duración por Fase | Total Estimado |
|------------|-------|-------------------|----------------|
| Simple     | 3-4   | ~12s              | <1 min         |
| Medium     | 8     | ~30s              | ~4 min         |
| Complex    | 10    | ~60s              | ~10 min        |
| Enterprise | 12    | ~90s              | ~18 min        |

### 🔧 Mejoras

- API route con system prompts específicos para cada agente (ARQ, CODE, QA, UX, Suggest)
- Auto-corrección con revisión real antes de responder (segundo pase de IA)
- `max_tokens` aumentado: KODA 4096, NOVA 3072, FLUX 2048
- Ventana de contexto ampliada (últimos 6 mensajes vs 4 antes)
- `maxDuration` aumentado a 300s para proyectos enterprise
- Timer de elapsed time durante la generación
- Agent badges en el progreso del plan
- Syntax highlighting con react-syntax-highlighter (tema One Dark)
- Simulated Vercel deployment con progreso animado
- Detección automática de complejidad del prompt

---

## [0.4.0] — 2026-05-01

### ✨ Añadido

- **Auto-corrección integrada**: La IA detecta y corrige sus propios errores antes de mostrar el resultado
- **3 Botones en el Chat**: Editar mensaje, Copiar mensaje y Escuchar mensaje (TTS con Web Speech API)
- **Planificación extendida**: 8 pasos de planificación para creación de apps
- **Self-review**: Paso de auto-revisión en el flujo de generación
- **GitHub Integration**: Repositorio automático con redirección desde la web

### 📈 Modelos Actualizados

| Modelo | Versión | Parámetros | Contexto |
|--------|---------|------------|----------|
| KODA   | 1.1     | 24B        | 256K     |
| NOVA   | 0.9     | 14B        | 128K     |
| FLUX   | 0.7     | 7B         | 80K      |

---

## [0.3.0] — 2026-04-2026

### ✨ Añadido

- **Planificación en tiempo real**: Pasos animados durante la generación de código
- **Chat a pantalla completa**: Modo fullscreen para el chat
- **Streaming optimizado**: Simulación de streaming palabra por palabra
- **Badge "Auto-corregido ✓"**: Indicador visual cuando la IA se autocorrige

### 📈 Modelos Actualizados

| Modelo | Versión | Parámetros | Contexto |
|--------|---------|------------|----------|
| KODA   | 0.9     | 20B        | 200K     |
| NOVA   | 0.7     | 12B        | 100K     |
| FLUX   | 0.5     | 5B         | 64K      |

---

## [0.2.0] — 2026-03-2026

### ✨ Añadido

- **Chat interactivo con IA**: Interfaz de chat funcional con los 3 modelos
- **3 modelos disponibles**: KODA, NOVA y FLUX con selectores
- **Simulación de streaming**: Efecto de escritura palabra por palabra
- **Versión inicial OpenSource**: Landing page completa con secciones

### 📈 Modelos Iniciales

| Modelo | Versión | Parámetros | Contexto |
|--------|---------|------------|----------|
| KODA   | 0.7     | 16B        | 128K     |
| NOVA   | 0.5     | 10B        | 64K      |
| FLUX   | 0.3     | 3B         | 32K      |

---

[0.7.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.7.0
[0.6.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.6.0
[0.5.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.5.0
[0.4.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.4.0
[0.3.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.3.0
[0.2.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.2.0
