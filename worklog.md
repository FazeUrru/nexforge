---
Task ID: 1
Agent: Main Agent
Task: Fix 'Error de conexión' bug, add auto-correction, chat buttons, extend planning, bump versions, add GitHub integration

Work Log:
- Tested API endpoint: /api/chat works correctly with all 3 models (KODA, NOVA, FLUX)
- Fixed root cause: API was functional, frontend error handling was too generic
- Rewrote /api/chat/route.ts with self-correction protocol: detectErrorsInResponse() + auto-retry
- Added self-improvement system prompts to all 3 models with Self-Review sections
- Added 3 chat message buttons: Edit (Pencil), Copy (Copy/Check), Listen (Volume2/VolumeX TTS)
- Extended planning from 7 steps to 8 steps, each taking 8 seconds with sub-step animations (2s rotation)
- Bumped versions: Web 0.3.0→0.4.0, KODA 0.9→1.1, NOVA 0.7→0.9, FLUX 0.5→0.7
- Updated all component files with new versions and features
- Added GitHub integration: prominent GitHub button in navbar, footer, and opensource section
- Added Changelog section in OpenSource section with version history
- Updated footer links to point to GitHub repo
- All external links open in new tab with ExternalLink icon
- Build passes successfully

Stage Summary:
- NexForge v0.4.0 with auto-correction, 3 chat buttons, extended planning, GitHub integration
- API fully functional with all models
- All versions bumped and consistent across all components
