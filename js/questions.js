// Uppgiftsgeneratorer i olympiadstil för åk 4–7.
// Varje generator skapar en ny variant med slumpade tal. Svaret räknas fram i koden.

export const SUBJECTS = {
  math: { sv: 'Matte', en: 'Maths', icon: '🧮', color: 'var(--blue)' },
  science: { sv: 'NO', en: 'Science', icon: '🔬', color: 'var(--green)' },
};

// Områden. Matteområden har subject 'math', NO-områden läggs till i science.js.
export const TOPICS = {
  arithmetic: { sv: 'Räkning', en: 'Arithmetic', icon: '🔢' },
  logic: { sv: 'Logik', en: 'Logic', icon: '🧩' },
  equations: { sv: 'Ekvationer', en: 'Equations', icon: '⚖️' },
  geometry: { sv: 'Geometri', en: 'Geometry', icon: '📐' },
  fractions: { sv: 'Bråk & procent', en: 'Fractions & percent', icon: '🍕' },
  patterns: { sv: 'Mönster', en: 'Patterns', icon: '🔁' },
  word: { sv: 'Problemlösning', en: 'Word problems', icon: '💬' },
  negative: { sv: 'Negativa tal', en: 'Negative numbers', icon: '➖' },
  probability: { sv: 'Sannolikhet', en: 'Probability', icon: '🎲' },
  time: { sv: 'Tid & datum', en: 'Time & dates', icon: '⏰' },
};

// ---------- hjälpfunktioner ----------
export function rng(seed) {
  let a = seed === undefined ? (Math.random() * 2 ** 32) >>> 0 : seed >>> 0;
  const next = () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle: (arr) => {
      const b = [...arr];
      for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
      return b;
    },
  };
}

