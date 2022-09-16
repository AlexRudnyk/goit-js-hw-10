import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputElement: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputElement.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  event.preventDefault();
  const country = event.target.value.trim();
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
  if (country !== '') {
    fetchCountries(country).then(countriesArr => {
      if (countriesArr.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countriesArr.length > 1 && countriesArr.length <= 10) {
        console.log('countriesArr: ', countriesArr);
        refs.countryListEl.insertAdjacentHTML(
          'beforeend',
          createCountryListMarkup(countriesArr)
        );
      } else if (countriesArr.length === 1) {
        refs.countryInfoEl.insertAdjacentHTML(
          'beforeend',
          createCountryInfoMarkup(countriesArr)
        );
      }
    });
  } else {
    refs.countryListEl.innerHTML = '';
    refs.countryInfoEl.innerHTML = '';
  }
}

function createCountryListMarkup(countries) {
  return countries
    .map(({ name, flags }) => {
      return `
    <li class='country-list__item'>
<img class='country-list__img' src='${flags.svg}' alt='flag'>
<p class='country-list__text'>${name.official}</p>
    </li>
    `;
    })
    .join('');
}

function createCountryInfoMarkup(country) {
  return country
    .map(({ population, capital, languages, name, flags }) => {
      const qwe = languages;
      return `
    <div class='country-container'>
    <img class='country-container__img' src='${flags.svg}' alt='flag'>
    <p>${name.official}</p>
    </div>
    <p class='country-descr'><span class='country-descr__span'>Capital: </span>${capital}</p>
    <p class='country-descr'><span class='country-descr__span'>Population: </span>${population}</p>
    <p class='country-descr'><span class='country-descr__span'>Languages: </span>${languages.spa}</p>
    `;
    })
    .join('');
}
