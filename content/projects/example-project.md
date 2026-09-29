---
title: Streaming ingestion for product analytics
date: 2026-08-01
section: work
summary: Event pipeline from app to warehouse with schema validation and near real-time dashboards.
role: Data engineer
stack: [Kafka, Spark, dbt, BigQuery]
highlights:
  - 15 min → 2 min data freshness
  - 0 silent schema breaks
  - −35% warehouse cost
repo: https://github.com/MARK-126
featured: true
draft: true
---

> Example case study. Use it as a template: keep the headings, replace the text, remove `draft: true`.

## Context

Who was the client or team, what did the product do, and why did the data matter? One or two
short paragraphs.

## Problem

What was broken or missing? Be concrete: numbers, symptoms, who was affected.

- Dashboards refreshed once a day, too late for the growth team.
- Schema changes in the app broke downstream models without warning.

## Approach

How you designed the solution and **why** — the trade-offs you considered.

1. Events validated against a schema registry at ingestion.
2. Spark Structured Streaming into partitioned tables.
3. dbt models with tests on freshness and volume.

```sql
select event_name, count(*) as events
from analytics.events
where event_date = current_date()
group by 1
```

## Results

What changed after it shipped. Mirror the `highlights` above with some context.

## What I learned

One honest paragraph: what you would do differently next time.
