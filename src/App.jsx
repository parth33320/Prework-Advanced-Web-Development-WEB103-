import React from 'react';
import { useRoutes, Link } from 'react-router-dom';
import '@picocss/pico';
import ShowCreators from './pages/ShowCreators';
import ViewCreator from './pages/ViewCreator';
import AddCreator from './pages/AddCreator';
import EditCreator from './pages/EditCreator';

/**
 * Inputs: None (defines route structure using react-router-dom useRoutes hook)
 * Outputs: Renders the active route's page component wrapped in a styled main layout with a top nav header.
 */
export default function App() {
  const routes = useRoutes([
    { path: '/', element: <ShowCreators /> },
    { path: '/new', element: <AddCreator /> },
    { path: '/view/:id', element: <ViewCreator /> },
    { path: '/edit/:id', element: <EditCreator /> },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Universal Top Navigation Header */}
      <nav className="container-fluid" style={{ borderBottom: '1px solid var(--pico-muted-border-color)', padding: '0.75rem 2rem', background: 'var(--pico-background-color)' }}>
        <ul>
          <li>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--pico-color)' }}>
              💫 Creatorverse
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/" className="secondary outline" role="button" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              View Gallery
            </Link>
          </li>
          <li>
            <Link to="/new" role="button" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              Add Creator
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="container" style={{ flex: '1 0 auto' }}>
        {routes}
      </main>

      {/* Footer */}
      <footer className="container-fluid" style={{ textAlign: 'center', padding: '2rem 0', marginTop: '3rem', borderTop: '1px solid var(--pico-muted-border-color)', fontSize: '0.9rem', color: 'var(--pico-muted-color)' }}>
        <p style={{ margin: 0 }}>
          Built with 💖 using React, Vite, Pico.css, and Supabase. Web103 Prework.
        </p>
      </footer>
    </div>
  );
}
