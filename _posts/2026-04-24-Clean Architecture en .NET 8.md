---
title: Clean Architecture en .NET 8 - Estructura que Escala
date: 2026-04-24 12:00:00 -500
categories: [technology, development, dotnet, programming, architecture]
tags: [cleanarchitecture, dotnet, csharp, architecture, programming]
author: <author_id>
comments: true
---
![image](/assets/img/softplanplanejamentoesistemasltda_softplan_image_175.jpeg)

## Del código limpio a la arquitectura limpia

Si llevas un tiempo leyendo este blog, ya sabes cómo aplicar los **principios SOLID** y cómo usar el **patrón Repository** para separar la lógica de acceso a datos de la lógica de negocio. Felicidades, ya tienes las piezas del rompecabezas. Pero... ¿cómo encajan todas esas piezas en un proyecto real? ¿Cómo organizas **toda una solución** para que no se convierta en un monstruo inmantenible a los seis meses?

Ahí es donde entra la **Clean Architecture**.

Y no, no es solo otro término fancy para impresionar en las entrevistas de trabajo (aunque funciona). Es una forma estructurada y probada de organizar tu aplicación para que cada quien sepa dónde vive cada cosa, y para que los cambios en una parte no rompan todo lo demás. El tipo de arquitectura donde, cuando llega ese ticket que dice "cambia el proveedor de base de datos", no te da un ataque de pánico.

## ¿Qué es Clean Architecture?

**Clean Architecture** fue propuesta por Robert C. Martin — sí, el mismo Uncle Bob de los principios SOLID. El señor no para. La publicó en 2012 y desde entonces se convirtió en referencia obligada para cualquier proyecto que quiera crecer sin explotar en el proceso.

La idea central es deceptivamente sencilla:

> **El código de negocio no debe depender de los detalles técnicos. Los detalles técnicos deben depender del negocio.**

Dicho de otra forma: tu lógica de negocio no debería importarle si usas SQL Server, PostgreSQL, MongoDB o archivos de texto plano. No debería importarle si la presentación es una API REST, gRPC o una consola. La lógica de negocio existe de forma **independiente** de todos esos detalles.

Esto se logra organizando el código en **capas**, donde las capas internas no conocen nada de las externas, pero las externas sí dependen de las internas.

## Las 4 Capas

Piensa en Clean Architecture como una cebolla (sin llorar, te lo prometo). Cada capa envuelve a la anterior:

```
╔══════════════════════════════════════╗
║           Presentation               ║  ← API, Controllers, UI
║  ╔══════════════════════════════╗    ║
║  ║        Infrastructure        ║    ║  ← EF Core, HTTP, Email...
║  ║  ╔══════════════════════╗    ║    ║
║  ║  ║      Application     ║    ║    ║  ← Casos de uso, Servicios
║  ║  ║  ╔════════════════╗  ║    ║    ║
║  ║  ║  ║     Domain     ║  ║    ║    ║  ← Entidades, Interfaces
║  ║  ║  ╚════════════════╝  ║    ║    ║
║  ║  ╚══════════════════════╝    ║    ║
║  ╚══════════════════════════════╝    ║
╚══════════════════════════════════════╝
```

### Domain — El corazón

Es la capa más interna. Aquí viven tus **entidades** y las **reglas de negocio puras**. Esta capa no depende de absolutamente nada externo — ni de Entity Framework, ni de ASP.NET, ni de ningún paquete de NuGet. Solo C# estándar y lógica de negocio.

Aquí también defines las **interfaces** de los repositorios. ¿Recuerdas la `IRepository<T>` del artículo anterior? Pues eso pertenece aquí.

### Application — La lógica

Aquí viven los **casos de uso** de tu aplicación. Los servicios que orquestan la lógica: "crear un producto", "obtener el catálogo", "actualizar el inventario".

Esta capa solo depende de **Domain**. Nada más. Si Application necesita guardar algo en base de datos, lo hace a través de las interfaces que definiste en Domain — no sabe si abajo hay un SQL Server, una hoja de Excel o la memoria RAM. Le da igual.

### Infrastructure — Los detalles

Aquí viven las implementaciones concretas: **Entity Framework Core**, clientes HTTP, servicios de email, integraciones con APIs externas. Es donde pones manos a la obra con los detalles técnicos.

