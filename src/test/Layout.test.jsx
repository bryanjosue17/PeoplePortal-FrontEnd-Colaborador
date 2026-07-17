import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import Layout from '../components/Layout';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      email: 'test@test.com',
      name: 'Test User',
      preferred_username: 'testuser',
    },
    logout: vi.fn(),
  }),
}));

vi.mock('../context/ThemeContext', () => ({
  useThemeContext: () => ({
    themeMode: 'light',
    toggleThemeMode: vi.fn(),
  }),
}));

vi.mock('../context/NotificationContext', () => ({
  useNotifications: () => ({
    unreadCount: 0,
    clearUnread: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

function renderWithRouter(component) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      {component}
    </MemoryRouter>
  );
}

it('renders app title in drawer', () => {
  renderWithRouter(<Layout><div>Content</div></Layout>);
  const titles = screen.getAllByText('PeoplePortal');
  expect(titles.length).toBeGreaterThanOrEqual(1);
});

it('renders subtitle (appears in temporary and permanent drawer)', () => {
  renderWithRouter(<Layout><div>Content</div></Layout>);
  const subtitles = screen.getAllByText('Colaborador');
  expect(subtitles.length).toBeGreaterThanOrEqual(1);
});

it('renders all navigation items in drawer', () => {
  renderWithRouter(<Layout><div>Content</div></Layout>);
  expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Mis Documentos').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Solicitudes').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Comunicados').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Beneficios').length).toBeGreaterThanOrEqual(1);
});

it('renders user name from token', () => {
  renderWithRouter(<Layout><div>Content</div></Layout>);
  expect(screen.getByText('Test User')).toBeInTheDocument();
});

it('renders children content', () => {
  renderWithRouter(<Layout><div>Child Content</div></Layout>);
  expect(screen.getByText('Child Content')).toBeInTheDocument();
});

it('highlights active route in drawer', () => {
  renderWithRouter(<Layout><div>Content</div></Layout>);
  const dashboardButtons = screen.getAllByRole('button');
  const hasSelected = dashboardButtons.some(btn => btn.classList.contains('Mui-selected'));
  expect(hasSelected).toBe(true);
});
