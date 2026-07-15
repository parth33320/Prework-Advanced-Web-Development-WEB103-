import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';
import Card from '../components/Card';

const DEFAULT_CREATORS = [
  {
    name: "Marques Brownlee (MKBHD)",
    url: "https://www.youtube.com/@mkbhd",
    description: "One of the world's top tech reviewers, producing extremely high-quality video reviews on smartphones, electric vehicles, and future tech gadgets.",
    imageURL: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Simone Giertz",
    url: "https://www.youtube.com/@simonegiertz",
    description: "A brilliant Swedish inventor, maker, and robotics enthusiast famous for crafting wonderfully useless machines and transforming a Tesla into 'Truckla'.",
    imageURL: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "The Primeagen",
    url: "https://www.youtube.com/@ThePrimeagen",
    description: "An energetic and highly entertaining software engineer focused on Neovim, TypeScript, Rust, algorithms, and hilarious developer culture memes.",
    imageURL: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Mark Rober",
    url: "https://www.youtube.com/@MarkRober",
    description: "A former NASA and Apple engineer who creates incredibly viral and educational science, engineering, and prank/glitter bomb videos.",
    imageURL: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kurzgesagt – In a Nutshell",
    url: "https://www.youtube.com/@kurzgesagt",
    description: "An animation studio making beautiful, colorful, bird-themed science videos explaining space, biology, physics, and complex philosophical dilemmas.",
    imageURL: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
  }
];

/**
 * Inputs: None (reads from database on component mount)
 * Outputs: Renders a list of all Creators as Card components. If database is empty, auto-seeds default Creators.
 */
export default function ShowCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      // Query creators ordered by ID/creation
      const { data, error } = await supabase
        .from('creators')
        .select('*');

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // Auto-seed table if it is completely empty
        const { error: seedError } = await supabase
          .from('creators')
          .insert(DEFAULT_CREATORS);

        if (seedError) {
          throw seedError;
        }

        // Re-fetch after seeding
        const { data: reFetchedData, error: reFetchError } = await supabase
          .from('creators')
          .select('*');

        if (reFetchError) {
          throw reFetchError;
        }
        setCreators(reFetchedData || []);
      } else {
        setCreators(data);
      }
    } catch (err) {
      console.error('Error fetching creators:', err);
      setError('Could not fetch content creators from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>💫 Creatorverse</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--pico-muted-color)' }}>
          Explore the Creatorverse — a curated gallery of high-quality content creators.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/new" role="button" style={{ fontWeight: 'bold' }}>
            ➕ Add a Creator
          </Link>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <span aria-busy="true">Loading creators...</span>
        </div>
      ) : error ? (
        <article className="error-card" style={{ borderColor: 'var(--pico-form-element-invalid-border-color)' }}>
          <p style={{ margin: 0, color: 'var(--pico-form-element-invalid-active-border-color)' }}>{error}</p>
        </article>
      ) : creators.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>No content creators in the database. Add one to get started!</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch'
          }}
        >
          {creators.map((creator) => (
            <Card
              key={creator.id}
              id={creator.id}
              name={creator.name}
              url={creator.url}
              description={creator.description}
              imageURL={creator.imageURL}
            />
          ))}
        </div>
      )}
    </div>
  );
}