Esta capa implementa las interfaces que definiste en Domain. Si allá declaraste `IProductRepository`, aquí es donde creas `ProductRepository : IProductRepository` con todo el código de EF Core.

### Presentation — La puerta de entrada

La capa más externa. Aquí están tus **controllers**, tus endpoints de Minimal API, tu UI. Es la capa que interactúa con el mundo exterior.

Presentation solo conoce la capa de Application. Recibe solicitudes, llama a los servicios de Application y regresa respuestas. No tiene idea de si abajo hay SQL Server o una API de terceros, y no necesita saberlo.

## La Regla de Dependencia

Esta es la regla de oro que hace que todo funcione:

> **Las dependencias SIEMPRE apuntan hacia adentro. Nunca hacia afuera.**

Domain no conoce a nadie. Application solo conoce a Domain. Infrastructure conoce a Domain y Application. Presentation conoce a Application.

¿Te suena familiar? Exacto — es el **Dependency Inversion Principle** de SOLID, pero aplicado a toda la arquitectura. No fue coincidencia que Uncle Bob inventara ambos.

## Implementación en .NET 8

Suficiente filosofía — vamos al código. Vamos a construir un catálogo de productos con las cuatro capas. Verás que si ya conoces el patrón Repository, esto va a encajar de forma muy natural.

### Creando la Solución

```bash
# La solución y los cuatro proyectos
dotnet new sln -n ProductCatalog

dotnet new classlib -n ProductCatalog.Domain
dotnet new classlib -n ProductCatalog.Application
dotnet new classlib -n ProductCatalog.Infrastructure
dotnet new webapi   -n ProductCatalog.API

# Los agregamos a la solución
dotnet sln add ProductCatalog.Domain
dotnet sln add ProductCatalog.Application
dotnet sln add ProductCatalog.Infrastructure
dotnet sln add ProductCatalog.API
```

Ahora configuramos las referencias entre proyectos. Aquí es donde aplicas la regla de dependencia de forma explícita — si intentas agregar una referencia que viola la regla, ya sabes que algo está mal:

```bash
# Application conoce a Domain
dotnet add ProductCatalog.Application reference ProductCatalog.Domain

# Infrastructure conoce a Domain y Application
dotnet add ProductCatalog.Infrastructure reference ProductCatalog.Domain
dotnet add ProductCatalog.Infrastructure reference ProductCatalog.Application

# API conoce a Application e Infrastructure (solo para registrar dependencias)
dotnet add ProductCatalog.API reference ProductCatalog.Application
dotnet add ProductCatalog.API reference ProductCatalog.Infrastructure
```

Tu solución debería verse así:

```
ProductCatalog/
├── ProductCatalog.Domain/
├── ProductCatalog.Application/
├── ProductCatalog.Infrastructure/
└── ProductCatalog.API/
```

Cuatro proyectos. Cada uno con una responsabilidad bien definida. Ya huele a orden, ¿verdad?

---

### Capa 1: Domain

La entidad `Product` y la interfaz del repositorio. Cero dependencias externas — solo C#.

```csharp
// ProductCatalog.Domain/Entities/Product.cs
namespace ProductCatalog.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }

        // Regla de negocio pura — vive aquí, no en la base de datos ni en la API
        public bool IsAvailable() => Stock > 0;
    }
}
```

```csharp
// ProductCatalog.Domain/Interfaces/IProductRepository.cs
using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Domain.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
```

Nota que `IProductRepository` vive en **Domain**, no en Infrastructure. El dominio define el *contrato* — los detalles de implementación vienen después. Si esto te parece el DIP en acción, es porque lo es.

---

### Capa 2: Application

Los casos de uso y los DTOs. Esta capa orquesta la lógica de negocio usando las interfaces de Domain, sin saber nada de EF Core ni de HTTP.

```csharp
// ProductCatalog.Application/DTOs/ProductDto.cs
namespace ProductCatalog.Application.DTOs
{
    // Lo que exponemos al exterior — nunca la entidad del dominio directamente
    public record ProductDto(int Id, string Name, string Description, decimal Price, int Stock, bool IsAvailable);

    public record CreateProductDto(string Name, string Description, decimal Price, int Stock);

    public record UpdateProductDto(string Name, string Description, decimal Price, int Stock);
}
```

