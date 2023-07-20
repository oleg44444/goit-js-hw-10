import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
import Notiflix from 'notiflix';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

// Ініціалізуємо об'єкт slimSelect
let slimSelect = new SlimSelect({
  select: '.breed-select',
  settings: {
    placeholder: 'Choose a breed',
    searchPlaceholder: false,
    allowDeselect: true,
  },
});

// Функція для створення розмітки селекта
function createSlimSelect(arr) {
  const selectData = arr.map(({ id, name }) => ({
    text: `${name}`,
    value: `${id}`,
  }));
  // Додаємо placeholder як перший варіант
  selectData.unshift({
    text: 'Choose a breed',
    value: '',
    data: { placeholder: true },
  });

  slimSelect.setData(selectData);
}

// Отримання даних та оновлення розмітки
fetchBreeds()
  .then(data => {
    loader.style.display = 'block';
    breedSelect.style.display = 'none';
    createSlimSelect(data);
  })
  .catch(error => {
    Notiflix.Notify.failure(errorMessage);
    showError(error);
    console.log(error);
  });

breedSelect.addEventListener('change', onBreedSelectChange);

function onBreedSelectChange(evt) {
  const breedId = evt.target.value;
  loader.style.display = 'block';

  // Отримання даних про кота за ID породи
  fetchCatByBreed(breedId)
    .then(data => {
      if (data.length === 0) {
        // Якщо отримано порожній масив даних, порода не знайдена
        Notiflix.Notify.failure('Котиків не знайдено');
      } else {
        // Приховуємо помилку, оскільки дані про кота були отримані
        hideError();
        createCatInfoMarkup(data);
      }
    })
    .catch(error => {
      // Використовуємо Notiflix для відображення сповіщення про помилку
      Notiflix.Notify.failure('Failed to fetch cat by breed');
      console.error(error);
    })
    .finally(() => {
      loader.style.display = 'none';
      catInfo.style.display = 'block';
    });
}

function createCatInfoMarkup(arr) {
  catInfo.innerHTML = arr
    .map(({ breeds, url }) => {
      if (!breeds || breeds.length === 0) {
        return ''; // Якщо `breeds` відсутній або порожній, повертаємо пустий рядок
      }
      const { name, temperament, description } = breeds[0];
      return `
        <img src="${url}" alt="${name}" />
        <h2>${name}</h2>
        <h3>${temperament}</h3>
        <p>${description}</p>
      `;
    })
    .join('');
}

// Функція для відображення елемента з помилкою
function showError(errorMessage) {
  error.style.display = 'block';
  error.textContent = errorMessage;
}

// Функція для приховування елемента з помилкою
function hideError() {
  error.style.display = 'none';
}
