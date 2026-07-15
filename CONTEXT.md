# Creatorverse Ubiquitous Language

This glossary establishes the canonical terms for the Creatorverse application, aligning the database schema, code interfaces, page components, and tests.

## Language

**Creator**:
A content creator (e.g., streamer, YouTube channel, artist) registered in the system.
- *Avoid*: streamer, influencer, channel, personality, content-maker, user
- *Attributes*:
  - **id**: A unique auto-generated integer identifying the creator.
  - **name**: The public display name of the creator.
  - **url**: The absolute URL linking to their primary channel or page.
  - **description**: A short summary highlighting why they are worth following.
  - **imageURL**: An optional absolute URL pointing to their picture or content thumbnail.

**Creatorverse**:
The entire curated space of all Creators.
- *Avoid*: app, directory, database, backend

**Card**:
A responsive, stylized visual container displaying a Creator's summary on the home page.
- *Avoid*: item, row, component, container, post

**ShowCreators**:
The homepage view presenting the entire list of Creators as Card elements.
- *Avoid*: index, list, main-page

**ViewCreator**:
The detail page view dedicated to presenting all available attributes of a single Creator.
- *Avoid*: detail-page, show-page

**AddCreator**:
The creation page view containing a form to insert a new Creator into the Creatorverse.
- *Avoid*: create-page, new-page, form-page

**EditCreator**:
The management page view containing a form to update an existing Creator's attributes or delete them.
- *Avoid*: update-page, delete-page

## Relationships

- The **Creatorverse** displays a collection of zero or more **Creators**.
- Each **Creator** is rendered within a dedicated **Card** on the **ShowCreators** page.
- A **Creator** details are shown on a **ViewCreator** page, with optional links to **EditCreator**.
