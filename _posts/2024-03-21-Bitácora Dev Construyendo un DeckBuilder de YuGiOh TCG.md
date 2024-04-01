---
title: Bitacora Dev - YuGiOh! DeckBuilder - Proyecto-pasatiempo hecho con .NET 8
date: 2024-03-22 11:07:00 -500
categories: [proyectos personales,software, development, yugioh] 
tags: [.net7,c#,unity,yugioh,asp.net core, async] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---
![image](/assets/img/2captura.jpg) 
Bitácora de desarrollo: **Yugioh, visualizador de cartas y constructor de decks**.

En este artículo, compartiré los avances y funcionalidades de esta sencilla aplicación creada con ASP.NET Core, C#, SQL y Javascript. Este proyecto nació del gusto y la nostalgia por el juego de cartas que muchos de los que nacimos en la década de los 90s disfrutamos en nuestra infancia, YuGiOh juego de cartas coleccionables. 

## Bitácora de Desarrollo: Creando YugiohDeckBuilder
Este es un proyecto personal de código abierto nacido de mi afición por el juego. Concebido inicialmente como una herramienta para gestionar y visualizar mazos de cartas de una manera más eficiente. A continuación, detallaré los aspectos más destacados de este proyecto hasta ahora. 

## Estructura del Proyecto
El proyecto se divide en varias partes clave, diseñadas para ofrecer una experiencia completa al usuario:

- **DeckBuilder**: Permite la creación y edición de mazos, con funcionalidades de arrastrar y soltar para facilitar el diseño del mazo. Esta página obtiene las cartas de la DB 

- **DecksManager**: Proporciona una vista general de todos los mazos disponibles, con opciones para editar, duplicar, renombrar y eliminar. Esta página obtiene los decks leídos desde una ubicación en la máquina local. Los decks están en archivos .ydk. 

- **CardViewer**: Ofrece una vista detallada de cada carta, incluyendo información sobre los sets en los que aparece y sus precios en el mercado. Esta página carga la carta desde la API. 

- **CardSearch** (Index): La página principal en donde el usuario puede buscar cartas por nombre. Esta página obtiene las cartas de la API. 


### Proyectos añadidos: 
- **YugiohDB**: Es un proyecto de consola secundario que asiste en la gestión de la base de datos y en la preparación inicial de los datos, incluido la descarga de las imágenes de las cartas. 
  
- **ImagesHelper**: Este es un proyecto que está actualmente en construcción. Tendrá la tarea única de ayudar en la descarga de las cartas al local. 

## Tecnologías y Manejo de Datos
Para garantizar que **YugiohDeckBuilder** se mantenga actualizado y funcione de manera óptima, he integrado la aplicación con la base de datos proporcionada por la API de ygoprodeck, utilizando EntityFrameworkCore para manipular estos datos localmente a través de la clase ``YgoContext``. Esto permite un acceso rápido y eficiente a la información de las cartas.

Para la obtención de datos desde la API de ygoprodeck.com, usamos el proveedor de cartas encapsulado en la clase ``YgoCardsProvider``. Éste a su vez implementa la interfaz ```ICardsProvider```. 

Estoy pensando en crear también de esta forma el servicio de proveedor de datos de SQL, el cual sería una abstracción que use ``YgoContext``, pero esto no ha sido necesario y sigo pensando en si hacerlo o no. 

## Manejo de Imágenes
Siguiendo las recomendaciones de ygoprodeck, decidí almacenar localmente las imágenes de las cartas para reducir la dependencia de la API externa. Esto mejora significativamente los tiempos de carga y la experiencia del usuario. Para poder hacer esto puedes usar el proyecto de consola YugiohDB. Lee el README del repositorio para usarlo. 

## Contribuciones
**YugiohDeckBuilder** es un proyecto de código abierto, y animo a otros desarrolladores a contribuir. Ya sea mejorando la funcionalidad existente, añadiendo nuevas características, o simplemente optimizando el código, todas las contribuciones son bienvenidas. El proyecto está alojado en GitHub, donde puedes encontrar más detalles sobre cómo colaborar.

Puedes checar, clonar o hacer fork al proyecto [desde su repositorio en mi GitHub.](https://github.com/diego-devs/YuGiOhTCG)


## Reflexión Final
Crear **YugiohDeckBuilder** ha sido una práctica enriquecedora , permitiéndome combinar mi gusto por el desarrollo y el juego de Yu-Gi-Oh. A través de este proyecto, he podido profundizar en tecnologías como ASP.NET Core, Javascript y C#. 

Espero que esta bitácora de desarrollo ofrezca una visión clara del trabajo detrás de esta sencilla web app y anime a otros a explorar el código, utilizar la aplicación, y contribuir al proyecto.

Asegúrate de seguir visitando mi blog para obtener más actualizaciones y detalles sobre este proyecto personal que tengo.


¡Saludos, duelistas!


**Mis redes:**

[LinkedIn](https://www.linkedin.com/in/diego-diaz-mendoza/)

[GitHub](https://github.com/diego-devs)

[Twitter](https://twitter.com/Diego_Devs)    

[YouTube](https://www.youtube.com/channel/UCGQmO-aJ9yJSdv_VD8_IDjg)

[TikTok](https://www.tiktok.com/@diegoz.code)

[Instagram](https://www.instagram.com/devs.diego/)
