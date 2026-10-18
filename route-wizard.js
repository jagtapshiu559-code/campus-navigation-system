document.addEventListener('DOMContentLoaded', () => {
  const panels = [...document.querySelectorAll('[data-step-panel]')];
  const buttons = [...document.querySelectorAll('#routeStepNav [data-step]')];
  function showStep(n) {
    panels.forEach(p => p.classList.toggle('active', Number(p.dataset.stepPanel) === n));
    buttons.forEach(b => b.classList.toggle('active', Number(b.dataset.step) === n));
    const panel = panels.find(p => Number(p.dataset.stepPanel) === n);
    if (panel) panel.scrollIntoView({behavior:'smooth', block:'start'});
  }
  buttons.forEach(b => b.addEventListener('click', () => showStep(Number(b.dataset.step))));
  const find = document.getElementById('findRouteButton');
  if (find) find.addEventListener('click', () => showStep(2));
  const route1 = document.getElementById('routeOne');
  const route2 = document.getElementById('routeTwo');
  [route1, route2].forEach(b => b && b.addEventListener('click', () => showStep(3)));
  showStep(0);
});
