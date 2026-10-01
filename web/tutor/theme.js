/* Device-local appearance, applied before the stylesheet to avoid a light flash. */
(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const read = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Current session still works. */ } };
  let preference = read('osed-forge-theme', 'system');
  let size = read('osed-forge-reading-size', 'medium');
  if (!['system', 'light', 'dark'].includes(preference)) preference = 'system';
  if (!['small', 'medium', 'large'].includes(size)) size = 'medium';
  const apply = () => {
    const resolved = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = resolved;
    root.dataset.readingSize = size;
    root.style.colorScheme = resolved;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#101e30' : '#f2f6f8');
    window.dispatchEvent(new CustomEvent('forge-appearance', { detail: { preference, resolved, size } }));
  };
  window.ForgeAppearance = Object.freeze({
    get: () => ({ preference, resolved: root.dataset.theme, size }),
    setTheme: value => { if (!['system', 'light', 'dark'].includes(value)) throw new Error('Choose System, Light or Dark.'); preference = value; write('osed-forge-theme', value); apply(); },
    toggle: () => { preference = root.dataset.theme === 'dark' ? 'light' : 'dark'; write('osed-forge-theme', preference); apply(); },
    setSize: value => { if (!['small', 'medium', 'large'].includes(value)) throw new Error('Choose a valid reading size.'); size = value; write('osed-forge-reading-size', value); apply(); }
  });
  media.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key === 'osed-forge-theme') { preference = ['system', 'light', 'dark'].includes(event.newValue) ? event.newValue : 'system'; apply(); }
    if (event.key === 'osed-forge-reading-size') { size = ['small', 'medium', 'large'].includes(event.newValue) ? event.newValue : 'medium'; apply(); }
  });
  apply();
})();
