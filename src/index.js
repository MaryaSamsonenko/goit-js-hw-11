import './sass/main.scss';
import Notiflix from 'notiflix';
import SearchPhotoApiService from './services/api';
import 'material-icons/iconfont/material-icons.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchPhotoApiService = new SearchPhotoApiService();

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const loadMoreEl = document.querySelector('.load-more');
let lightBox = null;

formEl.addEventListener('submit', onSearch);

loadMoreEl.addEventListener('click', onLoadMorePhoto);
function onSearch(event) {
  clearMarkup();

  event.preventDefault();
  searchPhotoApiService.query = event.target.elements.searchQuery.value;

  if (searchPhotoApiService.query === '') {
    Notiflix.Notify.info('Please, type your search query');
    clearMarkup();
    return;
  }
  showLoadMoreBtn();

  onFetch();
}

function onLoadMorePhoto() {
  onFetch();
}

function addGalleryMarkup({ ...data }) {
  console.log(data);
  const markupPreview = data.hits.reduce(
    (acc, { webformatURL, largeImageURL, likes, views, comments, downloads, tags }) =>
      acc +
      `<div class="photo-card">
  <a class="wrapper-img" href="${largeImageURL}"><img class='photo-img' src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
    const { data, hasNextPage } = await searchPhotoApiService.fetchPhoto();

    addGalleryMarkup(data);
    createLightBox();

    if (data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images...`);
    }
    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      hideLoadMoreBtn();
      return;
    }
    if (!hasNextPage) {
      hideLoadMoreBtn();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
  } catch (error) {
    console.log('error');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}
function clearMarkup() {
  galleryEl.innerHTML = '';
}
function showLoadMoreBtn() {
  loadMoreEl.classList.remove('is-hidden');
}
function hideLoadMoreBtn() {
  loadMoreEl.classList.add('is-hidden');
}

function createLightBox() {
  if (!lightBox) {
    lightBox = new SimpleLightbox('.wrapper-img');
    return;
  }
  lightBox.refresh();
}
