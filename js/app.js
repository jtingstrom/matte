import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_KEY, QUIZ_LENGTH } from './config.js';
import { STRINGS } from './i18n.js';
import { TOPICS, topicsFor, makeQuiz, optionText, generatorsFor } from './questions.js';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = document.getElementById('app');
const nav = document.getElementById('nav');
const AVATARS = ['🦊', '🐼', '🐯', '🦁', '🐸', '🐙', '🦄', '🐲', '🐧', '🦉', '🐬', '🚀', '⚽', '🎸', '🌟', '🤖'];
const LETTER_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];

// ---------- tillstånd ----------
const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignorera */ } },
};
const state = {
  lang: store.get('matte.lang', (navigator.language || 'sv').startsWith('sv') ? 'sv' : 'en'),
  user: null,
  children: [],
  child: null,
  level: null,
  quiz: null,
  recovery: false,
};
const t = (k, ...a) => { const v = STRINGS[state.lang][k]; return typeof v === 'function' ? v(...a) : v; };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const h = (html) => { app.innerHTML = html; window.scrollTo(0, 0); };
const $ = (sel) => app.querySelector(sel);
const redirectUrl = () => location.origin + location.pathname;

function setLang(l) {
  state.lang = l;
  store.set('matte.lang', l);
  document.documentElement.lang = l;
  document.getElementById('langBtn').textContent = l === 'sv' ? 'EN' : 'SV';
  document.getElementById('brandName').textContent = t('appName');
  document.title = t('appName');
}

document.getElementById('langBtn').onclick = () => { setLang(state.lang === 'sv' ? 'en' : 'sv'); rerender(); };
document.getElementById('brand').onclick = (e) => { e.preventDefault(); if (!state.quiz) route(); };

let current = () => {};
function rerender() { current(); }

function setNav(items) {
  nav.innerHTML = items.map(([label, id]) => `<button class="navbtn" data-nav="${id}">${label}</button>`).join('');
  nav.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => navActions[b.dataset.nav]()));
}
const navActions = {
  profiles: () => { state.child = null; route(); },
  stats: () => showStats(state.child?.id || state.children[0]?.id),
  logout: async () => { await sb.auth.signOut(); },
};
const parentNav = () => setNav([[t('profiles'), 'profiles'], [t('stats'), 'stats'], [t('logout'), 'logout']]);

function showError(e) {
  console.error(e);
  const el = document.createElement('div');
  el.className = 'notice err';
  el.style.marginBottom = '14px';
  el.textContent = `${t('error')} ${e?.message || e}`;
  app.prepend(el);
}

// ---------- routing ----------
async function route() {
  if (state.recovery) return showRecovery();
  if (!state.user) return showAuth();
  if (!state.child) return showProfiles();
  return showChildHome();
}

sb.auth.onAuthStateChange((event, session) => {
  const prev = state.user?.id;
  state.user = session?.user || null;
  if (event === 'PASSWORD_RECOVERY') state.recovery = true;
  if (event === 'SIGNED_OUT') { state.children = []; state.child = null; state.quiz = null; }
  if (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT' || event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && prev !== state.user?.id)) {
    setTimeout(route, 0);
  }
});

// ---------- inloggning ----------
function showAuth(tab = 'login', msg = null) {
  current = () => showAuth(tab, msg);
  setNav([]);
  const forgot = tab === 'forgot';
  h(`<div class="hero"><h1>${t('appName')}</h1><p class="muted">${t('tagline')}</p></div>
  <div class="card center">
    ${forgot ? '' : `<div class="tabs"><button data-tab="login" class="${tab === 'login' ? 'on' : ''}">${t('login')}</button><button data-tab="register" class="${tab === 'register' ? 'on' : ''}">${t('register')}</button></div>`}
    <form class="stack" id="authForm">
      ${msg ? `<div class="notice ${msg.type}">${esc(msg.text)}</div>` : ''}
      <div><label for="email">${t('email')}</label><input id="email" type="email" autocomplete="email" required></div>
      ${forgot ? '' : `<div><label for="pw">${t('password')}</label><input id="pw" type="password" minlength="6" autocomplete="${tab === 'register' ? 'new-password' : 'current-password'}" required></div>`}
      <button class="btn big" style="width:100%" type="submit">${forgot ? t('sendReset') : tab === 'login' ? t('login') : t('register')}</button>
      <div class="row small">
        ${forgot ? `<button type="button" class="linkbtn" data-tab="login">${t('back')}</button>` : tab === 'login' ? `<button type="button" class="linkbtn" data-tab="forgot">${t('forgot')}</button>` : `<span class="muted">${t('parentNote')}</span>`}
      </div>
    </form>
  </div>`);
  app.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => showAuth(b.dataset.tab)));
  $('#authForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.submitter; btn.disabled = true;
    const email = $('#email').value.trim(), pw = $('#pw')?.value;
    try {
      if (forgot) {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
        if (error) throw error;
        showAuth('login', { type: 'ok', text: t('resetSent') });
      } else if (tab === 'register') {
        const { data, error } = await sb.auth.signUp({ email, password: pw, options: { emailRedirectTo: redirectUrl() } });
        if (error) throw error;
        if (!data.session) showAuth('login', { type: 'ok', text: t('confirmSent') });
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      }
    } catch (err) {
      showAuth(tab, { type: 'err', text: err.message });
    }
  };
}

