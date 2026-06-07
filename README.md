# Guía de Edumark para Escola 4.0 🚀

¡Te damos la bienvenida! Esta guía te enseñará a crear materiales didácticos y **Situaciones de Aprendizaje (SdA)** de forma visualmente espectacular, sin necesidad de saber programar, escribir código ni diseñar páginas web. 

Todo se escribe en un archivo de texto simple usando un lenguaje llamado **Edumark**. Aquí aprenderás a usarlo paso a paso, desde lo más sencillo hasta lo más avanzado.

---

## Paso 0: Crea tu archivo de trabajo

1. Crea una carpeta vacía en tu ordenador (donde guardarás las imágenes y el trabajo de tu unidad).
2. Dentro de esa carpeta, crea un archivo de texto y asegúrate de que su nombre termine en `.edu` (por ejemplo: `mi_unidad.edu`).
3. Abre ese archivo en tu editor de código (VS Code) para empezar a escribir.

---

## Paso 1: La "Ficha Técnica" (Metadatos)

Lo primero que debe tener tu archivo (en la mismísima primera línea) es la información general del tema. Esta parte **siempre** debe empezar y terminar con tres guiones (`---`). 

Copia y pega este ejemplo al principio de tu archivo y cambia los textos por los tuyos:

```text
---
titulo: Criptografía y Mensajes Secretos
subtitulo: Protege tu información en la era digital
idioma: Español
autoria: Nombre del Profesor o Autores
licencia: Dominio Público
descripcion: Una introducción práctica a la seguridad digital para secundaria.
etapa: Secundaria
nivel: 1º ESO
area: Tecnología / Digitalización
tipo: Desenchufada
sesiones: 4
---
```

---

## Paso 2: Crear Páginas y Secciones (Estructura)

Para organizar tu material en diferentes páginas web (como temas o lecciones), usamos el símbolo almohadilla (`#`).

### 1. Crear una Página Principal:
Escribe una sola almohadilla `#`, la palabra `pagina` y luego el nombre de la página:
```text
# pagina Portada de la Unidad
```

### 2. Crear una Subpágina (una página dentro de otra):
Usa dos almohadillas `##`:
```text
## pagina Actividad 1: Descifrando el código
```

---

## Paso 3: Escribir Textos y Listas (Básico)

Escribir contenido es tan fácil como escribir en un documento de Word:

- **Párrafos**: Simplemente escribe tu texto. Para empezar un párrafo nuevo, deja una línea en blanco.
- **Letra Negrita**: Escribe el texto entre dos asteriscos dobles. Ejemplo: `Este texto está en **negrita**`.
- **Letra Cursiva**: Escribe el texto entre asteriscos simples o guiones bajos. Ejemplo: `Este texto está en *cursiva*`.

### Listas de elementos:
* **Lista con puntos (viñetas)**: Pon un asterisco `*` o un guion `-` seguido de un espacio antes de cada frase:
  ```text
  * Primer elemento
  * Segundo elemento
  ```
* **Lista con números**: Pon el número y un punto (`1.`) seguido de un espacio. Nuestras plantillas automáticas los convertirán en bonitos círculos de colores:
  ```text
  1. Primero haz esto.
  2. Luego haz esto otro.
  ```

---

## Paso 4: Insertar Imágenes

Para poner imágenes en tus páginas, copia el archivo de la imagen (por ejemplo, `seguridad.png`) en la misma carpeta de tu proyecto. Luego escribe una sola línea con este formato:

```text
#imagen seguridad.png {ancho: 600, pie: Explicación de la imagen en el pie de foto, sombra: si, borde: si}
```

**¿Qué significan las opciones entre llaves `{}`?**
- `ancho`: El tamaño en píxeles (ej: 600 es un tamaño mediano-grande muy adecuado).
- `pie`: El texto explicativo que aparecerá debajo de la imagen.
- `sombra` y `borde`: Escribe `si` o `no` para aplicar un contorno elegante y relieve a la imagen.

---

## Paso 5: Cajas Especiales e Interactivas (Avanzado)

Para destacar información o plantear retos, Escola 4.0 incluye 6 cajas especiales de diseño premium. Todas se escriben abriendo la caja con un símbolo `@` y cerrándola al final con `@end`.

Aquí tienes las 6 cajas disponibles:

### 1. ¿Pregúntate? (`@preguntate`)
* **Uso**: Para preguntas de reflexión personal o debates.
* **Diseño**: Borde morado oscuro con un icono de nube y un signo de interrogación.
```text
@preguntate

¿Crees que alguien podría estar leyendo tus chats?
¿Cómo proteges tus contraseñas?

@end
```

### 2. ¡Atención! (`@atencion`)
* **Uso**: Advertencias críticas o reglas que no se deben olvidar.
* **Diseño**: Borde rojo de alerta con un triángulo de peligro y un signo de exclamación.
```text
@atencion

¡No compartas nunca tus contraseñas con nadie, ni siquiera con tus mejores amigos!

@end
```

### 3. Información (`@informacion`)
* **Uso**: Datos teóricos, lecturas recomendadas o recursos en internet.
* **Diseño**: Caja azul con el icono de información `i`.
```text
@informacion

Puedes consultar la guía de ciberseguridad oficial en la web de INCIBE.

@end
```

### 4. Nota (`@nota`)
* **Uso**: Anotaciones, recordatorios rápidos o aclaraciones breves.
* **Diseño**: Caja gris pizarra con un icono de documento `N`.
```text
@nota

Esta actividad ya la realizaban las civilizaciones antiguas para enviar mensajes militares.

@end
```

### 5. ¿Sabías que...? (`@sabiasque`)
* **Uso**: Datos curiosos, datos científicos o anécdotas interesantes.
* **Diseño**: Caja rosa con el icono de una bombilla encendida y el signo `¿`.
```text
@sabiasque

¿Sabías que la contraseña más utilizada en el mundo sigue siendo "123456"?

@end
```

### 6. Sugerencia (`@sugerencia`)
* **Uso**: Tips prácticos, consejos para el alumno o propuestas para el profesor.
* **Diseño**: Caja turquesa con el icono de un globo de chat y una estrella `★`.
```text
@sugerencia

Puedes pedirle a tu profesor que organice un concurso de descifrado en clase.

@end
```