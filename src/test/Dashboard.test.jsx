import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';

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
    data: { activeAnnouncements: [1,2], availableBenefits: [], pendingRequestsCount: 3, recentDocuments: [1,2,3,4,5] },
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
    data: { activeAnnouncements: [1,2], availableBenefits: [], pendingRequestsCount: 10, recentDocuments: [1,2,3,4,5] },
  });
  await renderDashboard();
  await waitFor(() => {
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

it('shows empty state when no announcements', async () => {
  getDashboard.mockResolvedValue({
    data: { activeAnnouncements: [], availableBenefits: [], pendingRequestsCount: 0, recentDocuments: [] },
  });
  await renderDashboard();
  expect(await screen.findByText('No hay comunicados recientes.')).toBeInTheDocument();
});
