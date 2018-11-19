import { el, empty } from './helpers';
import { score } from './highscore';
import { save } from './storage';
import question from './question';

// allar breytur hér eru aðeins sýnilegar innan þessa módúl

let highscore;
let startButton; // takki sem byrjar leik
let problem; // element sem heldur utan um verkefni, sjá index.html
let result; // element sem heldur utan um niðurstöðu, sjá index.html

let playTime; // hversu lengi á að spila? Sent inn gegnum init()
let total = 0; // fjöldi spurninga í núverandi leik
let correct = 0; // fjöldi réttra svara í núverandi leik
let currentProblem; // spurning sem er verið að sýna

/**
 * Klárar leik. Birtir result og felur problem. Reiknar stig og birtir í result.
 */
function finish() {
  const points = score(total, correct, playTime);
  const text = `Þú svaraðir ${correct} rétt af ${total} spurningum og fékkst ${points} stig fyrir. Skráðu þig á stigatöfluna!`;
  result.classList.remove('result--hidden');
  const parent = document.querySelector('.result__text');
  empty(parent);
  const child = text;
  const newEl = el('p', child);
  parent.appendChild(newEl);
  problem.classList.add('problem--hidden');
}

/**
 * Keyrir áfram leikinn. Telur niður eftir því hve langur leikur er og þegar
 * tími er búinn kallar í finish().
 *
 * Í staðinn fyrir að nota setInterval köllum við í setTimeout á sekúndu fresti.
 * Þurfum þá ekki að halda utan um id á intervali og skilum falli sem lokar
 * yfir fjölda sekúnda sem eftir er.
 *
 * @param {number} current Sekúndur eftir
 */
function tick(current) {
  const parent = document.querySelector('.problem__timer');
  empty(parent);
  const child = current.toString();
  const newEl = el('p', child);
  parent.appendChild(newEl);

  if (current <= 0) {
    return finish();
  }

  return setTimeout(tick, 1000, current - 1);
}

/**
 * Býr til nýja spurningu og sýnir undir .problem__question
 */
function showQuestion() {
  const parent = document.querySelector('.problem__question');
  empty(parent);
  currentProblem = question();
  const child = currentProblem.problem;
  const newEl = el('p', child);
  parent.appendChild(newEl);
}

/**
 * Byrjar leik
 *
 * - Felur startButton og sýnir problem
 * - Núllstillir total og correct
 * - Kallar í fyrsta sinn í tick()
 * - Sýnir fyrstu spurningu
 */
function start() {
  startButton.classList.add('button--hidden');
  problem.classList.remove('problem--hidden');
  total = 0;
  correct = 0;
  tick(playTime);
  showQuestion();
}

/**
 * Event handler fyrir það þegar spurningu er svarað. Athugar hvort svar sé
 * rétt, hreinsar input og birtir nýja spurningu.
 *
 * @param {object} e Event þegar spurningu svarað
 */
function onSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  if (currentProblem.answer.toString() === input.value.toString()) {
    correct += 1;
  }
  total += 1;
  e.target.childNodes[1].value = '';
  showQuestion();
}

/**
 * Event handler fyrir þegar stig eru skráð eftir leik.
 *
 * @param {*} e Event þegar stig eru skráð
 */
function onSubmitScore(e) {
  e.preventDefault();

  const points = score(total, correct, playTime);
  const name = e.target.querySelector('input');
  save(name.value, points);
  e.target.childNodes[3].value = '';
  highscore.load();

  result.classList.add('result--hidden');
  problem.classList.add('problem--hidden');
  startButton.classList.remove('button--hidden');
}

/**
 * Finnur öll element DOM og setur upp event handlers.
 *
 * @param {number} _playTime Fjöldi sekúnda sem hver leikur er
 */
export default function init(_playTime, _highscore) {
  playTime = _playTime;
  highscore = _highscore;
  problem = document.querySelector('.problem');
  result = document.querySelector('.result');
  startButton = document.querySelector('.start');

  startButton.addEventListener('click', start);
  result.querySelector('form').addEventListener('submit', onSubmitScore);
  problem.querySelector('form').addEventListener('submit', onSubmit);
}
