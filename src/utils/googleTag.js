const isGtagReady = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

export const trackPageView = ({ pagePath, pageTitle }) => {
  if (!isGtagReady()) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: pageTitle,
  });
};

export const trackLead = (params = {}) => {
  if (!isGtagReady()) return;

  window.gtag('event', 'generate_lead', params);
};
