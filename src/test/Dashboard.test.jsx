import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@react-keycloak/web', () => ({
  useKeycloak: () => ({
    keycloak: {
      tokenParsed: {
        name: 'Test User',
        preferred_username: 'testuser',
      },
    },
  }),
}));

vi.mock('../api/dashboard', () => ({
  getDashboard: vi.fn(),
}));

import { getDashboard } from '../api/dashboard';

async function renderDashboard() {
  const Dashboard = (await import('../pages/Dashboard/Dashboard')).default;
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

it('shows welcome message with user name', async () => {
  getDashboard.mockRejectedValue(new Error('No data'));
  await renderDashboard();
  expect(await screen.findByText(/Bienvenido/)).toBeInTheDocument();
  expect(await screen.findByText((c) => c.includes('Test User'))).toBeInTheDocument();
});

it('displays info alert when API fails', async () => {
  getDashboard.mockRejectedValue(new Error('Network error'));
  await renderDashboard();
  expect(await screen.findByText(/No se pudieron cargar los datos del dashboard/)).toBeInTheDocument();
});

it('shows stat cards after loading', async () => {
  getDashboard.mockResolvedValue({
    data: { pendingRequests: 3, availableDocuments: 5, activeAnnouncements: 2, recentAnnouncements: [], activeBenefits: [] },
  });
  await renderDashboard();
  await waitFor(() => {
    expect(screen.getByText('Solicitudes Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Documentos Disponibles')).toBeInTheDocument();
    expect(screen.getByText('Comunicados Activos')).toBeInTheDocument();
  });
});

it('displays correct stat values', async () => {
  getDashboard.mockResolvedValue({
    data: { pendingRequests: 3, availableDocuments: 5, activeAnnouncements: 2, recentAnnouncements: [], activeBenefits: [] },
  });
  await renderDashboard();
  await waitFor(() => {
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

it('shows empty state when no announcements', async () => {
  getDashboard.mockResolvedValue({
    data: { pendingRequests: 0, availableDocuments: 0, activeAnnouncements: 0, recentAnnouncements: [], activeBenefits: [] },
  });
  await renderDashboard();
  expect(await screen.findByText('No hay comunicados recientes.')).toBeInTheDocument();
});
