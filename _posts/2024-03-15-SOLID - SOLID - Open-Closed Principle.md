---
title: Principios SOLID - Open-Closed Principle
date: 2024-03-15 12:00:00 -500
categories: [technology, development, dotnet, programming, SOLID] 
tags: [solid, dotnet, programming] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---
![image](/assets/img/openclose.jpg)

## Nos quedamos hablando de SOLID la última vez

En el desarrollo de software, los principios SOLID son pilares que sustentan la calidad, la mantenibilidad y la escalabilidad del código. Uno de estos pilares o principios, es el **Principio de Abierto/Cerrado (OCP)**, se centra en la idea de que *una clase debe estar abierta para su extensión pero cerrada para su modificación*. 

Exploremos a detalle el segundo principio SOLID (representa la 'O') y cómo aplicarlo en el desarrollo de software utilizando ejemplos con código en C#.

## ¿Qué es el Principio de Abierto/Cerrado (OCP)?

**El Principio de Abierto/Cerrado (Open/Closed Principle, OCP)** establece que las entidades de software, como clases, módulos o funciones, **deben estar abiertas para su extensión pero cerradas para su modificación.** Esto significa que cuando se necesite cambiar o extender el comportamiento de una entidad, no se debe modificar su código fuente original, en su lugar, se debe extender mediante la creación de nuevas clases o funciones.

## Implementación en C#

### Aplicando OCP en un Sistema de Pago:

Supongamos que tenemos un sistema de pago que maneja diferentes métodos de pago, como tarjeta de crédito, PayPal y transferencia bancaria. En lugar de tener una clase ``PaymentProcessor`` que contenga la lógica para todos estos métodos de pago, podemos aplicar el OCP creando una interfaz ``IPaymentMethod`` que define un método ``ProcessPayment()``. Luego, creamos una clase para cada método de pago que implementa esta interfaz. Si necesitamos agregar un nuevo método de pago, simplemente creamos una nueva clase que implemente ``IPaymentMethod``, sin necesidad de modificar el código existente.

```cs
public interface IPaymentMethod
{
    void ProcessPayment(decimal amount);
}

public class CreditCardPayment : IPaymentMethod
{
    public void ProcessPayment(decimal amount)
    {
        // Lógica de procesamiento para tarjeta de crédito
    }
}

public class PayPalPayment : IPaymentMethod
{
    public void ProcessPayment(decimal amount)
    {
        // Lógica de procesamiento para PayPal
    }
}

// Más clases para otros métodos de pago...
```

### Extensión de Funcionalidad en un Sistema de Envío:

Imaginemos un sistema de envío que maneja diferentes métodos de envío, como correo postal, entrega urgente y entrega en tienda. Podemos aplicar el principio OCP creando una clase base ``ShippingService`` con un método ``ShipOrder()`` y luego extendiéndola mediante la creación de clases específicas para cada método de envío.
```cs
public abstract class ShippingService
{
    public abstract void ShipOrder(Order order);
}

public class PostalShipping : ShippingService
{
    public override void ShipOrder(Order order)
    {
        // Lógica de envío por correo postal
    }
}

public class ExpressShipping : ShippingService
{
    public override void ShipOrder(Order order)
    {
        // Lógica de envío urgente
    }
}

// Más clases para otros métodos de envío...
```
## Conclusión:

**El Principio de Abierto/Cerrado (OCP)** es fundamental para escribir código mantenible y escalable en el desarrollo de software. Al seguir este principio, podemos diseñar sistemas que sean fáciles de extender y mantener en el futuro, lo que resulta en un código más limpio y menos propenso a errores. Al aplicar este principio en conjunción con otros principios **SOLID**, podemos construir software robusto y de alta calidad que se adapte fácilmente a los cambios y requerimientos del negocio.

**Mis redes:**

[LinkedIn](https://www.linkedin.com/in/diego-diaz-mendoza/)

[GitHub](https://github.com/diego-devs)

[Twitter](https://twitter.com/Diego_Devs)    

[YouTube](https://www.youtube.com/channel/UCGQmO-aJ9yJSdv_VD8_IDjg)

[TikTok](https://www.tiktok.com/@diegoz.code)

[Instagram](https://www.instagram.com/devs.diego/)