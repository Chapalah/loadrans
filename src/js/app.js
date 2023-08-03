import BaseHelpers from './helpers/BaseHelpers.js';
import BurgerMenu from './modules/BurgerMenu';
import inputMask from './libs/inputMask.js';

BaseHelpers.checkWebpSupport();

new BurgerMenu().init();

const calculatorInputs = document.querySelectorAll('.calculator__table input');
let calculatorData = {
  items: {},
  totalFeet: 0,
  totalWeight: 0,
  count: 0,
};

const updateCalculatorData = (value) => {
  const total = Object.keys(calculatorData.items).reduce(
    (acc, key) => (acc += +calculatorData.items[key].qty),
    0
  );
  const count = Object.keys(calculatorData.items).reduce(
    (acc, key) => (acc += +calculatorData.items[key].count),
    0
  );

  calculatorData = {
    ...calculatorData,
    count: count,
    totalFeet: total,
    totalWeight: total * 7,
  };
};

const renderTable = () => {
  const table = document.querySelector('.js-items-table');
  const tableWrap = document.querySelector('.js-calculator-items');
  const itemsWrap = document.querySelector('.quote__items');
  const empty = document.querySelector('.calculator__empty');
  const count = document.querySelector('.js-quote-count');
  const qty = document.querySelector('.js-quote-qty');

  const items = Object.keys(calculatorData.items).map(
    (key) =>
      `<tr>
        <td>${key}</td>
        <td>${calculatorData.items[key].count}</td>
        <td>${calculatorData.items[key].qty}</td>
      </tr>`
  );

  if (items.length > 0) {
    empty.classList.add('calculator__empty--hidden');
    itemsWrap.classList.add('quote__items--scroll');
    tableWrap.classList.remove('calculator__table--hidden');
    table.innerHTML = items.join('');
    count.innerHTML = calculatorData.count;
    qty.innerHTML = calculatorData.totalWeight;
  } else {
    empty.classList.remove('calculator__empty--hidden');
    itemsWrap.classList.remove('quote__items--scroll');
    tableWrap.classList.add('calculator__table--hidden');
    table.innerHTML = '';
  }
};

const renderCalculatorData = () => {
  const feet = document.querySelector('.js-total-feet');
  const weight = document.querySelector('.js-total-weight');

  feet.textContent = calculatorData.totalFeet;
  weight.textContent = calculatorData.totalWeight;
};

calculatorInputs.forEach((item) => {
  item.addEventListener('input', (event) => {
    if (event.target.value > 999) {
      event.target.value = 999;
      return;
    }

    if (event.target.value < 0) {
      event.target.value = 0;
      return;
    }

    const row = event.target.parentElement.parentElement;
    const rowFeet = row.querySelector('[data-feet]');
    const rowQty = row.querySelector('[data-qty]');
    const feet = rowFeet.getAttribute('data-feet');
    const qty = event.target.value * feet;

    rowQty.textContent = qty;

    if (event.target.value == 0) {
      delete calculatorData.items[event.target.name];
    } else {
      calculatorData = {
        ...calculatorData,
        items: {
          ...calculatorData.items,
          [event.target.name]: { count: event.target.value, feet, qty },
        },
      };
    }

    updateCalculatorData(event.target.value);
    renderCalculatorData();
    renderTable();
  });
});

const elevatorRadio = document.querySelectorAll('.js-elevator input');

elevatorRadio.forEach((item) => {
  item.addEventListener('change', (event) => {
    const div = document.querySelector(`.js-${event.target.getAttribute('data-type')}`);
    const select = div.querySelector('select');

    if (event.target.value == 'No') {
      div.classList.remove('quote-form__field--hidden');
      select.setAttribute('required', true);
    } else {
      div.classList.add('quote-form__field--hidden');
      select.removeAttribute('required');
    }
  });
});

const setHeight = (block, height) => {
  block.style.maxHeight = height + 'px';
};

const compareHeight = () => {
  window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.calculator__side')?.offsetHeight;

    const form = document.querySelector('.quote__form')?.offsetHeight;
    const tableItems = document.querySelector('.quote__items');

    setHeight(tableItems, form);

    document
      .querySelectorAll('.calculator .calculator__table')
      .forEach((item) => {
        setHeight(item, sidebar);
      });
  });
};

const onLoadSettings = () => {
  window.addEventListener('load', () => {
    if (window.innerWidth > 768)
      document
        .querySelectorAll('.calculator .calculator__table')
        .forEach((item) => {
          setHeight(
            item,
            document.querySelector('.calculator__side')?.offsetHeight
          );
        });
    setHeight(
      document.querySelector('.quote__items'),
      document.querySelector('.quote__form')?.offsetHeight
    );
  });
};

const tables = document.querySelectorAll('.calculator .calculator__table');
const tabs = document.querySelectorAll('.calculator__tab');

tabs.forEach((item) => {
  item.addEventListener('click', (event) => {
    const currentTab = event.target.getAttribute('data-tab');

    tables.forEach((table) => {
      if (table.getAttribute('data-tab') === currentTab) {
        tabs.forEach((item) => {
          item.classList.remove('calculator__tab--active');
        });
        item.classList.add('calculator__tab--active');
        table.classList.remove('calculator__table--hidden');
      } else {
        table.classList.add('calculator__table--hidden');
      }
    });
  });
});

compareHeight();
onLoadSettings();

document
  .querySelector('.js-show-contacts')
  .addEventListener('click', (event) => {
    document
      .querySelectorAll('.contacts__item--hidden')
      .forEach((item) => item.classList.remove('contacts__item--hidden'));
    event.target.classList.add('button--hidden');
  });

const form = document.querySelector('#quote-form');

const telSelector = form.querySelector('#phone');
const dateSelector = form.querySelector('#date');
const submitButton = document.getElementById('submit_quote')
const thanks = document.querySelector('.quote-form__thanks')
const telMask = new Inputmask({ mask: '999-999-9999' });

Inputmask().mask(dateSelector);
telMask.mask(telSelector);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.setAttribute('disabled', true);

  const data = new FormData(form);

  if (calculatorData.count > 0) {
    data.append('calculator', JSON.stringify(calculatorData));
  }

  try {
    const response = await fetch('./static/mail.php', {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    
    if (result.status === 'ok') {
      submitButton.removeAttribute('disabled');
      form.reset();
      thanks.classList.remove('quote-form__thanks--hidden')
    
      setTimeout(() => {
        thanks.classList.add('quote-form__thanks--hidden')
      }, 5000)
    }

  } catch (error) {
    console.error('Error:', error);
  }
});
