import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_KEY, QUIZ_LENGTH } from './config.js';
import { STRINGS } from './i18n.js';
import { TOPICS, SUBJECTS, topicsFor, makeQuiz, optionText, generatorsFor } from './questions.js';
import './science.js';

// Inloggning sker med cyberdynes konton (namn + lösenord) via databasfunktioner, inte Supabase Auth.
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
const app = document.getElementById('app');
const nav = document.getElementById('nav');
const AVATARS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐙', '🦄', '🐲', '🐧', '🦉', '🐬', '🚀', '⚽', '🎸', '🌟', '🤖'];
const LETTER_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];

// ---------- tillstånd ----------
const store = {
  get(k, d = null) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignorera */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignorera */ } },
};
const state = {
  lang: store.get('matte.lang', (navigator.language || 'sv').startsWith('sv') ? 'sv' : 'en'),
  token: store.get('matte.token'),
  teacher: store.get('matte.teacher'),
  guest: store.get('matte.guest') === '1',
  subject: SUBJECTS[store.get('matte.subject')] ? store.get('matte.subject') : null,
  me: null,
  level: null,
  quiz: null,
};
const t = (k, ...a) => { const v = STRINGS[state.lang][k]; return typeof v === 'function' ? v(...a) : v; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const h = (html) => { app.innerHTML = html; window.scrollTo(0, 0); };
const $ = (sel) => app.querySelector(sel);
const errText = (e) => { const m = String(e?.message || e || ''); const code = Object.keys(STRINGS.sv.errors).find((k) => m.includes(k)); return code ? t('errors')[code] : m; };
const isLoggedOutErr = (e) => String(e?.message || '').includes('not_logged_in');
const avatarFor = (me) => store.get(`matte.avatar.${me.id}`) || AVATARS[[...me.name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATARS.length];

async function rpc(fn, args) {
  const { data, error } = await sb.rpc(fn, args);
  if (error) throw error;
  return data;
}

function setLang(l) {
  state.lang = l;
  store.set('matte.lang', l);
  document.documentElement.lang = l;
  document.getElementById('langBtn').textContent = l === 'sv' ? 'EN' : 'SV';
  document.getElementById('brandName').textContent = t('appName');
  document.title = t('appName');
}
document.getElementById('langBtn').onclick = () => { setLang(state.lang === 'sv' ? 'en' : 'sv'); current(); };
document.getElementById('brand').onclick = (e) => { e.preventDefault(); if (!state.quiz) route(); };

let current = () => {};
const navActions = {};
function setNav(items) {
  nav.innerHTML = items.map(([label, id]) => `<button class="navbtn" data-nav="${id}">${label}</button>`).join('');
  nav.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => navActions[b.dataset.nav]()));
}
navActions.home = () => route();
navActions.subject = () => showSubjectPicker();
navActions.mystats = () => showMyStats();
navActions.logout = async () => {
  if (state.token) sb.rpc('logout_player', { p_token: state.token }).then(() => {}, () => {});
  state.token = null; state.me = null; state.guest = false; state.level = null;
  store.del('matte.token'); store.del('matte.guest');
  showAuth();
};
navActions.teacherLogout = () => {
  if (state.teacher) sb.rpc('teacher_logout', { p_token: state.teacher }).then(() => {}, () => {});
  state.teacher = null; store.del('matte.teacher'); showAuth('teacher'); };
const kidNav = () => setNav(state.guest ? [[t('changeSubject'), 'subject'], [t('loginOrRegister'), 'logout']] : [[t('changeSubject'), 'subject'], [t('myStats'), 'mystats'], [t('logout'), 'logout']]);

function showError(e) {
  console.error(e);
  const el = document.createElement('div');
  el.className = 'notice err';
  el.style.marginBottom = '14px';
  el.textContent = errText(e);
  app.prepend(el);
}

// ---------- routing ----------
async function route() {
  if (!state.token && !state.guest) return showAuth(state.teacher ? 'teacher' : 'login');
  if (!state.me) {
    h(`<div class="spin">${t('loading')}</div>`);
    try { await loadMe(); } catch (e) {
      if (isLoggedOutErr(e)) { state.token = null; store.del('matte.token'); return showAuth('login', { type: 'err', text: errText(e) }); }
      h(''); return showError(e);
    }
  }
  if (!state.subject) return showSubjectPicker();
  showHome();
}

