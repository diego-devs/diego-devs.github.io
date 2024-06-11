---
title: La Elegancia del Patrón de Diseño Repository para crear APIs con .NET 8
date: 2024-06-10 12:00:00 -500
categories: [datascience, development, software] 
tags: [datascience, datastructures, programming] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---
![image](/assets/img/apidev.webp)
## Introducción
El desarrollo de **APIs** en **.NET 8** puede ser una experiencia maravillosa, especialmente cuando adoptamos *patrones de diseño* que facilitan la gestión del código y la escalabilidad. Hoy vamos a explorar cómo crear una API utilizando el patrón **Repository** para manejar operaciones **CRUD** (Create, Read, Update, Delete) en varios controles. Vamos a sumergirnos en los conceptos más relevantes y mostrar fragmentos de código en ``C#`` que ilustran cómo hacerlo. 

Trataré de hacer los ejemplos en código lo más auto explicativos, así que si ya sabes ``C#`` esto será pan comido. 

## La verdadera belleza del patrón Repository radica en su elegancia.
Primero, un poco de filosofía. ¿Por qué deberías molestarte en usar el patrón Repository? La respuesta corta: separación de preocupaciones.  Este patrón te permite **separar la lógica de acceso a datos de la lógica de negocio**, lo que hace que tu código sea más **limpio**, **fácil de mantener** y, francamente, **más presentable**. Y también impresiona a tus colegas en las revisiones de código. 

## Configuración del Proyecto
Empecemos con la creación y configuración básica de un proyecto .NET 8. Abre tu terminal favorita (la que ya le modificaste hasta el desenfoque del color de fondo) y ejecuta:

```ps
dotnet new webapi -n MyAPI 
cd MyApiWithRepositories
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
```
Esto creará un nuevo proyecto de **API** y añadirá ``Entity Framework Core``, que utilizaremos para manejar la persistencia de datos.

## Definiendo el Contexto de la Base de Datos
Primero, definimos nuestro contexto de datos. Este paso es esencial a la hora de usar Entity Framework. Esta clase será el puente entre nuestra base de datos y el código C#. Nota como esta clase debe heredar de la clase de **Entity Framework** ``DbContext``.

```cs
namespace MyAPI.Data
{
    public class AppDbContext : DbContext
    {
        // Nuestros sets de datos (entidades)
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configuraciones adicionales aquí
        }
    }
    // Nuestros modelos: 
    public class Product { public int Id { get; set; } public string Name { get; set; } }
    public class Customer { public int Id { get; set; } public string Name { get; set; } }
    public class Order { public int Id { get; set; } public DateTime OrderDate { get; set; } }
}
```
## Creando el Repository Base
Ahora, el verdadero *frontman* del show: nuestro **Repository** ``base``. Este genérico manejará las operaciones CRUD básicas para todos nuestros tipos de entidades.

```cs
namespace MyAPI.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }

    public class Repository<T> : IRepository<T> where T : class
    {
        // Nuestra clase de contexto
        private readonly AppDbContext _context;
        // El set de entidades
        private readonly DbSet<T> _dbSet;
        // Nuestro Constructor: 
        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }
        // CRUD: Create, Read, Update, Delete.
        // Obtener todos: 
        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
        // Obtener uno por ID
        public async Task<T> GetByIdAsync(int id) => await _dbSet.FindAsync(id);
        // Añadir entidad 
        public async Task AddAsync(T entity)
        {
            // Lógica de añadir
            await _dbSet.AddAsync(entity);
            // No olvides salvar los cambios! 
            await _context.SaveChangesAsync();
        }
        // Actualizar entidad
        public async Task UpdateAsync(T entity)
        {
            // Lógica para actualizar
            _dbSet.Update(entity);
            // No olvides salvar!
            await _context.SaveChangesAsync();
        }
        // Borrar entidad
        public async Task DeleteAsync(int id)
        {
            // La buscamos por ID
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                // Lógica para remover 
                _dbSet.Remove(entity);
                // Salvamos persistencia de datos
                await _context.SaveChangesAsync();
            }
        }
    }
}
```
## Integrando Repositorios en los Controladores
Ahora, integremos este único repositorio en nuestros controladores para manejar diferentes sus tipos de entidades: Products, Customers y Orders. Aquí te dejo el ejemplo con el controlador de productos:  

```cs
namespace MyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase 
    {
        // Inyectamos nuestro repositorio con IRepository
        private readonly IRepository<Product> _productRepository;
        // Constructor
        public ProductsController(IRepository<Product> productRepository)
        {
            _productRepository = productRepository;
        }
        // Obtener todos los productos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productRepository.GetAllAsync();
            return Ok(products);
        }
        // Obtener producto por ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }
        // Crear producto
        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            await _productRepository.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }
        // Actualizar producto
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Product product)
        {
            // No olvides checar que exista
            if (id != product.Id) return BadRequest();
            await _productRepository.UpdateAsync(product);
            return NoContent();
        }
        // Borrar producto por ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productRepository.DeleteAsync(id);
            return NoContent();
        }
    }
    // Este esquema es prácticamente el mismo para 
    // los otros controladores: Customers y Orders. 
}
```
## Configuración Final
No olvides registrar tu repositorio genérico en Startup.cs para que la **inyección de dependencias** funcione. 

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Añadimos el servicio de DbContext 
    // usando SQL Server como proveedor 
    services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
    // Añadimos el servicio de Repositorio 
    services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
    // Nos aseguramos de tener el 
    // servicio de controladores de .NET
    services.AddControllers();
}
```
## Conclusión
Crear una API con el *patrón de diseño* **Repository** en .NET 8 no solo es una buena práctica, sino que también hace que tu vida como desarrollador sea **mucho más sencilla**. Al separar las preocupaciones y mantener el código limpio y modular, facilitas el mantenimiento y la escalabilidad de tu aplicación. Además, impresionarás a tus compañeros de trabajo y harás que tu código sea digno de ser exhibido en cualquier revisión. ;D 

Así que, ¿por qué no darle una oportunidad a este patrón? Después de todo, la simplicidad es la clave para la grandeza... o al menos, para un código menos desastroso.

Saludos, repos! 


**Sígueme en redes:**

[Twitch](https://twitch.tv/diegocod3s)

[GitHub](https://github.com/diego-devs)

[YouTube](https://www.youtube.com/channel/UCGQmO-aJ9yJSdv_VD8_IDjg)

[TikTok](https://www.tiktok.com/@diegoz.code)

[LinkedIn](https://www.linkedin.com/in/diego-diaz-mendoza/)

[Twitter](https://twitter.com/Diego_Devs)    

[Instagram](https://www.instagram.com/devs.diego/)