function showRecovery(msg = null) {
  current = () => showRecovery(msg);
  setNav([]);
  h(`<div class="card center"><h2>${t('newPassword')}</h2>
    <form class="stack" id="recForm">${msg ? `<div class="notice ${msg.type}">${esc(msg.text)}</div>` : ''}
      <div><label for="pw">${t('newPassword')}</label><input id="pw" type="password" minlength="6" autocomplete="new-password" required></div>
      <button class="btn big" type="submit">${t('savePassword')}</button></form></div>`);
  $('#recForm').onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await sb.auth.updateUser({ password: $('#pw').value });
    if (error) return showRecovery({ type: 'err', text: error.message });
    state.recovery = false;
    history.replaceState(null, '', redirectUrl());
    route();
  };
}

// ---------- profiler ----------
async function loadChildren() {
  const { data, error } = await sb.from('matte_children').select('*').order('created_at');
  if (error) throw error;
  state.children = data;
  return data;
}

async function showProfiles() {
  current = showProfiles;
  parentNav();
  h(`<div class="spin">${t('loading')}</div>`);
  try { await loadChildren(); } catch (e) { h(''); return showError(e); }
  h(`<div class="hero"><h1>${t('whoPlays')}</h1>${state.children.length ? '' : `<p class="muted">${t('noChildren')}</p>`}</div>
    <div class="kids">
      ${state.children.map((c) => `<div class="kid" role="button" tabindex="0" data-id="${c.id}">
        <button class="edit" data-edit="${c.id}" aria-label="${t('editChild')}">✏️</button>
        <span class="av">${esc(c.avatar)}</span><span class="nm">${esc(c.name)}</span><span class="gr">${t('gradeN', c.grade)}</span></div>`).join('')}
      <button class="kid add" id="addKid"><span class="av">➕</span><span class="nm">${t('addChild')}</span></button>
    </div>`);
  app.querySelectorAll('.kid[data-id]').forEach((el) => {
    const pick = () => selectChild(el.dataset.id);
    el.onclick = (e) => { if (!e.target.closest('[data-edit]')) pick(); };
    el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } };
  });
  app.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => showChildForm(state.children.find((c) => c.id === b.dataset.edit))));
  $('#addKid').onclick = () => showChildForm(null);
}

function selectChild(id) {
  state.child = state.children.find((c) => c.id === id);
  state.level = state.child.grade;
  if (state.child.lang !== state.lang) setLang(state.child.lang);
  route();
}

