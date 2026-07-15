import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';

/**
 * Inputs: None (gets creator ID from useParams, and reads/writes state on form submit or delete)
 * Outputs: Renders a populated form to modify a Creator's attributes, or delete them.
 *          Updates or deletes records in Supabase and redirects home.
 */
export default function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchCreatorForEdit = async () => {
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
        const creator = data[0];
        setFormData({
          name: creator.name || '',
          url: creator.url || '',
          description: creator.description || '',
          imageURL: creator.imageURL || ''
        });
      } else {
        setError('Content creator not found.');
      }
    } catch (err) {
      console.error('Error fetching creator for editing:', err);
      setError('Could not retrieve creator data for editing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorForEdit();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.url.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSaving(true);
      const { error: updateError } = await supabase
        .from('creators')
        .update({
          name: formData.name.trim(),
          url: formData.url.trim(),
          description: formData.description.trim(),
          imageURL: formData.imageURL.trim() || null
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      navigate('/');
    } catch (err) {
      console.error('Error updating creator:', err);
      setError('Could not update content creator. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${formData.name || 'this creator'}?`);
    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      const { error: deleteError } = await supabase
        .from('creators')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      navigate('/');
    } catch (err) {
      console.error('Error deleting creator:', err);
      setError('Could not delete creator from database.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <span aria-busy="true">Loading creator details...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '700px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontWeight: 'bold' }}>⚙️ Manage Creator</h1>
        <p style={{ color: 'var(--pico-muted-color)' }}>
          Update the profile details or remove this creator from the directory.
        </p>
      </header>

      {error && (
        <article className="error-card" style={{ borderColor: 'var(--pico-form-element-invalid-border-color)', marginBottom: '2rem' }}>
          <p style={{ margin: 0, color: 'var(--pico-form-element-invalid-active-border-color)', fontWeight: 'bold' }}>{error}</p>
        </article>
      )}

      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="name">
            Name <span style={{ color: 'var(--pico-form-element-invalid-active-border-color)' }}>*</span>
            <input
              type="text"
              id="name"
              name="name"
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
              value={formData.imageURL}
              onChange={handleChange}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button type="submit" aria-busy={saving} style={{ flex: 1, fontWeight: 'bold' }}>
            Update Creator
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="contrast"
            style={{ flex: 1, fontWeight: 'bold', backgroundColor: 'var(--pico-form-element-invalid-active-border-color)', borderColor: 'var(--pico-form-element-invalid-active-border-color)', color: '#fff' }}
          >
            Delete Creator
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="outline secondary" style={{ fontSize: '0.95rem' }}>
            Cancel and Return Home
          </Link>
        </div>
      </form>
    </div>
  );
}
