# Creatorverse

A curated directory showcasing my favorite content creators (Twitch streamers, YouTube channels, makers, artists), built with React, Vite, Pico.css, and Supabase.

## Features

### Required Features
- [x] **Logical React Component Structure**: Built with clear components (`Card`) and routing pages (`ShowCreators`, `ViewCreator`, `AddCreator`, `EditCreator`).
- [x] **Pre-populated content creators**: Automatically seeds 5 high-quality content creators on the home page if the database is empty.
- [x] **Full Content Creator Cards**: Displays the creator's name, external link, short description, and image URL (optional) on the card.
- [x] **Async/Await for API Calls**: Implemented robust database operations using the `async/await` design pattern via `@supabase/supabase-js`.
- [x] **Unique URL Routes**: Each content creator has their own unique details URL (`/view/:id`) and edit URL (`/edit/:id`).
- [x] **Detailed Viewing Page**: Clicking a creator card opens a detail page containing their full name, description, channel link, and manage/edit links.
- [x] **Creation Form**: Supports adding new content creators with dynamic database updates.
- [x] **Update Form**: Supports editing a creator's name, URL, description, and image.
- [x] **Deletion**: Allows users to permanently remove a content creator from the database (with deletion confirmation prompts).

### Stretch Features
- [x] **PicoCSS Integration**: Formatted all layouts, navigation headers, error blocks, buttons, and forms natively with PicoCSS.
- [x] **Grid & Cards Layout**: Creators are shown in a responsive CSS Grid with hovering/scaling cards.
- [x] **Content Creator Images**: Cards display a rich custom visual or a beautiful fallback abstract wallpaper if none is provided.

## Built With
- **React 19**
- **Vite 8**
- **React Router 7**
- **Pico.css 2**
- **Supabase JS Client**
- **Vitest & React Testing Library** (100% Test Coverage of behaviors)
- **Playwright** (E2E & Live Testing)

## Database Schema (`creators` table)
| Column Name | Data Type | Key / Options |
|-------------|-----------|---------------|
| `id`        | int8      | Primary Key, Identity, Auto-increment |
| `name`      | text      | Required |
| `url`       | text      | Required |
| `description`| text     | Required |
| `imageURL`  | text      | Optional |

## Local Installation

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```
2. **Setup environment variables** in a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. **Run development server**:
   ```bash
   npm run dev
   ```
4. **Run Unit and Integration Tests**:
   ```bash
   npm run test
   ```
5. **Run Playwright End-to-End Tests**:
   ```bash
   npm run test:e2e
   ```
