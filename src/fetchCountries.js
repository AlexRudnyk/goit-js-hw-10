export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=population,capital,languages,name,flags`
  ).then(response => response.json());
}
