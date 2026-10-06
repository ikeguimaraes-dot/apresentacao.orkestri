const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) document.documentElement.classList.add('motion-ready');
const topbar = document.querySelector('.topbar');
addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 40), { passive: true });
document.querySelector('#monthly').setAttribute('aria-live', 'polite');
document.querySelector('#selection').setAttribute('aria-live', 'polite');
