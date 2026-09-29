---
title: Ingesta en streaming para analítica de producto
date: 2026-08-01
type: practice
summary: Pipeline de eventos desde la app hasta el data warehouse, con validación de esquema y dashboards casi en tiempo real.
role: Ingeniero de datos
stack: [Kafka, Spark, dbt, BigQuery]
highlights:
  - Frescura de 15 min → 2 min
  - 0 roturas silenciosas de esquema
  - −35% costo del warehouse
repo: https://github.com/MARK-126
featured: true
draft: true
---

> Caso de estudio de ejemplo. Úsalo como plantilla: mantén los títulos, reemplaza el texto y quita
> `draft: true`.

## Contexto

¿Para quién era el proyecto, qué hacía el producto y por qué importaban los datos? Uno o dos
párrafos cortos.

## Problema

¿Qué estaba roto o faltaba? Sé concreto: números, síntomas, a quién afectaba.

- Los dashboards se actualizaban una vez por día, demasiado tarde para el equipo de growth.
- Los cambios de esquema en la app rompían los modelos sin aviso.

## Enfoque

Cómo diseñaste la solución y **por qué**: las alternativas que evaluaste.

1. Eventos validados contra un schema registry en la ingesta.
2. Spark Structured Streaming hacia tablas particionadas.
3. Modelos dbt con tests de frescura y volumen.

```sql
select event_name, count(*) as events
from analytics.events
where event_date = current_date()
group by 1
```

## Resultados

Qué cambió después de ponerlo en producción. Retoma los `highlights` con contexto.

## Qué aprendí

Un párrafo honesto: qué harías distinto la próxima vez.
