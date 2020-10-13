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
  // record.insertAdjacentHTML('afterBegin', `<p class = "info">Name: ${data.name}</p>
  //                                          <p class = "info">Owner: ${data.owner.login}</p>
  //                                          <p class = "info">Stars: ${data.stargazers_count}</p>`);


  let name = `Name: ${data.name}`;
  let owner = `Owner: ${data.owner.login}`;
  let stars = `Stars: ${data.stargazers_count}`;
  let arr = [name, owner, stars],
  container = record.querySelector('.record');

  arr.forEach((text) => {
    const info = document.createElement('p');
    info.textContent = text;
    info.className = 'info';
    record.appendChild(info);
  });


  addDelete(record);
  records.append(record);
  input.value = '';
  setTimeout(clearList, 300);
}

function addDelete(elem) {
  let parentDelete = document.createElement('button');
  parentDelete.className = 'close';
  parentDelete.addEventListener('click', () => {
    elem.remove();
  })

  elem.append(parentDelete);
}