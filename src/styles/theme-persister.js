function applyTheme() {
  const theme = localStorage.getItem('theme');
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// Re-apply the theme after view transitions
document.addEventListener('astro:after-swap', applyTheme);

// We don't need to run applyTheme() on initial load
// because our inline script in the <head> already handled that.