function showChildForm(child) {
  current = () => showChildForm(child);
  parentNav();
  const f = { name: child?.name || '', grade: child?.grade || 4, avatar: child?.avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)], lang: child?.lang || state.lang };
  h(`<div class="card center"><h2>${child ? t('editChild') : t('addChild')}</h2>
    <form class="stack" id="kidForm">
      <div><label for="nm">${t('name')}</label><input id="nm" maxlength="40" required value="${esc(f.name)}"></div>
      <div><label>${t('grade')}</label><div class="chips" id="grades">${[4, 5, 6, 7].map((g) => `<button type="button" class="chip ${g === f.grade ? 'on' : ''}" data-g="${g}">${g}</button>`).join('')}</div></div>
      <div><label>${t('avatar')}</label><div class="avatars" id="avs">${AVATARS.map((a) => `<button type="button" class="${a === f.avatar ? 'on' : ''}" data-a="${a}">${a}</button>`).join('')}</div></div>
      <div><label>${t('language')}</label><div class="chips" id="langs"><button type="button" class="chip ${f.lang === 'sv' ? 'on' : ''}" data-l="sv">Svenska</button><button type="button" class="chip ${f.lang === 'en' ? 'on' : ''}" data-l="en">English</button></div></div>
      <div class="row"><button class="btn green" type="submit">${t('save')}</button><button class="btn secondary" type="button" id="cancel">${t('cancel')}</button>
      <span class="spacer"></span>${child ? `<button class="btn danger" type="button" id="del">${t('delete')}</button>` : ''}</div>
    </form></div>`);
  const sel = (wrap, attr, key, conv = (x) => x) => app.querySelectorAll(`#${wrap} button`).forEach((b) => (b.onclick = () => {
    f[key] = conv(b.dataset[attr]);
    app.querySelectorAll(`#${wrap} button`).forEach((x) => x.classList.toggle('on', x === b));
  }));
  sel('grades', 'g', 'grade', Number); sel('avs', 'a', 'avatar'); sel('langs', 'l', 'lang');
  $('#cancel').onclick = () => route();
  if (child) $('#del').onclick = async () => {
    if (!confirm(t('confirmDelete', child.name))) return;
    const { error } = await sb.from('matte_children').delete().eq('id', child.id);
    if (error) return showError(error);
    route();
  };
  $('#kidForm').onsubmit = async (e) => {
    e.preventDefault();
    const row = { name: $('#nm').value.trim(), grade: f.grade, avatar: f.avatar, lang: f.lang };
    if (!row.name) return;
    const q = child ? sb.from('matte_children').update(row).eq('id', child.id) : sb.from('matte_children').insert(row);
    const { error } = await q;
    if (error) return showError(error);
    state.child = null;
    route();
  };
}

// ---------- barnets startsida ----------
function showChildHome() {
  current = showChildHome;
  setNav([[t('profiles'), 'profiles'], [t('stats'), 'stats']]);
  const c = state.child, g = state.level;
  const topics = topicsFor(g);
  h(`<div class="welcome"><span class="av">${esc(c.avatar)}</span><div><h1>${t('hi', esc(c.name))}</h1><span id="streak" class="muted"></span></div>
      <span class="spacer"></span><div><label>${t('level')}</label><div class="chips" id="lvl">${[4, 5, 6, 7].map((x) => `<button class="chip ${x === g ? 'on' : ''}" data-g="${x}">${x}</button>`).join('')}</div></div></div>
    <div class="modes">
      <button class="mode" style="background:var(--blue)" id="mixed"><span class="ic">🎯</span><b>${t('mixed')}</b><span>${t('mixedDesc', QUIZ_LENGTH)}</span></button>
      <button class="mode" style="background:var(--purple)" id="weak"><span class="ic">💪</span><b>${t('weak')}</b><span>${t('weakDesc')}</span></button>
    </div>
    <h2>${t('topicTitle')}</h2>
    <div class="topics">${topics.map((k) => `<button class="topic" data-topic="${k}"><span class="ic">${TOPICS[k].icon}</span>${TOPICS[k][state.lang]}</button>`).join('')}</div>`);
  app.querySelectorAll('#lvl button').forEach((b) => (b.onclick = () => { state.level = Number(b.dataset.g); showChildHome(); }));
  $('#mixed').onclick = () => startQuiz('quiz');
  $('#weak').onclick = () => startQuiz('weak');
  app.querySelectorAll('[data-topic]').forEach((b) => (b.onclick = () => startQuiz('topic', b.dataset.topic)));
  loadStreak();
}

async function loadStreak() {
  const { data } = await sb.from('matte_answers').select('created_at').eq('child_id', state.child.id).order('created_at', { ascending: false }).limit(1000);
  if (!data?.length) return;
  const days = new Set(data.map((a) => new Date(a.created_at).toLocaleDateString('sv-SE')));
  let n = 0; const d = new Date();
  if (!days.has(d.toLocaleDateString('sv-SE'))) d.setDate(d.getDate() - 1);
  while (days.has(d.toLocaleDateString('sv-SE'))) { n++; d.setDate(d.getDate() - 1); }
  const el = document.getElementById('streak');
  if (el && n > 0) el.textContent = t('streak', n);
}

