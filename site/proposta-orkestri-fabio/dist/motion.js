const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) document.documentElement.classList.add('motion-ready');
const topbar = document.querySelector('.topbar');
addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 40), { passive: true });
document.querySelector('#monthly').setAttribute('aria-live', 'polite');
document.querySelector('#selection').setAttribute('aria-live', 'polite');
document.querySelectorAll('#plus, #minus, .addon').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#minus').disabled = document.querySelector('#units').textContent === '0';
  const chosen = document.querySelector('#selection');
  if (document.querySelector('.addon[aria-pressed=true]')) chosen.textContent += ' Valores dos produtos não incluídos no total.';
  if (!reduceMotion) document.querySelector('#monthly').animate([{opacity:.4,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:320});
}));
document.querySelector('#minus').disabled = true;
