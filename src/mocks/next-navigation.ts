import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (url: string) => {
      if (location.pathname !== url) {
        setTimeout(() => navigate(url), 0);
      }
    },
    replace: (url: string) => {
      if (location.pathname !== url) {
        setTimeout(() => navigate(url, { replace: true }), 0);
      }
    },
    back: () => setTimeout(() => navigate(-1), 0),
    forward: () => setTimeout(() => navigate(1), 0),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
};

export const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

export { useSearchParams };
