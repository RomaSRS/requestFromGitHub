'use strict';

const autocomplete = document.querySelector('.autocomplete');
const input = autocomplete.firstElementChild;
const records = document.querySelector('.wrapper-records');
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
input.addEventListener('input', debouncedSearch);

async function search() {

  if (!input.value) {
    clearList()
    return;
  }
    
  const BASE_URL = `https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc`;
  const quantityOfoResponses = 5;
  let response = await fetch(BASE_URL);
  let result = await response.json();

  let countOfHints = result.items.length;
  countOfHints = (countOfHints > quantityOfoResponses) ? quantityOfoResponses : countOfHints;

  if (!listsCreate) createLists(countOfHints)
  let lists = document.querySelectorAll('.autocomplete-list');

  let listsArray = Array.from(lists);
  for (let i = 0; i < countOfHints; i++) {
    updateBtn(result.items[i], listsArray[i]);
  }
}

function updateBtn(elem, list){
  if (!elem) return
  list.innerText = elem.name;
  list.repoDate = elem;
}

function clearList(){
  let arr = Array.from(autocomplete.children).slice(1);
  arr.forEach(elem => elem.remove());
  listsCreate = false;
}

function createLists(count){
  
  for (let i = 0; i < count; i++) {
    let list = document.createElement('li');
    list.className = 'autocomplete-list';
    list.addEventListener('click', addRecord);
    autocomplete.append(list);
    listsCreate = true;
  }
}

function addRecord(evt) {
  
  let data = evt.target.repoDate;
  let record = document.createElement('div');
  record.className = 'record';
  record.insertAdjacentHTML('afterBegin', `<p>Name: ${data.name}</p><p>Owner: ${data.owner.login}</p><p>Stars: ${data.stargazers_count}</p>`);

  addDeleter(record);
  records.append(record);
  input.value = '';
  setTimeout(clearList, 300);
}

function addDeleter(elem) {
  let deleter = document.createElement('button');
  deleter.className = 'close';
  deleter.addEventListener('click', () => {
    elem.remove();
  })

  elem.append(deleter);
}