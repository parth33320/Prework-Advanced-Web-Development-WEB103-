import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ViewCreator from './ViewCreator';
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

describe('ViewCreator Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state, fetches and displays a creator details', async () => {
    const mockCreator = {
      id: 1,
      name: 'Marques Brownlee',
      url: 'https://www.youtube.com/@mkbhd',
      description: 'Quality tech videos and reviews.',
      imageURL: 'https://example.com/mkbhd.jpg',
    };

    const mockEq = vi.fn().mockResolvedValue({ data: [mockCreator], error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    supabase.from.mockReturnValue({
      select: mockSelect,
    });

    render(
      <MemoryRouter initialEntries={['/view/1']}>
        <Routes>
          <Route path="/view/:id" element={<ViewCreator />} />
        </Routes>
      </MemoryRouter>
    );

    // Should render loading initially or fetch data quickly
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('creators');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', '1');
      expect(screen.getByRole('heading', { name: 'Marques Brownlee', level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Quality tech videos and reviews.')).toBeInTheDocument();
    });

    // Check external link button
    const channelLink = screen.getByRole('button', { name: /Visit Channel/i });
    expect(channelLink).toHaveAttribute('href', 'https://www.youtube.com/@mkbhd');
  });

  it('renders "Creator not found" if creator does not exist', async () => {
    const mockEq = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    supabase.from.mockReturnValue({
      select: mockSelect,
    });

    render(
      <MemoryRouter initialEntries={['/view/999']}>
        <Routes>
          <Route path="/view/:id" element={<ViewCreator />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Creator not found/i)).toBeInTheDocument();
    });
  });
});
