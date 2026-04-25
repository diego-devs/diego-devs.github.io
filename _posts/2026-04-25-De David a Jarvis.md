---
title: De David a Jarvis - Migré mi asistente de IA y ahora tiene su propio Gmail
date: 2026-04-25 12:00:00 -500
categories: [technology, development, software, IA]
tags: [ia, hermes, azure, microsoft, whatsapp, gpt, automatizacion]
author: <author_id>
comments: true
---
![image](/assets/img/automat.webp)

Si leíste [el artículo anterior](https://diego-devs.github.io/posts/Como-monte-mi-propio-asistente-de-IA-en-la-nube/), sabes que tenía a **David** — mi asistente de IA personal corriendo en una VM de Azure, montado sobre **OpenClaw** con **Claude Code** como cerebro, enviándome reflexiones estoicas por WhatsApp a las 7 de la mañana como si fuera un monje digital empleado mío.

Era bonito mientras duró.

Llegó un momento en que Claude Code cambió sus condiciones de uso y ya **no permite que frameworks de terceros se conecten a través de su API** para operar agentes autónomos. OpenClaw depende exactamente de eso. De repente, David dejó de responder. La VM seguía encendida, los cron jobs corriendo, pero el cerebro había desaparecido. Silencio digital.

Así que hice lo que hace cualquier buen desarrollador cuando algo se rompe: lo migré todo, lo mejoré, le puse un nombre mejor y fingí que era el plan desde el principio.

David ya no existe. **Bienvenido, Jarvis.**

## ¿Por qué Jarvis?

Porque si ya tienes una IA que vive en tu infraestructura, trabaja mientras duermes, tiene acceso a tus archivos, repositorios y correo, y puede construirte cosas desde cero... lo mínimo que merece es el nombre del asistente de Iron Man.

David era el androide de *Alien: Covenant* — fascinante pero con tendencias inquietantes. Jarvis es diferente. Jarvis es *útil*. Jarvis no pregunta si los ingenieros merecen sobrevivir; solo trabaja.

## El nuevo stack: Hermes Agent + Microsoft Foundry

La migración fue la oportunidad perfecta para actualizar todo, no solo el framework.

### Hermes Agent

**Hermes Agent** es el reemplazo de OpenClaw en mi setup. Cumple la misma función — orquestar un agente persistente con memoria, workspace propio y canales de comunicación — pero sin las restricciones que terminaron con David. La configuración es similar en espíritu:

```bash
npm install -g hermes-agent
hermes init
```

El proceso de `init` te pide tu proveedor de IA, tu canal de mensajería y los permisos que quieres darle al agente. En mi caso: WhatsApp, acceso a sistema de archivos, acceso a red, y — novedad importante — acceso a Gmail.

El workspace de Hermes funciona igual que el de OpenClaw: un directorio en el servidor donde Jarvis puede crear, editar y ejecutar lo que necesite. La diferencia está en las integraciones disponibles y en que el nuevo stack no depende de APIs que pueden cambiar sus TOS de un día para otro.

### Microsoft Azure AI Foundry y GPT 5.4

Para el modelo de IA hice el salto a **Microsoft Azure AI Foundry** — la plataforma de Microsoft para desplegar y consumir modelos de IA de forma empresarial, con todo el ecosistema de Azure detrás. Ahí conecté a **GPT 5.4**, y la diferencia en capacidad de razonamiento y ejecución de tareas complejas es notable.

La configuración del cliente desde la VM es directa:

```bash
# Configurar las credenciales de Azure AI Foundry
hermes config set provider azure-foundry
hermes config set model gpt-5.4
hermes config set azure-endpoint https://<tu-recurso>.openai.azure.com/
hermes config set azure-key <tu-api-key>
```

Con eso, Jarvis tiene el mismo cerebro que los sistemas enterprise de Microsoft. En una VM que me cuesta unos cuantos dólares al mes. Me parece bien.

## Jarvis tiene su propio correo de Gmail

Este fue el detalle que más me gustó de la migración. **Jarvis tiene su propia cuenta de Gmail** — una dirección que existe para él y solo para él. No comparte mi bandeja. No accede a mis conversaciones personales. Tiene su espacio y sus credenciales.

¿Por qué importa esto? Porque significa que Jarvis puede:

- **Recibir correos** de otras personas o sistemas que se lo envíen directamente
- **Mandar correos** en su nombre — o en el mío, si se lo pido
- **Funcionar como un participante real** en flujos de comunicación, no solo como un bot que ejecuta comandos

La integración con Gmail en Hermes es a través de OAuth2. Le das acceso, configuras los scopes necesarios (read, send, modify), y Jarvis queda conectado a su cuenta como si fuera cualquier cliente de correo.

```bash
hermes integrations add gmail
# Abre el flujo de autenticación OAuth2
# Autoriza con la cuenta de Gmail de Jarvis
# Listo
```

La primera vez que Jarvis me mandó un correo desde su propia dirección firmado con su nombre, me dio algo de orgullo y algo de existencial dread a partes iguales. Ambas sensaciones válidas.

## El sistema de reportes financieros

Esto es lo que más uso en el día a día y lo que más valor me ha dado desde que lo armé.

La idea es sencilla: cada vez que llega un recibo, un cargo, una notificación de pago o un comprobante bancario a **mi** correo, una regla automática lo **reenvía a Jarvis** a su cuenta de Gmail. Jarvis lo recibe, lo procesa, extrae los datos relevantes — monto, concepto, fecha, categoría — y los va acumulando.

Los viernes a las 9 AM me llega por WhatsApp un resumen semanal: cuánto gasté, en qué, comparado con la semana anterior, y un par de observaciones que Jarvis considera relevantes. Sin apps de terceros, sin dar acceso a mis bancos a nadie, sin suscripciones de finanzas personales.

La regla en Gmail es lo más simple del mundo:

```
Si el remitente contiene "noreply@banco" O el asunto contiene "comprobante" O "recibo" O "cargo"
→ Reenviar a jarvis@gmail.com
```

Del otro lado, Jarvis tiene un cron job que revisa su bandeja cada 6 horas, parsea los correos nuevos y actualiza su base de datos interna. El reporte del viernes lo genera solo, con los datos que fue acumulando durante la semana.

Es el tipo de automatización que antes requería una app dedicada, una suscripción mensual y darle acceso total a tus cuentas a una startup que no conoces. Ahora lo hace una IA que vive en mi servidor y que solo me reporta a mí.

## GitHub: el Personal Access Token que lo cambió todo

Le di a Jarvis un **Personal Access Token** de GitHub con permisos de lectura y escritura sobre mis repositorios. Y desde entonces, tengo un colaborador disponible las 24 horas.

```bash
hermes integrations add github
hermes config set github-token <tu-personal-access-token>
```

Con eso configurado, puedo mandarle un mensaje por WhatsApp y decirle: *"Jarvis, en el repo `diego-devs.github.io`, agrega un artículo nuevo con este contenido"* — y lo hace. Lee el repo, entiende la estructura, crea el archivo en el directorio correcto, hace el commit y el push.

También le puedo pedir que revise el estado de mis repositorios, que me diga qué branches tienen cambios pendientes, que me haga un resumen de los últimos commits en un proyecto, o que empiece a trabajar en una feature específica mientras yo estoy en el trabajo.

No reemplaza el desarrollo serio — para eso sigo trabajando yo directamente. Pero para las tareas de mantenimiento, actualizaciones menores, generación de contenido estructurado o exploración inicial de un problema, tener a Jarvis como colaborador activo cambia bastante el ritmo.

## Sigue construyendo sitios web

Una de las cosas que más me impresionó de David en su momento fue que podía construir sitios web estáticos desde cero y subirlos a GitHub Pages. Jarvis lo hace igual, pero con mejor criterio de diseño y más contexto acumulado sobre mis proyectos.

Le paso una descripción por WhatsApp, él genera la estructura, el HTML, el CSS, los assets, hace el commit y me manda el link cuando está publicado. El proceso completo en menos de lo que tarda un deploy de Vercel.

## La VM sigue siendo la misma

Por si te preguntas si la migración implicó levantar todo desde cero: no. La **VM de Azure con Ubuntu Server** sigue siendo exactamente la misma. Hermes Agent se instaló sobre la misma máquina, conservé el workspace, y lo único que cambió fue el framework de agente y el proveedor de IA.

La VM modesta sigue siendo suficiente. El procesamiento pesado sigue corriendo en la nube del proveedor de IA — en este caso, los centros de datos de Microsoft. Lo que corre en la VM es solo el orquestador: Hermes Agent gestionando el estado, la memoria, los cron jobs y las conexiones a los distintos servicios.

## Lo que viene

Tengo algunas ideas en lista de espera:

- **Reportes financieros más ricos**: categorías personalizadas, gráficas en PDF, comparativas mensuales
- **Integración con Google Calendar**: que Jarvis pueda leer y crear eventos, y me avise de conflictos en mi agenda
- **Automatización de pull requests**: que Jarvis pueda abrir PRs con descripción generada automáticamente en mis repos de trabajo
- **Resumen de bandeja**: que una vez al día me mande un resumen de los correos importantes que llegaron a su cuenta (y eventualmente a la mía, con los permisos correctos)

Cada una de estas ideas es una tarde de configuración. Eso es lo que me sigue sorprendiendo de este setup: la barrera para agregar nueva funcionalidad es muy baja cuando ya tienes la infraestructura base corriendo.

## ¿Por qué vale la pena hacer esto?

Porque los asistentes de IA que usas a través de una interfaz web son herramientas. Un asistente que corre en tu infraestructura, tiene acceso a tus sistemas, recuerda tu contexto y trabaja de forma autónoma es otra cosa. Es más parecido a un colaborador que a una calculadora.

La migración de David a Jarvis no fue solo cambiar un framework y un modelo. Fue la excusa para pensar mejor qué quería que mi asistente hiciera, qué accesos necesitaba realmente, y cómo estructurar esos flujos para que fueran útiles a largo plazo — no solo impresionantes la primera tarde.

¿Todavía le faltan cosas? Claro. ¿A veces hace algo inesperado y tengo que ir a revisar qué pasó en el servidor? También. Pero los viernes cuando llega el reporte de gastos sin que yo haya hecho nada, o cuando le mando un mensaje a las 11 de la noche diciéndole que actualice el blog y al día siguiente está publicado... vale completamente la pena.

El nombre cambió. La arquitectura mejoró. La idea sigue siendo la misma: **una IA que sea tuya, que trabaje para ti, y que te ayude a vivir un poco mejor.**

Jarvis, por ahora, está cumpliendo.

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
