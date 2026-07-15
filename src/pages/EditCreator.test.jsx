import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditCreator from './EditCreator';
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

describe('EditCreator Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches existing creator, populates the form, and updates on submit', async () => {
    const user = userEvent.setup();
    const mockCreator = {
      id: 5,
      name: 'Simone Giertz',
      url: 'https://www.youtube.com/@simonegiertz',
      description: 'DIY creations.',
      imageURL: 'https://example.com/simone.jpg',
    };

    const mockEqSelect = vi.fn().mockResolvedValue({ data: [mockCreator], error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEqSelect });

    const mockEqUpdate = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEqUpdate });

    supabase.from.mockImplementation((table) => {
      if (table === 'creators') {
        return {
          select: mockSelect,
          update: mockUpdate,
        };
      }
    });

    render(
      <MemoryRouter initialEntries={['/edit/5']}>
        <Routes>
          <Route path="/edit/:id" element={<EditCreator />} />
        </Routes>
      </MemoryRouter>
    );

    // Should fetch and populate form values
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('creators');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEqSelect).toHaveBeenCalledWith('id', '5');
      expect(screen.getByLabelText(/Name/i)).toHaveValue('Simone Giertz');
    });

    // Modify name input and submit
    const nameInput = screen.getByLabelText(/Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Simone Giertz Inventor');

    const submitButton = screen.getByRole('button', { name: /Update Creator/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        name: 'Simone Giertz Inventor',
        url: 'https://www.youtube.com/@simonegiertz',
        description: 'DIY creations.',
        imageURL: 'https://example.com/simone.jpg',
      });
      expect(mockEqUpdate).toHaveBeenCalledWith('id', '5');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('deletes creator when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup();
    const mockCreator = {
      id: 5,
      name: 'Simone Giertz',
      url: 'https://www.youtube.com/@simonegiertz',
      description: 'DIY creations.',
      imageURL: 'https://example.com/simone.jpg',
    };

    const mockEqSelect = vi.fn().mockResolvedValue({ data: [mockCreator], error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEqSelect });

    const mockEqDelete = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEqDelete });

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    supabase.from.mockImplementation((table) => {
      if (table === 'creators') {
        return {
          select: mockSelect,
          delete: mockDelete,
        };
      }
    });

    render(
      <MemoryRouter initialEntries={['/edit/5']}>
        <Routes>
          <Route path="/edit/:id" element={<EditCreator />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue('Simone Giertz');
    });

    const deleteButton = screen.getByRole('button', { name: /Delete Creator/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEqDelete).toHaveBeenCalledWith('id', '5');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