// ---------- ämnesval ----------
function showSubjectPicker() {
  current = showSubjectPicker;
  setNav(state.guest ? [[t('loginOrRegister'), 'logout']] : [[t('myStats'), 'mystats'], [t('logout'), 'logout']]);
  const me = state.me;
  h(`<div class="hero"><h1>${me ? t('hi', esc(me.name)) + ' ' : ''}${t('pickSubject')}</h1></div>
    <div class="modes subjects">${Object.entries(SUBJECTS).map(([k, sub]) => `<button class="mode subject ${k === state.subject ? 'current' : ''}" style="background:${sub.color}" data-s="${k}">
      <span class="ic">${sub.icon}</span><b>${sub[state.lang]}</b><span>${t('subjectDesc')[k]}</span></button>`).join('')}</div>`);
  app.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => {
    state.subject = b.dataset.s; store.set('matte.subject', state.subject);
    showHome();
  }));
}

// Gästläge: inget sparas i databasen, bara lite lokalt i webbläsaren för "Träna på det svåra"
const readJson = (k, d) => { try { return JSON.parse(store.get(k)) ?? d; } catch { return d; } };
function guestMe() {
  const gens = readJson('matte.guest.gens', {});
  return {
    id: 'guest', name: t('guestName'), grade: 4, last_grade: null,
    days: readJson('matte.guest.days', []).map((day) => ({ day, n: 1 })),
    gens: Object.entries(gens).map(([k, v]) => { const [gen_id, grade] = k.split('|'); return { gen_id, grade: Number(grade), n: v.n, w: v.w }; }),
    today: new Date().toLocaleDateString('sv-SE'),
  };
}
function guestRecord(q, ok) {
  const gens = readJson('matte.guest.gens', {});
  const k = `${q.genId}|${q.grade}`;
  const x = (gens[k] ||= { n: 0, w: 0 }); x.n++; if (!ok) x.w++;
  store.set('matte.guest.gens', JSON.stringify(gens));
  const days = new Set(readJson('matte.guest.days', []));
  days.add(new Date().toLocaleDateString('sv-SE'));
  store.set('matte.guest.days', JSON.stringify([...days].sort().slice(-60)));
}

async function loadMe() {
  state.me = state.guest ? guestMe() : await rpc('matte_me', { p_token: state.token });
  if (!state.level) {
    const saved = Number(store.get(`matte.level.${state.me.id}`));
    state.level = state.me.last_grade || (saved >= 4 && saved <= 7 ? saved : Math.min(7, Math.max(4, state.me.grade)));
  }
  return state.me;
}

