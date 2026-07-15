import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AddCreator from './AddCreator';
import { supabase } from '../client';

// Mock the Supabase client
vi.mock('../client', () => {
  const mockFrom = vi.fn();
  return {
    supabase: {
      from: mockFrom,
    },
  };
});

// Helper component to track navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddCreator Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders form inputs correctly', () => {
    render(
      <MemoryRouter>
        <AddCreator />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Primary Channel or Page URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image URL \(Optional\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Creator/i })).toBeInTheDocument();
  });

  it('submits form with user inputs, calls supabase.insert, and redirects home', async () => {
    const user = userEvent.setup();
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({
      insert: mockInsert,
    });

    render(
      <MemoryRouter>
        <AddCreator />
      </MemoryRouter>
    );

    // Fill in form values
    const nameInput = screen.getByLabelText(/Name/i);
    const urlInput = screen.getByLabelText(/Primary Channel or Page URL/i);
    const descInput = screen.getByLabelText(/Description/i);
    const imageInput = screen.getByLabelText(/Image URL \(Optional\)/i);

    await user.type(nameInput, 'Marques Brownlee');
    await user.type(urlInput, 'https://www.youtube.com/@mkbhd');
    await user.type(descInput, 'Great tech videos.');
    await user.type(imageInput, 'https://example.com/mkbhd.jpg');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Submit Creator/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('creators');
      expect(mockInsert).toHaveBeenCalledWith([
        {
          name: 'Marques Brownlee',
          url: 'https://www.youtube.com/@mkbhd',
          description: 'Great tech videos.',
          imageURL: 'https://example.com/mkbhd.jpg',
        }
      ]);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
