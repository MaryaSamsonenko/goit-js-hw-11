import './sass/main.scss';
import Notiflix from 'notiflix';
import SearchPhotoApiService from './services/api';

const searchPhotoApiService = new SearchPhotoApiService();
const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const buttonEl = document.querySelector('.button');
const loadMoreEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onSearh);

async function onSearh(event) {
  event.preventDefault();
  searchPhotoApiService.searchQuery = event.target.value;
  try {
    const { data } = await searchPhotoApiService.fetchPhoto();

    addGalleryMarkup(data);
    // checkSearchLehgth(data);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}
function clearMarkup() {
  galleryEl.innerHTML = '';
}

function checkSearchLehgth(photo) {
  //   if (photo.length > 10) {
  //     Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  //   } else if (photo.length >= 2 && photo.length <= 10) {
  //     addListMarkup(photo);
  //   }
}

function addGalleryMarkup({ ...data }) {
  console.log(data);
  const markupPreview = data.hits.reduce(
    (acc, obj) =>
      acc +
      `<div class="photo-card">
  <img src="${obj.webformatURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${obj.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${obj.views} </b>
    </p>
    <p class="info-item">
      <b>Comments: ${obj.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${obj.downloads}</b>
    </p>
  </div>
</div>
`,
    '',
  );
  showGalleryMarkup(markupPreview);
}
function showGalleryMarkup(markup) {
  galleryEl.insertAdjacentHTML('afterbegin', markup);
}