// ---------- inloggning ----------
function showAuth(tab = 'login', msg = null) {
  current = () => showAuth(tab, msg);
  if (tab === 'teacher' && state.teacher) return showTeacher();
  setNav([]);
  let grade = 4;
  const field = (id, label, type, extra = '') => `<div><label for="${id}">${label}</label><input id="${id}" type="${type}" ${extra} required></div>`;
  h(`<div class="hero"><h1>${t('appName')}</h1><p class="muted">${t('tagline')}</p></div>
  <div class="card center">
    <div class="tabs">
      <button data-tab="login" class="${tab === 'login' ? 'on' : ''}">${t('login')}</button>
      <button data-tab="register" class="${tab === 'register' ? 'on' : ''}">${t('register')}</button>
    </div>
    <form class="stack" id="authForm">
      ${msg ? `<div class="notice ${msg.type}">${esc(msg.text)}</div>` : ''}
      ${tab === 'teacher'
        ? `<h3>👩‍🏫 ${t('teacher')}</h3>${field('pw', t('teacherPassword'), 'password', 'autocomplete="current-password"')}<p class="muted small">${t('teacherHint')}</p>`
        : `${field('nm', t('name'), 'text', `autocomplete="username" maxlength="16" minlength="2" ${tab === 'register' ? `title="${t('nameRules')}"` : ''}`)}
           ${field('pw', t('password'), 'password', `minlength="4" maxlength="64" autocomplete="${tab === 'register' ? 'new-password' : 'current-password'}"`)}
           ${tab === 'register' ? `<div><label>${t('grade')}</label><div class="chips" id="grades">${[4, 5, 6, 7].map((g) => `<button type="button" class="chip ${g === grade ? 'on' : ''}" data-g="${g}">${g}</button>`).join('')}</div></div>` : ''}`}
      <button class="btn big" style="width:100%" type="submit">${tab === 'register' ? t('register') : t('login')}</button>
      ${tab === 'teacher' ? '' : `<p class="muted small">${t('sameAccount')}${tab === 'login' ? ' ' + t('forgotHint') : ''}</p>`}
    </form>
  </div>
  ${tab === 'teacher' ? '' : `<div style="text-align:center;margin:-10px 0 18px"><button class="btn secondary big" id="guest">👤 ${t('guestBtn')}</button><p class="muted small">${t('guestHint')}</p></div>`}
  <p style="text-align:center"><button class="linkbtn" data-tab="${tab === 'teacher' ? 'login' : 'teacher'}">${tab === 'teacher' ? '← ' + t('login') : '👩‍🏫 ' + t('teacher')}</button></p>`);
  app.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => showAuth(b.dataset.tab)));
  if ($('#guest')) $('#guest').onclick = () => {
    state.guest = true; state.me = null; state.level = null; store.set('matte.guest', '1');
    route();
  };
  app.querySelectorAll('#grades button').forEach((b) => (b.onclick = () => {
    grade = Number(b.dataset.g);
    app.querySelectorAll('#grades button').forEach((x) => x.classList.toggle('on', x === b));
  }));
  $('#authForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.submitter; if (btn) btn.disabled = true;
    const pw = $('#pw').value;
    try {
      if (tab === 'teacher') {
        const res = await rpc('teacher_login', { p_password: pw });
        if (res?.error) throw new Error(res.error);
        state.teacher = res.token; store.set('matte.teacher', res.token);
        return showTeacher();
      }
      const name = $('#nm').value.trim();
      if (tab === 'register') {
        // cyberdyne-kontot sparar åk 3–6; mattenivån sparas separat
        const rows = await rpc('register_player', { p_name: name, p_password: pw, p_grade: Math.min(grade, 6) });
        state.token = rows[0].r_token;
        state.level = grade;
        store.set(`matte.level.${rows[0].r_id}`, grade);
      } else {
        const rows = await rpc('login_player', { p_name: name, p_password: pw });
        if (rows[0]?.r_error) throw new Error(rows[0].r_error);
        state.token = rows[0].r_token;
        state.level = null;
      }
      store.set('matte.token', state.token);
      state.guest = false; store.del('matte.guest');
      state.me = null;
      route();
    } catch (err) {
      showAuth(tab, { type: 'err', text: errText(err) });
    }
  };
}

// ---------- barnets startsida ----------
function showHome() {
  current = showHome;
  kidNav();
  const me = state.me, g = state.level;
  const subj = state.subject || 'math', sub = SUBJECTS[subj];
  const topics = topicsFor(g, subj);
  h(`<div class="welcome"><button class="av avbtn" id="av" title="${t('changeAvatar')}">${avatarFor(me)}</button>
      <div><h1>${t('hi', esc(me.name))}</h1><button class="badge subjbadge" id="subj" title="${t('changeSubject')}">${sub.icon} ${sub[state.lang]} ⇄</button> <span id="streak" class="muted"></span></div>
      <span class="spacer"></span><div><label>${t('level')}</label><div class="chips" id="lvl">${[4, 5, 6, 7].map((x) => `<button class="chip ${x === g ? 'on' : ''}" data-g="${x}">${x}</button>`).join('')}</div></div></div>
    ${state.guest ? `<div class="notice row" style="margin-bottom:6px"><span>👋 ${t('guestNote')}</span><span class="spacer"></span><button class="btn orange" id="toLogin">${t('register')}</button></div>` : ''}
    <div class="modes">
      <button class="mode" style="background:${sub.color}" id="mixed"><span class="ic">🎯</span><b>${t('mixed')}</b><span>${t('mixedDesc', QUIZ_LENGTH)}</span></button>
      <button class="mode" style="background:var(--purple)" id="weak"><span class="ic">💪</span><b>${t('weak')}</b><span>${t('weakDesc')}</span></button>
    </div>
    <h2>${t('topicTitle')}</h2>
    <div class="topics">${topics.map((k) => `<button class="topic" data-topic="${k}"><span class="ic">${TOPICS[k].icon}</span>${TOPICS[k][state.lang]}</button>`).join('')}</div>`);
  $('#subj').onclick = () => showSubjectPicker();
  $('#av').onclick = () => {
    const i = (AVATARS.indexOf(avatarFor(me)) + 1) % AVATARS.length;
    store.set(`matte.avatar.${me.id}`, AVATARS[i]);
    $('#av').textContent = AVATARS[i];
  };
  app.querySelectorAll('#lvl button').forEach((b) => (b.onclick = () => { state.level = Number(b.dataset.g); store.set(`matte.level.${me.id}`, state.level); showHome(); }));
  if (state.guest) $('#toLogin').onclick = () => { navActions.logout().then(() => showAuth('register')); };
  $('#mixed').onclick = () => startQuiz('quiz');
  $('#weak').onclick = () => startQuiz('weak');
  app.querySelectorAll('[data-topic]').forEach((b) => (b.onclick = () => startQuiz('topic', b.dataset.topic)));
  const n = streak(me.days, me.today);
  if (n > 0) $('#streak').textContent = t('streak', n);
}

