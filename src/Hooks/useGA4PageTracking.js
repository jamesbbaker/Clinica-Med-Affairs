import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useGA4PageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-XXXXX', {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location]);
};

export default useGA4PageTracking;