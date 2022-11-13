import { Notify } from 'notiflix';

const input = document.querySelector('input[type=text]');
const form = document.querySelector('form');
const btnLoad = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const axios = require('axios').default;
const URL = 'https://pixabay.com/api/?';

let page = 1;

btnLoad.style.display = 'none';

async function fetchPhotos(value) {
  value = input.value;
  const searchParams = new URLSearchParams({
    key: '31294634-7feec5daeee0a180c535a5028',
    q: value,
    safesearch: true,
    orientation: 'horizontal',
    image_type: 'photo',
    page: page,
    per_page: 40,
  });
    try {
      const response = await axios.get(URL + searchParams);
      if (response.data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (response.data.totalHits > 0 && page === 1)
        Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      return response;
    } catch (error) {
      console.log(error);
    }
}

function createGallery(data) {
  btnLoad.style.display = 'block';
  data.hits.forEach(hits =>
    gallery.insertAdjacentHTML(
      'beforeend',
      `<div class="photo-card">
  <img src="${hits.webformatURL}" style="width: 420px; height: 420px" alt="${hits.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${hits.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${hits.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${hits.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${hits.downloads}</b>
    </p>
  </div>
</div>`
    )
  );
}

function clearGallery() {
  gallery.innerHTML = '';
  page = 1;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  async function asyncCreate() {
    try {
      const response = await fetchPhotos();
      createGallery(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  if (input.value.trim().length >= 1) {
    gallery.innerHTML = '';
    asyncCreate();
  } else {
    Notify.failure('You need to enter something');
  } 
  if (gallery.childNodes.length > 0) {
    clearGallery();
    btnLoad.style.display = 'none';
  }
});

btnLoad.addEventListener('click', () => {
  page += 1;
  fetchPhotos().then(response => {
    if (gallery.childNodes.length === response.data.total) {
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    createGallery(response.data);
  });
});
