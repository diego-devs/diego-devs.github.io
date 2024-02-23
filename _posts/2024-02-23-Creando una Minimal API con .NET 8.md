---
title: Creando una Minimal API con .NET 8 
date: 2024-02-23 20:07:00 -500
categories: [software, development, backend, .NET8, APIs] 
tags: [api, .net8, c#] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---
![image](/assets/img/APIusing.png)

En un mundo donde la tecnología evoluciona constantemente, la habilidad de crear y manejar APIs se ha convertido en un conocimiento esencial para los desarrolladores. En este artículo te explicaré brevemente qué es una API, por qué deberías saber usarlas y además, vamos a crear una API de manera sencilla con .NET 8 y C#. 

## ¿Qué es una API y por qué es Importante en el Desarrollo de Software?

Una API (Interfaz de Programación de Aplicaciones) es esencial para la comunicación entre distintas aplicaciones o sistemas de software. Sirve como puente para intercambiar datos y solicitudes, mejorando la integración y eficiencia de las aplicaciones. Comprender las APIs es vital en el ámbito del desarrollo de software, ya que permite crear soluciones más innovadoras y personalizadas. En el contexto digital actual, dominar las APIs se ha vuelto fundamental para desarrolladores y empresas que aspiran a ofrecer experiencias de usuario superiores y mantenerse a la vanguardia.

![image](/assets/img/api-.jpg)

La analogía del mesero en un restaurante simplifica el concepto de una API. La cocina, donde se preparan los platos, es el backend, y los comensales representan a los usuarios finales. El mesero, actuando como la API, facilita la comunicación entre ambos, llevando los pedidos a la cocina y entregando los platos a los clientes. Esta comparación destaca cómo las APIs permiten interacciones eficientes entre el backend y los usuarios, sin que estos últimos necesiten entender los detalles técnicos del proceso o saber si las salsas están todas hechas. Los clientes solo quieren que su platillo llegue caliente y listo para comer. 

![image](/assets/img/api_3.png)

En el contexto del desarrollo de software, esto se traduce en un intercambio de datos y funcionalidades entre distintas aplicaciones o componentes de software.

La importancia de las APIs reside en su capacidad para expandir las funcionalidades de tus aplicaciones, permitiéndoles interactuar con otras aplicaciones y servicios. Por ejemplo, una API de mapas puede integrar información geográfica en tu sitio web o aplicación móvil, abriendo un mundo de posibilidades en términos de interactividad y utilidad.


## ¿Cómo usar .NET 8 para crear APIs?

### Minimal APIs con .NET 8

Son una forma simplificada de construir APIs en .NET, diseñada para reducir la complejidad y la cantidad de código necesario para iniciar y desarrollar servicios web. Este enfoque se centra en la productividad y la facilidad de uso, permitiendo a los desarrolladores definir rutas y manejar solicitudes HTTP con muy pocas líneas de código. 

### 1. Preparativos

Antes de comenzar, asegúrate de tener instalado el SDK de .NET 8. Puedes verificarlo ejecutando 
```cs
dotnet --version
``` 
Si no lo tienes, descárgalo desde [el sitio oficial de Microsoft](https://dotnet.microsoft.com/download/dotnet/8.0)


### 2. Creación del Proyecto
Para iniciar, crea un nuevo proyecto llamado RestauranteAPI, lo cual se puede hacer fácilmente mediante la línea de comandos de .NET. Este paso generará la estructura básica necesaria para nuestra API.

Abre tu terminal y ejecuta:

```bash
dotnet new webapi -n RestauranteApi
```

Navega al directorio del proyecto:

```bash
cd RestauranteApi
```
### 3.  Configuración de la API

Para adaptar el proyecto a nuestras necesidades, enfocaremos en configurar una API minimalista directamente dentro del archivo Program.cs, eliminando la necesidad de controladores separados.

Reemplaza el contenido predeterminado de Program.cs con el siguiente código, que define dos endpoints esenciales para nuestra API de restaurante:

```cs
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Método GET para obtener un pedido por ID
app.MapGet("/pedido/{id}", (int id) => {
    // Simulación de búsqueda de un pedido por ID
    var pedido = new { Id = id, Producto = "Pizza Margarita", Estado = "Preparándose" };
    return Results.Ok(pedido);
}).WithName("GetPedido");

// Método POST para crear un nuevo pedido
app.MapPost("/pedido", ([FromBody] Pedido nuevoPedido) => {
    // Procesa el nuevo pedido
    nuevoPedido.Id = new Random().Next(1000); // Simulación de asignación de ID
    // Guarda el pedido aquí

    return Results.CreatedAtRoute("GetPedido", new { id = nuevoPedido.Id }, nuevoPedido);
});
app.Run();
```
Este código configura dos endpoints: uno para obtener los detalles de un pedido (GET) y otro para crear un nuevo pedido (POST).

### Método GET
Este método se utiliza para solicitar la información de un pedido específico sin modificar los datos. Proporciona una forma eficiente de recuperar detalles basados en el ID del pedido.

### Método POST
A diferencia del GET, el método POST se emplea para enviar datos al servidor, como crear un nuevo pedido. Este enfoque asegura que la información necesaria para procesar y almacenar un pedido nuevo se maneje de manera segura.


### Clase Pedido 
No hay que olvidar crear la clase Pedido, necesaria para nuestra lógica:  

```cs
public class Pedido
{
    public int Id { get; set; }
    public string Producto { get; set; }
    public string Estado { get; set; }
    // Puedes añadir más propiedades según los requerimientos del negocio, como cantidad, precio, etc.

    // Constructor vacío necesario para la deserialización
    public Pedido() { }

    // Constructor para facilitar la creación de instancias con propiedades inicializadas
    public Pedido(int id, string producto, string estado)
    {
        Id = id;
        Producto = producto;
        Estado = estado;
    }
}
```


#### 4.  Ejecución de la API
Para poner en marcha nuestra API, ejecuta el siguiente comando en el terminal:

```bash
dotnet run
```

Tu API ahora está corriendo localmente y puedes probarla utilizando Postman o cualquier cliente HTTP, enviando peticiones GET y POST a http://localhost:5058/pedido. 

```*Revisa que el puerto al que estás tratando de acceder sea el que está definido en el archivo Properties/launchSettings.json*```

Incluso puedes usar tu propio explorador. http://localhost:5058/pedido/123
deberías ver algo como esto: 

![image](/assets/img/results_minimal_api.PNG)

**¡Listo!** Así de fácil es crear Minimal APIs con .NET 8 y C#. 



## Prueba de la API

Puedes usar Postman u otras herramientas similares para probar tu API enviando solicitudes HTTP a las rutas que has definido. Asegúrate de que tus endpoints respondan correctamente y manejen las solicitudes de acuerdo a tu lógica. 

### ¡No olvides practicar mucho y divertirte probando esto en tus proyectos personales! 



