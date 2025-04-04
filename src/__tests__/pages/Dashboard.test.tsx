import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '../../contexts/NotificationContext';
import Dashboard from '../../pages/Dashboard';

// Mock the services
jest.mock('../../services/eventService', () => ({
  eventService: {
    getEvents: jest.fn().mockResolvedValue([
      {
        id: '1',
        title: 'Culto de Domingo',
        description: 'Culto semanal',
        event_date: '2023-12-31',
        start_time: '09:00:00',
        end_time: '11:00:00',
        location: 'Templo Principal',
        status: 'Confirmado'
      }
    ])
  }
}));

jest.mock('../../services/volunteerService', () => ({
  volunteerService: {
    getVolunteers: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '(11) 98765-4321',
        department: 'Louvor',
        role: 'Músico',
        status: 'Ativo'
      },
      {
        id: '2',
        name: 'Maria Oliveira',
        email: 'maria@example.com',
        phone: '(11) 91234-5678',
        department: 'Mídia',
        role: 'Operador de Som',
        status: 'Ativo'
      }
    ])
  }
}));

describe('Dashboard Page', () => {
  test('renders dashboard with loading state initially', () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <Dashboard />
        </NotificationProvider>
      </BrowserRouter>
    );
    
    // Should show loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // More tests would be added to check the rendered content after loading
});
