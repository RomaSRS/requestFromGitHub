'use strict';

const QUANTITY_OF_RESPONSES = 5;
const autocomplete = document.querySelector('.autocomplete');
const input = document.querySelector('.autocomplete__input');
const records = document.querySelector('.record-wrapper');
const BASE_URL = 'https://api.github.com/search/repositories?sort=stars&order=desc';

let listsCreate = false;

function debounceFn(fn, debounceTime) {

  let timeout;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, debounceTime);
  };
}

async function search() {

  const response = await fetch(`${BASE_URL}&q=${input.value}`);
  const result = await response.json();
  const countOfHints = result.items.length > QUANTITY_OF_RESPONSES ? QUANTITY_OF_RESPONSES : result.items.length;

  if (!input.value) {
    clearList()
  } else {
    if (!listsCreate) createLists(countOfHints)

    const lists = document.querySelectorAll('.autocomplete__list');
    const listsArray = Array.from(lists);

    for (let i = 0; i < countOfHints; i++) {
      updateList(result.items[i], listsArray[i]);
    }
  }
}

function updateList(elem, list) {
  if (elem) {
    list.innerText = elem.name;
    list.repoDate = elem;
  }
}

function clearList() {
  const arr = Array.from(autocomplete.children).slice(1);

  arr.forEach(elem => elem.remove());
  listsCreate = false;
}

function addRecord(event) {
  if (event.target.className === 'autocomplete__list') {
    const data = event.target.repoDate;
    const record = document.createElement('li');
    const name = `Name: ${data.name}`;
    const owner = `Owner: ${data.owner.login}`;
    const stars = `Stars: ${data.stargazers_count}`;
    const arr = [name, owner, stars];

    record.className = 'record-wrapper__list';

    arr.forEach((text) => {
      const info = document.createElement('p');
      info.textContent = text;
      info.className = 'record-wrapper__info';
      record.appendChild(info);
    });


    addButtonDelete(record);
    records.append(record);
    input.value = '';
    setTimeout(clearList, 300);
  }
}

function createLists(count) {
  listsCreate = true;

  for (let i = 0; i < count; i++) {
    const list = document.createElement('li');

    list.className = 'autocomplete__list';
    autocomplete.append(list);
  }
  autocomplete.addEventListener('click', addRecord);
}

function addButtonDelete(elem) {
  const closeButton = document.createElement('button');

  closeButton.className = 'record-wrapper__btn-close';
  closeButton.addEventListener('click', () => {
    elem.remove();
  })

  elem.append(closeButton);
}

input.addEventListener('input', debounceFn(search, 500));