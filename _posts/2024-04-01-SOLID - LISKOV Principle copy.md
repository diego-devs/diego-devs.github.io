---
title: Principios SOLID - LISKOV substitution principle
date: 2024-01-04 12:00:00 -500
categories: [technology, development, dotnet, programming, SOLID] 
tags: [solid, dotnet, programming] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---
![image](/assets/img/solid-3.5c92822e_1Euk0.avif)

## Principio de Sustitución de Liskov: 

De los principios SOLID, el Principio de Sustitución de Liskov es el menos intuitivo de comprender si no lo conoces. Propuesto por la informática *Barbara Liskov* en 1987, es un principio de diseño de software que establece que los **objetos** de un programa deberían ser **reemplazables** por **instancias de sus subtipos** sin alterar la corrección del programa. 

En otras palabras, si **S** es un subtipo de **T**, entonces los objetos de tipo **T** en un programa pueden ser reemplazados por objetos de tipo **S** sin afectar la funcionalidad del programa.

## Ejemplo de Violación del Principio de Liskov:

Supongamos que estamos desarrollando un videojuego y estamos creando a los enemigos. Inicialmente diseñamos nuestras clases de enemigos de la siguiente manera, sin considerar el principio de **Liskov**:

```csharp
// Clase base para todos los enemigos
public class Enemy
{
    public virtual void ReceiveDamage(int amount)
    {
        // Lógica para recibir daño
    }

    public virtual void AttackPlayer()
    {
        // Lógica para atacar al jugador
    }
}

// Clase para el tipo de enemigo "Normal"
public class NormalEnemy : Enemy
{
    public override void ReceiveDamage(int amount)
    {
        // Lógica para recibir daño
    }

    public override void AttackPlayer()
    {
        // Lógica para atacar al jugador
    }
}

// Clase para el tipo de enemigo "Jefe"
public class BossEnemy : Enemy
{
    public override void ReceiveDamage(int amount)
    {
        // Lógica para recibir daño, quizás el jefe tenga un umbral de daño para activar habilidades especiales
    }

    public override void AttackPlayer()
    {
        // Lógica para atacar al jugador
    }

    // Método adicional para activar habilidades especiales del jefe
    public void ActivateSpecialAbility()
    {
        // Lógica para activar habilidades especiales del jefe
    }
}
```
En este ejemplo, estamos utilizando herencia para definir diferentes tipos de enemigos. Sin embargo, esto viola el Principio de Liskov, ya que la clase base ``Enemy`` (Enemigo) y sus subclases ``NormalEnemy`` y ``BossEnemy`` no pueden ser tratadas de manera intercambiable sin afectar el comportamiento del juego. Por ejemplo, si tratamos a un ``BossEnemy`` como un ``NormalEnemy``, podríamos activar habilidades especiales del jefe de manera inesperada, lo que rompería la consistencia del juego.

## Aplicación Correcta del Principio de Liskov:
Para corregir esto y aplicar correctamente el **Principio de Liskov**, debemos reestructurar nuestro diseño de clases de la siguiente manera:

```csharp
// Interfaz para todos los enemigos
public interface IEnemy
{
    void ReceiveDamage(int amount);
    void AttackPlayer();
}

// Clase para el tipo de enemigo "Normal"
public class NormalEnemy : IEnemy
{
    public void ReceiveDamage(int amount)
    {
        // Lógica para recibir daño
    }

    public void AttackPlayer()
    {
        // Lógica para atacar al jugador
    }
}

// Clase para el tipo de enemigo "Jefe"
public class BossEnemy : IEnemy
{
    public void ReceiveDamage(int amount)
    {
        // Lógica para recibir daño, quizás el jefe tenga un umbral de daño para activar habilidades especiales
    }

    public void AttackPlayer()
    {
        // Lógica para atacar al jugador, el jefe puede tener un ataque más poderoso o múltiples fases de ataque
        ActivateSpecialAbility();
    }

    // Método adicional para activar habilidades especiales del jefe
    public void ActivateSpecialAbility()
    {
        // Lógica para activar habilidades especiales del jefe
    }
}
```
En este nuevo diseño, utilizamos una interfaz ``IEnemy`` en lugar de una clase base, lo que nos permite tratar a todos los tipos de enemigos de manera intercambiable. Ahora, cualquier clase que implemente la interfaz ``IEnemy`` puede ser utilizada en cualquier contexto donde se espere un enemigo, sin comprometer la coherencia del juego. Esto cumple con el **Principio de Liskov** y nos permite construir un sistema más flexible y mantenible.

**Mis redes:**

[LinkedIn](https://www.linkedin.com/in/diego-diaz-mendoza/)

[GitHub](https://github.com/diego-devs)

[Twitter](https://twitter.com/Diego_Devs)    

[YouTube](https://www.youtube.com/channel/UCGQmO-aJ9yJSdv_VD8_IDjg)

[TikTok](https://www.tiktok.com/@diegoz.code)

[Instagram](https://www.instagram.com/devs.diego/)