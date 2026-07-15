# Architecture Design: Creatorverse

This document details the architectural design of the **Creatorverse** application, following the Deep Module principles.

## Seams and Interfaces

Our system defines a single key boundary (Seam) between the user interface and the persistence layer (Supabase). Following deep module principles, we keep the data-fetching and persistence implementation details hidden behind simple, expressive interface signatures.

### Interface: `src/client.js`
The `supabase` client is the primary seam where external HTTP communication is handled.
To maintain high leverage and keep client components deep, we export a clean, configured client interface:

```javascript
// Inputs: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (from import.meta.env)
// Outputs: Configured SupabaseClient object
export const supabase = createClient(URL, API_KEY);
```

All interactions with Supabase are structured end-to-end inside vertical slices:
- **ShowCreators**: Queries all columns from the `creators` table, ordered by creation date. It auto-seeds the database if empty.
- **ViewCreator**: Fetches a single record by `id`.
- **AddCreator**: Inserts a new record.
- **EditCreator**: Updates or deletes a record by `id`.

## System Architecture Diagram

```mermaid
graph TD
    subgraph UI Layer (Deep Modules)
        A[App / React Router] --> B[ShowCreators Page]
        A --> C[ViewCreator Page]
        A --> D[AddCreator Page]
        A --> E[EditCreator Page]

        B -->|Renders| F[Card Component]
    end

    subgraph Service Boundary (Seam)
        B & C & D & E -->|API calls via async/await| G[Supabase Client / client.js]
    end

    subgraph External Infrastructure
        G -->|HTTPS REST API| H[(Supabase Database)]
    end
```

## Storage Choice and ADR

We record the storage choice of Supabase in `docs/adr/0001-use-supabase-for-persistence.md`.
