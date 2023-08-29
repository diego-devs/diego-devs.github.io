# Bitacora Dev - Construyendo un Creador de Mazos de Yu-Gi-Oh con ASP.NET Core (*****update*****)
¡Bienvenido a esta bitácora de desarrollo! 
En este artículo, compartiré los avances y funcionalidades del Creador de Mazos de Yu-Gi-Oh utilizando .NET 6 y ASP.NET Core.

## El Proyecto en Desarrollo
El objetivo es crear una herramienta que facilite la creación y gestión de mazos de cartas de Yu-Gi-Oh. Hasta ahora, he establecido la base para este Creador de Mazos, centrándome en tres funcionalidades clave:

## Búsqueda y Visualización de Cartas
El proyecto nos permite buscar y visualizar cartas de Yu-Gi-Oh desde una base de datos. Hemos creado una página donde puedes introducir el nombre de una carta y obtener una lista de resultados coincidentes. Esto facilita la búsqueda de las cartas que deseas agregar a tu mazo.

Para esto nos conectamos a la API de ygoProDeck y consultamos las cartas requeridas. Lo que hice fue crear un proveedor de datos que implementa una interfaz llamada ```ICardsProvider```. De esta forma implementé el método para buscar las cartas.
```cs
async Task<ICollection<Card>> ICardsProvider.GetSearchAsync(string search)
        {
            string url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=" + search;
            var ygoClient = new HttpClient() { BaseAddress = new Uri(url) };

            try
            {
                var request = await ygoClient.GetAsync(url);
                if (request.IsSuccessStatusCode)
                {
                    var content = await request.Content.ReadAsStringAsync();
                    var model = JsonSerializer.Deserialize<Card>(content, new JsonSerializerOptions());
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

## Gestión de Mazos - DeckBuilder
Una vez que tienes una lista de cartas disponibles, hemos implementado una funcionalidad para cargar un mazo. Puedes seleccionar cartas desde la lista y agregarlas a tu mazo en construcción. La página de "DeckBuilder" muestra tu mazo actual, dividiendo las cartas en el mazo principal, mazo extra y mazo lateral.

Para esta pagina y debido a las imagenes usadas, YgoProDeck API recomienda no hacer llamadas para las imagenes que ellos tienen en su servidor, sino descargarlas localmente y llamarlas de este modo. Así es tal cual funciona este YGO Deck Builder. Las cartas manejadas en este sitio son consultadas directamente de nuestra clase YGOContext, que representa nuestra base de datos ya creada con todas las cartas (copiar todas fue una lata, pero se logró).

### División del Contenido en DeckBuilder
Una de las características es la disposición dividida en la página "DeckBuilder". Aquí es donde puedes ver tu mazo actual en un lado de la pantalla y las cartas disponibles para agregar en el otro. Esta división del contenido permite una administración fluida del mazo.

```html
<!-- Ejemplo de la división del contenido en DeckBuilder -->
<div class="split-section">
    <div class="deck-section">
        <!-- ... código para mostrar el mazo actual ... -->
    </div>
    <div class="cards-section">
        <!-- ... código para mostrar las cartas disponibles ... -->
    </div>
</div>

```
# Próximos Pasos
Aunque he logrado avances en este Creador de Mazos de Yu-Gi-Oh, todavía hay mucho por hacer. El próximo paso será implementar funcionalidades para hacer que las cartas de la lista de búsqueda sean seleccionables y agregables al mazo cargado. También estoy planeando incorporar interactividad adicional para mejorar la experiencia del usuario.

Asegúrate de seguir visitando mi blog para obtener más actualizaciones y detalles sobre el proyecto.

Puedes checar el repositorio del proyecto [desde aquí.](https://github.com/diego-devs/YuGiOhTCG)
