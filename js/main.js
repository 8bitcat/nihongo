// main — appstart & navigation.

import { initAudio, stopSpeech } from './audio.js';
import * as screens from './screens.js';
import { renderTestIntro, renderTestRun } from './test.js';
import { renderArcade } from './arcade.js';
import { renderReading, renderMangaGuide, renderManga, renderStory } from './reading.js';
import { renderCourse, renderCourseLesson } from './course.js';
import { renderGrind, renderGrindRun, renderGrindList } from './grind.js';
import { initBadge } from './badge.js';

const app = document.getElementById('app');

const routes = {
  home: screens.renderHome,
  kana: screens.renderKanaModule,
  kanaTable: screens.renderKanaTable,
  kanaMatch: screens.renderKanaMatch,
  kanaLesson: screens.renderKanaLesson,
  vocab: screens.renderVocabModule,
  vocabCat: screens.renderVocabCat,
  vocabLesson: screens.renderVocabLesson,
  kanjiModule: screens.renderKanjiModule,
  kanjiLesson: screens.renderKanjiLesson,
  grammarModule: screens.renderGrammarModule,
  grammarLesson: screens.renderGrammarLesson,
  review: screens.renderReview,
  result: screens.renderResult,
  settings: screens.renderSettings,
  testIntro: renderTestIntro,
  testRun: renderTestRun,
  course: renderCourse,
  courseLesson: renderCourseLesson,
  arcade: renderArcade,
  grind: renderGrind,
  grindRun: renderGrindRun,
  grindList: renderGrindList,
  achievements: screens.renderAchievements,
  boss: screens.renderBoss,
  reading: renderReading,
  mangaGuide: renderMangaGuide,
  manga: renderManga,
  story: renderStory,
};

export const nav = {
  onLeave: null,
  go(name, params = {}) {
    if (nav.onLeave) { try { nav.onLeave(); } catch { /* städning får inte krascha nav */ } nav.onLeave = null; }
    stopSpeech();
    app.innerHTML = '';
    window.scrollTo(0, 0);
    (routes[name] || routes.home)(app, nav, params);
  },
};

initAudio();
initBadge();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline-stöd är nice-to-have */ });
}
nav.go('home');
