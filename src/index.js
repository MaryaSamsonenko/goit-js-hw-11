import './sass/main.scss';
import Notiflix from 'notiflix';
import SearchPhotoApiService from './services/api';
import 'material-icons/iconfont/material-icons.css';

const searchPhotoApiService = new SearchPhotoApiService();

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const buttonEl = document.querySelector('.button');
const loadMoreEl = document.querySelector('.load-more');
console.log(loadMoreEl);
formEl.addEventListener('submit', onSearch);
loadMoreEl.addEventListener('click', onLoadMorePhoto);

function onSearch(event) {
  // clearMarkup();

  event.preventDefault();
  searchPhotoApiService.query = event.target.elements.searchQuery.value;

  if (searchPhotoApiService.query === '') {
    Notiflix.Notify.info('Please, type your search query');
    clearCardsContainer();
    return;
  }

  onFetch();

  loadMoreEl.classList.remove('is-hidden');
  // Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images...`);
  if (searchPhotoApiService.query.length >= PER_PAGE) {
    loadMoreEl.classList.remove('is-hidden');
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

function onLoadMorePhoto() {
  onFetch();
}

function addGalleryMarkup({ ...data }) {
  const markupPreview = data.hits.reduce(
    (acc, { webformatURL, likes, views, comments, downloads, tags }) =>
      acc +
      `<div class="photo-card">
  <a class="wrapper-img" href="#"><img class='photo-img' src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <div class="info-item">
      <span class="material-icons-outlined">favorite_border</span>
      <p class="info-text">${likes}</p>
    </div>
    <div class="info-item">
     
      <span class="material-icons-outlined">preview</span>
      <p class="info-text">${views}</p>
    </div>
    <div class="info-item">
      <span class="material-icons-outlined">comment</span>
       <p class="info-text">${comments}</p>
    </div>
    <div class="info-item">
      <span class="material-icons-outlined">download</span>
      <p class="info-text">${downloads}</p>
    </div>
  </div>
</div>
`,
    '',
  );
  showGalleryMarkup(markupPreview);
}
function showGalleryMarkup(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

async function onFetch() {
  try {
    const { data } = await searchPhotoApiService.fetchPhoto();

    addGalleryMarkup(data);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}
function clearMarkup() {
  galleryEl.innerHTML = '';
}
