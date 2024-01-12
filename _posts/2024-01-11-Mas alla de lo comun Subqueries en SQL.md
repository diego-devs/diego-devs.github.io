---
title: Tipos de subqueries en SQL
date: 2024-01-11 20:07:00 -500
categories: [software, development, backend, databases, SQL] 
tags: [SQL Server] # Tag names should ALWAYS be lowercase
author: <author_id>
comments: true
---

### Introducción:

Mi trabajo actual como desarrollador a menudo conlleva enfrentarme a docenas de queries hechos para distintas bases de datos, cada una con cientos de tablas listas para devorarme. A lo largo de todo este tiempo de alegría y llanto trabajando con SQL, me he dado cuenta que los **subqueries** o **subconsultas** suelen ser un reto para los principiantes en el lenguaje. Bueno, ciertamente ha sido mi caso. 

Resulta que los subqueries, son una herramienta fundamental para comunicarse de manera efectiva con las bases de datos relacionales, no solo con SQL. Pero por ahora mantengámonos con éste. 

Proporcionaré cinco ejemplos de subconsultas que demuestran cómo utilizar subconsultas escalares, de varias filas y correlativas en las cláusulas ```WHERE```, ```FROM/JOIN``` y ```SELECT```.

### Qué es un Subquery o Subconsulta

En pocas palabras un subquery es una consulta dentro de otra consulta. Al solicitar información de una base de datos, puede resultar necesario incluir una subconsulta en las cláusulas ```SELECT```, ```FROM```, ```JOIN``` o ```WHERE```. Sin embargo, también se pueden usar subconsultas al actualizar la base de datos (por ejemplo, en declaraciones ```INSERT```, ```UPDATE``` y ```DELETE```).

Existen varios tipos de subconsultas en SQL:

1. **Subconsultas escalares:** Devuelven un único valor o exactamente una fila y una columna.
2. **Subconsultas de varias filas:** Devuelven o bien una columna con múltiples filas (una lista de valores), o varias columnas con múltiples filas (tablas).
3. **Subconsultas correlativas:** Donde la consulta interna depende de información obtenida de la consulta externa.

---

### 5 Ejemplos de Subconsultas en SQL

Imaginemos que gestionamos una agencia de publicidad y vendemos videos para marcas. Tenemos una **base de datos** con cuatro tablas: **Videos**, **Editores**, **Marcas** y **Ventas**. Puedes ver los datos almacenados en cada tabla en las imágenes:

#### Tabla: Videos

![image](/assets/img/sql_1_tablaVideos.png)

#### Tabla: Editores

![image](/assets/img/sql_1_tablaEditores.png)

#### Tabla: Marcas

![image](/assets/img/sql_1_tablaMarcas.png)

#### Tabla: Ventas

![image](/assets/img/sql_1_tablaVentas.png)

Ahora, exploremos estos datos mediante consultas SQL con diferentes tipos de subconsultas.

### Ejemplo 1 - Subconsulta Escalar

Comencemos con un ejemplo simple: Queremos listar los videos que tienen un precio superior al promedio. Básicamente, queremos obtener los nombres y precios listados de los videos, pero solo de aquellos que cuestan más que el promedio. Esto significa que primero necesitamos encontrar este precio promedio; aquí es donde entra en juego la subconsulta escalar:

```sql
SELECT nombre, precio_listado
FROM videos
WHERE precio_listado > (
    SELECT AVG(precio_listado)
    FROM videos
);
```
Resultados:

![image](/assets/img/sql_1_1.png)

Nuestra subconsulta está en la cláusula WHERE, donde filtra el conjunto de resultados según el precio listado. Esta subconsulta devuelve un único valor: el precio promedio por video. Cada precio listado se compara con este valor y solo los videos que tienen un precio por encima del promedio llegan al resultado final.

### Ejemplo 2 - Subconsulta de Varias Filas

Ahora veamos subconsultas que devuelven una columna con múltiples filas. Estas subconsultas se incluyen a menudo en la cláusula ```WHERE``` para filtrar los resultados de la consulta principal.

Supongamos que queremos listar todos los editores que realizaron al menos un video. Podemos obtener la salida necesaria utilizando una subconsulta de varias filas. Específicamente, podemos usar una subconsulta interna para listar todos los IDs de los editores presentes en la tabla de ventas; estos serían los IDs correspondientes a los editores que realizaron al menos una venta. Luego, en la consulta externa, solicitamos el primer nombre y el puesto de todos los editores cuyo ID está en la salida de la subconsulta interna. Aquí está el código:

```sql
SELECT DISTINCT editores.primer_nombre, editores.posicion
FROM editores
WHERE editores.id IN (
    SELECT DISTINCT ventas.editor_id
    FROM ventas
);
```
Resultados:

![image](/assets/img/sql_1_2.png)

Curiosamente, podríamos obtener el mismo resultado sin una subconsulta utilizando un ```INNER JOIN``` (o simplemente ```JOIN```). Este tipo de unión devuelve solo los registros que se pueden encontrar en ambas tablas. Entonces, si unimos las tablas de editores y ventas, obtendremos una lista de editores con registros correspondientes en la tabla de ventas. Nota: También he utilizado la palabra clave ```DISTINCT``` aquí para eliminar duplicados del resultado.

