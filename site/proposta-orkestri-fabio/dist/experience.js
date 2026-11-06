(() => {
  const root = document.querySelector('.new-site');
  if (!root) return;
  const sections = [...root.querySelectorAll(':scope > section')];
  const labels = ['A Orkestri', 'Sua empresa', 'Como funciona', 'Plataforma', 'Aplicativo', 'Resultados', 'Demonstração', 'Implantação', 'Ecossistema', 'Vamos conversar'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  sections.forEach((section, i) => {
    section.dataset.chapter = String(i + 1).padStart(2, '0');
    if (!section.id) section.id = `capitulo-${i + 1}`;
  });
  root.querySelectorAll('.process-grid, .delivery-grid, .results-grid, .ecosystem-grid').forEach(grid => {
    [...grid.children].forEach((card, i) => card.style.setProperty('--reveal-delay', `${(i % 3) * 100}ms`));
  });
  const dock = document.createElement('nav');
  dock.className = 'chapter-dock';
  dock.setAttribute('aria-label', 'Navegação entre seções');
  dock.innerHTML = '<span class="chapter-dock-label"><b>01</b><span>A Orkestri</span></span><span class="chapter-dock-progress" aria-hidden="true"><span></span></span><button type="button" aria-label="Seção anterior">↑</button><button type="button" aria-label="Próxima seção">↓</button><a class="dock-cta" href="#contato">Agendar demo ↗</a>';
  document.body.append(dock);
  const number = dock.querySelector('b');
  const label = dock.querySelector('.chapter-dock-label > span');
  const [prev, next] = dock.querySelectorAll('button');
  let active = 0;
  let frame = 0;
  let positions = [];
  const measure = () => {
    positions = sections.map(section => ({ top: section.getBoundingClientRect().top + scrollY, height: section.offsetHeight }));
    schedule();
  };
  const update = () => {
    frame = 0;
    const focusLine = scrollY + innerHeight * .4;
    active = Math.max(0, positions.findLastIndex(position => position.top <= focusLine));
    const first = positions[0];
    const last = positions[positions.length - 1];
    dock.classList.toggle('is-active', scrollY > first.top - 140 && scrollY < last.top - innerHeight * .2);
    number.textContent = String(active + 1).padStart(2, '0');
    label.textContent = labels[active];
    prev.disabled = active === 0;
    next.disabled = active === sections.length - 1;
    dock.style.setProperty('--journey', Math.min(1, Math.max(0, (focusLine - first.top) / (last.top + last.height - first.top))));
    if (!reduce.matches && fine.matches) {
      const app = sections[4];
      const position = positions[4];
      if (position.top < scrollY + innerHeight && position.top + position.height > scrollY) {
        app.style.setProperty('--float-y', `${Math.max(-16, Math.min(16, (position.top - scrollY) * .035))}px`);
      }
    }
  };
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  const go = delta => sections[active + delta]?.scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth', block: 'start' });
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  new ResizeObserver(measure).observe(root);
  root.addEventListener('pointermove', event => {
    if (reduce.matches || !fine.matches) return;
    const card = event.target.closest('.delivery-grid article, .ecosystem-card');
    const section = event.target.closest('.ink');
    const target = card || section;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (card) {
      card.style.setProperty('--card-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--card-y', `${event.clientY - rect.top}px`);
    } else {
      section.style.setProperty('--pointer-x', `${(event.clientX - rect.left) / rect.width * 100}%`);
      section.style.setProperty('--pointer-y', `${(event.clientY - rect.top) / rect.height * 100}%`);
    }
  }, { passive: true });
  measure();
  document.fonts.ready.then(measure);
})();
