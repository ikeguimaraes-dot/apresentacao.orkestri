(() => {
  const dialog = document.querySelector('#agendar-demonstracao');
  const form = document.querySelector('#booking-form');
  if (!dialog || !form) return;
  const status = form.querySelector('.booking-status');
  const submit = form.querySelector('[type="submit"]');
  const fallback = form.querySelector('.booking-fallback');
  const date = form.querySelector('#booking-date');
  let sending = false;

  const updateDate = () => {
    const today = new Date();
    date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };
  const open = () => {
    updateDate();
    if (!dialog.open) dialog.showModal();
  };
  document.addEventListener('click', event => {
    if (event.target.closest('[data-demo-open]')) {
      event.preventDefault();
      open();
    }
  });
  dialog.querySelector('[data-demo-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  if (location.hash === '#agendar-demonstracao') open();
  addEventListener('hashchange', () => {
    if (location.hash === '#agendar-demonstracao') open();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    if (form.elements._honey.value) return;
    const fields = Object.fromEntries(new FormData(form));
    const emailBody = Object.entries(fields)
      .filter(([name]) => !name.startsWith('_'))
      .map(([name, value]) => `${name}: ${value || 'Não informado'}`)
      .join('\n');
    form.querySelector('.booking-email').href = `mailto:ricardo@orkestri.net?subject=${encodeURIComponent('Pedido de demonstração — Orkestri')}&body=${encodeURIComponent(emailBody)}`;
    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    fallback.hidden = true;
    status.dataset.state = 'pending';
    status.textContent = 'Enviando seu pedido…';
    try {
      const response = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(25000)
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission rejected');
      status.dataset.state = 'success';
      status.textContent = 'Pedido enviado! Nossa equipe entrará em contato para confirmar a data e o horário da sua demonstração.';
      form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Não foi possível confirmar o envio. Seus dados foram mantidos: tente novamente ou entre em contato por e-mail.';
      fallback.hidden = false;
    } finally {
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
})();
