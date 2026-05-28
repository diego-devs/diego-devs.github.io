---
title: Construí un Squad de Agentes IA para Matar Bugs y así funciona
date: 2026-05-28 12:00:00 -500
categories: [technology, development, software, IA]
tags: [ia, agentes, github copilot, azure devops, bugs, debugging]
author: <author_id>
comments: true
---

![image](/assets/img/automat.webp)

Corregir bugs no es lo difícil. Lo difícil es todo lo que rodea al bug.

Leer el ticket en Azure DevOps. Entender qué quiso decir la persona que lo reportó. Buscar el módulo correcto en un monorepo gigante. Confirmar la causa raíz. Aplicar el fix. Verificar que no rompiste otra cosa. Documentar lo que hiciste. Para un bug pequeño, ese overhead fácilmente se come más tiempo que la corrección misma.

Y como ya me estaba cansando de gastar energía mental en esa parte repetitiva del trabajo, hice lo que haría cualquier desarrollador con acceso a demasiadas herramientas de IA: construí un pequeño squad de agentes especializados para encargarse del proceso.

No es un solo agente “mágico” que hace todo. Son cuatro. Cada uno con una responsabilidad concreta, un alcance limitado y un rol bien definido dentro del flujo.

Y sí: funcionan sorprendentemente bien.

## El problema con arreglar bugs “a mano”

Cuando pensamos en bugs, solemos imaginar la parte intelectual del trabajo: encontrar la causa raíz y decidir cómo corregirla. Pero en la práctica, gran parte del tiempo se va en tareas secundarias:

- abrir el bug en ADO
- leer comentarios y contexto histórico
- revisar adjuntos
- encontrar el punto exacto del código afectado
- entender si el problema es local o transversal
- verificar si ya existe un patrón similar en otro módulo
- implementar el cambio
- validar que compile
- revisar riesgo de regresión
- dejar registro de lo aprendido

Ninguno de esos pasos es imposible. El problema es que juntos forman una cadena larga, cansada y muy fácil de romper cuando cambias de contexto varias veces al día.

Yo quería reducir esa fricción sin perder control técnico. No quería un sistema autónomo que hiciera cambios a ciegas. Quería algo más parecido a un equipo: alguien que analiza, alguien que implementa, alguien que valida y alguien que documenta.

## El squad

Así quedó dividido:

- **bug-planner**: analiza el ticket, entiende el problema, busca la causa raíz y produce un plan de solución
- **bug-fixer**: toma ese plan y aplica el cambio en el código
- **bug-tester**: revisa el fix, evalúa regresiones y valida si el cambio tiene sentido
- **bug-retro**: registra patrones, aprendizajes y contexto útil para futuros bugs

La analogía más simple sería esta:

- el planner es el arquitecto que aterriza el problema
- el fixer es el desarrollador que ejecuta
- el tester es el QA técnico que revisa con mala intención
- el retro es la memoria del equipo

La separación importa más de lo que parece. Si el mismo agente analiza, modifica, valida y concluye que todo quedó bien, realmente no hay ningún control. Solo hay una cadena de autoafirmación probabilística. En cambio, cuando separas responsabilidades, aparecen fricción útil, revisión cruzada y menos alucinaciones peligrosas.

## Cómo funciona el flujo

El flujo completo es bastante directo:

Bug en Azure DevOps → Planner → Fixer → Tester → Retro

Primero, el planner lee el bug directamente desde Azure DevOps. Toma la descripción, comentarios, adjuntos e incluso screenshots si existen. Si el bug tiene un Excel pegado o algún archivo raro, también lo analiza. Luego navega el código fuente, encuentra el punto problemático y genera un plan de fix con contexto real.

Ese plan no es un resumen bonito de PM. Es un plan técnico. Incluye snippets del código relevante, explicación de la causa raíz, nivel de riesgo, y una propuesta concreta de solución. Si encuentra una implementación parecida ya resuelta en otro servicio, también la referencia.

Después entra el fixer. Su única tarea es ejecutar. Abre los archivos indicados por el planner, confirma que el contexto coincide y aplica el cambio de forma quirúrgica. Si algo en el plan no cuadra con el código real, no improvisa a ciegas: lo reporta.

Luego pasa el tester. Este agente no modifica nada. Solo revisa. Inspecciona los archivos tocados, busca errores de lógica, efectos secundarios, null references, off-by-one mistakes, y evalúa el riesgo de regresión. Si el fix no convence, rebota el trabajo con feedback específico.

