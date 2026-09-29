---
title: Por qué cada pipeline de datos necesita un contrato
date: 2026-09-20
type: article
summary: Un cambio de esquema aguas arriba rompe en silencio los dashboards de aguas abajo. Los contratos de datos convierten esa sorpresa en un check que falla.
tags: [ingeniería de datos, calidad de datos]
draft: true
---

> Artículo de ejemplo. Úsalo como plantilla: reemplaza el texto y quita `draft: true` para publicarlo.

Todo equipo de datos vivió esta escena: un lunes a la mañana el dashboard de ventas muestra
ceros. Nadie tocó el pipeline. Lo que cambió fue **la aplicación**: alguien renombró una columna.

## El problema no es técnico, es de acuerdos

Los datos cruzan fronteras entre equipos que no se hablan. Quien produce el evento no sabe quién lo
consume, y quien lo consume no se entera cuando cambia.

## Qué es un contrato de datos

Un acuerdo explícito y verificable sobre:

- **Esquema**: nombres, tipos y nulabilidad de cada campo.
- **Semántica**: qué significa cada campo y en qué unidad.
- **Calidad**: frescura y volumen esperados.

```yaml
event: order_created
fields:
  order_id: { type: string, required: true }
  amount: { type: decimal, unit: ARS }
freshness: 15m
```

## Lo que aprendí

La herramienta importa menos que la conversación. El contrato es la excusa para que dos equipos
acuerden qué significa un dato.
