'use strict';

const autocomplete = document.querySelector('.autocomplete');
const input = autocomplete.firstElementChild;
const records = document.querySelector('.record-wrapper');
let listsCreate = false;

const debounce = (fn, debounceTime) => {

  let timeout;
    
  return function () {
    const fnCall = () => { 
      fn.apply(this, arguments);
    }

    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
}

const debouncedSearch = debounce(search, 500);

async function search() {

  const BASE_URL = `https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc`;
  const quantityOfoResponses = 5;
  let response = await fetch(BASE_URL);
  let result = await response.json();
  let countOfHints = result.items.length;

  if (!input.value) {
    clearList()
    return;
  }

  countOfHints = (countOfHints > quantityOfoResponses) ? quantityOfoResponses : countOfHints;

  if (!listsCreate) createLists(countOfHints)
  let lists = document.querySelectorAll('.autocomplete__list');

  let listsArray = Array.from(lists);
  for (let i = 0; i < countOfHints; i++) {
    updateList(result.items[i], listsArray[i]);
  }
}

function updateList(elem, list){
  if (!elem) return
  list.innerText = elem.name;
  list.repoDate = elem;
}

function clearList(){
  let arr = Array.from(autocomplete.children).slice(1);
  arr.forEach(elem => elem.remove());
  listsCreate = false;
}

function addRecord(evt) {
  
  let data = evt.target.repoDate;
  let record = document.createElement('li');
  let name = `Name: ${data.name}`;
  let owner = `Owner: ${data.owner.login}`;
  let stars = `Stars: ${data.stargazers_count}`;
  let arr = [name, owner, stars],
  container = record.querySelector('.record-wrapper__list');
  record.className = 'record-wrapper__list';

  // record.insertAdjacentHTML('afterBegin', `<p class = "info">Name: ${data.name}</p>
  //                                          <p class = "info">Owner: ${data.owner.login}</p>
  //                                          <p class = "info">Stars: ${data.stargazers_count}</p>`);


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

input.addEventListener('input', debouncedSearch);

function createLists(count){
  
  for (let i = 0; i < count; i++) {
    let list = document.createElement('li');
    list.className = 'autocomplete__list';
    list.addEventListener('click', addRecord);
    autocomplete.append(list);
    listsCreate = true;
  }
}

function addButtonDelete(elem) {
  let deleteButtonClickHandler = document.createElement('button');
  deleteButtonClickHandler.className = 'record-wrapper__btn-close';
  deleteButtonClickHandler.addEventListener('click', () => {
    elem.remove();
  })

  elem.append(deleteButtonClickHandler);
}