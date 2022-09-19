import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 500;

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
      if (countriesArr.status === 404) {
        return Notify.failure('Oops, there is no country with that name');
      } else if (countriesArr.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countriesArr.length > 1 && countriesArr.length <= 10) {
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
      refs.countryListEl.addEventListener('click', onSpecificCountryNameClick);
      function onSpecificCountryNameClick(event) {
        refs.countryListEl.innerHTML = '';
        refs.countryInfoEl.innerHTML = '';
        const specificCountryName = event.target.textContent;
        fetchCountries(specificCountryName)
          .then(specCountry => {
            refs.countryListEl.innerHTML = '';
            refs.countryInfoEl.innerHTML = '';
            refs.countryInfoEl.insertAdjacentHTML(
              'beforeend',
              createSpecCountryInfoMarkup(specCountry)
            );
          })
          .catch(error => {
            Notify.info('Please, tap on the country name');
          });
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
      return `
    <div class='country-container'>
    <img class='country-container__img' src='${flags.svg}' alt='flag'>
    <p class='country-container__text'>${name.official}</p>
    </div>
    <p class='country-descr'><span class='country-descr__span'><b>Capital: </b></span>${capital}</p>
    <p class='country-descr'><span class='country-descr__span'><b>Population: </b></span>${population}</p>
    <p class='country-descr'><span class='country-descr__span'><b>Languages: </b></span>${Object.values(
      languages
    )}</p>
    `;
    })
    .join('');
}

function createSpecCountryInfoMarkup(country) {
  return country
    .map(({ population, capital, languages, name, flags }) => {
      return `
    <div class='country-container'>
    <img class='country-container__img' src='${flags.svg}' alt='flag'>
    <p class='country-container__text'>${name.official}</p>
    </div>
    <p class='country-descr'><span class='country-descr__span'><b>Capital: </b></span>${capital}</p>
    <p class='country-descr'><span class='country-descr__span'><b>Population: </b></span>${population}</p>
    <p class='country-descr'><span class='country-descr__span'><b>Languages: </b></span>${Object.values(
      languages
    )}</p>
    `;
    })
    .join('');
}