Aquí está la consulta:

```sql
SELECT DISTINCT editores.primer_nombre, editores.apellido
FROM editores
JOIN ventas
  ON editores.id = ventas.editor_id;
```

Puedes leer más sobre la elección entre subconsulta vs. JOIN en otro lugar de nuestro blog.

### Ejemplo 3 - Subconsulta de Varias Filas con Múltiples Columnas

Cuando una subconsulta devuelve una tabla con múltiples filas y columnas, esa subconsulta suele encontrarse en la cláusula ```FROM``` o ```JOIN```. Esto te permite obtener una tabla con datos que no estaban disponibles directamente en la base de datos (por ejemplo, datos agrupados) y luego unir esta tabla con otra de tu base de datos, si es necesario.

Digamos que queremos ver el monto total de ventas para cada editor que haya realizado al menos un video. Podemos comenzar con una subconsulta que se basa en la tabla de ventas y calcula el monto total de videos realizados para cada ID de editor. Luego, en la consulta externa, combinamos esta información con los nombres y posiciones de los editores para obtener la salida requerida:

```sql
SELECT
  editores.primer_nombre,
  editores.posicion,
  ventas_editor.ventas
FROM editores
JOIN (
    SELECT editor_id, SUM(precio_venta) AS ventas
    FROM ventas
    GROUP BY editor_id
) AS ventas_editor
ON editores.id = ventas_editor.editor_id;
```
Resultados:

![image](/assets/img/sql_1_3.png)

Asignamos un alias significativo a la salida de nuestra subconsulta (ventas_editor). De esta manera, podemos referirnos fácilmente a ella en la consulta externa, al seleccionar la columna de esta tabla y al definir la condición de unión en la cláusula ```ON```. Nota: Las bases de datos arrojarán un error si no proporcionas un alias para la salida de tu subconsulta.

### Ejemplo 4 - Subconsulta Correlativa

El siguiente ejemplo demostrará cómo las subconsultas:

1. Se pueden utilizar en la cláusula ```SELECT```, y
2. Pueden ser correlativas (es decir, la consulta principal o externa depende de información obtenida de la consulta interna).

Queremos calcular, para cada editor, el número de videos realizados a través de nuestra agencia de publicidad. Para responder a esta pregunta, podemos usar una subconsulta que cuente el número de videos realizados por cada editor. Aquí está la consulta completa:

```sql
SELECT
  primer_nombre,
  posicion,
  (
    SELECT COUNT(*) AS videos
    FROM ventas
    WHERE editores.id = ventas.editor_id
  )
FROM editores;
```
Resultados:

![image](/assets/img/sql_1_4.png)


### Ejemplo 5 - Subconsulta Correlativa

En esta ocasión, queremos mostrar los nombres y el puesto de los editores que no realizaron ningún video en nuestra agencia de publicidad. Intentemos lograr esta tarea utilizando una subconsulta correlativa en la cláusula ```WHERE```:

```sql
SELECT primer_nombre, posicion
FROM editores
WHERE NOT EXISTS (
  SELECT *
  FROM ventas
  WHERE ventas.editor_id = editores.id
);
```
Resultados:

![image](/assets/img/sql_1_5.png)

Esto es lo que sucede en esta consulta:

- La consulta externa enumera información básica sobre los editores, verificando primero si hay registros correspondientes en las ventas.
- La subconsulta interna busca registros que se correspondan con el ID del editor que se está comprobando actualmente en la consulta externa.
- Si no hay registros correspondientes, se agregan el nombre y el puesto del editor correspondiente al resultado. 

En nuestro ejemplo, solo tenemos un editor en posición freelance sin ningún video realizado hasta ahora; esperemos que lleguen más.


-----
### Recursos de Aprendizaje y Documentación Oficial

#### Documentación Oficial de SQL:
- [SQL Documentation](https://dev.mysql.com/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Microsoft SQL Server Documentation](https://docs.microsoft.com/en-us/sql/)

#### Tutoriales y Cursos en Línea:
1. **W3Schools SQL Tutorial:**
   - [W3Schools SQL Tutorial](https://www.w3schools.com/sql/)

2. **Codecademy SQL Courses:**
   - [Codecademy SQL Courses](https://www.codecademy.com/learn/learn-sql)

3. **Khan Academy - Intro to SQL:**
   - [Khan Academy SQL Course](https://www.khanacademy.org/computing/computer-programming/sql)

4. **Coursera - SQL for Everybody Specialization (University of Michigan):**
   - [SQL for Everybody Specialization](https://www.coursera.org/specializations/sql-for-everybody)

5. **SQLZoo:**
   - [SQLZoo](https://sqlzoo.net/)

#### Comunidades y Foros:
- [Stack Overflow - SQL Questions](https://stackoverflow.com/questions/tagged/sql)
- [Reddit - r/SQL](https://www.reddit.com/r/SQL/)

Estos recursos proporcionan una variedad de opciones para aprender SQL, desde la documentación oficial hasta tutoriales interactivos y cursos en línea. También puedes participar en comunidades y foros para obtener ayuda y discutir preguntas relacionadas con SQL. ¡Qué nunca te fallen los queries!