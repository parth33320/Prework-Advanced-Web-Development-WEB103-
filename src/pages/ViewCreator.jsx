import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../client';

/**
 * Inputs: None (gets creator ID from URL parameters via useParams)
 * Outputs: Renders detailed attributes of a single Creator with external link and navigation options.
 */
export default function ViewCreator() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCreatorDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setCreator(data[0]);
      } else {
        setCreator(null);
      }
    } catch (err) {
      console.error('Error fetching creator details:', err);
      setError('Could not retrieve creator details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <span aria-busy="true">Loading details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <article className="error-card" style={{ borderColor: 'var(--pico-form-element-invalid-border-color)' }}>
          <p style={{ margin: 0, color: 'var(--pico-form-element-invalid-active-border-color)' }}>{error}</p>
        </article>
        <Link to="/" role="button" className="outline" style={{ marginTop: '1.5rem' }}>
          Back to Creatorverse
        </Link>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2>Creator not found</h2>
        <p>This content creator might have been removed or does not exist.</p>
        <Link to="/" role="button" style={{ marginTop: '1.5rem' }}>
          Back to Creatorverse
        </Link>
      </div>
    );
  }

  // Fallback image if none specified
  const imageUrlToUse = creator.imageURL || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <nav aria-label="breadcrumb">
        <ul>
          <li><Link to="/">Creatorverse</Link></li>
          <li>{creator.name}</li>
        </ul>
      </nav>

      <article style={{ padding: '2rem', borderRadius: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div style={{ maxHeight: '400px', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
            <img
              src={imageUrlToUse}
              alt={`${creator.name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          <div>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 'bold' }}>{creator.name}</h1>

            <p style={{ fontSize: '1.15rem', lineHeight: '1.6', color: 'var(--pico-muted-color)', marginBottom: '2rem' }}>
              {creator.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <a
                href={creator.url}
                target="_blank"
                rel="noopener noreferrer"
                role="button"
                style={{ flex: 1, minWidth: '200px', fontWeight: 'bold' }}
              >
                🌐 Visit Channel
              </a>
              <Link
                to={`/edit/${creator.id}`}
                role="button"
                className="secondary"
                style={{ flex: 1, minWidth: '200px', fontWeight: 'bold' }}
              >
                ⚙️ Edit / Manage
              </Link>
            </div>
          </div>
        </div>
      </article>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/" className="outline secondary">
          ⬅ Back to Creatorverse
        </Link>
      </div>
    </div>
  );
}