export const L = (sv, en) => ({ sv, en });
export const N = (n) => (n < 0 ? '−' + -n : String(n));
const P = (n) => (n < 0 ? `(${N(n)})` : N(n)); // negativa tal inom parentes
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => (a * b) / gcd(a, b);
const frac = (p, q) => { const d = gcd(p, q); return q / d === 1 ? String(p / d) : `${p / d}/${q / d}`; };
const pad = (n) => String(n).padStart(2, '0');
const clock = (min) => { const m = ((min % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
const svGen = (n) => (/[sxz]$/i.test(n) ? n : n + 's');

const NAMES = ['Ella', 'Leo', 'Maja', 'Omar', 'Alva', 'Noah', 'Saga', 'Elias', 'Wilma', 'Liam', 'Ines', 'Hugo', 'Sara', 'Adam', 'Nora', 'Ali'];
const WEEKDAYS = [
  L('måndag', 'Monday'), L('tisdag', 'Tuesday'), L('onsdag', 'Wednesday'), L('torsdag', 'Thursday'),
  L('fredag', 'Friday'), L('lördag', 'Saturday'), L('söndag', 'Sunday'),
];
export const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'];

export const GENERATORS = [];
export function define(id, topic, grades, make, subject = 'math') { GENERATORS.push({ id, topic, grades, make, subject }); }
const def = (id, topic, grades, make) => define(id, topic, grades, make, 'math');

// Bygger fyra unika svarsalternativ. Värden kan vara tal, strängar eller {sv,en}.
const keyOf = (v) => (typeof v === 'object' ? v.sv : typeof v === 'number' ? N(v) : String(v));
function buildOptions(r, ans, wrong) {
  const key = keyOf(ans);
  const seen = new Set([key]);
  const out = [ans];
  const ok = (w) => {
    if (w === undefined || w === null) return false;
    if (typeof w === 'number') {
      if (!Number.isFinite(w)) return false;
      if (typeof ans === 'number' && Number.isInteger(ans) && !Number.isInteger(w)) return false;
      if (typeof ans === 'number' && ans >= 0 && w < 0) return false;
    }
    return !seen.has(keyOf(w));
  };
  for (const w of wrong) {
    if (out.length >= 4) break;
    if (ok(w)) { seen.add(keyOf(w)); out.push(w); }
  }
  if (typeof ans === 'number') {
    const step = Math.abs(ans) >= 100 ? 10 : 1;
    for (let k = 1; out.length < 4 && k < 50; k++) {
      for (const c of r.shuffle([ans + k * step, ans - k * step])) {
        if (out.length < 4 && ok(c)) { seen.add(keyOf(c)); out.push(c); }
      }
    }
  }
  if (out.length < 4) throw new Error('too few options');
  const order = r.shuffle([0, 1, 2, 3]);
  return { options: order.map((i) => out[i]), correct: order.indexOf(0) };
}

// ---------- visuella hjälpare ----------
const box = (content, color, extra = '') =>
  `<span class="vbox" style="background:${color}${extra}">${content}</span>`;

function chainSvg(start, ops, showStart, result) {
  // HTML-flöde: [start] --(+5)--> [ ] --(×3)--> [?]
  let h = '<div class="chain">';
  h += `<span class="node ${showStart ? '' : 'q'}">${showStart ? N(start) : '?'}</span>`;
  ops.forEach(([op, v], i) => {
    h += `<span class="arrow" style="--c:${COLORS[i % COLORS.length]}"><b>${op}${v}</b></span>`;
    const last = i === ops.length - 1;
    if (last) h += `<span class="node ${showStart ? 'q' : ''}">${showStart ? '?' : N(result)}</span>`;
    else h += '<span class="node empty"></span>';
  });
  return h + '</div>';
}

function rectSvg(w, h, labelW, labelH) {
  const s = Math.min(220 / w, 130 / h);
  const W = w * s, H = h * s;
  return `<svg viewBox="0 0 ${W + 90} ${H + 60}" class="fig" role="img">
    <rect x="45" y="20" width="${W}" height="${H}" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="3"/>
    <text x="${45 + W / 2}" y="${H + 48}" text-anchor="middle">${labelW}</text>
    <text x="38" y="${20 + H / 2 + 5}" text-anchor="end">${labelH}</text></svg>`;
}

function triangleSvg(A, B, labels) {
  // basen från (0,0) till (1,0), vinkel A vid vänster, B vid höger
  const a = (A * Math.PI) / 180, b = (B * Math.PI) / 180;
  const x = Math.tan(b) / (Math.tan(a) + Math.tan(b));
  const y = x * Math.tan(a);
  const pts = [[0, 0], [1, 0], [x, y]];
  const maxY = Math.max(y, 0.01);
  const minX = Math.min(0, x), maxX = Math.max(1, x);
  const s = Math.min(240 / (maxX - minX), 170 / maxY);
  const W = 300, H = maxY * s + 40;
  const offX = (W - (maxX - minX) * s) / 2;
  const T = ([px, py]) => [offX + (px - minX) * s, 20 + (maxY - py) * s];
  const P2 = pts.map(T);
  // placera varje etikett en bit in mot triangelns tyngdpunkt
  const cx = (P2[0][0] + P2[1][0] + P2[2][0]) / 3, cy = (P2[0][1] + P2[1][1] + P2[2][1]) / 3;
  const lab = (p, text) => {
    const dx = cx - p[0], dy = cy - p[1], len = Math.hypot(dx, dy) || 1, d = Math.min(38, len * 0.6);
    return `<text x="${p[0] + (dx / len) * d}" y="${p[1] + (dy / len) * d + 6}" text-anchor="middle">${text}</text>`;
  };
  return `<svg viewBox="0 0 ${W} ${H}" class="fig" role="img">
    <polygon points="${P2.map((p) => p.join(',')).join(' ')}" fill="#dcfce7" stroke="#22c55e" stroke-width="3"/>
    ${labels.map((l, i) => (l ? lab(P2[i], l) : '')).join('')}</svg>`;
}

function gridSvg(rows, cols, shadedSet) {
  const c = 36;
  let cells = '';
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const on = shadedSet.has(i * cols + j);
    cells += `<rect x="${4 + j * c}" y="${4 + i * c}" width="${c}" height="${c}" fill="${on ? '#f59e0b' : '#fff'}" stroke="#334155" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 ${cols * c + 8} ${rows * c + 8}" class="fig small" role="img">${cells}</svg>`;
}

function isoBox(l, w, h) {
  // isometrisk låda av l×w×h små kuber
  const u = Math.min(26, 150 / (l + w + h) * 1.4);
  const cx = Math.cos(Math.PI / 6) * u, cy = Math.sin(Math.PI / 6) * u;
  const ox = w * cx + 10, oy = h * u + 10;
  const p = (x, y, z) => [ox + (x - y) * cx, oy + (x + y) * cy - z * u];
  const poly = (pts, fill) => `<polygon points="${pts.map((q) => q.join(',')).join(' ')}" fill="${fill}" stroke="#1e293b" stroke-width="1.2"/>`;
  let s = '';
  // toppen (z=h)
  for (let i = 0; i < l; i++) for (let j = 0; j < w; j++)
    s += poly([p(i, j, h), p(i + 1, j, h), p(i + 1, j + 1, h), p(i, j + 1, h)], '#93c5fd');
  // framsida x (y = w)
  for (let i = 0; i < l; i++) for (let k = 0; k < h; k++)
    s += poly([p(i, w, k), p(i + 1, w, k), p(i + 1, w, k + 1), p(i, w, k + 1)], '#3b82f6');
  // sida (x = l)
  for (let j = 0; j < w; j++) for (let k = 0; k < h; k++)
    s += poly([p(l, j, k), p(l, j + 1, k), p(l, j + 1, k + 1), p(l, j, k + 1)], '#1d4ed8');
  const W = (l + w) * cx + 20, H = (l + w) * cy + h * u + 20;
  return `<svg viewBox="0 0 ${W} ${H}" class="fig" role="img">${s}</svg>`;
}

function clockSvg(h, m) {
  const ang = (deg) => ((deg - 90) * Math.PI) / 180;
  const hd = (h % 12) * 30 + m * 0.5, md = m * 6;
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = ang(i * 30);
    ticks += `<line x1="${70 + 52 * Math.cos(a)}" y1="${70 + 52 * Math.sin(a)}" x2="${70 + 60 * Math.cos(a)}" y2="${70 + 60 * Math.sin(a)}" stroke="#334155" stroke-width="3"/>`;
  }
  return `<svg viewBox="0 0 140 140" class="fig small" role="img">
    <circle cx="70" cy="70" r="64" fill="#fff" stroke="#334155" stroke-width="4"/>${ticks}
    <line x1="70" y1="70" x2="${70 + 32 * Math.cos(ang(hd))}" y2="${70 + 32 * Math.sin(ang(hd))}" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
    <line x1="70" y1="70" x2="${70 + 50 * Math.cos(ang(md))}" y2="${70 + 50 * Math.sin(ang(md))}" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
    <circle cx="70" cy="70" r="5" fill="#1e293b"/></svg>`;
}

// ---------- generatorer ----------

def('ages', 'word', [4, 5, 6], (r, g) => {
  const n = r.pick(NAMES);
  const d = r.int(2, g >= 6 ? 12 : 7);
  const cat = r.int(d + 2, g >= 6 ? 25 : 15);
  const dog = cat - d, s = cat + dog;
  return {
    q: L(`${svGen(n)} hund är ${d} år yngre än ${svGen(n)} katt. Tillsammans är djuren ${s} år gamla. Hur gammal är katten?`,
      `${n}'s dog is ${d} years younger than ${n}'s cat. Together the pets are ${s} years old. How old is the cat?`),
    ans: cat, wrong: [dog, cat + d, Math.floor(s / 2), cat + 1, cat - 1], unit: L('år', 'years'),
    ex: L(`Om hunden vore lika gammal som katten skulle summan bli ${s} + ${d} = ${s + d}. Katten är alltså ${s + d} ÷ 2 = ${cat} år (och hunden ${dog} år).`,
      `If the dog were as old as the cat, the sum would be ${s} + ${d} = ${s + d}. So the cat is ${s + d} ÷ 2 = ${cat} years old (and the dog is ${dog}).`),
  };
});

def('taxi', 'word', [5, 6, 7], (r) => {
  const x = r.int(3, 12), p2 = r.int(8, 15), diff = r.int(2, 6), p1 = p2 + diff;
  const a1 = r.int(3, 8) * 5, a2 = a1 + x * diff, T = a1 + p1 * x;
  return {
    q: L(`Taxi Röd kostar ${a1} kr i startavgift och ${p1} kr per kilometer. Taxi Blå kostar ${a2} kr i startavgift och ${p2} kr per kilometer. Två kompisar åker lika långt i var sin taxi och betalar exakt lika mycket. Hur lång var resan?`,
      `Taxi Red charges ${a1} kr to start and ${p1} kr per kilometre. Taxi Blue charges ${a2} kr to start and ${p2} kr per kilometre. Two friends ride the same distance in different taxis and pay exactly the same. How long was the ride?`),
    ans: x, wrong: [x + 1, x - 1, x + 2, a2 - a1], unit: L('km', 'km'),
    ex: L(`Taxi Blå har ${a2 - a1} kr högre startavgift, men Taxi Röd tar ${diff} kr mer per km. Röd har kommit ikapp efter ${a2 - a1} ÷ ${diff} = ${x} km. Kontroll: ${a1} + ${p1} × ${x} = ${T} och ${a2} + ${p2} × ${x} = ${T}.`,
      `Taxi Blue's start fee is ${a2 - a1} kr higher, but Taxi Red charges ${diff} kr more per km. Red catches up after ${a2 - a1} ÷ ${diff} = ${x} km. Check: ${a1} + ${p1} × ${x} = ${T} and ${a2} + ${p2} × ${x} = ${T}.`),
  };
});

def('week', 'arithmetic', [4, 5], (r) => {
  const n = r.pick(NAMES);
  const mon = r.int(40, 150), a = r.int(10, 40), b = r.int(5, 30), c = r.int(5, 30);
  const tue = mon + a, thu = tue - b, sat = thu + c, tot = mon + tue + thu + sat;
  return {
    q: L(`${n} löste ${mon} mattetal på måndagen. På tisdagen löste ${n} ${a} fler än på måndagen. På torsdagen löste ${n} ${b} färre än på tisdagen. På lördagen löste ${n} ${c} fler än på torsdagen. Hur många tal löste ${n} sammanlagt de fyra dagarna?`,
      `${n} solved ${mon} maths problems on Monday. On Tuesday ${n} solved ${a} more than on Monday. On Thursday ${n} solved ${b} fewer than on Tuesday. On Saturday ${n} solved ${c} more than on Thursday. How many problems did ${n} solve in total on these four days?`),
    ans: tot, wrong: [tot + 100, tot - 100, tot + 10, sat],
    ex: L(`Måndag ${mon}, tisdag ${mon} + ${a} = ${tue}, torsdag ${tue} − ${b} = ${thu}, lördag ${thu} + ${c} = ${sat}. Summa: ${mon} + ${tue} + ${thu} + ${sat} = ${tot}.`,
      `Monday ${mon}, Tuesday ${mon} + ${a} = ${tue}, Thursday ${tue} − ${b} = ${thu}, Saturday ${thu} + ${c} = ${sat}. Total: ${mon} + ${tue} + ${thu} + ${sat} = ${tot}.`),
  };
});

def('letters', 'logic', [4, 5, 6], (r, g) => {
  const LET = ['P', 'Q', 'R', 'S'];
  for (let tries = 0; tries < 500; tries++) {
    const nums = [r.int(1000, 3999), r.int(1000, 3999), r.int(1000, 2999)];
    const sum = nums[0] + nums[1] + nums[2];
    if (sum > 9999) continue;
    const cols = r.shuffle([0, 1, 2, 3]);
    const D = nums.map((n) => String(n).split('').map(Number));
    const S = String(sum).split('').map(Number);
    if (D.some((d, i) => cols[i] === 0 && d[0] === 0)) continue;
    let sols = 0, sol = null;
    for (let a = 0; a < 10; a++) for (let b = 0; b < 10; b++) for (let c = 0; c < 10; c++) {
      const vals = [a, b, c];
      if (cols.slice(0, 3).some((col, i) => col === 0 && vals[i] === 0)) continue;
      const ns = D.map((d, i) => { const dd = [...d]; dd[cols[i]] = vals[i]; return +dd.join(''); });
      const ss = String(ns[0] + ns[1] + ns[2]);
      if (ss.length !== 4) continue;
      const sd = ss.split('').map(Number);
      if (sd.every((v, k) => k === cols[3] || v === S[k])) { sols++; sol = [a, b, c, sd[cols[3]]]; }
    }
    if (sols !== 1) continue;
    const [p, q, rr, s] = sol;
    const hard = g >= 6;
    const ans = hard ? p * q + rr + s : p + q + rr + s;
    const row = (digits, col, li) => digits.map((d, k) => (k === col ? box(LET[li], COLORS[li]) : `<span class="dig">${d}</span>`)).join('');
    let v = '<div class="addition">';
    D.forEach((d, i) => { v += `<div class="arow">${i === 2 ? '<span class="plus">+</span>' : '<span class="plus"></span>'}${row(d, cols[i], i)}</div>`; });
    v += `<div class="arow sum"><span class="plus"></span>${row(S, cols[3], 3)}</div></div>`;
    const expr = hard ? 'P × Q + R + S' : 'P + Q + R + S';
    return {
      q: L(`Här har tre fyrsiffriga tal adderats. Några siffror har bytts ut mot bokstäver (varje bokstav är en siffra). Vad är ${expr}?`,
        `Three four-digit numbers have been added. Some digits have been replaced by letters (each letter is one digit). What is ${expr}?`),
      visual: v, ans, wrong: [ans + 1, ans - 1, ans + 2, ans - 2, hard ? p + q + rr + s : ans + 10],
      ex: L(`Räkna kolumn för kolumn från höger och kom ihåg minnessiffrorna. Då får man P = ${p}, Q = ${q}, R = ${rr} och S = ${s} (${nums[0]} + ${nums[1]} + ${nums[2]} = ${sum}). Alltså är ${expr} = ${ans}.`,
        `Work column by column from the right and remember the carries. You get P = ${p}, Q = ${q}, R = ${rr} and S = ${s} (${nums[0]} + ${nums[1]} + ${nums[2]} = ${sum}). So ${expr} = ${ans}.`),
    };
  }
  throw new Error('letters failed');
});

def('chain', 'arithmetic', [4, 5, 6, 7], (r, g) => {
  for (let tries = 0; tries < 200; tries++) {
    const start = r.int(2, 12);
    let x = start;
    const ops = [], steps = [];
    const k = g >= 6 ? 4 : 3;
    let guard = 0;
    while (ops.length < k && guard++ < 50) {
      const t = r.pick(['+', '−', '×', '÷']);
      let v, y;
      if (t === '+') { v = r.int(2, 20); y = x + v; }
      else if (t === '−') { if (x <= 3) continue; v = r.int(1, Math.min(20, x - 1)); y = x - v; }
      else if (t === '×') { if (x > 40) continue; v = r.int(2, 5); y = x * v; }
      else { const ds = [2, 3, 4, 5].filter((d) => x % d === 0 && x / d > 1); if (!ds.length) continue; v = r.pick(ds); y = x / v; }
      if (ops.length && ops[ops.length - 1][0] === t) continue;
      ops.push([t, v]); steps.push(`${x} ${t} ${v} = ${y}`); x = y;
    }
    if (ops.length < k) continue;
    const reverse = g >= 6 && r.next() < 0.5;
    const inv = { '+': '−', '−': '+', '×': '÷', '÷': '×' };
    if (!reverse) {
      return {
        q: L('Följ pilarna och räkna. Vilket tal ska stå i rutan med frågetecken?', 'Follow the arrows and calculate. Which number belongs in the box with the question mark?'),
        visual: chainSvg(start, ops, true, x), ans: x, wrong: [x + ops[ops.length - 1][1], x - 1, x + 1, x + 2],
        ex: L(`Räkna steg för steg: ${steps.join(', ')}.`, `Step by step: ${steps.join(', ')}.`),
      };
    }
    let y = x; const back = [];
    for (let i = ops.length - 1; i >= 0; i--) {
      const [t, v] = ops[i]; const op = inv[t];
      const z = op === '+' ? y + v : op === '−' ? y - v : op === '×' ? y * v : y / v;
      back.push(`${y} ${op} ${v} = ${z}`); y = z;
    }
    return {
      q: L(`Följ pilarna. Vilket tal måste stå i första rutan för att slutresultatet ska bli ${x}?`, `Follow the arrows. Which number must be in the first box for the final result to be ${x}?`),
      visual: chainSvg(start, ops, false, x), ans: start, wrong: [start + 1, start - 1, start + 2, start * 2],
      ex: L(`Räkna baklänges med motsatta räknesätt: ${back.join(', ')}.`, `Work backwards using the opposite operations: ${back.join(', ')}.`),
    };
  }
  throw new Error('chain failed');
});

def('fruits', 'logic', [4, 5, 6, 7], (r, g) => {
  const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9);
  const hard = g >= 6;
  const eq = (lhs, rhs) => `<div class="eqline">${lhs} <span>=</span> <b>${rhs}</b></div>`;
  let v = '<div class="eqs">';
  v += eq('🍎 + 🍎 + 🍎', 3 * a);
  v += eq('🍎 + 🍌 + 🍌', a + 2 * b);
  v += hard ? eq('🍌 × 🍇', b * c) : eq('🍌 + 🍇 + 🍇', b + 2 * c);
  v += eq(hard ? '🍎 + 🍌 × 🍇' : '🍎 + 🍌 + 🍇', '?') + '</div>';
  const ans = hard ? a + b * c : a + b + c;
  const ex = hard
    ? L(`🍎 = ${3 * a} ÷ 3 = ${a}. 🍌 = (${a + 2 * b} − ${a}) ÷ 2 = ${b}. 🍇 = ${b * c} ÷ ${b} = ${c}. Multiplikation först: ${a} + ${b} × ${c} = ${ans}.`,
      `🍎 = ${3 * a} ÷ 3 = ${a}. 🍌 = (${a + 2 * b} − ${a}) ÷ 2 = ${b}. 🍇 = ${b * c} ÷ ${b} = ${c}. Multiply first: ${a} + ${b} × ${c} = ${ans}.`)
    : L(`🍎 = ${3 * a} ÷ 3 = ${a}. 🍌 = (${a + 2 * b} − ${a}) ÷ 2 = ${b}. 🍇 = (${b + 2 * c} − ${b}) ÷ 2 = ${c}. Summa: ${a} + ${b} + ${c} = ${ans}.`,
      `🍎 = ${3 * a} ÷ 3 = ${a}. 🍌 = (${a + 2 * b} − ${a}) ÷ 2 = ${b}. 🍇 = (${b + 2 * c} − ${b}) ÷ 2 = ${c}. Sum: ${a} + ${b} + ${c} = ${ans}.`);
  return {
    q: L('Varje frukt står för ett tal. Vilket tal ska stå på frågetecknets plats?', 'Each fruit stands for a number. Which number replaces the question mark?'),
    visual: v, ans, wrong: hard ? [(a + b) * c, a + b + c, a * b * c, ans + 1] : [ans + 1, ans - 1, a + 2 * b + c, 3 * a + b + c], ex,
  };
});

def('sequence', 'patterns', [4, 5, 6, 7], (r, g) => {
  const types = ['arith', 'geo', 'incr', 'alt'];
  if (g >= 6) types.push('square', 'fib');
  const t = r.pick(types);
  let s = [], nx, wrong, ex;
  if (t === 'arith') {
    const a = r.int(1, 30), d = r.int(2, g >= 6 ? 15 : 9) * (g >= 6 && r.next() < 0.3 ? -1 : 1);
    s = [0, 1, 2, 3, 4].map((i) => a + i * d); nx = a + 5 * d;
    wrong = [nx + d, nx + 1, nx - 1, nx + 2];
    ex = L(`Talen ökar med ${N(d)} varje gång: ${N(s[4])} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${N(nx)}.`, `The numbers change by ${N(d)} each time: ${N(s[4])} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${N(nx)}.`);
  } else if (t === 'geo') {
    const a = r.int(1, 4), q = r.pick(g >= 5 ? [2, 3] : [2]);
    s = [0, 1, 2, 3, 4].map((i) => a * q ** i); nx = a * q ** 5;
    wrong = [s[4] + (s[4] - s[3]), nx + q, nx - q, s[4] * (q + 1)];
    ex = L(`Varje tal är ${q} gånger det förra: ${s[4]} × ${q} = ${nx}.`, `Each number is ${q} times the previous one: ${s[4]} × ${q} = ${nx}.`);
  } else if (t === 'incr') {
    const a = r.int(1, 20), d0 = r.int(1, 3);
    s = [a]; for (let i = 0; i < 4; i++) s.push(s[i] + d0 + i);
    nx = s[4] + d0 + 4;
    wrong = [s[4] + d0 + 3, s[4] + d0 + 5, nx + 2, nx - 2];
    ex = L(`Ökningen växer med 1 varje gång: +${d0}, +${d0 + 1}, +${d0 + 2}, +${d0 + 3}, sedan +${d0 + 4}. ${s[4]} + ${d0 + 4} = ${nx}.`,
      `The step grows by 1 each time: +${d0}, +${d0 + 1}, +${d0 + 2}, +${d0 + 3}, then +${d0 + 4}. ${s[4]} + ${d0 + 4} = ${nx}.`);
  } else if (t === 'alt') {
    const a = r.int(5, 30), p = r.int(4, 12), m = r.int(1, p - 1);
    s = [a, a + p, a + p - m, a + 2 * p - m, a + 2 * p - 2 * m]; nx = s[4] + p;
    wrong = [s[4] - m, s[4] + p - m, nx + 1, nx - 1];
    ex = L(`Mönstret är +${p}, −${m}, +${p}, −${m}, … Nästa steg är +${p}: ${s[4]} + ${p} = ${nx}.`, `The pattern is +${p}, −${m}, +${p}, −${m}, … The next step is +${p}: ${s[4]} + ${p} = ${nx}.`);
  } else if (t === 'square') {
    const k = r.int(1, 8);
    s = [0, 1, 2, 3, 4].map((i) => (k + i) ** 2); nx = (k + 5) ** 2;
    wrong = [s[4] + (s[4] - s[3]), nx + 1, nx - 1, nx + 2];
    ex = L(`Det är kvadrattal: ${k}², ${k + 1}², … ${k + 4}². Nästa är ${k + 5}² = ${nx}.`, `These are square numbers: ${k}², ${k + 1}², … ${k + 4}². The next is ${k + 5}² = ${nx}.`);
  } else {
    const a = r.int(1, 5), b = r.int(a, 8);
    s = [a, b]; for (let i = 2; i < 5; i++) s.push(s[i - 1] + s[i - 2]);
    nx = s[4] + s[3];
    wrong = [s[4] + (s[4] - s[3]), nx + 1, nx - 1, s[4] * 2];
    ex = L(`Varje tal är summan av de två föregående: ${s[3]} + ${s[4]} = ${nx}.`, `Each number is the sum of the two before it: ${s[3]} + ${s[4]} = ${nx}.`);
  }
  return {
    q: L('Vilket tal kommer härnäst i talföljden?', 'Which number comes next in the sequence?'),
    visual: `<div class="seq">${s.map((x) => `<span>${N(x)}</span>`).join('')}<span class="q">?</span></div>`,
    ans: nx, wrong, ex,
  };
});

def('train', 'time', [4, 5], (r) => {
  const h = r.int(6, 19), m = r.int(0, 11) * 5, dur = r.int(7, 34) * 5;
  const dep = h * 60 + m, arr = dep + dur;
  const wrongMins = dep + Math.floor(dur / 100) * 60 + (dur % 100);
  const hh = Math.floor(dur / 60), mm = dur % 60;
  return {
    q: L(`Ett tåg går ${clock(dep)} och resan tar ${dur} minuter. Hur mycket är klockan när tåget kommer fram?`,
      `A train leaves at ${clock(dep)} and the journey takes ${dur} minutes. What time does the train arrive?`),
    ans: clock(arr), wrong: [clock(wrongMins), clock(arr + 10), clock(arr - 10), clock(arr + 60), clock(arr - 60)],
    ex: L(`${dur} minuter = ${hh} h ${mm} min. ${clock(dep)} + ${hh} h ${mm} min = ${clock(arr)}.`, `${dur} minutes = ${hh} h ${mm} min. ${clock(dep)} + ${hh} h ${mm} min = ${clock(arr)}.`),
  };
});

def('sale', 'fractions', [5, 6, 7], (r, g) => {
  const p = r.int(5, 30) * 20;
  const tax = g >= 6;
  const base = 3 * p, ans = tax ? (base * 5) / 4 : base;
  return {
    q: L(`I en sportbutik är det kampanj: köp en fotboll och få nästa för halva priset. En fotboll kostar ${p} kr. Hur mycket kostar 4 fotbollar${tax ? ' om det dessutom läggs på 25 % moms på det rabatterade priset' : ''}?`,
      `A sports shop has a deal: buy one football and get the next for half price. One football costs ${p} kr. How much do 4 footballs cost${tax ? ' if 25% VAT is then added to the discounted price' : ''}?`),
    ans, unit: L('kr', 'kr'), wrong: tax ? [base, 4 * p, 5 * p, (7 * p) / 2] : [4 * p, 2 * p, (7 * p) / 2, base + p / 2],
    ex: tax
      ? L(`Två fotbollar kostar ${p} + ${p / 2} = ${(3 * p) / 2} kr, så fyra kostar ${base} kr. 25 % moms: ${base} + ${base / 4} = ${ans} kr.`,
        `Two footballs cost ${p} + ${p / 2} = ${(3 * p) / 2} kr, so four cost ${base} kr. 25% VAT: ${base} + ${base / 4} = ${ans} kr.`)
      : L(`Två fotbollar kostar ${p} + ${p / 2} = ${(3 * p) / 2} kr, så fyra kostar 2 × ${(3 * p) / 2} = ${base} kr.`,
        `Two footballs cost ${p} + ${p / 2} = ${(3 * p) / 2} kr, so four cost 2 × ${(3 * p) / 2} = ${base} kr.`),
  };
});

def('rect', 'geometry', [4, 5, 6], (r, g) => {
  let w = r.int(4, 15), h = r.int(2, 11);
  if (w === h) w++;
  const area = w * h, per = 2 * (w + h);
  const v = g >= 5 ? r.pick(['area', 'per', 'fromPer']) : r.pick(['area', 'per']);
  if (v === 'area') return {
    q: L('Hur stor area har rektangeln?', 'What is the area of the rectangle?'),
    visual: rectSvg(w, h, `${w} cm`, `${h} cm`), ans: area, unit: L('cm²', 'cm²'), wrong: [per, w + h, area + w, area - h],
    ex: L(`Area = längd × bredd = ${w} × ${h} = ${area} cm².`, `Area = length × width = ${w} × ${h} = ${area} cm².`),
  };
  if (v === 'per') return {
    q: L('Hur lång är rektangelns omkrets?', 'What is the perimeter of the rectangle?'),
    visual: rectSvg(w, h, `${w} cm`, `${h} cm`), ans: per, unit: L('cm', 'cm'), wrong: [w + h, area, per + 2, per - 2],
    ex: L(`Omkretsen är alla sidor tillsammans: ${w} + ${h} + ${w} + ${h} = ${per} cm.`, `The perimeter is all four sides added: ${w} + ${h} + ${w} + ${h} = ${per} cm.`),
  };
  return {
    q: L(`En rektangel har omkretsen ${per} cm. Den ena sidan är ${w} cm. Hur stor är rektangelns area?`, `A rectangle has a perimeter of ${per} cm. One side is ${w} cm. What is its area?`),
    visual: rectSvg(w, h, `${w} cm`, '?'), ans: area, unit: L('cm²', 'cm²'), wrong: [w * (per / 2), w * (per - 2 * w), area + w, area - w],
    ex: L(`Två sidor tillsammans är ${per} ÷ 2 = ${per / 2} cm, så den andra sidan är ${per / 2} − ${w} = ${h} cm. Area = ${w} × ${h} = ${area} cm².`,
      `Two sides together are ${per} ÷ 2 = ${per / 2} cm, so the other side is ${per / 2} − ${w} = ${h} cm. Area = ${w} × ${h} = ${area} cm².`),
  };
});

def('magic', 'logic', [4, 5, 6], (r, g) => {
  let M = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
  const rot = (m) => m[0].map((_, j) => m.map((row) => row[j]).reverse());
  for (let i = r.int(0, 3); i > 0; i--) M = rot(M);
  if (r.next() < 0.5) M = M.map((row) => [...row].reverse());
  const c = r.int(1, 10), d = r.int(1, g >= 5 ? 4 : 2);
  M = M.map((row) => row.map((v) => c + d * (v - 1)));
  const S = M[0][0] + M[0][1] + M[0][2];
  const qi = r.int(0, 2), qj = r.int(0, 2);
  const oi = r.pick([0, 1, 2].filter((i) => i !== qi)), oj = r.pick([0, 1, 2].filter((j) => j !== qj));
  const full = [0, 1, 2].find((i) => i !== qi && i !== oi);
  const ans = M[qi][qj];
  const others = M[qi].filter((_, j) => j !== qj);
  let v = '<table class="magic">';
  for (let i = 0; i < 3; i++) {
    v += '<tr>';
    for (let j = 0; j < 3; j++) v += i === qi && j === qj ? '<td class="q">?</td>' : i === oi && j === oj ? '<td></td>' : `<td>${M[i][j]}</td>`;
    v += '</tr>';
  }
  v += '</table>';
  return {
    q: L('I den magiska kvadraten är summan lika stor i varje rad, kolumn och diagonal. Vilket tal ska stå i rutan med frågetecken?',
      'In this magic square every row, column and diagonal has the same sum. Which number belongs in the square with the question mark?'),
    visual: v, ans, wrong: [ans + d, ans - d, M[oi][oj], ans + 1],
    ex: L(`Den hela raden ger summan ${M[full].join(' + ')} = ${S}. I frågetecknets rad: ${S} − ${others[0]} − ${others[1]} = ${ans}.`,
      `The complete row gives the sum ${M[full].join(' + ')} = ${S}. In the question mark's row: ${S} − ${others[0]} − ${others[1]} = ${ans}.`),
  };
});

def('handshake', 'logic', [6, 7], (r) => {
  const n = r.int(5, 14), ans = (n * (n - 1)) / 2;
  const sport = r.next() < 0.5;
  return {
    q: sport
      ? L(`I en fotbollsserie med ${n} lag möter varje lag alla andra lag exakt en gång. Hur många matcher spelas det totalt?`, `In a football league with ${n} teams, every team plays every other team exactly once. How many matches are played in total?`)
      : L(`${n} personer träffas och alla skakar hand med alla andra exakt en gång. Hur många handslag blir det?`, `${n} people meet and everyone shakes hands with everyone else exactly once. How many handshakes are there?`),
    ans, wrong: [n * (n - 1), n * n, ans + n, ans - 1],
    ex: L(`Var och en skakar hand med ${n - 1} andra: ${n} × ${n - 1} = ${n * (n - 1)}. Men då räknas varje par två gånger, så det blir ${n * (n - 1)} ÷ 2 = ${ans}.`,
      `Each one meets ${n - 1} others: ${n} × ${n - 1} = ${n * (n - 1)}. But that counts each pair twice, so the answer is ${n * (n - 1)} ÷ 2 = ${ans}.`),
  };
});

def('divisible', 'arithmetic', [5, 6, 7], (r, g) => {
  const k = r.int(3, g >= 6 ? 13 : 9);
  const A = r.int(10, 80), B = A + r.int(50, 250);
  const first = Math.ceil(A / k) * k, last = Math.floor(B / k) * k;
  const ans = (last - first) / k + 1;
  return {
    q: L(`Hur många tal från ${A} till ${B} (båda medräknade) är delbara med ${k}?`, `How many numbers from ${A} to ${B} (both included) are divisible by ${k}?`),
    ans, wrong: [ans - 1, ans + 1, Math.floor((B - A) / k) + 2, Math.floor(B / k)],
    ex: L(`Det första är ${first} och det sista är ${last}. Antal: (${last} − ${first}) ÷ ${k} + 1 = ${ans}.`, `The first is ${first} and the last is ${last}. Count: (${last} − ${first}) ÷ ${k} + 1 = ${ans}.`),
  };
});

def('fracof', 'fractions', [4, 5, 6], (r) => {
  const b = r.pick([3, 4, 5, 6, 8, 10]);
  let a = r.int(1, b - 1); while (gcd(a, b) !== 1) a = r.int(1, b - 1);
  const n = r.pick(NAMES), N0 = b * r.int(3, 12), give = (N0 * a) / b, left = N0 - give;
  return {
    q: L(`${n} har ${N0} klistermärken och ger bort ${a}/${b} av dem. Hur många klistermärken har ${n} kvar?`, `${n} has ${N0} stickers and gives away ${a}/${b} of them. How many stickers does ${n} have left?`),
    ans: left, wrong: [give, N0 / b, N0 - a, left + N0 / b],
    ex: L(`1/${b} av ${N0} är ${N0} ÷ ${b} = ${N0 / b}. ${a}/${b} är ${a} × ${N0 / b} = ${give}. Kvar: ${N0} − ${give} = ${left}.`,
      `1/${b} of ${N0} is ${N0} ÷ ${b} = ${N0 / b}. ${a}/${b} is ${a} × ${N0 / b} = ${give}. Left: ${N0} − ${give} = ${left}.`),
  };
});

def('orderops', 'arithmetic', [4, 5, 6, 7], (r, g) => {
  if (g < 6) {
    const a = r.int(2, 20), b = r.int(2, 9), c = r.int(2, 9);
    const d = r.int(1, Math.min(20, a + b * c - 1));
    const ans = a + b * c - d;
    return {
      q: L(`Vad blir ${a} + ${b} × ${c} − ${d}?`, `What is ${a} + ${b} × ${c} − ${d}?`),
      ans, wrong: [(a + b) * c - d, a + b * (c - d), ans + 1, ans - 1],
      ex: L(`Multiplikation först: ${b} × ${c} = ${b * c}. Sedan ${a} + ${b * c} − ${d} = ${ans}.`, `Multiply first: ${b} × ${c} = ${b * c}. Then ${a} + ${b * c} − ${d} = ${ans}.`),
    };
  }
  const a = r.int(5, 30), b = r.int(2, 6), c = r.int(1, 9), d = r.int(1, 12), f = r.int(2, 6), e = r.int(2, 9);
  const ans = a - b * (c - d) + e;
  const ltr = ((a - b) * (c - d) + e * f) / f;
  return {
    q: L(`Vad blir ${a} − ${b} × (${c} − ${d}) + ${e * f} ÷ ${f}?`, `What is ${a} − ${b} × (${c} − ${d}) + ${e * f} ÷ ${f}?`),
    ans, wrong: [ltr, a - b * (c - d) + e * f, a + b * (c - d) + e, ans - 2 * e, -ans],
    ex: L(`Parentesen först: ${c} − ${d} = ${N(c - d)}. Sedan ${b} × ${P(c - d)} = ${N(b * (c - d))} och ${e * f} ÷ ${f} = ${e}. Till sist ${a} − ${P(b * (c - d))} + ${e} = ${N(ans)}.`,
      `Brackets first: ${c} − ${d} = ${N(c - d)}. Then ${b} × ${P(c - d)} = ${N(b * (c - d))} and ${e * f} ÷ ${f} = ${e}. Finally ${a} − ${P(b * (c - d))} + ${e} = ${N(ans)}.`),
  };
});

def('balance', 'logic', [4, 5, 6], (r) => {
  const a = r.int(2, 4), b = r.int(1, a - 1), c = r.int(2, 5), m = r.int(2, 3);
  const k = a * m, ans = m * b * c;
  return {
    q: L(`${a} äpplen väger lika mycket som ${b === 1 ? '1 päron' : b + ' päron'}. 1 päron väger lika mycket som ${c} plommon. Hur många plommon väger lika mycket som ${k} äpplen?`,
      `${a} apples weigh the same as ${b === 1 ? '1 pear' : b + ' pears'}. 1 pear weighs the same as ${c} plums. How many plums weigh the same as ${k} apples?`),
    visual: '<div class="emoji-row">🍎 ⚖️ 🍐 ⚖️ 🟣</div>',
    ans, wrong: [k * c, m * b, k * b * c, ans + c],
    ex: L(`${k} äpplen är ${m} gånger ${a} äpplen, alltså ${m} × ${b} = ${m * b} päron. ${m * b} päron = ${m * b} × ${c} = ${ans} plommon.`,
      `${k} apples is ${m} times ${a} apples, so ${m} × ${b} = ${m * b} pears. ${m * b} pears = ${m * b} × ${c} = ${ans} plums.`),
  };
});

def('calendar', 'time', [4, 5, 6], (r) => {
  const t = r.int(0, 6), n = r.int(15, 150);
  const ans = (t + n) % 7, q = Math.floor(n / 7), rem = n % 7;
  return {
    q: L(`Idag är det ${WEEKDAYS[t].sv}. Vilken veckodag är det om ${n} dagar?`, `Today is ${WEEKDAYS[t].en}. What day of the week will it be in ${n} days?`),
    ans: WEEKDAYS[ans], wrong: [WEEKDAYS[(ans + 1) % 7], WEEKDAYS[(ans + 6) % 7], WEEKDAYS[(ans + 2) % 7], WEEKDAYS[t]],
    ex: L(`${n} = 7 × ${q} + ${rem}. Efter ${q} hela veckor är det ${WEEKDAYS[t].sv} igen, och ${rem} dagar till blir ${WEEKDAYS[ans].sv}.`,
      `${n} = 7 × ${q} + ${rem}. After ${q} whole weeks it is ${WEEKDAYS[t].en} again, and ${rem} more days gives ${WEEKDAYS[ans].en}.`),
  };
});

def('legs', 'logic', [5, 6, 7], (r) => {
  const R = r.int(3, 15), C = r.int(3, 20), H = R + C, Lg = 4 * R + 2 * C;
  return {
    q: L(`På en gård finns höns och kaniner. Tillsammans har de ${H} huvuden och ${Lg} ben. Hur många kaniner finns det?`, `A farm has chickens and rabbits. Together they have ${H} heads and ${Lg} legs. How many rabbits are there?`),
    visual: '<div class="emoji-row">🐔 🐇</div>',
    ans: R, wrong: [C, Math.round(Lg / 4), R + 1, R - 1, R + 2],
    ex: L(`Om alla ${H} djuren vore höns skulle de ha ${2 * H} ben. Det fattas ${Lg} − ${2 * H} = ${Lg - 2 * H} ben, och varje kanin har 2 ben extra. Kaniner: ${Lg - 2 * H} ÷ 2 = ${R}.`,
      `If all ${H} animals were chickens there would be ${2 * H} legs. We are missing ${Lg} − ${2 * H} = ${Lg - 2 * H} legs, and each rabbit has 2 extra. Rabbits: ${Lg - 2 * H} ÷ 2 = ${R}.`),
  };
});

def('average', 'arithmetic', [5, 6, 7], (r) => {
  for (let i = 0; i < 200; i++) {
    const k = r.int(3, 5), m1 = r.int(8, 15), x = r.int(5, 20);
    if ((k * m1 + x) % (k + 1)) continue;
    const m2 = (k * m1 + x) / (k + 1);
    if (m2 === m1) continue;
    const n = r.pick(NAMES);
    return {
      q: L(`${n} har gjort ${k} prov och fått i medel ${m1} poäng. Efter ytterligare ett prov är medelvärdet ${m2} poäng. Hur många poäng fick ${n} på det sista provet?`,
        `${n} has taken ${k} tests with an average of ${m1} points. After one more test the average is ${m2} points. How many points did ${n} get on the last test?`),
      ans: x, wrong: [m2, 2 * m2 - m1, x + 1, x - 1, x + 2],
      ex: L(`Summan av ${k} prov: ${k} × ${m1} = ${k * m1}. Summan av ${k + 1} prov: ${k + 1} × ${m2} = ${(k + 1) * m2}. Sista provet: ${(k + 1) * m2} − ${k * m1} = ${x}.`,
        `Total of ${k} tests: ${k} × ${m1} = ${k * m1}. Total of ${k + 1} tests: ${k + 1} × ${m2} = ${(k + 1) * m2}. Last test: ${(k + 1) * m2} − ${k * m1} = ${x}.`),
    };
  }
  throw new Error('average failed');
});

def('negatives', 'negative', [6, 7], (r) => {
  const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 12);
  const t = r.int(0, 3);
  let expr, ans, wrong, steps;
  if (t === 0) { expr = `(−${a}) × ${b} − (−${c})`; ans = -a * b + c; wrong = [-a * b - c, a * b + c, a * b - c]; steps = `(−${a}) × ${b} = ${N(-a * b)}. Minus ett negativt tal är plus: ${N(-a * b)} + ${c} = ${N(ans)}.`; }
  else if (t === 1) { expr = `−${a} + ${b} × (−${c})`; ans = -a - b * c; wrong = [a + b * c, -a + b * c, (-a + b) * -c]; steps = `${b} × (−${c}) = ${N(-b * c)}. Sedan −${a} + (${N(-b * c)}) = ${N(ans)}.`; }
  else if (t === 2) { expr = `(−${a}) × (−${b}) − ${c}`; ans = a * b - c; wrong = [-a * b - c, -a * b + c, a * b + c]; steps = `Minus gånger minus blir plus: (−${a}) × (−${b}) = ${a * b}. ${a * b} − ${c} = ${N(ans)}.`; }
  else { expr = `${c} − (−${a}) × ${b}`; ans = c + a * b; wrong = [c - a * b, (c + a) * b, -(c + a * b)]; steps = `(−${a}) × ${b} = ${N(-a * b)}. ${c} − (${N(-a * b)}) = ${c} + ${a * b} = ${N(ans)}.`; }
  const stepsEn = steps.replace('Minus ett negativt tal är plus', 'Subtracting a negative is adding').replace('Minus gånger minus blir plus', 'Minus times minus is plus').replace('Sedan', 'Then');
  return { q: L(`Vad blir ${expr}?`, `What is ${expr}?`), ans, wrong: [...wrong, ans + 1, ans - 1], ex: L(steps, stepsEn) };
});

def('percent', 'fractions', [6, 7], (r) => {
  for (let i = 0; i < 200; i++) {
    const Pr = r.pick([200, 400, 500, 800, 1000, 1200, 1600, 2000]);
    const p = r.pick([10, 20, 25, 50]), q = r.pick([10, 20, 25, 50]);
    const up = (Pr * (100 + p)) / 100;
    const fin = (up * (100 - q)) / 100;
    if (!Number.isInteger(up) || !Number.isInteger(fin)) continue;
    const naive = (Pr * (100 + p - q)) / 100;
    return {
      q: L(`En cykel kostade ${Pr} kr. Priset höjdes först med ${p} % och sänktes sedan med ${q} %. Vad kostar cykeln nu?`,
        `A bike cost ${Pr} kr. The price was first raised by ${p}% and then lowered by ${q}%. What does the bike cost now?`),
      ans: fin, unit: L('kr', 'kr'), wrong: [naive, Pr, up, fin + 20, fin - 20],
      ex: L(`Höjning: ${Pr} + ${p} % = ${up} kr. Sänkning med ${q} % av det nya priset: ${up} − ${(up * q) / 100} = ${fin} kr. (Procenten räknas på olika belopp, så man kan inte bara ta ${p} − ${q}.)`,
        `Increase: ${Pr} + ${p}% = ${up} kr. Then ${q}% off the new price: ${up} − ${(up * q) / 100} = ${fin} kr. (The percentages are of different amounts, so you can't just do ${p} − ${q}.)`),
    };
  }
  throw new Error('percent failed');
});

def('products', 'equations', [6, 7], (r, g) => {
  const x = r.int(2, 5), y = r.int(2, 5), z = r.int(2, g >= 7 ? 7 : 5);
  const A = x * y, B = x * x * y, C = y * y * z, ans = x + y + z;
  return {
    q: L('x, y och z är positiva heltal. Vad är x + y + z?', 'x, y and z are positive whole numbers. What is x + y + z?'),
    visual: `<div class="eqs"><div class="eqline">x · y <span>=</span> <b>${A}</b></div><div class="eqline">x² · y <span>=</span> <b>${B}</b></div><div class="eqline">y² · z <span>=</span> <b>${C}</b></div></div>`,
    ans, wrong: [ans + 1, ans - 1, ans + 2, ans - 2],
    ex: L(`x² · y är x gånger x · y, så x = ${B} ÷ ${A} = ${x}. Då är y = ${A} ÷ ${x} = ${y}, och z = ${C} ÷ ${y * y} = ${z}. Summa: ${x} + ${y} + ${z} = ${ans}.`,
      `x² · y is x times x · y, so x = ${B} ÷ ${A} = ${x}. Then y = ${A} ÷ ${x} = ${y}, and z = ${C} ÷ ${y * y} = ${z}. Sum: ${x} + ${y} + ${z} = ${ans}.`),
  };
});

def('lineq', 'equations', [5, 6, 7], (r, g) => {
  const x = r.int(2, 12);
  if (g >= 7 && r.next() < 0.6) {
    const c = r.int(1, 5), a = c + r.int(1, 5), b = r.int(1, 15);
    const d = (a - c) * x + b;
    return {
      q: L(`Lös ekvationen ${a}x + ${b} = ${c}x + ${d}. Vad är x?`, `Solve ${a}x + ${b} = ${c}x + ${d}. What is x?`),
      ans: x, wrong: [(d + b) / (a - c), (d - b) / (a + c), x + 1, x - 1, d - b],
      ex: L(`Ta bort ${c}x från båda sidor: ${a - c}x + ${b} = ${d}. Ta bort ${b}: ${a - c}x = ${d - b}. Dela med ${a - c}: x = ${x}.`,
        `Subtract ${c}x from both sides: ${a - c}x + ${b} = ${d}. Subtract ${b}: ${a - c}x = ${d - b}. Divide by ${a - c}: x = ${x}.`),
    };
  }
  const a = r.int(2, 9), b = r.int(1, 20), c = a * x + b;
  return {
    q: L(`Lös ekvationen ${a}x + ${b} = ${c}. Vad är x?`, `Solve ${a}x + ${b} = ${c}. What is x?`),
    ans: x, wrong: [(c + b) / a, c - b, x + 1, x - 1, x + 2],
    ex: L(`Ta bort ${b} från båda sidor: ${a}x = ${c - b}. Dela med ${a}: x = ${x}.`, `Subtract ${b} from both sides: ${a}x = ${c - b}. Divide by ${a}: x = ${x}.`),
  };
});

def('ratio', 'fractions', [6, 7], (r) => {
  let a = r.int(2, 7), b = r.int(2, 7);
  while (a === b || gcd(a, b) !== 1) { a = r.int(2, 7); b = r.int(2, 7); }
  const k = r.int(2, 8), T = (a + b) * k;
  return {
    q: L(`I en klubb är förhållandet mellan pojkar och flickor ${a} : ${b}. Det finns ${T} medlemmar. Hur många är flickor?`,
      `In a club the ratio of boys to girls is ${a} : ${b}. There are ${T} members. How many are girls?`),
    ans: b * k, wrong: [a * k, T / 2, b * k + k, T - a],
    ex: L(`${a} + ${b} = ${a + b} delar. En del = ${T} ÷ ${a + b} = ${k}. Flickor: ${b} × ${k} = ${b * k}.`, `${a} + ${b} = ${a + b} parts. One part = ${T} ÷ ${a + b} = ${k}. Girls: ${b} × ${k} = ${b * k}.`),
  };
});

def('triangle', 'geometry', [5, 6, 7], (r, g) => {
  if (g >= 6 && r.next() < 0.4) {
    const t = r.int(28, 70) * 2, base = (180 - t) / 2;
    return {
      q: L(`En likbent triangel har toppvinkeln ${t}°. Hur stor är var och en av de två basvinklarna?`, `An isosceles triangle has a top angle of ${t}°. How big is each of the two base angles?`),
      visual: triangleSvg(base, base, ['', '', `${t}°`]), ans: base, unit: L('°', '°'), wrong: [180 - t, t, 90 - t / 4, base + 10],
      ex: L(`Vinklarna i en triangel är tillsammans 180°. 180° − ${t}° = ${180 - t}°, som delas lika: ${180 - t} ÷ 2 = ${base}°.`,
        `The angles of a triangle add up to 180°. 180° − ${t}° = ${180 - t}°, shared equally: ${180 - t} ÷ 2 = ${base}°.`),
    };
  }
  let a, b, c;
  for (;;) {
    a = r.int(6, 20) * 5; b = r.int(4, Math.min(20, (170 - a) / 5)) * 5; c = 180 - a - b;
    const ta = Math.tan((a * Math.PI) / 180), tb = Math.tan((b * Math.PI) / 180);
    const x = tb / (ta + tb), y = x * ta;
    if (c >= 25 && y <= 0.95 && x > -0.15 && x < 1.15) break;
  }
  return {
    q: L('Hur stor är vinkeln som är markerad med frågetecken?', 'How big is the angle marked with a question mark?'),
    visual: triangleSvg(a, b, [`${a}°`, `${b}°`, '?']), ans: c, unit: L('°', '°'), wrong: [360 - a - b, 180 - a, c + 10, c - 10],
    ex: L(`Vinklarna i en triangel är tillsammans 180°. 180° − ${a}° − ${b}° = ${c}°.`, `The angles of a triangle add up to 180°. 180° − ${a}° − ${b}° = ${c}°.`),
  };
});

def('powers', 'arithmetic', [6, 7], (r, g) => {
  if (g >= 7 && r.next() < 0.6) {
    const base = r.pick([2, 3, 5, 10]), a = r.int(2, 9), b = r.int(2, 9), c = r.int(1, a + b - 1), x = a + b - c;
    return {
      q: L(`(${base}<sup>${a}</sup> · ${base}<sup>${b}</sup>) ÷ ${base}<sup>${c}</sup> = ${base}<sup>x</sup>. Vad är x?`, `(${base}<sup>${a}</sup> · ${base}<sup>${b}</sup>) ÷ ${base}<sup>${c}</sup> = ${base}<sup>x</sup>. What is x?`),
      ans: x, wrong: [a * b - c, a + b + c, x + 1, x - 1],
      ex: L(`Vid multiplikation adderas exponenterna och vid division subtraheras de: ${a} + ${b} − ${c} = ${x}.`, `When multiplying, add the exponents; when dividing, subtract: ${a} + ${b} − ${c} = ${x}.`),
    };
  }
  const a = r.int(3, 9), b = r.int(2, 6), c = r.int(2, 3);
  const ans = a * a + b * b - c ** 3;
  return {
    q: L(`Vad blir ${a}² + ${b}² − ${c}³?`, `What is ${a}² + ${b}² − ${c}³?`),
    ans, wrong: [a * 2 + b * 2 - c * 3, (a + b) ** 2 - c ** 3, a * a + b * b - c * c, ans + 1],
    ex: L(`${a}² = ${a * a}, ${b}² = ${b * b} och ${c}³ = ${c ** 3}. ${a * a} + ${b * b} − ${c ** 3} = ${N(ans)}.`, `${a}² = ${a * a}, ${b}² = ${b * b} and ${c}³ = ${c ** 3}. ${a * a} + ${b * b} − ${c ** 3} = ${N(ans)}.`),
  };
});

def('buses', 'time', [5, 6, 7], (r) => {
  let a, b;
  do { a = r.pick([6, 8, 9, 10, 12, 15, 20]); b = r.pick([6, 8, 9, 10, 12, 15, 20]); } while (a === b || lcm(a, b) === a * b || lcm(a, b) > 120);
  const start = r.int(6, 9) * 60, l = lcm(a, b);
  return {
    q: L(`Buss 1 går var ${a}:e minut och buss 2 var ${b}:e minut. Båda går från hållplatsen klockan ${clock(start)}. När går de samtidigt nästa gång?`,
      `Bus 1 leaves every ${a} minutes and bus 2 every ${b} minutes. Both leave the stop at ${clock(start)}. When do they next leave at the same time?`),
    ans: clock(start + l), wrong: [clock(start + a * b), clock(start + a + b), clock(start + 2 * l), clock(start + l + Math.min(a, b))],
    ex: L(`Buss 1: ${[1, 2, 3, 4].map((i) => a * i).join(', ')}, … minuter. Buss 2: ${[1, 2, 3].map((i) => b * i).join(', ')}, … minuter. Första gemensamma tid är minsta gemensamma multipeln ${l} minuter, alltså ${clock(start + l)}.`,
      `Bus 1: ${[1, 2, 3, 4].map((i) => a * i).join(', ')}, … minutes. Bus 2: ${[1, 2, 3].map((i) => b * i).join(', ')}, … minutes. The first common time is the least common multiple, ${l} minutes, i.e. ${clock(start + l)}.`),
  };
});

def('ribbons', 'arithmetic', [6, 7], (r) => {
  let p, q;
  do { p = r.int(2, 9); q = r.int(2, 9); } while (p === q || gcd(p, q) !== 1);
  const g0 = r.pick([6, 8, 10, 12, 15]), m = g0 * p, n = g0 * q;
  return {
    q: L(`Två band är ${m} cm och ${n} cm långa. De ska klippas i bitar som är lika långa, så långa som möjligt, utan att något blir över. Hur många bitar blir det totalt?`,
      `Two ribbons are ${m} cm and ${n} cm long. They are cut into pieces of equal length, as long as possible, with nothing left over. How many pieces are there in total?`),
    ans: p + q, wrong: [g0, p * q, p + q + 1, (m + n) / 2],
    ex: L(`Den längsta biten som går jämnt upp i båda är största gemensamma delaren: ${g0} cm. ${m} ÷ ${g0} = ${p} och ${n} ÷ ${g0} = ${q}. Totalt ${p} + ${q} = ${p + q} bitar.`,
      `The longest piece that fits both exactly is the greatest common divisor: ${g0} cm. ${m} ÷ ${g0} = ${p} and ${n} ÷ ${g0} = ${q}. Total ${p} + ${q} = ${p + q} pieces.`),
  };
});

def('speed', 'word', [5, 6, 7], (r) => {
  for (let i = 0; i < 200; i++) {
    const v = r.pick([12, 15, 18, 20, 24, 30, 36, 40, 45, 60]), t = r.pick([10, 15, 20, 30, 40, 45, 50, 90]);
    if ((v * t) % 60) continue;
    const d = (v * t) / 60, n = r.pick(NAMES);
    if (r.next() < 0.5) return {
      q: L(`${n} cyklar med farten ${v} km/h i ${t} minuter. Hur långt hinner ${n}?`, `${n} cycles at ${v} km/h for ${t} minutes. How far does ${n} get?`),
      ans: d, unit: L('km', 'km'), wrong: [v * t, v / t * 60, d + 1, d * 2, d + 2],
      ex: L(`${t} minuter är ${t}/60 timme. Sträcka = ${v} × ${t} ÷ 60 = ${d} km.`, `${t} minutes is ${t}/60 of an hour. Distance = ${v} × ${t} ÷ 60 = ${d} km.`),
    };
    return {
      q: L(`${n} cyklar ${d} km med farten ${v} km/h. Hur många minuter tar det?`, `${n} cycles ${d} km at ${v} km/h. How many minutes does it take?`),
      ans: t, unit: L('min', 'min'), wrong: [t + 10, t - 5, v - d, Math.round((v / d) * 10)],
      ex: L(`Tid = sträcka ÷ fart = ${d} ÷ ${v} timme = ${d} × 60 ÷ ${v} = ${t} minuter.`, `Time = distance ÷ speed = ${d} ÷ ${v} hours = ${d} × 60 ÷ ${v} = ${t} minutes.`),
    };
  }
  throw new Error('speed failed');
});

def('probability', 'probability', [6, 7], (r) => {
  const red = r.int(1, 8), blue = r.int(1, 8), green = r.int(1, 8), T = red + blue + green;
  const ask = r.pick(['notblue', 'red']);
  const ans = ask === 'red' ? frac(red, T) : frac(T - blue, T);
  const wrong = [frac(blue, T), frac(red, T), frac(green, T), frac(red + green, T), `${T - blue}/${blue}`, `${red}/${blue + green}`, frac(1, 3), frac(red + 1, T + 1)];
  return {
    q: ask === 'red'
      ? L(`I en påse finns ${red} röda, ${blue} blå och ${green} gröna kulor. Du tar en kula utan att titta. Hur stor är sannolikheten att den är röd?`,
        `A bag holds ${red} red, ${blue} blue and ${green} green marbles. You take one without looking. What is the probability that it is red?`)
      : L(`I en påse finns ${red} röda, ${blue} blå och ${green} gröna kulor. Du tar en kula utan att titta. Hur stor är sannolikheten att den inte är blå?`,
        `A bag holds ${red} red, ${blue} blue and ${green} green marbles. You take one without looking. What is the probability that it is not blue?`),
    visual: `<div class="emoji-row wrap">${'🔴'.repeat(red)}${'🔵'.repeat(blue)}${'🟢'.repeat(green)}</div>`,
    ans, wrong,
    ex: ask === 'red'
      ? L(`Det finns ${T} kulor och ${red} är röda. Sannolikheten är ${red}/${T}${frac(red, T) !== `${red}/${T}` ? ' = ' + frac(red, T) : ''}.`, `There are ${T} marbles and ${red} are red. The probability is ${red}/${T}${frac(red, T) !== `${red}/${T}` ? ' = ' + frac(red, T) : ''}.`)
      : L(`Det finns ${T} kulor och ${T - blue} är inte blå. Sannolikheten är ${T - blue}/${T}${ans !== `${T - blue}/${T}` ? ' = ' + ans : ''}.`, `There are ${T} marbles and ${T - blue} are not blue. The probability is ${T - blue}/${T}${ans !== `${T - blue}/${T}` ? ' = ' + ans : ''}.`),
  };
});

def('gauss', 'patterns', [5, 6, 7], (r) => {
  if (r.next() < 0.5) {
    const n = r.pick([10, 20, 30, 40, 50, 60, 80, 100]), ans = (n * (n + 1)) / 2;
    return {
      q: L(`Vad är 1 + 2 + 3 + … + ${n}?`, `What is 1 + 2 + 3 + … + ${n}?`),
      ans, wrong: [(n * n) / 2, (n * (n - 1)) / 2, n * (n + 1), ans + n],
      ex: L(`Para ihop första och sista: 1 + ${n} = ${n + 1}, 2 + ${n - 1} = ${n + 1}, … Det blir ${n / 2} par: ${n / 2} × ${n + 1} = ${ans}.`,
        `Pair the first and last: 1 + ${n} = ${n + 1}, 2 + ${n - 1} = ${n + 1}, … There are ${n / 2} pairs: ${n / 2} × ${n + 1} = ${ans}.`),
    };
  }
  const k = r.int(5, 15), last = 2 * k - 1, ans = k * k;
  return {
    q: L(`Vad är 1 + 3 + 5 + … + ${last}? (alla udda tal upp till ${last})`, `What is 1 + 3 + 5 + … + ${last}? (all odd numbers up to ${last})`),
    ans, wrong: [k * (k + 1), (last * (last + 1)) / 2, ans - 1, ans + k],
    ex: L(`Det är ${k} udda tal. Summan av de ${k} första udda talen är ${k}² = ${ans} (1 = 1², 1 + 3 = 2², 1 + 3 + 5 = 3², …).`,
      `There are ${k} odd numbers. The sum of the first ${k} odd numbers is ${k}² = ${ans} (1 = 1², 1 + 3 = 2², 1 + 3 + 5 = 3², …).`),
  };
});

def('table', 'equations', [6, 7], (r) => {
  const vals = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
  for (let i = 0; i < 500; i++) {
    const a = r.pick(vals), b = r.pick(vals), c = r.pick(vals);
    if ((a * c) % b || Math.abs(b) === 1 || a === b || b === c) continue;
    const ans = (a * c) / b;
    return {
      q: L('Tabellen visar några produkter av talen a, b och c. Vad är (a · c) ÷ b?', 'The table shows some products of the numbers a, b and c. What is (a · c) ÷ b?'),
      visual: `<table class="magic wide"><tr><th>a · b · c</th><th>b · c</th><th>c</th></tr><tr><td>${N(a * b * c)}</td><td>${N(b * c)}</td><td>${N(c)}</td></tr></table>`,
      ans, wrong: [-ans, (a * b) / c, ans + 1, ans - 1, a * c, ans * 2],
      ex: L(`a = ${N(a * b * c)} ÷ ${P(b * c)} = ${N(a)} och b = ${N(b * c)} ÷ ${P(c)} = ${N(b)}. (a · c) ÷ b = (${N(a)} · ${P(c)}) ÷ ${P(b)} = ${N(a * c)} ÷ ${P(b)} = ${N(ans)}.`,
        `a = ${N(a * b * c)} ÷ ${P(b * c)} = ${N(a)} and b = ${N(b * c)} ÷ ${P(c)} = ${N(b)}. (a · c) ÷ b = (${N(a)} · ${P(c)}) ÷ ${P(b)} = ${N(a * c)} ÷ ${P(b)} = ${N(ans)}.`),
    };
  }
  throw new Error('table failed');
});

def('shaded', 'fractions', [4, 5, 6], (r) => {
  const rows = r.int(2, 4), cols = r.int(3, 6), T = rows * cols;
  const divs = [2, 3, 4, 6].filter((x) => T % x === 0);
  const d = divs.length && r.next() < 0.6 ? r.pick(divs) : 1;
  const k = d * r.int(1, T / d - 1);
  const cells = new Set(r.shuffle([...Array(T).keys()]).slice(0, k));
  const ans = frac(k, T);
  return {
    q: L('Hur stor del av figuren är färgad? Svara i enklaste form.', 'What fraction of the figure is coloured? Give the simplest form.'),
    visual: gridSvg(rows, cols, cells), ans,
    wrong: [frac(T - k, T), frac(k + 1, T), k > 1 ? frac(k - 1, T) : null, frac(k, 2 * T), frac(k + 2, T), frac(Math.max(1, T - k - 1), T)],
    ex: L(`${k} av ${T} rutor är färgade: ${k}/${T}${ans !== `${k}/${T}` ? ` = ${ans} (förkorta med ${gcd(k, T)})` : ''}.`,
      `${k} of ${T} squares are coloured: ${k}/${T}${ans !== `${k}/${T}` ? ` = ${ans} (divide top and bottom by ${gcd(k, T)})` : ''}.`),
  };
});

def('cubes', 'geometry', [4, 5, 6, 7], (r, g) => {
  if (g >= 6) {
    const l = r.int(3, 6), w = r.int(3, 5), h = r.int(3, 5);
    const ans = (l - 2) * (w - 2) * (h - 2), T = l * w * h;
    return {
      q: L(`Ett rätblock är byggt av ${T} små kuber (${l} × ${w} × ${h}). Hela utsidan målas. Hur många av de små kuberna har ingen målad sida alls?`,
        `A box is built from ${T} small cubes (${l} × ${w} × ${h}). The whole outside is painted. How many of the small cubes have no painted face at all?`),
      visual: isoBox(l, w, h), ans, wrong: [(l - 1) * (w - 1) * (h - 1), T - ans, l * w, ans + 2, 8],
      ex: L(`Kuberna utan färg bildar ett inre block där ett lager är borttaget på varje sida: (${l} − 2) × (${w} − 2) × (${h} − 2) = ${l - 2} × ${w - 2} × ${h - 2} = ${ans}.`,
        `The unpainted cubes form an inner block with one layer removed on every side: (${l} − 2) × (${w} − 2) × (${h} − 2) = ${l - 2} × ${w - 2} × ${h - 2} = ${ans}.`),
    };
  }
  const l = r.int(2, 5), w = r.int(2, 4), h = r.int(2, 4), ans = l * w * h;
  return {
    q: L('Hur många små kuber består rätblocket av? (Det är helt fyllt inuti.)', 'How many small cubes make up the box? (It is completely filled inside.)'),
    visual: isoBox(l, w, h), ans, wrong: [l * w + w * h + l * h, l * w + h, l + w + h, ans + l * w, ans - w],
    ex: L(`Ett lager är ${l} × ${w} = ${l * w} kuber, och det finns ${h} lager: ${l * w} × ${h} = ${ans}.`, `One layer is ${l} × ${w} = ${l * w} cubes, and there are ${h} layers: ${l * w} × ${h} = ${ans}.`),
  };
});

def('agesfuture', 'equations', [6, 7], (r) => {
  for (let i = 0; i < 500; i++) {
    const S = r.int(3, 12), k = r.int(3, 6), F = k * S, n = r.int(1, 30);
    if ((F + n) % (S + n)) continue;
    const m = (F + n) / (S + n);
    if (m < 2 || m >= k) continue;
    const mom = r.next() < 0.5;
    const times = (x) => L(x === 2 ? 'dubbelt så gammal' : `${x} gånger så gammal`, x === 2 ? 'twice as old' : `${x} times as old`);
    return {
      q: L(`En ${mom ? 'mamma' : 'pappa'} är ${times(k).sv} som sitt barn. Om ${n} år är ${mom ? 'mamman' : 'pappan'} ${times(m).sv} som barnet. Hur gammalt är barnet nu?`,
        `A ${mom ? 'mother' : 'father'} is ${times(k).en} as their child. In ${n} years the ${mom ? 'mother' : 'father'} will be ${times(m).en} as the child. How old is the child now?`),
      ans: S, unit: L('år', 'years'), wrong: [S + 1, S - 1, n, S + 2],
      ex: L(`Kalla barnets ålder x. Då är ${mom ? 'mamman' : 'pappan'} ${k}x. Om ${n} år: ${k}x + ${n} = ${m}(x + ${n}), alltså ${k - m === 1 ? '' : k - m}x = ${(m - 1) * n} och x = ${S}. Kontroll: ${F} + ${n} = ${F + n} = ${m} × ${S + n}.`,
        `Call the child's age x. The ${mom ? 'mother' : 'father'} is ${k}x. In ${n} years: ${k}x + ${n} = ${m}(x + ${n}), so ${k - m === 1 ? '' : k - m}x = ${(m - 1) * n} and x = ${S}. Check: ${F} + ${n} = ${F + n} = ${m} × ${S + n}.`),
    };
  }
  throw new Error('agesfuture failed');
});

def('reverse', 'logic', [6, 7], (r) => {
  const a = r.int(1, 7), b = r.int(a + 1, 9), s = a + b, diff = 9 * (b - a), ans = 10 * a + b;
  return {
    q: L(`Ett tvåsiffrigt tal har siffersumman ${s}. Om man byter plats på siffrorna blir talet ${diff} större. Vilket är talet?`,
      `A two-digit number has digit sum ${s}. If you swap its digits, the number gets ${diff} bigger. What is the number?`),
    ans, wrong: [10 * b + a, 10 * (a + 1) + (b - 1), a > 1 ? 10 * (a - 1) + (b + 1 <= 9 ? b + 1 : b) : ans + 9, ans + 10],
    ex: L(`Att byta siffrorna ändrar talet med 9 × (skillnaden mellan siffrorna). ${diff} ÷ 9 = ${b - a}, så den andra siffran är ${b - a} större. Siffror som summerar till ${s} med skillnad ${b - a}: ${a} och ${b}. Talet är ${ans} (${10 * b + a} − ${ans} = ${diff}).`,
      `Swapping digits changes the number by 9 × (the difference between the digits). ${diff} ÷ 9 = ${b - a}, so the second digit is ${b - a} bigger. Digits that add to ${s} with difference ${b - a}: ${a} and ${b}. The number is ${ans} (${10 * b + a} − ${ans} = ${diff}).`),
  };
});

def('change', 'word', [4, 5], (r) => {
  const n = r.pick(NAMES);
  const p1 = r.int(4, 15), n1 = r.int(2, 5), p2 = r.int(10, 35), n2 = r.int(2, 4);
  const tot = p1 * n1 + p2 * n2, pay = tot < 100 ? 100 : tot < 200 ? 200 : 500, ans = pay - tot;
  return {
    q: L(`${n} köper ${n1} pennor för ${p1} kr styck och ${n2} block för ${p2} kr styck. ${n} betalar med en ${pay}-kronorssedel. Hur mycket får ${n} tillbaka?`,
      `${n} buys ${n1} pens at ${p1} kr each and ${n2} notebooks at ${p2} kr each. ${n} pays with a ${pay} kr note. How much change does ${n} get?`),
    ans, unit: L('kr', 'kr'), wrong: [tot, pay - (p1 + p2), ans + 10, ans - 10, ans + 5],
    ex: L(`Pennor: ${n1} × ${p1} = ${p1 * n1} kr. Block: ${n2} × ${p2} = ${p2 * n2} kr. Totalt ${tot} kr. Tillbaka: ${pay} − ${tot} = ${ans} kr.`,
      `Pens: ${n1} × ${p1} = ${p1 * n1} kr. Notebooks: ${n2} × ${p2} = ${p2 * n2} kr. Total ${tot} kr. Change: ${pay} − ${tot} = ${ans} kr.`),
  };
});

def('clockangle', 'geometry', [6, 7], (r, g) => {
  const h = r.int(1, 11);
  if (g >= 7 && r.next() < 0.5) {
    let a = Math.abs(30 * h - 165); a = Math.min(a, 360 - a);
    return {
      q: L(`Hur stor är den minsta vinkeln mellan timvisaren och minutvisaren när klockan är ${h}:30?`, `What is the smaller angle between the hour hand and the minute hand at ${h}:30?`),
      visual: clockSvg(h, 30), ans: a, unit: L('°', '°'),
      wrong: [Math.min(Math.abs(30 * h - 180), 360 - Math.abs(30 * h - 180)), a + 15, Math.abs(a - 30), a + 30],
      ex: L(`Minutvisaren pekar på 6 (180°). Timvisaren har gått halvvägs mellan ${h} och ${h + 1}: ${h} × 30° + 15° = ${30 * h + 15}°. Skillnaden blir ${a}°.`,
        `The minute hand points at 6 (180°). The hour hand is halfway between ${h} and ${h + 1}: ${h} × 30° + 15° = ${30 * h + 15}°. The difference is ${a}°.`),
    };
  }
  const a = 30 * Math.min(h, 12 - h);
  return {
    q: L(`Hur stor är den minsta vinkeln mellan visarna när klockan är exakt ${h}:00?`, `What is the smaller angle between the hands at exactly ${h}:00?`),
    visual: clockSvg(h, 0), ans: a, unit: L('°', '°'), wrong: [360 - a, 6 * h, a + 30, Math.abs(a - 30), 30 * h],
    ex: L(`Mellan två siffror på klockan är det 360° ÷ 12 = 30°. Visarna står ${Math.min(h, 12 - h)} steg isär: ${Math.min(h, 12 - h)} × 30° = ${a}°.`,
      `Between two numbers on a clock is 360° ÷ 12 = 30°. The hands are ${Math.min(h, 12 - h)} steps apart: ${Math.min(h, 12 - h)} × 30° = ${a}°.`),
  };
});

def('pagedigits', 'logic', [6, 7], (r) => {
  const n = r.int(40, 320);
  const ans = n < 10 ? n : n < 100 ? 9 + 2 * (n - 9) : 9 + 180 + 3 * (n - 99);
  return {
    q: L(`En bok har ${n} sidor numrerade 1, 2, 3, … ${n}. Hur många siffror används totalt för att skriva alla sidnummer?`,
      `A book has ${n} pages numbered 1, 2, 3, … ${n}. How many digits are used in total to print all the page numbers?`),
    ans, wrong: [ans - 9, ans + 9, n * (n < 100 ? 2 : 3), ans + 1],
    ex: n < 100
      ? L(`Sida 1–9: 9 siffror. Sida 10–${n}: ${n - 9} sidor × 2 = ${2 * (n - 9)}. Totalt ${ans}.`, `Pages 1–9: 9 digits. Pages 10–${n}: ${n - 9} pages × 2 = ${2 * (n - 9)}. Total ${ans}.`)
      : L(`Sida 1–9: 9 siffror. Sida 10–99: 90 × 2 = 180. Sida 100–${n}: ${n - 99} × 3 = ${3 * (n - 99)}. Totalt 9 + 180 + ${3 * (n - 99)} = ${ans}.`,
        `Pages 1–9: 9 digits. Pages 10–99: 90 × 2 = 180. Pages 100–${n}: ${n - 99} × 3 = ${3 * (n - 99)}. Total 9 + 180 + ${3 * (n - 99)} = ${ans}.`),
  };
});

// ---------- publikt API ----------
export function generatorsFor(grade, topic, subject = 'math') {
  return GENERATORS.filter((gn) => gn.subject === subject && gn.grades.includes(grade) && (!topic || gn.topic === topic));
}

export function topicsFor(grade, subject = 'math') {
  return [...new Set(generatorsFor(grade, null, subject).map((gn) => gn.topic))];
}

export function makeQuestion(gen, grade, r = rng()) {
  const raw = gen.make(r, grade);
  const { options, correct } = buildOptions(r, raw.ans, raw.wrong || []);
  return { genId: gen.id, topic: gen.topic, subject: gen.subject, grade, q: raw.q, visual: raw.visual || '', options, correct, unit: raw.unit || null, ex: raw.ex };
}

// Skapar ett quiz. weights: { genId: vikt } för att träna mer på svåra uppgifter.
export function makeQuiz(grade, { count = 10, topic = null, weights = null, subject = 'math', r = rng() } = {}) {
  const pool = generatorsFor(grade, topic, subject);
  const chosen = [];
  let bag = [];
  while (chosen.length < count && pool.length) {
    if (!bag.length) {
      bag = [];
      for (const gn of pool) { const w = Math.max(1, Math.round(weights?.[gn.id] ?? 1)); for (let i = 0; i < w; i++) bag.push(gn); }
      bag = r.shuffle(bag);
    }
    const gn = bag.pop();
    if (chosen.length && chosen[chosen.length - 1].id === gn.id && pool.length > 1) continue;
    chosen.push(gn);
  }
  return chosen.map((gn) => makeQuestion(gn, grade, r));
}

export function optionText(v, unit, lang) {
  const base = typeof v === 'object' ? v[lang] : typeof v === 'number' ? N(v) : String(v);
  if (!unit) return base;
  return unit[lang] === '°' ? base + '°' : `${base} ${unit[lang]}`;
}
