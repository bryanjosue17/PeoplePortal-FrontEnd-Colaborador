/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getMyRequests } from '../api/requests';

const NotificationsContext = createContext({ pendingCount: 0, unreadCount: 0, clearUnread: () => {} });

export const useNotifications = () => useContext(NotificationsContext);

const STORAGE_KEY = 'pp_request_statuses';
const POLL_INTERVAL = 90_000; // 90 seconds

export function NotificationsProvider({ children }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount]   = useState(0);
  const intervalRef = useRef(null);

  const clearUnread = useCallback(() => setUnreadCount(0), []);

  const checkRequests = useCallback(async () => {
    try {
      const res = await getMyRequests();
      const requests = Array.isArray(res.data) ? res.data : [];

      // Count active pending requests
      const pending = requests.filter(
        r => r.status === 'Submitted' || r.status === 'InReview'
      ).length;
      setPendingCount(pending);

      // Detect status changes vs stored state
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      let newUnread = 0;

      requests.forEach(r => {
        const prev = stored[r.id];
        if (prev && prev !== r.status) {
          const wasActive = prev === 'Submitted' || prev === 'InReview';
          const isResolved = r.status === 'Approved' || r.status === 'Rejected' || r.status === 'Cancelled';
          if (wasActive && isResolved) {
            const label = r.status === 'Approved' ? 'aprobada ✓' : r.status === 'Rejected' ? 'rechazada ✗' : 'cancelada';
            toast.info(`Tu solicitud fue ${label}`, { toastId: r.id });
            newUnread++;
          }
        }
      });

      // Persist current statuses
      const next = {};
      requests.forEach(r => { next[r.id] = r.status; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      if (newUnread > 0) setUnreadCount(c => c + newUnread);
    } catch {
      // Silently ignore poll errors
    }
  }, []);

  useEffect(() => {
    checkRequests();
    intervalRef.current = setInterval(checkRequests, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [checkRequests]);

  return (
    <NotificationsContext.Provider value={{ clearUnread, pendingCount, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}
