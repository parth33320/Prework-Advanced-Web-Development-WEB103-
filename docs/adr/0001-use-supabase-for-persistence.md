# 1. Use Supabase for Persistence

## Context

The Creatorverse application requires a persistent datastore to support full CRUD operations on Creators. It must store each Creator's name, primary channel URL, description, and an optional image URL.

## Decision

We will use **Supabase** (PostgreSQL-as-a-service) for all persistence. The frontend React application will communicate directly with Supabase via the official `@supabase/supabase-js` client library.

## Consequences

- We can use real-time database queries and full SQL features.
- We do not need a custom intermediate backend server, which simplifies deployment and minimizes maintenance.
- Connection parameters (Supabase REST URL and Anonymous public API key) must be configured in a `.env` file and bundled with the Vite client build.
- Table columns will match our Ubiquitous Language: `id`, `name`, `url`, `description`, and `imageURL`.
