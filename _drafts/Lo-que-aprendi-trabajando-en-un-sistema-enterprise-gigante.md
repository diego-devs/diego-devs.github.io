---
title: "Lo que aprendí trabajando en un sistema enterprise gigante (y que ningún tutorial te enseña)"
date: 2026-12-01 10:00:00 -0600
categories: [technology, development, career]
tags: [carrera, enterprise, legacy, ia, software engineer, desarrollo profesional, developers, trabajo en equipo]
author: <author_id>
comments: true
image: /assets/img/enterprise-gigante-cover.jpg
---

Los tutoriales te enseñan a crear un proyecto desde cero: `dotnet new webapi`, un par de endpoints, una base de datos limpia y todo compila en segundos.

Luego llegas a un sistema enterprise de verdad y nada se parece a eso.

En uno de los proyectos en los que trabajo actualmente hay varios productos que comparten una misma plataforma, un orquestador de servicios, decenas de soluciones, años de historia en el código, varios equipos tocando piezas que dependen unas de otras y reglas de negocio súper específicas que solo ingenieros químicos entienden.

Ahí aprendí cosas que ningún curso me enseñó. Y con la IA metida en casi todo el flujo, esas lecciones importan más, no menos. Porque la IA no es magia: no conoce tu sistema, ni tus reglas de negocio, ni a tus usuarios.

## 1. Vas a leer mucho más código del que escribes

En un proyecto personal, casi todo el tiempo escribes código. En un sistema enterprise es al revés: lees, navegas y entiendes cómo fluye algo a través de cinco capas antes de cambiar una sola línea.

Y está bien. Tres líneas en el lugar correcto valen más que cien en el lugar equivocado.

> 🤖 **¿Y la IA?** Te ahorra horas explicándote un flujo o encontrando dónde se usa algo. Pero te da un resumen, no comprensión. Si tú no entiendes lo que lees, no vas a notar cuando te lo explicó mal.
{: .prompt-info }

## 2. El legacy no es basura: es código que paga sueldos

Ese código feo lleva años en producción resolviendo problemas reales. Muchas de sus "rarezas" son bugs que alguien ya arregló, reglas de negocio que no conoces o workarounds para algo que pasó en 2019.

Antes de quitar algo, entiende por qué alguien lo puso ahí. Y si refactorizas, hazlo con cuidado y siempre con tests.

> 🤖 **¿Y la IA?** Si le pides que "limpie" un método viejo, lo hará con muchísima seguridad... y puede borrar justo esa regla de negocio que nadie documentó. La IA ve código feo, no la historia detrás.
{: .prompt-info }

## 3. Los builds lentos cambian tu forma de trabajar

Cuando compilar tarda varios minutos y la suite de tests puede tardar hasta una hora, dejas de programar por prueba y error. Aprendes a compilar solo lo que tocaste, a entender qué depende de qué (y con eso, la arquitectura) y a correr solo los tests relevantes.

Suena a limitación, pero te vuelve un developer mucho más intencional.

> 🤖 **¿Y la IA?** Genera código en segundos, pero no hace que tu build corra más rápido. Úsala para pensar mejor antes de compilar, no para aventar código a ver qué pasa.
{: .prompt-info }

## 4. El contexto de negocio vale más que el código

En un tutorial, un bug es un bug. En un sistema enterprise, un bug puede significar que un cliente toma una mala decisión con datos incorrectos o que alguien pierde dinero de verdad.

Cuando entiendes quién usa el sistema y qué le duele, tomas mejores decisiones técnicas.

**El código resuelve problemas técnicos. El contexto te dice cuáles importan.**

> 🤖 **¿Y la IA?** Puede escribirte un cálculo perfecto en sintaxis y equivocado según las reglas del negocio. Si tú no entiendes el dominio, no vas a detectar el error. Por eso todo lo que se implementa, lo haya escrito una persona o un agente, debe estar probado y validado por QE antes de llegar a producción.
{: .prompt-info }

## 5. Tu cambio siempre afecta a alguien más

Ese método que quieres cambiar lo usa otro equipo que no conoces. Los contratos (APIs, eventos, esquemas) no se cambian a la ligera, y un mensaje a tiempo evita una regresión en otro producto o más chamba para los QE's.

Muchas veces el reto no es técnico. Es de coordinación.

> 🤖 **¿Y la IA?** Solo ve el contexto que le das. Un agente puede hacer el cambio en minutos, pero la conversación con el otro equipo sigue siendo tuya.
{: .prompt-info }

## 6. La documentación está en la gente (y en los tickets viejos)

Spoiler: la documentación nunca está al día. El conocimiento real vive en quien lleva cinco años en el equipo, en el tercer comentario de un bug viejo y en los mensajes de commit.

Por eso construí agentes que guardan memoria de cada bug que resuelven. El conocimiento que no se escribe se pierde.

> 🤖 **¿Y la IA?** Un agente con memoria solo es tan bueno como el contexto que recibe. Si nadie escribe el "por qué" de las cosas, la IA tampoco lo va a adivinar.
{: .prompt-info }

## Conclusión

Un sistema enterprise gigante no es glamoroso: no hay repo limpio, no hay builds instantáneos y casi nunca entiendes el sistema completo. Pero ahí aprendes a **trabajar dentro de algo mucho más grande que tú.**

Leer antes de escribir. Entender antes de cambiar. Comunicar antes de romper.

La IA lo acelera todo, sí, pero el contexto, el criterio y la validación siguen siendo nuestros. Y eso es lo que te convierte en un mejor ingeniero, no solo en un mejor programador.

---

Saludos, devs!

**Sígueme en redes:**

[Twitch](https://twitch.tv/diegocod3s)

[GitHub](https://github.com/diego-devs)

[YouTube](https://www.youtube.com/channel/UCGQmO-aJ9yJSdv_VD8_IDjg)

[TikTok](https://www.tiktok.com/@diegoz.code)

[LinkedIn](https://www.linkedin.com/in/diego-diaz-mendoza/)

[Twitter](https://twitter.com/Diego_Devs)

[Instagram](https://www.instagram.com/devs.diego/)
