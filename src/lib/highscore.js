import { load as storLoad, clear as storClear } from './storage';
import { empty, el } from './helpers';
/**
 * Reikna út stig fyrir svör út frá heildarfjölda svarað á tíma.
 * Ekki þarf að gera ráð fyrir hversu lengi seinasta spurning var sýnd. Þ.e.a.s.
 * stig verða alltaf reiknuð fyrir n-1 af n spurningum.
 *
 * @param {number} total Heildarfjöldi spurninga
 * @param {number} correct Fjöldi svarað rétt
 * @param {number} time Tími sem spurningum var svarað á í sekúndum
 *
 * @returns {number} Stig fyrir svör
 */
export function score(total, correct, time) {
  const points = ((correct / total) * (correct / total) + correct) * total / time;
  const scores = Math.round(points) * 100;
  return scores;
}

/**
 * Útbúa stigatöflu, sækir gögn í gegnum storage.js
 */
export default class Highscore {
  constructor() {
    this.scores = document.querySelector('.highscore__scores');
    this.button = document.querySelector('.highscore__button');

    this.button.addEventListener('click', this.clear.bind(this));
  }

  /**
   * Hlaða stigatöflu inn
   */
  load() {
    const data = storLoad();
    const rows = [];

    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];

      const pointsEl = el('p', `${item.points} stig`);
      pointsEl.classList.add('highscore__number');
      const nameEl = el('p', item.name);
      nameEl.classList.add('highscore__name');
      const rowEl = el('li', null);

      rowEl.appendChild(pointsEl);
      rowEl.appendChild(nameEl);
      rows.push(rowEl);
    }

    empty(this.scores);

    if (data.length === 0) {
      this.scores.appendChild(el('p', 'Engin stig skráð'));
      this.button.classList.add('highscore__button--hidden');
    } else {
      this.scores.appendChild(el('ol', rows));
      this.button.classList.remove('highscore__button--hidden');
    }
  }

  /**
   * Hreinsa allar færslur úr stigatöflu, tengt við takka .highscore__button
   */
  clear() {
    empty(this.scores);
    storClear();
    const child = 'Engin stig skráð';
    const newEl = el('p', child);
    this.scores.appendChild(newEl);
  }
}
