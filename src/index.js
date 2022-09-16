import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

console.log('countryListTpl: ', countryListTpl);

const DEBOUNCE_DELAY = 300;

const refs = {
  inputElement: document.querySelector('#search-box'),
};

refs.inputElement.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const country = event.target.value.trim();
  if (country !== '') {
    fetchCountries(country).then(value => console.log(value));
  }
}
