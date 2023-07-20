import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_gq9QIKBTPbEUAXRC2PYFFGUKaAqT7jm4nxXtndBBvBKLLj53pAY73WC8ZY2NoKsW';

const BASE_URL = 'https://api.thecatapi.com/v1/';

export function fetchBreeds() {
  return axios
    .get(`${BASE_URL}breeds`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch breeds');
      }
      return response.data;
    })
    .catch(error => {
      Notiflix.Notify.failure('Failed to fetch breeds');
      console.error(error);
    });
}

export function fetchCatByBreed(breedId) {
  return axios
    .get(`${BASE_URL}images/search?breed_ids=${breedId}`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch cat by breed');
      }
      return response.data;
    })
    .catch(error => {
      Notiflix.Notify.failure('Failed to fetch cat by breed');
      console.error(error);
    });
}
