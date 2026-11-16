const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const script = readFileSync('site/proposta-orkestri-fabio/dist/demonstracao.js', 'utf8');

function setup(fetchResponse, { valid = true, honey = '' } = {}) {
  const listeners = {};
  const status = { dataset: {}, focus() {} };
  const submit = { disabled: false };
  const fallback = { hidden: true };
  const emailLink = {};
  const date = {};
  let requests = 0;
  let resets = 0;
  const form = {
    action: 'https://formsubmit.co/ricardo@orkestri.net',
    elements: { _honey: { value: honey } },
    querySelector: selector => ({ '.booking-status': status, '[type="submit"]': submit, '.booking-fallback': fallback, '#booking-date': date, '.booking-email': emailLink })[selector],
    addEventListener: (event, handler) => { listeners[event] = handler; },
    reportValidity: () => valid,
    setAttribute() {}, removeAttribute() {},
    reset: () => { resets++; }
  };
  const dialog = { querySelector: () => ({ addEventListener() {} }), addEventListener() {} };
  const context = {
    document: { querySelector: selector => selector === '#booking-form' ? form : dialog, addEventListener() {} },
    location: { hash: '' }, addEventListener() {}, Date, AbortSignal,
    setTimeout: () => 1, clearTimeout() {},
    FormData: class { *[Symbol.iterator]() { yield ['email', 'test@example.com']; } },
    fetch: async (url, options) => {
      requests++;
      assert.equal(url, 'https://formsubmit.co/ajax/ricardo@orkestri.net');
      assert.equal(options.method, 'POST');
      return fetchResponse();
    }
  };
  vm.runInNewContext(script, context);
  return { send: () => listeners.submit({ preventDefault() {} }), status, submit, fallback, emailLink, requests: () => requests, resets: () => resets };
}

test('confirma pedido e limpa campos somente após aceitação do serviço', async () => {
  const ui = setup(async () => ({ ok: true, json: async () => ({ success: 'true' }) }));
  await ui.send();
  assert.equal(ui.status.dataset.state, 'success');
  assert.equal(ui.resets(), 1);
  assert.equal(ui.submit.disabled, false);
});

test('falha de rede deixa confirmação pendente sem sugerir envio duplicado', async () => {
  const ui = setup(async () => { throw new TypeError('Network error'); });
  await ui.send();
  assert.equal(ui.status.dataset.state, 'unconfirmed');
  assert.equal(ui.resets(), 0);
  assert.equal(ui.fallback.hidden, true);
  assert.match(ui.status.textContent, /pode ter sido entregue/);
  assert.match(ui.emailLink.href, /^mailto:ricardo@orkestri.net\?/);
  assert.match(decodeURIComponent(ui.emailLink.href), /email: test@example.com/);
  assert.equal(ui.submit.disabled, false);
});

test('erro 500 após entrega não é apresentado como pedido recusado', async () => {
  const ui = setup(async () => ({ ok: false, status: 500, json: async () => { throw new SyntaxError('HTML error page'); } }));
  await ui.send();
  assert.equal(ui.status.dataset.state, 'unconfirmed');
  assert.equal(ui.resets(), 0);
  assert.equal(ui.requests(), 1);
  assert.equal(ui.fallback.hidden, true);
});

test('tempo esgotado não gera mensagem de falha nem novo envio automático', async () => {
  const ui = setup(async () => { const error = new Error('Timeout'); error.name = 'TimeoutError'; throw error; });
  await ui.send();
  assert.equal(ui.status.dataset.state, 'unconfirmed');
  assert.equal(ui.resets(), 0);
  assert.equal(ui.requests(), 1);
});

test('resposta sem confirmação JSON mantém pedido como não confirmado', async () => {
  const ui = setup(async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('Invalid JSON'); } }));
  await ui.send();
  assert.equal(ui.status.dataset.state, 'unconfirmed');
  assert.equal(ui.resets(), 0);
});

test('recusa explícita oferece envio alternativo sem apagar os dados', async () => {
  const ui = setup(async () => ({ ok: false, status: 429 }));
  await ui.send();
  assert.equal(ui.status.dataset.state, 'error');
  assert.equal(ui.resets(), 0);
  assert.equal(ui.fallback.hidden, false);
});

test('não apresenta sucesso quando o provedor recusa o envio', async () => {
  const ui = setup(async () => ({ ok: true, json: async () => ({ success: 'false' }) }));
  await ui.send();
  assert.equal(ui.status.dataset.state, 'error');
  assert.equal(ui.resets(), 0);
});

test('impede envios duplicados enquanto aguarda resposta', async () => {
  let resolve;
  const pending = new Promise(done => { resolve = done; });
  const ui = setup(() => pending);
  const first = ui.send();
  await ui.send();
  assert.equal(ui.requests(), 1);
  assert.equal(ui.submit.disabled, true);
  resolve({ ok: true, json: async () => ({ success: true }) });
  await first;
  assert.equal(ui.submit.disabled, false);
});

test('não envia formulário inválido nem armadilha preenchida', async () => {
  for (const options of [{ valid: false }, { honey: 'spam' }]) {
    const ui = setup(() => { throw new Error('Não deve enviar'); }, options);
    await ui.send();
    assert.equal(ui.requests(), 0);
  }
});
