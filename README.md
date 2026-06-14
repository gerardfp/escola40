# Guía de Edumark para Escola 4.0 🚀

¡Te damos la bienvenida! Esta guía te enseñará a crear materiales didácticos y **Situaciones de Aprendizaje (SdA)** visualmente espectaculares de forma sencilla. Todo se escribe en un archivo de texto plano utilizando el lenguaje **Edumark** (archivos con extensión `.edu`).

---

## 📋 1. Ficha Técnica (Metadatos)

El documento debe comenzar siempre con un bloque de metadatos delimitado por tres guiones (`---`). Define las propiedades generales de la unidad didáctica:

```text
---
titulo: Missatges secrets: la criptografia a Internet
subtitulo: Construeix un sistema de privadesa com el que s'utilitza a internet
idioma: Valencià
autoria: Gerard Falcó Pérez
licencia: public domain
descripcion: Algorismes de xifratge: cèsar, vigenère, polibi i RSA simplificat.
etapa: Secundària
nivel: 1r ESO
area: Taller de Relacions Digitals Responsables
tipo: Desendollada
sesiones: 4-5
---
```

---

## 🏗️ 2. Páginas, Secciones y Estructura

La estructura y jerarquía de tu unidad se definen usando directivas que comienzan con almohadilla (`#`).

> ⚠️ **IMPORTANTE:** A diferencia del Markdown clásico, las directivas estructurales de Edumark **no** llevan espacio entre el símbolo `#` y la palabra clave (es decir, escribe `#pagina` y `#seccion`).

### Crear una Página
Crea una nueva página web que se añadirá al menú de navegación lateral:
```text
#pagina Título de la Página
```
*Ejemplo:* `#pagina Missatges secrets: la criptografia a Internet`

### Crear una Subpágina (Página anidada)
Para crear una página dentro de otra (nivel secundario), añade almohadillas adicionales:
```text
##pagina Sessió 1: Algorismes bàsics de xifratge
```

### Crear una Sección o Apartado
Dentro de una página, puedes dividir el contenido en diferentes secciones o bloques didácticos mediante `#seccion`:
```text
#seccion Título de la Sección
```
*Ejemplo:* `#seccion Joc d'interceptació`

---

## ✍️ 3. Formateo de Texto y Elementos Básicos

Puedes escribir el texto libremente dejando líneas en blanco entre párrafos.

### Títulos y Subtítulos (Jerarquía de Texto)
Para organizar el texto dentro de una sección o artículo, puedes usar los encabezados estándar de Markdown **(con espacio tras los símbolos `#`)**:
- `## Título de nivel 2` (para títulos grandes)
- `### Título de nivel 3` (títulos medianos)
- `#### Título de nivel 4` (títulos pequeños)
- `##### Título de nivel 5` (subtítulos o aclaraciones)

*Ejemplo:* `### Coneix l'art d'ocultar secrets`

### Estilo de Texto
- **Negrita**: Envoltura con asteriscos dobles. Ejemplo: `**texto en negrita**`.
- **Cursiva**: Envoltura con asteriscos simples. Ejemplo: `*texto en cursiva*`.
- **Código en línea**: Envoltura con acentos graves. Ejemplo: `` `código en línea` ``.

### Listas
* **Lista desordenada (viñetas)**: Usa un asterisco `*` o un guion `-` seguido de espacio.
* **Lista ordenada (números)**: Usa `1.` o `2.` seguido de espacio. El renderizador los convertirá en círculos de colores elegantes.

### Enlaces y Descargas
* **Enlaces**: Usa el formato estándar de Markdown `[Texto visible del enlace](dirección-url-o-archivo)`.
* *Ejemplo:* `[Descarregar roda de xifratge Cèsar](rueda_cesar.pdf)`

---

## 🖼️ 4. Imágenes y Portada

### Imagen General
Copia la imagen en tu carpeta de trabajo e insértala especificando sus propiedades opcionales entre llaves `{}`:
```text
#imagen algos1.png {ancho: 600, titulo: Mi título, pie: Pie explicativo, enlace_pie: http://..., fuente: Autor/Fuente, enlace_fuente: http://..., licencia: CC BY-SA 4.0, sombra: si, borde: si, alt: Descripción para accesibilidad}
```
*Parámetros:*
- `ancho` / `alto`: Dimensiones de la imagen en píxeles.
- `titulo`: Título descriptivo de la imagen (atributo `title` de HTML).
- `pie`: Texto explicativo que se muestra bajo la imagen.
- `enlace_pie`: Enlace web asociado al pie de foto.
- `fuente`: Nombre de la fuente o autor de la imagen.
- `enlace_fuente`: Enlace web a la página del autor o fuente original.
- `licencia`: Licencia de la imagen (ej: `CC BY-SA 4.0`, `CC BY`, `CC0`, `Public Domain`). Si coincide con una licencia conocida de Creative Commons, se redirigirá automáticamente a su página oficial de términos.
- `alt`: Descripción alternativa obligatoria para accesibilidad y lectores de pantalla.
- `sombra` / `borde`: Aplica relieve y contorno si se especifica `si`.