function streak(days, today) {
  const set = new Set((days || []).map((d) => d.day));
  const d = new Date(today + 'T12:00:00Z');
  const key = () => d.toISOString().slice(0, 10);
  if (!set.has(key())) d.setUTCDate(d.getUTCDate() - 1);
  let n = 0;
  while (set.has(key())) { n++; d.setUTCDate(d.getUTCDate() - 1); }
  return n;
}

function weakWeights(grade) {
  const agg = {};
  for (const x of state.me?.gens || []) if (x.grade === grade) agg[x.gen_id] = x;
  const weights = {};
  for (const gn of generatorsFor(grade, null, state.subject || 'math')) {
    const x = agg[gn.id];
    weights[gn.id] = x ? 1 + Math.round(8 * (x.w / x.n)) : 2; // osedda uppgifter får lite extra vikt
  }
  return weights;
}

// ---------- quiz ----------
async function startQuiz(mode, topic = null) {
  const grade = state.level, subject = state.subject || 'math';
  h(`<div class="spin">${t('loading')}</div>`);
  const questions = makeQuiz(grade, { count: QUIZ_LENGTH, topic, subject, weights: mode === 'weak' ? weakWeights(grade) : null });
  state.quiz = { mode, topic, grade, subject, questions, i: 0, answers: [], sessionId: null, saveFailed: false, shownAt: 0 };
  if (state.guest) return showQuestion();
  try {
    state.quiz.sessionId = await rpc('matte_start', { p_token: state.token, p_grade: grade, p_lang: state.lang, p_mode: mode, p_subject: subject });
  } catch (e) {
    if (isLoggedOutErr(e)) { state.quiz = null; return navActions.logout(); }
    state.quiz.saveFailed = true; console.error(e);
  }
  showQuestion();
}