async function weakWeights(grade) {
  const { data } = await sb.from('matte_answers').select('gen_id, correct').eq('child_id', state.child.id).eq('grade', grade).order('created_at', { ascending: false }).limit(800);
  const agg = {};
  for (const a of data || []) { const x = (agg[a.gen_id] ||= { n: 0, w: 0 }); x.n++; if (!a.correct) x.w++; }
  const weights = {};
  for (const gn of generatorsFor(grade)) {
    const x = agg[gn.id];
    weights[gn.id] = x ? 1 + Math.round(8 * (x.w / x.n)) : 2; // osedda uppgifter får lite extra vikt
  }
  return weights;
}

// ---------- quiz ----------
async function startQuiz(mode, topic = null) {
  const grade = state.level;
  h(`<div class="spin">${t('loading')}</div>`);
  let weights = null;
  if (mode === 'weak') { try { weights = await weakWeights(grade); } catch { weights = null; } }
  const questions = makeQuiz(grade, { count: QUIZ_LENGTH, topic, weights });
  state.quiz = { mode, topic, grade, questions, i: 0, answers: [], sessionId: null, saveFailed: false, shownAt: 0 };
  const { data, error } = await sb.from('matte_sessions').insert({ child_id: state.child.id, grade, lang: state.lang, mode }).select('id').single();
  if (error) { state.quiz.saveFailed = true; console.error(error); } else state.quiz.sessionId = data.id;
  showQuestion();
}

function showQuestion() {
  const Q = state.quiz; if (!Q) return route();
  current = () => showQuestion(true);
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
      ${q.visual ? `<div class="visual">${q.visual}</div>` : ''}
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
  const Q = state.quiz, q = Q.questions[Q.i];
  if (Q.answers[Q.i] !== undefined) return;
  const ms = Math.round(performance.now() - Q.shownAt);
  Q.answers[Q.i] = k;
  showQuestion();
  if (!Q.sessionId) return;
  const { error } = await sb.from('matte_answers').insert({
    child_id: state.child.id, session_id: Q.sessionId, gen_id: q.genId, topic: q.topic, grade: q.grade, correct: k === q.correct, time_ms: Math.min(ms, 3600000),
  });
  if (error) { console.error(error); if (!Q.saveFailed) { Q.saveFailed = true; if (state.quiz === Q && Q.answers[Q.i] !== undefined) showQuestion(); } }
}

async function finishQuiz(quit = false) {
  const Q = state.quiz; if (!Q) return;
  const answered = Q.answers.filter((a) => a !== undefined).length;
  const correct = Q.questions.filter((q, i) => Q.answers[i] === q.correct).length;
  if (Q.sessionId) {
    await sb.from('matte_sessions').update({ total: answered, correct, finished_at: new Date().toISOString() }).eq('id', Q.sessionId);
  }
  state.quiz = null;
  if (quit) return route();
  showResult(Q, correct);
}

function showResult(Q, correct) {
  current = () => showResult(Q, correct);
  setNav([[t('profiles'), 'profiles'], [t('stats'), 'stats']]);
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
          <p>${q.q[L]}</p>${q.visual ? `<div class="visual">${q.visual}</div>` : ''}
          <p><b>${t('yourAnswer')}:</b> ${esc(optionText(q.options[Q.answers[i]], q.unit, L))}${ok ? '' : ` · <b>${t('rightAnswer')}</b> ${esc(optionText(q.options[q.correct], q.unit, L))}`}</p>
          <p class="muted">${q.ex[L]}</p></div></details>`;
      }).join('')}</div></div>`);
  $('#again').onclick = () => startQuiz(Q.mode, Q.topic);
  $('#home').onclick = () => route();
}

// ---------- statistik ----------
async function showStats(childId) {
  current = () => showStats(childId);
  parentNav();
  h(`<div class="spin">${t('loading')}</div>`);
  try {
    if (!state.children.length) await loadChildren();
    if (!childId) childId = state.children[0]?.id;
    if (!childId) { h(`<div class="card center">${t('noChildren')}</div>`); return; }
    const since = new Date(Date.now() - 90 * 864e5).toISOString();
    const [ans, ses] = await Promise.all([
      sb.from('matte_answers').select('topic, correct, created_at').eq('child_id', childId).gte('created_at', since).order('created_at', { ascending: false }).limit(5000),
      sb.from('matte_sessions').select('*').eq('child_id', childId).order('started_at', { ascending: false }).limit(20),
    ]);
    if (ans.error) throw ans.error;
    if (ses.error) throw ses.error;
    renderStats(childId, ans.data, ses.data);
  } catch (e) { h(''); showError(e); }
}

