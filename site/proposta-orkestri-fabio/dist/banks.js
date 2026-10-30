// Institutions confirmed by the client; capabilities vary by institution.
const integratedBanks = [
  {
    "name": "Itaú",
    "logo": "assets/banks/itau.svg"
  },
  {
    "name": "Santander",
    "logo": "assets/banks/santander.svg"
  },
  {
    "name": "Bradesco",
    "logo": "assets/banks/bradesco.svg"
  },
  {
    "name": "Banco do Brasil",
    "logo": "assets/banks/banco-do-brasil.svg"
  },
  {
    "name": "Sicoob",
    "logo": "assets/banks/sicoob.svg"
  },
  {
    "name": "Sicredi",
    "logo": "assets/banks/sicredi.svg"
  },
  {
    "name": "Caixa",
    "logo": "assets/banks/caixa.svg"
  },
  {
    "name": "Inter",
    "logo": "assets/banks/inter.svg"
  },
  {
    "name": "Ailos",
    "logo": "assets/banks/ailos.png"
  },
  {
    "name": "Unicred",
    "logo": "assets/banks/unicred.png"
  },
  {
    "name": "BRB",
    "logo": "assets/banks/brb.png"
  },
  {
    "name": "Banrisul",
    "logo": "assets/banks/banrisul.png"
  },
  {
    "name": "BTG Pactual",
    "logo": "assets/banks/btg.png"
  },
  {
    "name": "C6 Bank",
    "logo": "assets/banks/c6.png"
  },
  {
    "name": "Efí",
    "logo": "assets/banks/efi.png"
  },
  {
    "name": "Cora",
    "logo": "assets/banks/cora.svg"
  },
  {
    "name": "Safra",
    "logo": "assets/banks/safra.svg"
  },
  {
    "name": "Daycoval",
    "logo": "assets/banks/daycoval.png"
  },
  {
    "name": "Cresol",
    "logo": "assets/banks/cresol.png"
  },
  {
    "name": "Sofisa",
    "logo": "assets/banks/sofisa.svg"
  },
  {
    "name": "Sisprime",
    "logo": "assets/banks/sisprime.png"
  },
  {
    "name": "ASA",
    "logo": "assets/banks/asa.png"
  }
];

const bankSection = document.querySelector('.bank-integrations');
if (bankSection && integratedBanks.length) {
  const group = bankSection.querySelector('.bank-group');
  for (const bank of integratedBanks) {
    const item = document.createElement('li');
    const logo = document.createElement('img');
    logo.src = bank.logo;
    logo.alt = '';
    logo.width = 32;
    logo.height = 32;
    const name = document.createElement('span');
    name.textContent = bank.name;
    if (bank.name === 'BRB') item.classList.add('bank-brb');
    if (bank.name === 'Sofisa') item.classList.add('bank-sofisa');
    item.append(logo, name);
    group.append(item);
  }
  // Each half must cover wide screens for a seamless loop.
  const originals = [...group.children];
  while (group.children.length * 136 < 2560) {
    for (const item of originals) {
      const repeat = item.cloneNode(true);
      repeat.setAttribute('aria-hidden', 'true');
      group.append(repeat);
    }
  }
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.removeAttribute('aria-label');
  group.parentElement.append(duplicate);
  bankSection.hidden = false;
}