```csharp
// ProductCatalog.Application/Services/ProductService.cs
using ProductCatalog.Application.DTOs;
using ProductCatalog.Domain.Entities;
using ProductCatalog.Domain.Interfaces;

namespace ProductCatalog.Application.Services
{
    public class ProductService
    {
        // Solo conocemos la interfaz — no la implementación concreta de abajo
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await _repository.GetAllAsync();
            // Mapeamos entidad a DTO para no exponer el modelo de dominio
            return products.Select(p =>
                new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Stock, p.IsAvailable()));
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product is null) return null;
            return new ProductDto(product.Id, product.Name, product.Description, product.Price, product.Stock, product.IsAvailable());
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Name        = dto.Name,
                Description = dto.Description,
                Price       = dto.Price,
                Stock       = dto.Stock
            };

            var created = await _repository.AddAsync(product);
            return new ProductDto(created.Id, created.Name, created.Description, created.Price, created.Stock, created.IsAvailable());
        }

        public async Task UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _repository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"Producto con ID {id} no encontrado.");

            product.Name        = dto.Name;
            product.Description = dto.Description;
            product.Price       = dto.Price;
            product.Stock       = dto.Stock;

            await _repository.UpdateAsync(product);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
```

`ProductService` no sabe si los datos están en SQL Server, en memoria o en un JSON. Solo sabe que existe algo que cumple el contrato de `IProductRepository`. Los detalles técnicos le son completamente indiferentes — y eso es exactamente lo que queremos.

---

### Capa 3: Infrastructure

Aquí llegamos a Entity Framework. Primero, los paquetes:

```bash
dotnet add ProductCatalog.Infrastructure package Microsoft.EntityFrameworkCore
dotnet add ProductCatalog.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add ProductCatalog.Infrastructure package Microsoft.EntityFrameworkCore.Tools
```

```csharp
// ProductCatalog.Infrastructure/Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Product> Products { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
```

```csharp
// ProductCatalog.Infrastructure/Repositories/ProductRepository.cs
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Domain.Entities;
using ProductCatalog.Domain.Interfaces;
using ProductCatalog.Infrastructure.Data;

namespace ProductCatalog.Infrastructure.Repositories
{
    // Implementamos la interfaz que definimos en Domain
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
            => await _context.Products.ToListAsync();

        public async Task<Product?> GetByIdAsync(int id)
            => await _context.Products.FindAsync(id);

        public async Task<Product> AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is not null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
```

Si el artículo del patrón Repository te quedó grabado, esto se ve casi idéntico — y no es casualidad. Clean Architecture no reinventa el patrón, solo le da un hogar bien definido dentro del mapa de la solución.

---

### Capa 4: Presentation (API)

El último eslabón. Aquí configuramos los endpoints y, lo más importante, **registramos todas las dependencias** en el contenedor de inyección de .NET. Este es el único lugar en toda la solución donde las capas internas "se presentan" entre sí.

```csharp
// ProductCatalog.API/Program.cs
using Microsoft.EntityFrameworkCore;
using ProductCatalog.Application.DTOs;
using ProductCatalog.Application.Services;
using ProductCatalog.Domain.Interfaces;
using ProductCatalog.Infrastructure.Data;
using ProductCatalog.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registramos EF Core con SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Aquí casamos la interfaz del dominio con la implementación de infraestructura
// Este es el único lugar donde Infrastructure y Domain se "conocen" explícitamente
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ProductService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Los endpoints solo hablan con Application — nunca con Domain o Infrastructure directamente
app.MapGet("/products", async (ProductService service) =>
    Results.Ok(await service.GetAllAsync()));

app.MapGet("/products/{id}", async (int id, ProductService service) =>
{
    var product = await service.GetByIdAsync(id);
    return product is null ? Results.NotFound() : Results.Ok(product);
});

app.MapPost("/products", async (CreateProductDto dto, ProductService service) =>
{
    var created = await service.CreateAsync(dto);
    return Results.Created($"/products/{created.Id}", created);
});

app.MapPut("/products/{id}", async (int id, UpdateProductDto dto, ProductService service) =>
{
    await service.UpdateAsync(id, dto);
    return Results.NoContent();
});

app.MapDelete("/products/{id}", async (int id, ProductService service) =>
{
    await service.DeleteAsync(id);
    return Results.NoContent();
});

app.Run();
```

