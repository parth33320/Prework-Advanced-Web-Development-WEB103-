import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ShowCreators from './ShowCreators';
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

describe('ShowCreators Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders "No creators found" or default creators if database is empty and auto-seeding succeeds', async () => {
    // Select returns empty, insert succeeds, subsequent select returns 2 seeded creators
    const mockCreators = [
      {
        id: 1,
        name: 'Marques Brownlee',
        url: 'https://www.youtube.com/@mkbhd',
        description: 'Quality tech videos and reviews.',
        imageURL: 'https://example.com/mkbhd.jpg',
      },
    ];

    const mockSelect = vi.fn()
      .mockResolvedValueOnce({ data: [], error: null }) // first select: empty
      .mockResolvedValueOnce({ data: mockCreators, error: null }); // second select: returns seeded creators

    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    supabase.from.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    });

    render(
      <MemoryRouter>
        <ShowCreators />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('creators');
      expect(mockInsert).toHaveBeenCalled();
      expect(screen.getByText('Marques Brownlee')).toBeInTheDocument();
    });
  });

  it('renders a list of creators when present in the database', async () => {
    const mockCreators = [
      {
        id: 1,
        name: 'Marques Brownlee',
        url: 'https://www.youtube.com/@mkbhd',
        description: 'Quality tech videos and reviews.',
        imageURL: 'https://example.com/mkbhd.jpg',
      },
      {
        id: 2,
        name: 'Simone Giertz',
        url: 'https://www.youtube.com/@simonegiertz',
        description: 'DIY creations, robotics, and comedy.',
        imageURL: '',
      },
    ];

    const mockSelect = vi.fn().mockResolvedValue({ data: mockCreators, error: null });
    supabase.from.mockReturnValue({
      select: mockSelect,
    });

    render(
      <MemoryRouter>
        <ShowCreators />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Marques Brownlee')).toBeInTheDocument();
      expect(screen.getByText('Simone Giertz')).toBeInTheDocument();
      expect(screen.getByText('Quality tech videos and reviews.')).toBeInTheDocument();
    });
  });
});
