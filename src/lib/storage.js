/**
 * Sækir og vistar í localStorage
 */

// Fast sem skilgreinir heiti á lykli sem vistað er undir í localStorage
const LOCALSTORAGE_KEY = 'calc_game_scores';

function compare(x, y) {
  if (x.points > y.points) return -1;
  if (x.points < y.points) return 1;
  return 0;
}

/**
 * Sækir gögn úr localStorage. Skilað sem röðuðum lista á forminu:
 * { points: <stig>, name: <nafn> }
 *
 * @returns {array} Raðað fylki af svörum eða tóma fylkið ef ekkert vistað.
 */
export function load() {
  const savedData = window.localStorage.getItem(LOCALSTORAGE_KEY);

  if (savedData) {
    return JSON.parse(savedData);
  }

  return [];
}

/**
 * Vista stig
 *
 * @param {string} name Nafn þess sem á að vista
 * @param {number} points Stig sem á að vista
 */
export function save(name, points) {
  const scores = load();
  scores.push({ points, name });
  scores.sort(compare);
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(scores));
}

/**
 * Hreinsa öll stig úr localStorage
 */
export function clear() {
  window.localStorage.clear();
}
