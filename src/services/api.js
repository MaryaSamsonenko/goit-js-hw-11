import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = 'key=24310244-ee4074f763d6520362b30c74e';
const PER_PAGE = 40;

export default class SearchPhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = PER_PAGE;
  }
  async fetchPhoto() {
    const url = `${BASE_URL}?${API_KEY}&q=${this.searchQuery}&image_type=photo&per_page=${this.perPage}&page=${this.page}&orientation=horizontal&safesearch=true`;
    // const url = 'https://pixabay.com/api/?key=24310244-ee4074f763d6520362b30c74e&q=yellow+flowers&image_type=photo&pretty=true';

    const data = await axios.get(url);

    console.log(data);
    return data;
  }
  get query() {
    return this.searchQuery;
  }
}
