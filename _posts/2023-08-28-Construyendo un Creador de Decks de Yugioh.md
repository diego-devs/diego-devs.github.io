---
title: Bitacora Dev Construyendo un Creador de Mazos de Yu-Gi-Oh con ASP.NET Core
date: 2023-08-28 11:07:00 -500
categories: [proyectos personales,software, development, yugioh] 
tags: [.net7,c#,unity,yugioh,asp.net core, async] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---
![image](/assets/img/deckbuilder1.png) 
Bitácora de desarrollo: **Yugioh, visualizador de cartas y constructor de decks**.
En este artículo, compartiré los avances y funcionalidades de esta sencilla aplicación creada con ASP.NET Core, C#, SQL y Javascript. 

## El Proyecto en Desarrollo
El objetivo es crear una herramienta que facilite la búsqueda de cartas, creación y gestión de decks de Yu-Gi-Oh. Hasta ahora, he establecido la base para esta solución, centrándome en tres funcionalidades clave:

## Búsqueda y Visualización de Cartas
El proyecto nos permite buscar y visualizar cartas de Yu-Gi-Oh desde la API ygoprodeck y también desde una base de datos local creada con SQLServer. 

Lo que hice fue crear un proveedor de datos que implementa una interfaz llamada ```ICardsProvider```. De esta forma implementé el método para buscar las cartas, algo así: 
```cs
// Pedimos texto como parámetro, normalmente el nombre relacionado a la carta
async Task<ICollection<Card>> ICardsProvider.GetSearchAsync(string search) 
        {
            // Añadimos la búsqueda al query tal y como lo pide ygoprodeck.com en sus docs
            string url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=" + search;
            // Creamos nuestro cliente usando HttpClient. Namespace: System.Net.Http
            var ygoClient = new HttpClient() { BaseAddress = new Uri(url) };

            try
            {
                // Importante, usamos métodos asíncronos para las llamadas a la API
                var request = await ygoClient.GetAsync(url);
                // Validamos si el request fue existoso o no
                if (request.IsSuccessStatusCode)
                {
                    // Leemos el contenido como string
                    var content = await request.Content.ReadAsStringAsync();
                    // Deserializamos usando JsonSerializer de System.Text.Json
                    var model = JsonSerializer.Deserialize<Card>(content, new JsonSerializerOptions());
                    // Solo para debug: 
                    Console.WriteLine("Cards found: " + model.Data.Count);

                    var data = model.Data;
                    return data;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
```

## El Deck Builder

 La página de Deck Builder muestra el deck seleccionado previamente (esto es hardcode por el momento), dividiendo las cartas en el Main Deck, Extra Deck y Side Deck. 

Para esta pagina y debido a las imagenes usadas, YgoProDeck API recomienda no hacer llamadas para las imagenes que ellos tienen en su servidor, sino descargarlas localmente y llamarlas de este modo. Así es tal y como funciona esta página Deck Builder. Las cartas manejadas en este sitio son consultadas directamente de nuestra clase YGOContext, que representa nuestra base de datos local. 

Copiar todas las cartas, sets, precios, imágenes y demás fue una lata, pero se logró. Esto lo explico más a fondo en la [documentación](https://github.com/diego-devs/YuGiOhDeckBuilder) del repositorio en GitHub.

### División del Contenido en DeckBuilder
Aquí tenemos la pantalla dividida en tres, en donde de lado derecho se muestra una búsqueda de cartas, en medio todas las cartas del Deck más información adicional y de lado izquierdo la carta seleccionada en visualización amplia y detalles. 

```html
<div class="split-section">
    <div class="detail-section">
        <!-- Imagen de la carta en grande con detalles -->
    </div>
    <div class="deck-section">
        <!-- El Deck actual dividido en Main, Extra y Side -->
    </div>
    <div class="cards-section">
        <!-- La búsqueda de cartas hecha por el usuario, -->
        <!-- desde aquí se arrastran las cartas para agregarse al deck -->
    </div>
</div>
```
## Hand Testing
Work in progress... Aquí deberíamos de poder tener una visualización interactiva del deck para poder sacar cartas. Ya se tiene algo muy primitivo en el código para esto. 

# Próximos Pasos, Notas del desarrollador

Todavía hay mucho por hacer ya que la solución tiene muchos problemas tanto de frontend como de backend. No tener un framework para el front ha hecho las cosas más enrredadas con Javascript, pero definitivamente he aprendido muchísimo sobre el lenguaje. 

 La base de datos tiene que ser actualizada ya que cada ciertos meses nuevas cartas son lanzadas y para eso usaré una app de consola que lo haga de forma automática. Ya se tiene código creado para esto, solo hace falta incroporarlo para este fin. 
 
 Incorporar interactividad adicional para mejorar la experiencia del usuario es imperativo.

 Añadir el Hand Testing y el Deck Manager (para crear decks y administrarlos) es algo en lo que estoy trabajando actualmente.  

Asegúrate de seguir visitando mi blog para obtener más actualizaciones y detalles sobre el proyecto.

Puedes checar el repositorio del proyecto [desde aquí.](https://github.com/diego-devs/YuGiOhTCG)
Eres bienvenido a contribuir al proyecto si así lo deseas. Acá está mi contacto. 

¡Saludos, duelistas!