function renderStats(childId, answers, sessions) {
  const L = state.lang, child = state.children.find((c) => c.id === childId);
  const tabs = `<div class="chips" style="margin:14px 0">${state.children.map((c) => `<button class="chip ${c.id === childId ? 'on' : ''}" data-c="${c.id}">${esc(c.avatar)} ${esc(c.name)}</button>`).join('')}</div>`;
  const bind = () => app.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => showStats(b.dataset.c)));
  if (!answers.length) { h(`<h1>${t('stats')}</h1>${tabs}<div class="card">${t('noData')}</div>`); return bind(); }
  const nCorrect = answers.filter((a) => a.correct).length;
  const dayKey = (d) => new Date(d).toLocaleDateString('sv-SE');
  const perDay = {};
  answers.forEach((a) => { perDay[dayKey(a.created_at)] = (perDay[dayKey(a.created_at)] || 0) + 1; });
  const byTopic = {};
  answers.forEach((a) => { const x = (byTopic[a.topic] ||= { n: 0, c: 0 }); x.n++; if (a.correct) x.c++; });
  const topicRows = Object.entries(byTopic).sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n);
  const color = (p) => (p >= 0.8 ? 'var(--green)' : p >= 0.5 ? 'var(--orange)' : 'var(--red)');
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return d; });
  const maxDay = Math.max(1, ...days.map((d) => perDay[dayKey(d)] || 0));
  const fmtDate = (d) => new Date(d).toLocaleDateString(L === 'sv' ? 'sv-SE' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  h(`<h1>${t('stats')}: ${esc(child?.avatar || '')} ${esc(child?.name || '')}</h1>${tabs}
    <p class="muted small">90 ${L === 'sv' ? 'dagar' : 'days'}</p>
    <div class="kpis">
      <div class="kpi"><span class="v">${sessions.filter((s) => s.finished_at).length}${sessions.length === 20 ? '+' : ''}</span><span class="l">${t('totalQuizzes')}</span></div>
      <div class="kpi"><span class="v">${answers.length}</span><span class="l">${t('totalAnswers')}</span></div>
      <div class="kpi"><span class="v">${Math.round((nCorrect / answers.length) * 100)} %</span><span class="l">${t('accuracy')}</span></div>
      <div class="kpi"><span class="v">${Object.keys(perDay).length}</span><span class="l">${t('activeDays')}</span></div>
    </div>
    <div class="card section"><h3>${t('byTopic')}</h3><div class="bars">
      ${topicRows.map(([k, x]) => { const p = x.c / x.n; return `<div class="bar"><span>${TOPICS[k]?.icon || ''} ${TOPICS[k]?.[L] || k}</span><div class="track"><div class="fill" style="width:${p * 100}%;background:${color(p)}"></div></div><span class="pct">${Math.round(p * 100)} % <span class="muted small">(${x.n})</span></span></div>`; }).join('')}
    </div></div>
    <div class="card section"><h3>${t('last14')}</h3><div class="days">
      ${days.map((d) => { const v = perDay[dayKey(d)] || 0; return `<div class="d" title="${dayKey(d)}: ${v}"><span>${v || ''}</span><div class="col ${v ? '' : 'zero'}" style="height:${(v / maxDay) * 100}%"></div><span>${d.getDate()}</span></div>`; }).join('')}
    </div></div>
    <div class="card section"><h3>${t('recent')}</h3><table class="list"><tr><th>${t('date')}</th><th>${t('mode')}</th><th>${t('grade')}</th><th>${t('result')}</th></tr>
      ${sessions.filter((s) => s.total > 0).map((s) => `<tr><td>${fmtDate(s.started_at)}</td><td>${t('modes')[s.mode] || s.mode}</td><td>${s.grade}</td><td><b>${s.correct}/${s.total}</b></td></tr>`).join('')}
    </table></div>`);
  bind();
}

// ---------- start ----------
setLang(state.lang);
h(`<div class="spin">${t('loading')}</div>`);
