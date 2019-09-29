const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const KEY_NEXT_FETCH = 'next_fetch';

const cleanLocalStorage = function () {
  localStorage.removeItem(KEY_NEXT_FETCH);
}

const getData = async api => {
  await fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      const next_page = response.info.next;

      localStorage.setItem(KEY_NEXT_FETCH,next_page);

      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

const loadData = () => {
  let url;
  const next_fetch = localStorage.getItem(KEY_NEXT_FETCH);
  if ( typeof next_fetch === 'string' && next_fetch.length !== 0 ) {
    url = next_fetch;
  } else if ( typeof next_fetch === 'string' && next_fetch.length == 0 ){
    detenerObserver();
  } else {
    url = API;
  }
  getData(url);
}

const detenerObserver = function () {
  intersectionObserver.unobserve($observe);
  $observe.innerHTML='Ya no hay más personajes';
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

cleanLocalStorage();

intersectionObserver.observe($observe);