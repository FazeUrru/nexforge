<p align="center">
  <img src="https://img.shields.io/badge/version-0.4.0-%2306d6a0?style=for-the-badge&labelColor=%230a0f1c" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-%2306d6a0?style=for-the-badge&labelColor=%230a0f1c" alt="License">
  <img src="https://img.shields.io/badge/price-FREE-%2306d6a0?style=for-the-badge&labelColor=%230a0f1c" alt="Free">
  <img src="https://img.shields.io/badge/AI-Auto--Corrección-%2300ffc8?style=for-the-badge&labelColor=%230a0f1c" alt="Auto-Correction">
</p>

<h1 align="center">
  <img width="60" src="https://raw.githubusercontent.com/FazeUrru/nexforge/main/public/logo-nexforge.png" alt="NexForge Logo">
  <br/>
  Nex<span style="color:#06d6a0">Forge</span>
</h1>

<p align="center">
  <strong>IA OpenSource para crear aplicaciones web completas</strong><br/>
  100% Gratis · Ilimitado · Auto-Corrección Integrada · OpenSource para siempre
</p>

---

## 🚀 ¿Qué es NexForge?

NexForge es una plataforma web impulsada por Inteligencia Artificial que genera **aplicaciones web completas** a partir de un simple prompt. Incluye planificación arquitectónica, frontend, backend, base de datos, APIs, autenticación y despliegue — todo en un solo flujo de trabajo.

### ✨ Características principales

- 🧠 **Auto-corrección IA** — La IA detecta y corrige sus propios errores antes de mostrar el resultado
- 📝 **Editar mensajes** — Edita cualquier mensaje del chat y regenera desde ese punto
- 📋 **Copiar mensajes** — Copia el contenido de cualquier respuesta al portapapeles
- 🔊 **Escuchar mensajes** — Text-to-Speech integrado para escuchar las respuestas de la IA
- ⏱️ **Planificación en tiempo real** — 8 pasos detallados con sub-pasos animados (~64 segundos)
- 📐 **Planificación arquitectónica automática** — La IA diseña la arquitectura completa antes de codificar
- 💻 **Código production-ready** — TypeScript, React 19, Next.js 16, Tailwind CSS 4, shadcn/ui
- 🗄️ **Base de datos integrada** — Prisma ORM con migraciones automáticas
- 🔐 **Autenticación incluida** — NextAuth.js v4 con OAuth providers
- 🚀 **Despliegue inmediato** — Config para Vercel, Docker, AWS
- 💯 **100% Gratis e Ilimitado** — Sin planes de pago, sin restricciones
- 📖 **OpenSource MIT** — Código completamente libre, auditable y modificable

---

## 🤖 Modelos de IA

| Modelo | Versión | Parámetros | Contexto | Velocidad | Especialidad |
|--------|---------|------------|----------|-----------|-------------|
| **KODA** | 1.1 | 24B | 256K | 72 tok/s | Full-stack avanzado + auto-corrección |
| **NOVA** | 0.9 | 14B | 128K | 120 tok/s | Equilibrado + auto-mejora |
| **FLUX** | 0.7 | 7B | 80K | 220 tok/s | Velocidad extrema + self-check |

### KODA 1.1 — El motor más potente
Modelo full-stack avanzado con 24B parámetros y 256K de contexto. Genera aplicaciones completas con planificación arquitectónica, código production-ready, testing y configuración de despliegue. Incluye auto-corrección que detecta y repara errores antes de mostrar el resultado.

### NOVA 0.9 — Brillante y auto-mejorable
Modelo equilibrado con 14B parámetros y 128K de contexto. Combina inteligencia contextual avanzada con auto-mejora continua. Genera código limpio, bien documentado y con explicaciones paso a paso.

### FLUX 0.7 — Velocidad pura
Modelo ultrarrápido con 7B parámetros y 220 tok/s. Genera MVPs completos y prototipos funcionales en segundos. Incluye self-check automático que verifica imports, tipos y lógica.

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui
- **Backend**: Next.js API Routes · Server Actions
- **IA**: z-ai-web-dev-sdk (GLM)
- **ORM**: Prisma (SQLite/PostgreSQL)
- **Animaciones**: Framer Motion 12
- **Markdown**: react-markdown 10
- **Iconos**: Lucide React

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/FazeUrru/nexforge.git
cd nexforge

# Instalar dependencias
bun install

# Configurar base de datos
bun run db:push

# Iniciar servidor de desarrollo
bun run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🎯 Uso

1. **Abre el Chat** — Haz clic en "Chat IA" o desplázate hasta la sección de chat
2. **Elige un modelo** — Selecciona KODA, NOVA o FLUX según tu necesidad
3. **Describe tu app** — Escribe lo que quieres crear ("Crea una app de e-commerce con carrito")
4. **Observa la planificación** — La IA planificará cada paso en tiempo real
5. **Revisa el código** — La IA genera código completo y se auto-corrige si detecta errores
6. **Edita y regenera** — Usa los botones de editar, copiar o escuchar para interactuar

---

## 🔧 Scripts

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo (puerto 3000) |
| `bun run build` | Build de producción |
| `bun run start` | Servidor de producción |
| `bun run db:push` | Sincronizar esquema Prisma |
| `bun run db:generate` | Generar cliente Prisma |

---

## 📋 Changelog

### v0.4.0 (Mayo 2026)
- ✅ Auto-corrección IA integrada — detecta y corrige errores automáticamente
- ✅ 3 botones de chat: Editar mensaje, Copiar mensaje, Escuchar mensaje (TTS)
- ✅ Planificación extendida: 8 pasos × 8 segundos con sub-pasos animados
- ✅ KODA 1.1 · NOVA 0.9 · FLUX 0.7 — modelos más inteligentes y rápidos
- ✅ Integración GitHub con botón de redirección y changelog

### v0.3.0 (Abril 2026)
- ✅ Planificación en tiempo real al crear apps
- ✅ Chat a pantalla completa
- ✅ Streaming optimizado
- ✅ KODA 0.9 · NOVA 0.7 · FLUX 0.5

### v0.2.0 (Marzo 2026)
- ✅ Chat interactivo con IA
- ✅ 3 modelos disponibles
- ✅ Simulación de streaming
- ✅ Versión inicial OpenSource

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este es un proyecto OpenSource y la comunidad es fundamental.

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'Añadir nueva feature'`)
4. Push al branch (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** — consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Hecho con 🤖 IA y ❤️ amor OpenSource<br/>
  <strong>NexForge v0.4.0</strong> · <a href="https://github.com/FazeUrru/nexforge">GitHub</a>
</p>