### Portada de la Unidad
Para establecer la imagen principal de la portada de la unidad didáctica, usa la directiva `#portada`:
```text
#portada portada.png
```

---

## 📦 5. Cajas Didácticas Especiales

Para destacar información pedagógica importante, abre el bloque con un símbolo `@` seguido del nombre del bloque y ciérralo al final con `@end`.

Dispones de las siguientes 6 cajas didácticas principales:

| Bloque | Uso sugerido |
| :--- | :--- |
| **`@preguntate`** | Preguntas de reflexión, debate inicial o autoevaluación. |
| **`@atencion`** | Advertencias de ciberseguridad, reglas críticas o alertas. |
| **`@informacion`** | Conceptos teóricos, lecturas o enlaces externos. |
| **`@nota`** | Recordatorios rápidos o apuntes históricos/técnicos. |
| **`@sabiasque`** | Curiosidades, datos científicos o anécdotas de interés. |
| **`@sugerencia`** | Consejos metodológicos o tips prácticos para actividades. |

*Ejemplo de uso:*
```text
@preguntate

1. Creus que algú podria llegir els teus missatges?
2. Qui hauria de tenir accés a la teva informació?

@end
```

---

## 🎢 6. Componentes Interactivos y Contenedores

Edumark permite agrupar varios elementos en contenedores dinámicos como **Pestañas**, **Acordeones** o **Carruseles**.

### Estructura general
Usa el bloque del contenedor (ej. `@pestanas`, `@carrusel`, `@acordeon` o `@paginacion`) y define cada una de las pestañas/diapositivas usando `#item Título`:

```text
@pestanas

#item Introducció
Aquí va el contenido de la primera pestaña...

#item El Repte
Aquí va el contenido del reto o misión del alumno...

#item Assoliments
* Logro 1
* Logro 2

@end
```

### Contenedores disponibles:
- **`@pestanas`**: Menú superior de pestañas horizontales.
- **`@carrusel`**: Slider interactivo de diapositivas (ideal para secuencias de pasos o galerías).
- **`@acordeon`**: Paneles colapsables verticalmente (útil para preguntas frecuentes o listas largas).
- **`@paginacion`**: Divide el contenido simulando páginas de libro.

---

## 🧠 7. Activación del Pensamiento Computacional (`@pc`)

Para documentar explícitamente qué habilidades del Pensamiento Computacional se ejercitan en la actividad, utiliza el bloque `@pc`:

```text
@pc
Descomposició:
* L'alumnat divideix el repte d'enviar missatges segurs en subproblemes.

Reconeixement de patrons:
* Identificació de regularitats en les lletres xifrades.

Abstracció:
* Representació de conceptes d'Internet mitjançant un model físic.

Disseny algorísmic:
* Seqüència de passos per a xifrar amb la roda Cèsar.

Avaluació:
* Verificació crítica del desxifrat per detectar errors en els càlculs.
@end
```

---

## 📊 8. Rúbricas de Evaluación (`#rubrica`)

Para insertar rúbricas de evaluación estructuradas de forma atractiva, utiliza la directiva `#rubrica` seguida del título. No requiere bloque `@end` si se introduce como directiva de página o sección, aunque puedes modelarla como tabla geométrica.

*Ejemplo de Rúbrica de Evaluación:*
```text
#rubrica Rúbrica d'Avaluació

Insuficient (1-4) | Suficient / Bé (5-6) | Notable (7-8) | Excel·lent (9-10)

* Comprensió de conceptes criptogràfics (CE 1.1, CE 1.5, CD4) 
    - No aconsegueix diferenciar entre xifratge simètric i asimètric.
    - Identifica de forma bàsica la diferència entre clau pública i privada.
    - Diferencia amb claredat entre xifratge simètric i asimètric.
    - Domina amb precisió teòrica i pràctica la diferència entre sistemes.
```

---

## 🛠️ 9. Otras Directivas Especiales

* **`#resum`**: Genera de forma automática un cuadro resumen estructurado con la información de la ficha técnica.
* **`#descarga`**: Inserta automáticamente un botón de descarga interactivo para que los usuarios puedan descargar el archivo `.elpx` compilado directamente.