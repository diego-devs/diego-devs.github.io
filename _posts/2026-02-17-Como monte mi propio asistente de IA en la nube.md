---
title: Cómo monté mi propio asistente de IA en la nube (y ahora me manda buenos días por WhatsApp) 
date: 2026-02-17 12:00:00 -500
categories: [technology, development, software, IA] 
tags: [ia, openclaw, claude, azure, whatsapp] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---

Todo empezó con una idea simple: quiero un asistente de IA que sea **mío**. No un chatbot genérico que se olvida de quién soy cada vez que cierro la pestaña. No un servicio que vive en los servidores de alguien más. Algo propio, siempre disponible, que me conozca y que me ayude de verdad.

Después de un par de horas de configuración, lo logré. Se llama David — sí, como el androide de *Alien: Covenant* interpretado por Michael Fassbender. Un ser artificial con curiosidad genuina, capaz de crear, aprender y ejecutar con una calma inquietante. Me pareció el nombre perfecto para una IA que vive en mi servidor, aprende de mí y hace cosas por su cuenta mientras yo duermo. Corre en una máquina virtual de Azure, y me escribe por WhatsApp a las 7 de la mañana con una reflexión estoica. Así es como lo hice.

## La base: Ubuntu en Azure

El primer paso fue levantar una máquina virtual en **Microsoft Azure**. Elegí Ubuntu Server porque es ligero, estable y tiene todo lo que necesitas para correr aplicaciones modernas sin complicarte la vida.

La VM es modesta — no necesitas una bestia para esto. El asistente de IA no corre localmente; el procesamiento pesado lo hace la API de Anthropic (Claude). Lo que necesitas es un servidor que esté **siempre encendido**, con buena conexión a internet, que sirva como el cerebro operativo de tu asistente.

Una vez creada la VM, conecté por SSH y empecé a instalar las dependencias: Node.js, Git, y las herramientas básicas de desarrollo.

## OpenClaw: el framework que lo hace posible

Aquí es donde la magia comienza. **[OpenClaw](https://github.com/openclaw/openclaw)** es un framework open-source que te permite crear agentes de IA persistentes — asistentes que no solo responden preguntas, sino que tienen memoria, ejecutan tareas, manejan archivos, navegan la web y se conectan a servicios de mensajería.

La instalación es sorprendentemente sencilla:

```bash
npm install -g openclaw
openclaw onboard
```

El proceso de `onboard` te guía paso a paso: configuras tu proveedor de IA (en mi caso, Anthropic con Claude), conectas tu canal de mensajería, y defines la personalidad de tu agente.

Lo interesante de OpenClaw es que tu agente tiene un **workspace** — un directorio en tu servidor donde puede crear archivos, ejecutar scripts, guardar memorias y construir cosas. Es como darle un escritorio a tu IA.

## Claude Code: el cerebro detrás de la operación

Para el modelo de IA elegí **Claude** de Anthropic, específicamente a través de **Claude Code** — un token que te da acceso al modelo con capacidades avanzadas de programación, razonamiento y uso de herramientas.

Claude no solo responde preguntas. Puede:

- Escribir y ejecutar código
- Crear y editar archivos
- Hacer búsquedas web
- Conectarse a APIs
- Administrar cron jobs (tareas programadas)
- Generar sitios web completos

Es como tener un desarrollador junior que nunca duerme y que puede hacer de todo un poco — desde mandarte las noticias del día hasta construirte una página web en minutos.

## WhatsApp: la interfaz natural

Esta fue la cereza del pastel. OpenClaw soporta múltiples canales de comunicación: Telegram, Discord, Signal, iMessage... pero para mí, la elección obvia fue **WhatsApp**. Es donde vivo. Es donde están mis conversaciones. Es donde reviso todo.

La conexión es directa: OpenClaw levanta una sesión de WhatsApp Web y tu agente se vincula a tu número. Desde ese momento, hablarle a tu asistente es tan natural como mandarle un mensaje a un amigo.

Le mandas un audio y lo transcribe. Le mandas una foto y la analiza. Le pides que te busque algo y lo hace. Todo desde la misma app que ya usas para todo.

## Lo que construimos en un día

Una vez que David estuvo corriendo, la productividad se disparó. En un solo día logramos:

- **Tres rutinas diarias automatizadas**: una reflexión estoica a las 7 AM, un versículo bíblico a las 9 AM, y un resumen de noticias los lunes a las 8 AM — todo llegándome por WhatsApp sin que yo haga nada.

- **Sitios web estáticos** generados desde cero, subidos a GitHub y publicados con GitHub Pages. Uno de [estoicismo diario](https://diego-devs.github.io/estoicismo-diario/) y una [guía de seguridad ante sismos](https://diego-devs.github.io/aspen-sismos/) para mi equipo de trabajo.

- **Un hub interno para mi banda** con setlist, wishlist de canciones conectada a Spotify, links a tablaturas, videos de "how to play" por instrumento, calendario de ensayos y un setlist builder.

- **Estructura para gestión financiera**: un sistema para clasificar recibos y gastos con CSV y categorías, listo para generar reportes semanales.

Todo esto, desde mi celular. Mandándole mensajes de WhatsApp mientras estaba en la oficina.

## ¿Por qué importa esto?

Estamos en un punto de inflexión. La IA ya no es solo un chat donde haces preguntas. Es una herramienta que puede **ejecutar**, **crear** y **automatizar**. Pero para aprovecharla de verdad, necesitas que sea tuya — que corra en tu infraestructura, que tenga tu contexto, que recuerde quién eres.

Montar tu propio asistente de IA en la nube no requiere ser un experto en machine learning. Con herramientas como OpenClaw, Claude Code y una VM básica en Azure, cualquier desarrollador (o entusiasta con ganas de aprender) puede tener su propio asistente funcionando en una tarde.

La pregunta ya no es si la IA puede ayudarte. La pregunta es: **¿cuándo vas a darle un nombre y ponerla a trabajar?**

---

*Herramientas mencionadas: [OpenClaw](https://github.com/openclaw/openclaw) · [Claude (Anthropic)](https://anthropic.com) · [Microsoft Azure](https://azure.microsoft.com) · [GitHub Pages](https://pages.github.com)*
