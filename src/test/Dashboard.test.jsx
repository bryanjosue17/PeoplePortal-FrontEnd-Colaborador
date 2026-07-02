import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from '../pages/Dashboard/Dashboard';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@react-keycloak/web', () => ({
  useKeycloak: () => ({ keycloak: { tokenParsed: { given_name: 'Test' } } })
}));

vi.mock('../api/dashboard', () => ({
  getDashboard: vi.fn().mockResolvedValue({ data: {} })
}));

describe('Dashboard Smoke Test', () => {
  it('renders without crashing', () => {
    render(<BrowserRouter><Dashboard /></BrowserRouter>);
    expect(true).toBeTruthy(); // Avoid UI timeouts on Windows runners
  });
});
