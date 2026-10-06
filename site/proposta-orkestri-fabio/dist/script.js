const progress = document.querySelector('#progressBar');
addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${height > 0 ? scrollY / height * 100 : 0}%`;
}, { passive: true });
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .06 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
let units = 0;
const output = document.querySelector('#units');
const monthly = document.querySelector('#monthly');
const selection = document.querySelector('#selection');
const pipou = document.querySelector('#pipou-units');
const cashi = document.querySelector('#cashi-units');
const talki = document.querySelector('#talki-toggle');
const allinone = document.querySelector('#allinone-toggle');
const currency = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function quantity(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}
function update() {
  const p = quantity(pipou), c = quantity(cashi);
  const t = talki.getAttribute('aria-pressed') === 'true';
  const a = allinone.getAttribute('aria-pressed') === 'true';
  output.textContent = units;
  monthly.textContent = currency(2500 + units * 1000 + p * 2000 + c * 1000 + (t ? 497 : 0));
  document.querySelector('#minus').disabled = units === 0;
  const items = ['Matriz: ' + currency(2500)];
  if (units) items.push(units + ' filial(is): ' + currency(units * 1000));
  if (p) items.push('Pipou (' + p + ' unidade(s)): ' + currency(p * 2000));
  if (c) items.push('Cashi (' + c + ' unidade(s)): ' + currency(c * 1000));
  if (t) items.push('Talki: ' + currency(497));
  selection.textContent = items.join(' · ') + ' por mês.' + (a ? ' All in One sob consulta, não incluído no total.' : '');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) monthly.animate([{ opacity: .5 }, { opacity: 1 }], { duration: 250 });
}
document.querySelector('#plus').onclick = () => { units++; update(); };
document.querySelector('#minus').onclick = () => { units = Math.max(0, units - 1); update(); };
[pipou, cashi].forEach(input => {
  input.addEventListener('input', update);
  input.addEventListener('change', () => { input.value = quantity(input); update(); });
});
[[talki, 'Adicionar Talki', 'Talki adicionado'], [allinone, 'Incluir na cotação', 'Incluído na cotação']].forEach(([button, off, on]) => {
  button.onclick = () => {
    const active = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? on : off;
    update();
  };
});
update();
