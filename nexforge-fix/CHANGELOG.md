# Changelog

Todas las versiones notables de NexForge están documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.5.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.5.0
[0.4.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.4.0
[0.3.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.3.0
[0.2.0]: https://github.com/FazeUrru/nexforge/releases/tag/v0.2.0
