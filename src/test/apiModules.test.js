import { describe, it, expect, vi, beforeEach } from 'vitest';

const apiClientMock = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
};

vi.mock('../api/client', () => ({
  default: apiClientMock,
}));

describe('API modules - FrontEnd Colaborador', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('announcements usa endpoint correcto', async () => {
    const { getActiveAnnouncements } = await import('../api/announcements');
    getActiveAnnouncements();
    expect(apiClientMock.get).toHaveBeenCalledWith('/api/announcements');
  });

  it('benefits usa endpoint correcto', async () => {
    const { getActiveBenefits } = await import('../api/benefits');
    getActiveBenefits();
    expect(apiClientMock.get).toHaveBeenCalledWith('/api/benefits');
  });

  it('dashboard usa endpoint correcto', async () => {
    const { getDashboard } = await import('../api/dashboard');
    getDashboard();
    expect(apiClientMock.get).toHaveBeenCalledWith('/api/dashboard');
  });

  it('documents usa endpoint correcto', async () => {
    const { getMyDocuments } = await import('../api/documents');
    getMyDocuments();
    expect(apiClientMock.get).toHaveBeenCalledWith('/api/documents/me');
  });

  it('employees usa endpoints correctos', async () => {
    const { getMyProfile, updateMyProfile } = await import('../api/employees');
    const payload = { phone: '5555-5555' };

    getMyProfile();
    updateMyProfile(payload);

    expect(apiClientMock.get).toHaveBeenCalledWith('/api/employees/me');
    expect(apiClientMock.put).toHaveBeenCalledWith('/api/employees/me', payload);
  });

  it('requests usa endpoints correctos', async () => {
    const {
      getMyRequests,
      createVacation,
      createCertificate,
      createVoucher,
      cancelRequest,
    } = await import('../api/requests');

    const vacation = { startDate: '2026-07-01', endDate: '2026-07-03', reason: 'Vacaciones' };
    const certificate = { certificateType: 'Trabajo', reason: 'Banco' };
    const voucher = { period: 'Junio', year: '2026', reason: 'Tramite' };

    getMyRequests();
    createVacation(vacation);
    createCertificate(certificate);
    createVoucher(voucher);
    cancelRequest('req-123');

    expect(apiClientMock.get).toHaveBeenCalledWith('/api/requests/me');
    expect(apiClientMock.post).toHaveBeenCalledWith('/api/requests/vacation', vacation);
    expect(apiClientMock.post).toHaveBeenCalledWith('/api/requests/certificate', certificate);
    expect(apiClientMock.post).toHaveBeenCalledWith('/api/requests/voucher', voucher);
    expect(apiClientMock.post).toHaveBeenCalledWith('/api/requests/req-123/cancel');
  });
});
