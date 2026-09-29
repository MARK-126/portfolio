---
title: Tu comportamiento como dato
date: 2026-09-29
type: experiment
status: demo en vivo
summary: Un registro de eventos en vivo de cómo usas esta misma página. Una forma concreta de mostrar que los datos son conducta — sin guardar ni enviar nada.
role: Diseño y desarrollo
stack: [TypeScript, React, Web APIs]
featured: true
---

## La pregunta

Cada vez que alguien usa un producto digital genera una huella: movimientos, pausas, clics, lo que
mira y lo que ignora. En analítica de producto esa huella se convierte en eventos, y esos eventos
alimentan pipelines, dashboards y decisiones.

¿Cómo se ve esa huella en tiempo real, y qué tan rápido pasa de ser ruido a parecer una
interpretación sobre una persona?

## Pruébalo

Mueve el mouse, pasa sobre los enlaces, haz scroll o quédate quieto unos segundos. El panel registra
lo que haces en esta página mientras lo haces.

<div data-embed="behavior-panel"></div>

## Qué probé

- **Captura de eventos** del navegador: movimiento del puntero, scroll, hover y clics sobre elementos
  interactivos, inactividad, cambio de pestaña, de tema y de idioma.
- **Agregación**: el movimiento se acumula y se registra una vez por segundo, igual que haría un
  pipeline real para no inundar el sistema con eventos de bajo valor.
- **Métricas derivadas**: tiempo en página, distancia del cursor, profundidad de scroll y actividad
  por segundo en los últimos 30 segundos.
- **Un "perfil"** con reglas simples: decidido, explorador, lector, observador. Es deliberadamente
  ingenuo, y la confianza que muestra es una broma.

Todo ocurre en la memoria de tu navegador: no hay cookies, almacenamiento ni envío de datos.

## Resultado

Con muy pocos eventos el panel ya "opina" sobre quién eres. Esa es la parte interesante: el salto
de dato a interpretación es enorme y fácil de dar. En psicología aprendemos a desconfiar de las
conclusiones rápidas sobre la conducta; en datos, ese mismo cuidado es lo que separa una métrica
útil de una historia inventada.

## Qué aprendí

- Diseñar eventos es diseñar qué vamos a poder preguntar después. Lo que no se registra, no existe.
- Agregar pronto reduce ruido y costo, pero también decide qué detalle se pierde.
- La privacidad no es un agregado: este experimento funciona igual sin guardar nada.
