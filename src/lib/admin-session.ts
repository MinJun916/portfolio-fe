export const TOKEN_KEY = 'portfolio.admin.accessToken';
export const SESSION_EVENT = 'portfolio:session';

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function subscribeSession(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY || event.key === null) callback();
  };
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

export function loginDestination(value: string | null) {
  return value &&
    /^\/admin(?:\/|$)/.test(value) &&
    !value.includes('\\') &&
    !value.startsWith('/admin/login')
    ? value
    : '/admin';
}
