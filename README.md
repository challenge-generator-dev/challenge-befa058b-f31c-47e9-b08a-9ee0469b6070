# Integración de Kafka para visualización de órdenes en tiempo real

En el contexto de una plataforma de comercio electrónico, el sistema necesita publicar y consumir eventos en un topic de Kafka para mostrar el estado de las órdenes en tiempo real. Los eventos incluyen información sobre nuevas órdenes, actualizaciones de estado y cancelaciones. El sistema debe manejar volúmenes pico de 10,000 órdenes por hora y garantizar una latencia de actualización de menos de 1 segundo.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial de Kafka

**Objetivo:** Configurar un entorno de Kafka para publicar y consumir eventos.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configurar un topic en Kafka para eventos de órdenes.
- Establecer conexiones de publicación y consumo en el sistema.

**Entregable:** Entorno de Kafka configurado con topic y conexiones establecidas.

<details>
<summary>Pistas de conocimiento</summary>

- Pistas sobre la arquitectura de Kafka y sus componentes.
- Consideraciones sobre la configuración de topics y particiones.

</details>

### Fase 2: Publicación de eventos de órdenes

**Objetivo:** Implementar la publicación de eventos de nuevas órdenes en el topic de Kafka.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Crear un servicio que publique eventos de nuevas órdenes en el topic de Kafka.
- Asegurar que los eventos contengan toda la información necesaria sobre la orden.

**Entregable:** Servicio que publica eventos de nuevas órdenes en el topic de Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Pistas sobre la estructura de los eventos y la serialización de datos.
- Consideraciones sobre la gestión de errores en la publicación de eventos.

</details>

### Fase 3: Consumo y visualización de eventos

**Objetivo:** Implementar la consumición de eventos de Kafka y su visualización en tiempo real en la interfaz de usuario.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Crear un consumidor que lea eventos del topic de Kafka y actualice la interfaz de usuario en tiempo real.
- Asegurar que la visualización refleje los cambios de estado de las órdenes de manera precisa y oportuna.

**Entregable:** Consumidor que actualiza la interfaz de usuario con eventos de Kafka en tiempo real.

<details>
<summary>Pistas de conocimiento</summary>

- Pistas sobre la integración de Kafka con Angular.
- Consideraciones sobre la gestión de estado en la interfaz de usuario.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es un topic en Kafka y para qué se utiliza?
- **paraQueSirve**: ¿Cómo se utiliza Kafka para la publicación y consumición de eventos en tiempo real?
- **comoSeUsa**: ¿Cómo configurar y conectar un servicio a un topic de Kafka?
- **erroresComunes**: ¿Cuáles son los errores comunes al publicar y consumir eventos en Kafka y cómo se manejan?
- **queDecisionesImplica**: ¿Qué decisiones implica la integración de Kafka con una aplicación Angular para la visualización de eventos en tiempo real?

## Criterios de Evaluacion

- Configuración correcta del topic de Kafka y conexiones de publicación y consumo.
- Implementación de un servicio que publique eventos de nuevas órdenes en Kafka.
- Implementación de un consumidor que actualice la interfaz de usuario con eventos de Kafka en tiempo real.
- Manejo adecuado de errores en la publicación y consumición de eventos.
- Visualización precisa y oportuna de los cambios de estado de las órdenes en la interfaz de usuario.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/stream`
  - `POST /orders`

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
