if (typeof window !== 'undefined') {
  const emit = (name, params = {}) => window.gtag?.('event', name, params);
  window.addEventListener('DOMContentLoaded', () => {
    emit('page_view_client', { path: location.pathname });
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const text = (button.textContent || '').toLowerCase();
        if (text.includes('copy result')) emit('result_copy', { path: location.pathname });
        if (text.includes('copy share')) emit('share_copy', { path: location.pathname });
        if (text.includes('download')) emit('download_click', { path: location.pathname });
      });
    });
    const fix = () => {
      if (!location.pathname.includes('/print-size-calculator')) return;
      const body = document.body.textContent || '';
      if (!body.includes('Print size: 3000 x 2400 px')) return;
      document.querySelectorAll('.result p').forEach((p) => {
        const text = p.textContent || '';
        if (text.includes('Print size: 3000 x 2400 px')) {
          p.textContent = text.replace('Print size: 3000 x 2400 px', 'Print size: 10 x 8 in');
        }
      });
    };
    fix();
    new MutationObserver(fix).observe(document.body, { subtree: true, childList: true, characterData: true });
  });
}