function showQuestion() {
  const Q = state.quiz; if (!Q) return route();
  current = showQuestion;
  setNav([[t('quit'), 'quit']]);
  navActions.quit = () => { if (confirm(t('quitConfirm'))) finishQuiz(true); };
  const q = Q.questions[Q.i], picked = Q.answers[Q.i];
  const done = picked !== undefined;
  const L = state.lang;
  const topic = TOPICS[q.topic];
  h(`<div class="quizhead"><div class="progress"><div style="width:${((Q.i + (done ? 1 : 0)) / Q.questions.length) * 100}%"></div></div></div>
    <div class="card qcard">
      <div class="qtop"><span class="qnum">${t('question', Q.i + 1, Q.questions.length)}</span><span class="badge">${topic.icon} ${topic[L]}</span></div>
      <div class="qtext">${q.q[L]}</div>
      ${q.visual ? `<div class="visual">${typeof q.visual === 'object' ? q.visual[L] : q.visual}</div>` : ''}
      <div class="answers">${q.options.map((o, k) => {
        const cls = done ? (k === q.correct ? 'right' : k === picked ? 'wrongpick' : '') : '';
        return `<button class="ans ${cls}" data-k="${k}" ${done ? 'disabled' : ''}><span class="letter" style="background:${LETTER_COLORS[k]}">${'ABCD'[k]}</span>${esc(optionText(o, q.unit, L))}</button>`;
      }).join('')}</div>
      ${done ? `<div class="feedback ${picked === q.correct ? 'good' : 'bad'}">
        <h3>${picked === q.correct ? '🎉 ' + t('correct') : '🤔 ' + t('wrong')}</h3>
        ${picked !== q.correct ? `<div><b>${t('rightAnswer')}</b> ${'ABCD'[q.correct]}) ${esc(optionText(q.options[q.correct], q.unit, L))}</div>` : ''}
        <p>${q.ex[L]}</p>
        <button class="btn green big" id="next">${Q.i + 1 < Q.questions.length ? t('next') + ' →' : t('finish') + ' 🏁'}</button>
        ${Q.saveFailed ? `<div class="notice err small" style="margin-top:12px">${t('saveError')}</div>` : ''}
      </div>` : ''}
    </div>`);
  if (!done) {
    Q.shownAt = Q.shownAt || performance.now();
    app.querySelectorAll('.ans').forEach((b) => (b.onclick = () => answer(Number(b.dataset.k))));
  } else {
    const nb = $('#next'); nb.focus({ preventScroll: true });
    nb.onclick = () => { Q.i++; Q.shownAt = 0; if (Q.i >= Q.questions.length) finishQuiz(); else showQuestion(); };
    $('.feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function answer(k) {
  const Q = state.quiz, q = Q.questions[Q.i], idx = Q.i;
  if (Q.answers[idx] !== undefined) return;
  const ms = Math.round(performance.now() - Q.shownAt);
  Q.answers[idx] = k;
  showQuestion();
  if (state.guest) return guestRecord(q, k === q.correct);
  if (!Q.sessionId) return;
  try {
    await rpc('matte_answer', { p_token: state.token, p_session: Q.sessionId, p_gen: q.genId, p_topic: q.topic, p_grade: q.grade, p_correct: k === q.correct, p_time_ms: ms });
  } catch (e) {
    console.error(e);
    if (!Q.saveFailed) { Q.saveFailed = true; if (state.quiz === Q && Q.i === idx) showQuestion(); }
  }
}

async function finishQuiz(quit = false) {
  const Q = state.quiz; if (!Q) return;
  const correct = Q.questions.filter((q, i) => Q.answers[i] === q.correct).length;
  state.quiz = null;
  if (Q.sessionId) {
    try { await rpc('matte_finish', { p_token: state.token, p_session: Q.sessionId }); } catch (e) { console.error(e); }
  }
  state.me = null; // läs om statistiken nästa gång
  try { await loadMe(); } catch { /* visas vid nästa route */ }
  if (quit) return route();
  showResult(Q, correct);
}

function showResult(Q, correct) {
  current = () => showResult(Q, correct);
  setNav(state.guest ? [[t('home'), 'home'], [t('loginOrRegister'), 'logout']] : [[t('home'), 'home'], [t('myStats'), 'mystats']]);
  const n = Q.questions.length, p = correct / n, L = state.lang;
  const stars = p === 1 ? 3 : p >= 0.7 ? 2 : p >= 0.4 ? 1 : 0;
  h(`<div class="card result" style="max-width:720px;margin:20px auto">
      <h2>${t('result')}</h2>
      <div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <div class="bigscore">${t('score', correct, n)}</div>
      <p style="font-size:1.2rem">${t('msg', p)}</p>
      <div class="row" style="justify-content:center"><button class="btn big" id="again">🔁 ${t('again')}</button><button class="btn big secondary" id="home">🏠 ${t('home')}</button></div>
      <div class="review"><h3>${t('review')}</h3>
      ${Q.questions.map((q, i) => {
        const ok = Q.answers[i] === q.correct;
        return `<details><summary>${ok ? '✅' : '❌'} ${i + 1}. ${TOPICS[q.topic].icon} ${TOPICS[q.topic][L]}</summary><div class="mini">
          <p>${q.q[L]}</p>${q.visual ? `<div class="visual">${typeof q.visual === 'object' ? q.visual[L] : q.visual}</div>` : ''}
          <p><b>${t('yourAnswer')}:</b> ${esc(optionText(q.options[Q.answers[i]], q.unit, L))}${ok ? '' : ` · <b>${t('rightAnswer')}</b> ${esc(optionText(q.options[q.correct], q.unit, L))}`}</p>
          <p class="muted">${q.ex[L]}</p></div></details>`;
      }).join('')}</div></div>`);
  $('#again').onclick = () => { state.subject = Q.subject; startQuiz(Q.mode, Q.topic); };
  $('#home').onclick = () => route();
}

// ---------- statistik (gemensamma byggstenar) ----------
const pct = (c, n) => (n ? Math.round((c / n) * 100) : 0);
const barColor = (p) => (p >= 0.8 ? 'var(--green)' : p >= 0.5 ? 'var(--orange)' : 'var(--red)');
function subjectTopicCards(topics) {
  return Object.entries(SUBJECTS).map(([k, sub]) => {
    const list = (topics || []).filter((x) => (x.subject || 'math') === k);
    return list.length ? `<div class="card section"><h3>${sub.icon} ${sub[state.lang]}: ${t('byTopic').toLowerCase()}</h3><div class="bars">${topicBars(list)}</div></div>` : '';
  }).join('');
}
function topicBars(topics) {
  const L = state.lang;
  return [...topics].sort((a, b) => a.c / a.n - b.c / b.n).map((x) => {
    const p = x.c / x.n;
    return `<div class="bar"><span>${TOPICS[x.topic]?.icon || ''} ${TOPICS[x.topic]?.[L] || esc(x.topic)}</span><div class="track"><div class="fill" style="width:${p * 100}%;background:${barColor(p)}"></div></div><span class="pct">${Math.round(p * 100)} % <span class="muted small">(${x.n})</span></span></div>`;
  }).join('');
}
function dayBars(days, today) {
  const per = Object.fromEntries((days || []).map((d) => [d.day, d.n]));
  const list = [...Array(14)].map((_, i) => { const d = new Date(today + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - 13 + i); return d; });
  const max = Math.max(1, ...list.map((d) => per[d.toISOString().slice(0, 10)] || 0));
  return `<div class="days">${list.map((d) => { const k = d.toISOString().slice(0, 10), v = per[k] || 0; return `<div class="d" title="${k}: ${v}"><span>${v || ''}</span><div class="col ${v ? '' : 'zero'}" style="height:${(v / max) * 100}%"></div><span>${d.getUTCDate()}</span></div>`; }).join('')}</div>`;
}
const fmtDate = (d) => new Date(d).toLocaleDateString(state.lang === 'sv' ? 'sv-SE' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

async function showMyStats() {
  current = showMyStats;
  setNav([[t('home'), 'home'], [t('logout'), 'logout']]);
  h(`<div class="spin">${t('loading')}</div>`);
  try { await loadMe(); } catch (e) { h(''); return showError(e); }
  const me = state.me;
  if (!me.answers) { h(`<h1>${t('myStats')}</h1><div class="card">${t('noData')}</div>`); return; }
  h(`<h1>${avatarFor(me)} ${t('myStats')}</h1><p class="muted small">${t('days90')}</p>
    <div class="kpis">
      <div class="kpi"><span class="v">${me.quizzes}</span><span class="l">${t('totalQuizzes')}</span></div>
      <div class="kpi"><span class="v">${me.answers}</span><span class="l">${t('totalAnswers')}</span></div>
      <div class="kpi"><span class="v">${pct(me.correct, me.answers)} %</span><span class="l">${t('accuracy')}</span></div>
      <div class="kpi"><span class="v">${me.days.length}</span><span class="l">${t('activeDays')}</span></div>
      ${(me.subjects || []).filter((x) => x.answers).map((x) => `<div class="kpi"><span class="v">${pct(x.correct, x.answers)} %</span><span class="l">${SUBJECTS[x.subject].icon} ${SUBJECTS[x.subject][state.lang]}: ${t('accuracy').toLowerCase()} (${x.answers})</span></div>`).join('')}
    </div>
    ${subjectTopicCards(me.topics)}
    <div class="card section"><h3>${t('last14')}</h3>${dayBars(me.days, me.today)}</div>
    <div class="card section"><h3>${t('recent')}</h3><table class="list"><tr><th>${t('date')}</th><th>${t('subject')}</th><th>${t('mode')}</th><th>${t('grade')}</th><th>${t('result')}</th></tr>
      ${me.recent.map((s) => `<tr><td>${fmtDate(s.started_at)}</td><td>${SUBJECTS[s.subject]?.icon || ''} ${SUBJECTS[s.subject]?.[state.lang] || ''}</td><td>${t('modes')[s.mode] || esc(s.mode)}</td><td>${s.grade}</td><td><b>${s.correct}/${s.total}</b></td></tr>`).join('')}
    </table></div>`);
}

// ---------- vuxen-/lärarvy ----------
async function showTeacher(days = 30, msg = null) {
  current = () => showTeacher(days, msg);
  setNav([[t('logout'), 'teacherLogout']]);
  h(`<div class="spin">${t('loading')}</div>`);
  let s;
  try { s = await rpc('matte_teacher_stats', { p_token: state.teacher, p_days: days }); } catch (e) {
    if (isLoggedOutErr(e)) { state.teacher = null; store.del('matte.teacher'); return showAuth('teacher', { type: 'err', text: errText(e) }); }
    h(''); return showError(e);
  }
  const L = state.lang;
  const tot = s.kids.reduce((a, k) => ({ n: a.n + k.answers, c: a.c + k.correct, q: a.q + k.quizzes }), { n: 0, c: 0, q: 0 });
  const cell = (c, n) => (n ? `<b style="color:${barColor(c / n)}">${pct(c, n)} %</b> <span class="muted small">(${n})</span>` : '–');
  const weakest = (topics) => { const x = (topics || []).filter((y) => y.n >= 3).sort((a, b) => a.c / a.n - b.c / b.n)[0]; return x ? `${TOPICS[x.topic]?.icon || ''} ${TOPICS[x.topic]?.[L] || esc(x.topic)} (${pct(x.c, x.n)} %)` : '–'; };
  h(`<h1>👩‍🏫 ${t('stats')}</h1>
    <div class="row"><b>${t('period')}:</b><div class="chips" id="per">${[7, 30, 90].map((d) => `<button class="chip ${d === days ? 'on' : ''}" data-d="${d}">${t('daysN', d)}</button>`).join('')}</div></div>
    ${msg ? `<div class="notice ${msg.type}" style="margin-top:14px">${esc(msg.text)}</div>` : ''}
    ${s.kids.length ? `
    <div class="kpis">
      <div class="kpi"><span class="v">${s.kids.length}</span><span class="l">${t('students')}</span></div>
      <div class="kpi"><span class="v">${tot.q}</span><span class="l">${t('totalQuizzes')}</span></div>
      <div class="kpi"><span class="v">${tot.n}</span><span class="l">${t('totalAnswers')}</span></div>
      <div class="kpi"><span class="v">${pct(tot.c, tot.n)} %</span><span class="l">${t('accuracy')}</span></div>
    </div>
    <div class="card section" style="overflow-x:auto"><h3>${t('students')}</h3><table class="list">
      <tr><th>${t('student')}</th><th>${t('totalQuizzes')}</th><th>${t('totalAnswers')}</th><th>${SUBJECTS.math.icon} ${SUBJECTS.math[L]}</th><th>${SUBJECTS.science.icon} ${SUBJECTS.science[L]}</th><th>${t('weakest')}</th><th>${t('lastActive')}</th></tr>
      ${s.kids.map((k) => `<tr><td><b>${esc(k.name)}</b></td><td>${k.quizzes}</td><td>${k.answers}</td><td>${cell(k.math_c, k.math_n)}</td><td>${cell(k.sci_c, k.sci_n)}</td><td>${weakest(k.topics)}</td><td>${k.last ? fmtDate(k.last) : '–'}</td></tr>`).join('')}
    </table></div>
    ${subjectTopicCards(s.topics)}
    <div class="card section"><h3>${t('last14')}</h3>${dayBars(s.days, s.today)}</div>`
    : `<div class="card section">${t('noStudents')}</div>`}
    <div class="card section"><h3>🔑 ${t('resetTitle')}</h3>
      <form class="row" id="resetForm" style="align-items:flex-end">
        <div style="flex:1;min-width:160px"><label for="rn">${t('name')}</label><input id="rn" required maxlength="16"></div>
        <div style="flex:1;min-width:160px"><label for="rp">${t('newPassword')}</label><input id="rp" required minlength="4" maxlength="64" autocomplete="new-password"></div>
        <button class="btn orange" type="submit">${t('resetBtn')}</button>
      </form></div>`);
  app.querySelectorAll('#per button').forEach((b) => (b.onclick = () => showTeacher(Number(b.dataset.d))));
  $('#resetForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = $('#rn').value.trim();
    try {
      await rpc('teacher_reset_password', { p_token: state.teacher, p_name: name, p_new: $('#rp').value });
      showTeacher(days, { type: 'ok', text: t('resetDone', name) });
    } catch (err) {
      if (isLoggedOutErr(err)) return navActions.teacherLogout();
      showTeacher(days, { type: 'err', text: errText(err) });
    }
  };
}

// ---------- start ----------
setLang(state.lang);
route();
