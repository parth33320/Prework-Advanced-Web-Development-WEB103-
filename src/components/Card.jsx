import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Inputs:
 * - id: Number (unique creator ID)
 * - name: String (creator's display name)
 * - url: String (creator's external channel URL)
 * - description: String (short channel summary)
 * - imageURL: String (optional URL to an image/avatar of the creator)
 * Outputs:
 * - A rendered JSX Card displaying the creator's info using PicoCSS card grid layout.
 */
export default function Card({ id, name, url, description, imageURL }) {
  // Use a fallback placeholder image if none is provided
  const imageUrlToUse = imageURL || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';

  return (
    <article className="creator-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
      <header style={{ padding: 0, margin: '0 0 1rem 0', border: 'none', background: 'none' }}>
        <div style={{ height: '160px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
          <img
            src={imageUrlToUse}
            alt={`${name}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>{name}</h3>
      </header>

      <p style={{ fontSize: '0.95rem', flexGrow: 1, color: 'var(--pico-muted-color)' }}>
        {description}
      </p>

      <footer style={{ padding: 0, margin: '1rem 0 0 0', display: 'flex', gap: '0.5rem', background: 'none', border: 'none' }}>
        <Link to={`/view/${id}`} role="button" className="outline" style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}>
          View Details
        </Link>
        <Link to={`/edit/${id}`} role="button" className="outline contrast" style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}>
          Edit
        </Link>
      </footer>
    </article>
  );
}
