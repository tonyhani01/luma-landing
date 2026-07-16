const requested = new URLSearchParams(location.search).get('ad') || '1';
document.querySelectorAll('[data-ad]').forEach((node) => {
  node.hidden = node.dataset.ad !== requested;
});
document.documentElement.dataset.export = 'true';