Al final entra el retro. Ese agente registra qué patrón apareció, cómo se resolvió, qué señales ayudaron a encontrar la causa raíz y qué tipo de bug fue. La próxima vez que aparece algo similar, el planner ya no parte desde cero.

## La arquitectura detrás

Todo esto vive en una estructura bastante simple dentro del entorno del agente. No hay una plataforma enterprise de veinte microservicios. Son definiciones de agentes, skills reutilizables, contexto compartido y una pequeña base de conocimiento persistente.

La pieza clave es que los agentes viven dentro de GitHub Copilot CLI y se conectan a Azure DevOps usando el MCP server oficial de Microsoft. Eso significa que el planner puede leer work items, descargar adjuntos y dejar comentarios sin necesidad de que yo esté copiando y pegando contexto manualmente entre herramientas.

En otras palabras: el ticket deja de ser una isla separada del código.

Y eso cambia bastante el juego.

## Por qué no usar un solo agente para todo

Esta fue una de las decisiones más importantes.

La tentación obvia es crear un mega-agente con acceso completo a todo y pedirle: “resuelve este bug”. En teoría suena eficiente. En práctica, no tanto.

Un agente monolítico tiene varios problemas:

- mientras más largo el prompt, más fácil que pierda foco
- si el mismo agente implementa y valida, no existe segunda opinión real
- cuesta más depurar su comportamiento cuando se equivoca
- cualquier cambio de proceso obliga a tocar una sola entidad enorme y frágil
- no acumula aprendizajes de forma clara por etapa

Separar agentes me dio algo mucho más mantenible. Si quiero mejorar el análisis inicial, trabajo sobre el planner. Si quiero endurecer la validación, mejoro el tester. Si quiero añadir memoria de patrones, evoluciono el retro. Cada parte puede crecer sin convertir el sistema en una sopa de instrucciones.

Además, hay un beneficio importante de seguridad y control: cada agente solo recibe las herramientas que necesita. El planner puede leer ADO y navegar el código. El fixer puede editar. El tester revisa. Nadie necesita acceso absoluto a todo.

Principio de menor privilegio, aplicado a agentes de IA.

## Lo que pasa en la práctica

En uso real, el ciclo se siente así:

Yo le pido al planner que analice un bug específico. El planner me devuelve algo como esto:

- severidad y triage del bug
- causa raíz probable con snippet del código problemático
- propuesta de fix
- referencia a otro módulo que resuelve un problema similar
- notas de riesgo

Luego el fixer hace su trabajo. Después el tester me dice si el cambio realmente se sostiene o si huele a parche apresurado. Y al final el retro deja guardado el patrón detectado.

Para bugs moderados, el ciclo completo puede bajar a minutos. No porque la IA sea mágica, sino porque elimina gran parte del cambio de contexto y la ceremonia alrededor del trabajo.

Yo sigo tomando las decisiones importantes. Sigo leyendo el plan. Sigo validando si el enfoque tiene sentido. Pero ya no tengo que hacer manualmente toda la parte mecánica de recopilar contexto, ordenar el problema y preparar el terreno.

Y honestamente, eso vale muchísimo.

## Lo interesante no es la velocidad

La parte más llamativa de este tipo de sistema no es que “arregla bugs rápido”. Lo más interesante es otra cosa: convierte un proceso difuso y tácito en un flujo explícito.

Te obliga a definir:

- cómo se analiza un bug
- qué evidencia cuenta como causa raíz
- qué tan detallado debe ser un plan
- cómo se valida un fix
- qué aprendizajes vale la pena guardar

Cuando haces eso, no solo mejoras a los agentes. También mejoras tu propio proceso como equipo. Te das cuenta de qué partes eran criterio técnico real y qué partes eran simplemente desorden operativo.

## Lo que sigue

Todavía hay varias cosas que quiero añadir:

- métricas de tiempo promedio por bug
- tasa de aprobación del fixer al primer intento
- clasificación automática de patrones recurrentes
- soporte para más productos y módulos
- mejores reportes de regresión

Pero incluso en su estado actual, el squad ya me sirve.

No reemplaza desarrolladores. No sustituye criterio. No elimina la necesidad de entender el sistema. Lo que sí hace es quitar bastante trabajo mecánico del camino para que yo pueda concentrarme en lo que de verdad importa: pensar bien el problema y decidir bien la solución.

Y para ser sincero, ese es exactamente el tipo de uso de IA que más me interesa.

No una demo bonita. No un juguete. No un “mira cómo escribe código”.

Una herramienta real que me quite fricción en trabajo real.

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
