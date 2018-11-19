import init from './lib/game';
import Highscore from './lib/highscore';

const PLAY_TIME = 10;

document.addEventListener('DOMContentLoaded', () => {
  const highscore = new Highscore();
  highscore.load();
  init(PLAY_TIME, highscore );
});