Observa el patrón en `AddScoped<IProductRepository, ProductRepository>()`. Este es el momento donde la magia ocurre: el contenedor de DI sabe que cada vez que alguien pida un `IProductRepository`, debe darle un `ProductRepository`. Las capas internas nunca se tienen que conocer directamente — el `Program.cs` hace las presentaciones.

---

## ¿Por qué vale la pena todo esto?

Quizás estás pensando: "Diego, esto es mucho andamiaje para un CRUD de productos." Y tienes razón — para un proyecto personal pequeño puede ser overkill. Pero considera estos escenarios reales:

**Mañana el cliente quiere migrar de SQL Server a PostgreSQL.** Solo tocas `Infrastructure`. Las otras tres capas ni se enteran del cambio.

**El equipo crece y ahora son cuatro developers trabajando en paralelo.** Cada quien trabaja en su capa sin pisarse los pies. Cero conflictos de merge por culpa de un archivo monolítico.

**Quieres escribir unit tests para la lógica de negocio.** Como `ProductService` depende de `IProductRepository` — una interfaz — puedes inyectar un mock en tus pruebas sin necesitar base de datos real. Tests rápidos, deterministas y sin infraestructura. Hablaremos más de esto pronto.

**El cliente quiere una app de Blazor además de la API.** Agregas un proyecto `ProductCatalog.Blazor` que consume el mismo `Application`. No hay que reescribir una sola línea de lógica de negocio.

Ese es el poder real: las decisiones técnicas se vuelven **reversibles**. Y en el desarrollo de software, eso no tiene precio.

## La conexión con lo que ya conoces

Si leíste los artículos de SOLID en este blog, habrás notado que Clean Architecture no es un concepto aislado — es SOLID llevado al nivel arquitectural:

| Principio SOLID | Cómo aparece en Clean Architecture |
|---|---|
| **SRP** | Cada capa tiene una sola razón para cambiar |
| **OCP** | Agregas nuevas implementaciones (nuevos repos, nuevos servicios) sin modificar las capas internas |
| **LSP** | Cualquier implementación de `IProductRepository` puede reemplazar a otra sin romper Application |
| **ISP** | Cada capa expone solo lo que necesita — los DTOs evitan que Presentation conozca toda la entidad |
| **DIP** | Application depende de abstracciones (interfaces en Domain), no de implementaciones concretas |

No es coincidencia. Son los mismos principios, aplicados a una escala mayor. Una vez que internalizas SOLID a nivel de clases, Clean Architecture es el siguiente paso natural.

## Conclusión

Clean Architecture no es magia ni es perfecta para todo. Es una inversión: pagas algo de complejidad inicial a cambio de mucha flexibilidad y mantenibilidad a largo plazo. En proyectos de escala mediana o grande, esa inversión se paga sola al primer cambio de requerimiento importante.

Lo que más me gusta de este enfoque es lo que *no* hace: no te ata a ningún framework, a ningún proveedor de base de datos, a ninguna decisión técnica particular. Tu dominio es tuyo. Los detalles técnicos vienen y van.

Si ya tienes proyectos en .NET con el patrón Repository, te tengo buenas noticias: ya estás a mitad del camino. Solo falta saber dónde vive cada pieza dentro del mapa completo.

Y hablando de piezas que encajan — en el próximo artículo vamos a ver **unit testing** con `xUnit` y `Moq`. Vas a ver de primera mano cómo esta arquitectura hace que testear sea un placer en lugar de un sufrimiento existencial. ¿O crees que dije "testeable desde el día uno" de adorno?

Saludos, arquitectos!

---

**Sígueme en redes:**

[Twitch](https://twitch.tv/diegocod3s)

[GitHub](https://github.com/diego-devs)

[YouTube](https://www.youtube.com/channel/UCGQmO-aJ9yJSdv_VD8_IDjg)

[TikTok](https://www.tiktok.com/@diegoz.code)

[LinkedIn](https://www.linkedin.com/in/diego-diaz-mendoza/)

[Twitter](https://twitter.com/Diego_Devs)

[Instagram](https://www.instagram.com/devs.diego/)
