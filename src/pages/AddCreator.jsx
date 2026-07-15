import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

/**
 * Inputs: None (interacts with form submission events)
 * Outputs: Renders a form to enter Name, URL, Description, and Image URL (optional).
 *          On submission, saves the Creator to Supabase and navigates back to ShowCreators.
 */
export default function AddCreator() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!formData.name.trim() || !formData.url.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const { error: insertError } = await supabase
        .from('creators')
        .insert([
          {
            name: formData.name.trim(),
            url: formData.url.trim(),
            description: formData.description.trim(),
            imageURL: formData.imageURL.trim() || null
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      // Navigate home on success
      navigate('/');
    } catch (err) {
      console.error('Error inserting creator:', err);
      setError('Could not add content creator to database. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '700px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontWeight: 'bold' }}>➕ Add a Creator</h1>
        <p style={{ color: 'var(--pico-muted-color)' }}>
          Register a new content creator into the Creatorverse directory.
        </p>
      </header>

      {error && (
        <article className="error-card" style={{ borderColor: 'var(--pico-form-element-invalid-border-color)', marginBottom: '2rem' }}>
          <p style={{ margin: 0, color: 'var(--pico-form-element-invalid-active-border-color)', fontWeight: 'bold' }}>{error}</p>
        </article>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="name">
            Name <span style={{ color: 'var(--pico-form-element-invalid-active-border-color)' }}>*</span>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., Simone Giertz"
              value={formData.name}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="url">
            Primary Channel or Page URL <span style={{ color: 'var(--pico-form-element-invalid-active-border-color)' }}>*</span>
            <input
              type="url"
              id="url"
              name="url"
              placeholder="e.g., https://www.youtube.com/@simonegiertz"
              value={formData.url}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="description">
            Description <span style={{ color: 'var(--pico-form-element-invalid-active-border-color)' }}>*</span>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell us what makes this content creator special..."
              value={formData.description}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </label>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="imageURL">
            Image URL (Optional)
            <input
              type="url"
              id="imageURL"
              name="imageURL"
              placeholder="e.g., https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
              value={formData.imageURL}
              onChange={handleChange}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="submit" aria-busy={loading} style={{ flex: 1, fontWeight: 'bold' }}>
            Submit Creator
          </button>
          <Link to="/" role="button" className="secondary outline" style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
