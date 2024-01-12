---
title: Creando una Base de Datos con Code-First en .NET 7 y SQL
date: 2024-01-08 12:07:00 -500
categories: [software, development, backend, .NET, C#, databases] 
tags: [.net7,c#, codefirst, SQL Server, .NET] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---

## Una Guía Práctica Inicial de Entity Framework Core

El desarrollo de aplicaciones en **.NET** ha evolucionado considerablemente a lo largo de los años, y con la llegada de .NET 8, la metodología **Code-First** se ha vuelto aún más poderosa y fácil de usar gracias a **Entity Framework Core**, el *ORM* por excelencia del universo Microsoft. 

### **¿Qué es Entity Framework Core?**

**Entity Framework Core (EF Core)** es un framework de mapeo objeto-relacional (*ORM*) de código abierto desarrollado por Microsoft. Permite a los desarrolladores trabajar con bases de datos utilizando objetos .NET, **eliminando la necesidad de escribir SQL directamente**. 

El ORM se encarga de mediar entre **el mundo de los objetos** de la POO (Programación Orientada a Objetos) donde usamos clases, **y el mundo de las bases de datos relacionales**, en donde se manejan tablas. 

![image](/assets/img/iaqbt7xhkmiol22fpnot.jpg)

### **Paso 1: Configuración del Proyecto en .NET 8**

Comencemos creando un nuevo proyecto en .NET 8. Utiliza el siguiente comando en la terminal o PowerShell:

```bash
dotnet new console -n MiProyecto
```

Este comando creará un proyecto de consola básico. Ahora, instala las herramientas necesarias para trabajar con **Entity Framework Core** y **SQL Server**:

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### **Paso 2: Definición del Modelo de Datos**

En Code-First, el modelo de datos se define mediante *clases* en el código. Creemos una *clase* sencilla para representar una entidad en nuestra base de datos. No te preocupes por ahora si no es el modelo final, por lo general, los modelos suelen cambiar en etapa de desarrollo por distintos factores, lo normal es que evolucionen y **EF Core** tiene todo previsto. 

Ahora verás de lo que te hablo, por lo mientras, creamos nuestra clase Usuario: 

```csharp
public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    // Otros capos serán agregados según sea necesario
}
```

### **Paso 3: Configuración del Contexto de la Base de Datos**

Ahora necesitamos la abstracción de nuestra base de datos en C#, es decir, el modelo que representará el **contexto de la base de datos** y **las entidades representadas**.

¿Y cómo hacemos eso, pues? Creamos una clase que herede `DbContext` (ojo de dónde viene esa clase; justamente de *EF Core*). Este contexto incluirá las entidades que queremos mapear a la base de datos. En este caso, el contexto se puede ver algo así: 


```csharp
public class UsersContext : DbContext
{
    public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=UsersDatabase;Integrated Security=True;");
        
    }
}
```

### **Paso 4: Migraciones y Creación de la Base de Datos con EF Core**

Una característica clave de Entity Framework Core es el uso de **"migraciones"** para realizar cambios en la base de datos. 

Esto es justo de lo que hablaba antes, cada que nuestros modelos sean modificados en el código, **habría que modificar también la base de datos** para que los modelos estén completamente mapedos. Para esto sirve la herramienta de **Migrations**. 

Puedes pensar estas migraciones como un snapshot de tus modelos en determinado momento en el tiempo. Este "snapshot" le sirve a EF Core para traducir a instrucciones de SQL la modificacion de las tablas en la base de datos a la hora de darle update. 

Velo por ti mismo. Después de definir el modelo de datos, ejecutamos los siguientes comandos en la terminal:

```bash
dotnet ef migrations add CreateUsersDatabase
dotnet ef database update
```

Estos comandos generan un script de migración y actualizan la base de datos según el modelo especificado en el código.

### **Paso 5: Utilizando la Base de Datos en la Aplicación**

Con la base de datos creada, podemos utilizarla en nuestra aplicación.
Por ejemplo, para agregar un nuevo usuario habría que ubicarnos en el punto de entrada de la aplicación de consola, el cual es el método Main() dentro de la clase Program: 

```csharp
class Program
{
    static void Main()
    {
        using (var context = new UsersContext())
        {
            var usuario = new Usuario { Nombre = "Juan Pérez" };
            contexto.Usuarios.Add(usuario);

            // Importante usar SaveChanges() para que los datos insertados persistan
            contexto.SaveChanges(); 
        }
    }
}
```
### Visualizando la Base de Datos con SQL Server Management Studio:
Después de haber aplicado las migraciones y creado la base de datos, puedes usar SQL Server Management Studio (SSMS) para explorarla. Sigue estos pasos sencillos:

Abre **SQL Server Management Studio**.

1. Conéctate al servidor de la base de datos utilizando la misma información que especificaste en la cadena de conexión.
2. En el Explorador de Objetos, expande la carpeta "databases" para ver tu recién creada y modificada **UsersDatabase** tal y como la llamamos pasos atrás.

### **Enlaces de Documentación Oficial de Microsoft:**

Para obtener información más detallada y oficial, te recomiendo explorar los siguientes enlaces en la documentación de Microsoft:

- [Documentación General de Entity Framework Core](https://docs.microsoft.com/es-es/ef/core/)

- [Guía de Migraciones de EF Core](https://docs.microsoft.com/es-es/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli)

- [Configuración en EF Core](https://docs.microsoft.com/es-es/ef/core/configurations/)

- [Conexiones y Proveedores en EF Core](https://docs.microsoft.com/es-es/ef/core/providers/)

Además, si necesitas descargar SQL Server Management Studio (SSMS) para explorar y gestionar tu base de datos, visita la página oficial de descargas de Microsoft:

- [Descargar SQL Server Management Studio (SSMS)](https://docs.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms)