---
title: SOLID - Dependency Inversion Principle
date: 2024-05-20 12:00:00 -500
categories: [technology, development, dotnet, programacion, solid] 
tags: [solid, csharp, programacion] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---
![image](/assets/img/1_GoLwqfeB624NB5g7JPVyBA.png)

## Principio de Inversión de Dependencias (D) en SOLID:
### Un Guía Completa con Ejemplos en C#

Hemos llegado al final de los principios SOLID: El Principio de Inversión de **D**ependencias. Este en particular puede 

1.  Los módulos de alto nivel **no deben depender** de módulos de bajo nivel. **Ambos deben depender de abstracciones.**

2.  Las abstracciones **no deben depender** de detalles. **Los detalles deben depender de abstracciones.**
   
Esto es de lo más confuso si te encuentras estudiando por primera vez estos conceptos. Desglosemos este principio mostrando ejemplos en C#. 

## ¿Qué es el Principio de Inversión de Dependencias?
Este principio sugiere que tanto los módulos de alto nivel (que contienen lógica de negocio compleja) como los de bajo nivel (que manejan detalles como acceso a bases de datos o servicios externos) deben depender de abstracciones. Es decir, **deberíamos diseñar nuestro código de tal manera que los detalles concretos de implementación sean inyectados en lugar de estar acoplados directamente.**

## Ventajas del Principio de Inversión de Dependencias
1. Flexibilidad: Facilita el cambio de las implementaciones concretas sin afectar los módulos de alto nivel.
2. Testabilidad: Mejora la capacidad de prueba del código, permitiendo inyectar dependencias simuladas (mocks) durante las pruebas.
3. Mantenibilidad: Reduce el acoplamiento entre módulos, haciendo el código más fácil de mantener y evolucionar.
   
## Ejemplo en C#
Imaginemos que tenemos una aplicación que envía notificaciones a los usuarios. Sin aplicar el principio de Inversión de Dependencias, podríamos tener algo así:

```csharp
public class EmailService
{
    public void SendEmail(string message)
    {
        // Lógica para enviar un correo electrónico
    }
}

public class Notification
{
    private EmailService _emailService;

    public Notification()
    {
        _emailService = new EmailService();
    }

    public void Send(string message)
    {
        _emailService.SendEmail(message);
    }
}
```
En este caso, ``Notification`` está directamente acoplado a ``EmailService``. Si en el futuro quisiéramos cambiar la forma de enviar notificaciones, tendríamos que modificar ``Notification``. Evitarnos esto es de mucho valor.

Aplicando el **Principio de Inversión de Dependencias**
Vamos a **refactorizar este código**:

```csharp
// Definimos una abstracción (interfaz) para el servicio de notificaciones
public interface INotificationService
{
    void Send(string message);
}

// Implementación concreta del servicio de notificaciones por correo electrónico
public class EmailService : INotificationService
{
    public void Send(string message)
    {
        // Lógica para enviar un correo electrónico
    }
}

// Clase Notification ahora depende de la abstracción INotificationService
public class Notification
{
    private readonly INotificationService _notificationService;

    // La dependencia se inyecta a través del constructor
    public Notification(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public void Send(string message)
    {
        _notificationService.Send(message);
    }
}
```
Con este enfoque, ``Notification`` ya no está directamente acoplado a ``EmailService``. Ahora depende de la interfaz ``INotificationService``, lo que nos permite cambiar fácilmente la implementación de notificaciones sin modificar la clase ``Notification``.

## Inyección de Dependencias en C#
Para gestionar la creación e inyección de dependencias, podemos usar un contenedor de inyección de dependencias como el provisto por **.NET** en nuestra clase Startup.cs (antes de .NET 6) y Program.cs (.NET 6 en adelante).

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Registramos la implementación concreta para la interfaz
        services.AddTransient<INotificationService, EmailService>();

        // Registramos la clase Notification que dependerá de INotificationService
        services.AddTransient<Notification>();
    }
}
```
##
El principio de **Inversión de Dependencias** es esencial para crear aplicaciones flexibles, mantenibles y testables. Al depender de abstracciones en lugar de implementaciones concretas, reducimos el acoplamiento y facilitamos el cambio de componentes en el futuro. Aplicar este principio en tus proyectos de C# no solo mejorará la calidad de tu código, sino que también te permitirá adaptarte más fácilmente a nuevos requisitos y cambios en la tecnología.

Saludos, devs!

**Sígueme en redes:**

[Twitch](https://twitch.tv/diegocod3s)

[GitHub](https://github.com/diego-devs)

[YouTube](https://www.youtube.com/channel/UCGQmO-aJ9yJSdv_VD8_IDjg)

[TikTok](https://www.tiktok.com/@diegoz.code)

[LinkedIn](https://www.linkedin.com/in/diego-diaz-mendoza/)

[Twitter](https://twitter.com/Diego_Devs)    

[Instagram](https://www.instagram.com/devs.diego/)
