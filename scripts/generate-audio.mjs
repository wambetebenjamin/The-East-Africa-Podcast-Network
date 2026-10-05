/**
 * Generates placeholder demo audio for EAPN episodes.
 * Six distinct synthesized "podcast bed music" tracks encoded to MP3 with lamejs.
 * Real episode audio should be swapped in later (Vercel Blob or external CDN) —
 * see lib/data.ts `audio` fields.
 */
import lamejs from '@breezystack/lamejs';
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const SECONDS = 84;
const N = SR * SECONDS;

// ---------- tiny synth toolkit ----------
const env = (t, a, d, s, r, dur) => {
  if (t < 0 || t > dur) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
  if (t < dur - r) return s;
  return Math.max(0, s * (1 - (t - (dur - r)) / r));
};
const sine = (f, t) => Math.sin(2 * Math.PI * f * t);
const tri = (f, t) => (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * f * t));
let noiseState = 1;
const noise = () => {
  noiseState = (noiseState * 1103515245 + 12345) & 0x7fffffff;
  return (noiseState / 0x3fffffff) - 1;
};
class LP {
  constructor(alpha = 0.15) { this.a = alpha; this.y = 0; }
  run(x) { this.y += this.a * (x - this.y); return this.y; }
}
const note = (n) => 440 * Math.pow(2, (n - 69) / 12); // midi → Hz

function addTone(buf, start, dur, freq, { gain = 0.3, type = 'sine', a = 0.01, d = 0.08, s = 0.7, r = 0.2, detune = 0, lp = null } = {}) {
  const s0 = Math.floor(start * SR), len = Math.floor(dur * SR);
  for (let i = 0; i < len && s0 + i < buf.length; i++) {
    const t = i / SR;
    const e = env(t, a, d, s, r, dur);
    let v = type === 'sine' ? sine(freq, t) : type === 'tri' ? tri(freq, t) : Math.sign(sine(freq, t)) * 0.8;
    if (detune) v = (v + (type === 'sine' ? sine(freq * (1 + detune), t) : tri(freq * (1 + detune), t))) / 2;
    if (lp) v = lp.run(v);
    buf[s0 + i] += v * e * gain;
  }
}
function addKick(buf, start, { gain = 0.9 } = {}) {
  const s0 = Math.floor(start * SR), dur = 0.24, len = Math.floor(dur * SR);
  let phase = 0;
  for (let i = 0; i < len && s0 + i < buf.length; i++) {
    const t = i / SR;
    const f = 120 * Math.exp(-t * 24) + 42;
    phase += (2 * Math.PI * f) / SR;
    const e = Math.exp(-t * 14);
    buf[s0 + i] += Math.sin(phase) * e * gain;
  }
}
function addSnare(buf, start, { gain = 0.5, tone = 190 } = {}) {
  const s0 = Math.floor(start * SR), dur = 0.18, len = Math.floor(dur * SR);
  const lp = new LP(0.4);
  for (let i = 0; i < len && s0 + i < buf.length; i++) {
    const t = i / SR;
    const e = Math.exp(-t * 22);
    buf[s0 + i] += (lp.run(noise()) * 0.8 + sine(tone, t) * 0.5) * e * gain;
  }
}
function addShaker(buf, start, { gain = 0.16, dur = 0.06, hp = false } = {}) {
  const s0 = Math.floor(start * SR), len = Math.floor(dur * SR);
  const lp = new LP(hp ? 0.6 : 0.35);
  for (let i = 0; i < len && s0 + i < buf.length; i++) {
    const t = i / SR;
    const e = Math.sin((Math.PI * t) / dur);
    buf[s0 + i] += lp.run(noise()) * e * gain;
  }
}
function softClip(buf, drive = 1.4) {
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i] * drive;
    buf[i] = Math.tanh(x) / Math.tanh(drive) * 0.92;
  }
}

// ---------- compositions ----------
const BPM = 96, B = 60 / BPM; // beat seconds

function afro(buf) { // upbeat afro-pop bed, Am–F–C–G
  const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // A F C G
  const scale = [69, 71, 72, 74, 76, 79, 81];
  for (let bar = 0; bar * 4 * B < SECONDS - 4; bar++) {
    const t0 = bar * 4 * B;
    const ch = chords[bar % 4];
    addKick(buf, t0); addKick(buf, t0 + 1.5 * B); addKick(buf, t0 + 2.5 * B); addKick(buf, t0 + 3.75 * B);
    addSnare(buf, t0 + B, { gain: 0.32 }); addSnare(buf, t0 + 3 * B, { gain: 0.32 });
    for (let k = 0; k < 8; k++) addShaker(buf, t0 + k * B / 2, { gain: k % 2 ? 0.09 : 0.15 });
    // pad chord
    ch.forEach((m, ci) => addTone(buf, t0, 4 * B * 0.98, note(m - 12), { gain: 0.05 + ci * 0.004, type: 'tri', a: 0.3, r: 0.6, detune: 0.004 }));
    // marimba melody
    if (bar % 2 === 0) {
      const n = scale[(bar * 2) % scale.length];
      addTone(buf, t0 + B, 0.3, note(n), { gain: 0.16, a: 0.004, d: 0.12, s: 0.1, r: 0.15, type: 'sine' });
      addTone(buf, t0 + 2 * B, 0.3, note(n - 3), { gain: 0.13, a: 0.004, d: 0.12, s: 0.1, r: 0.15 });
      addTone(buf, t0 + 2.75 * B, 0.3, note(n + 2), { gain: 0.11, a: 0.004, d: 0.12, s: 0.1, r: 0.15 });
    }
  }
}

function talk(buf) { // mellow conversational bed, Fmaj7 – Am7
  const chords = [[53, 57, 60, 64], [57, 60, 64, 67]];
  const bassN = [41, 45];
  for (let bar = 0; bar * 4 * B < SECONDS - 4; bar++) {
    const t0 = bar * 4 * B, ci = bar % 2;
    addTone(buf, t0, 4 * B, note(bassN[ci]), { gain: 0.12, type: 'sine', a: 0.05, r: 0.5 });
    chords[ci].forEach((m, j) => addTone(buf, t0 + j * 0.02, 4 * B * 0.95, note(m), { gain: 0.055, type: 'tri', a: 0.6, d: 1.5, s: 0.6, r: 0.9, detune: 0.003 }));
    addKick(buf, t0 + 1 * B, { gain: 0.35 }); addKick(buf, t0 + 3 * B, { gain: 0.35 });
    addShaker(buf, t0 + 0.5 * B, { gain: 0.05 }); addShaker(buf, t0 + 2.5 * B, { gain: 0.07 });
  }
}

function news(buf) { // news stinger bed, Dm pulse
  const ch = [50, 53, 57, 62];
  for (let bar = 0; bar * 4 * B < SECONDS - 4; bar++) {
    const t0 = bar * 4 * B;
    [0, 1, 2, 3].forEach((b) => {
      addKick(buf, t0 + b * B, { gain: 0.55 });
      ch.forEach((m, j) => addTone(buf, t0 + b * B + j * 0.008, 0.34, note(m), { gain: 0.07, type: 'tri', a: 0.005, d: 0.1, s: 0.25, r: 0.12 }));
    });
    addSnare(buf, t0 + B, { gain: 0.24 }); addSnare(buf, t0 + 3 * B, { gain: 0.28 });
    addShaker(buf, t0 + 0.5 * B, { gain: 0.08, hp: true }); addShaker(buf, t0 + 2.5 * B, { gain: 0.08, hp: true });
    if (bar % 4 === 3) addTone(buf, t0 + 3 * B, 1 * B, note(74), { gain: 0.09, a: 0.01, d: 0.2, s: 0.3, r: 0.3 });
  }
}

function lofi(buf) { // lofi interview bed, Dm9 – G7
  const chords = [[50, 53, 57, 60, 64], [43, 47, 50, 53, 59]];
  for (let bar = 0; bar * 4 * B < SECONDS - 4; bar++) {
    const t0 = bar * 4 * B, ch = chords[bar % 2];
    addKick(buf, t0); addKick(buf, t0 + 2.5 * B, { gain: 0.6 });
    addSnare(buf, t0 + B, { gain: 0.26, tone: 170 }); addSnare(buf, t0 + 3 * B, { gain: 0.26, tone: 170 });
    for (let k = 0; k < 4; k++) addShaker(buf, t0 + k * B + B / 2, { gain: 0.06 });
    ch.forEach((m, j) => addTone(buf, t0 + j * 0.03, 3.8 * B, note(m), { gain: 0.05, type: 'tri', a: 0.4, d: 1.2, s: 0.5, r: 1.2, detune: 0.006, lp: new LP(0.12) }));
    if (bar % 2 === 1) addTone(buf, t0 + 2 * B, 0.8, note(69 + [0, 3, 5, 7][bar % 4]), { gain: 0.08, a: 0.02, d: 0.3, s: 0.2, r: 0.3, lp: new LP(0.2) });
  }
  // vinyl crackle
  for (let i = 0; i < N; i++) if (Math.random() < 0.0012) buf[i] += (Math.random() - 0.5) * 0.12;
}

function sports(buf) { // stadium groove
  for (let bar = 0; bar * 4 * B < SECONDS - 4; bar++) {
    const t0 = bar * 4 * B;
    addKick(buf, t0); addKick(buf, t0 + 0.75 * B); addKick(buf, t0 + 2 * B); addKick(buf, t0 + 3 * B, { gain: 0.8 });
    addSnare(buf, t0 + B, { gain: 0.5 }); addSnare(buf, t0 + 2.5 * B, { gain: 0.35 }); addSnare(buf, t0 + 3.5 * B, { gain: 0.5 });
    for (let k = 0; k < 8; k++) addShaker(buf, t0 + k * B / 2, { gain: 0.1, hp: true });
    if (bar % 2 === 0) { addTone(buf, t0 + 2 * B, 0.5, note(57), { gain: 0.12, type: 'tri', a: 0.004, d: 0.2, s: 0.1, r: 0.2 }); addTone(buf, t0 + 2 * B, 0.5, note(64), { gain: 0.1, type: 'tri', a: 0.004, d: 0.2, s: 0.1, r: 0.2 }); }
  }
}

function faith(buf) { // ambient swell + bells
  const ch = [46, 53, 58, 62, 65];
  const bells = [70, 74, 77, 82, 74, 70, 77, 74];
  for (let bar = 0; bar * 4 * B < SECONDS - 6; bar++) {
    const t0 = bar * 4 * B;
    ch.forEach((m, j) => addTone(buf, t0 + j * 0.05, 4.4 * B, note(m), { gain: 0.045, type: 'tri', a: 1.2, d: 1.5, s: 0.55, r: 2.2, detune: 0.002, lp: new LP(0.1) }));
    addTone(buf, t0 + (bar % 4) * B, 1.6, note(bells[bar % bells.length]), { gain: 0.07, a: 0.004, d: 0.5, s: 0.08, r: 1.1 });
    addTone(buf, t0 + (bar % 4) * B, 1.6, note(bells[bar % bells.length]) * 2.01, { gain: 0.03, a: 0.004, d: 0.5, s: 0.05, r: 1.1 });
    addShaker(buf, t0 + 2 * B, { gain: 0.03 });
  }
}

// ---------- render + encode ----------
const tracks = { afro, talk, news, lofi, sports, faith };
const outDir = path.join(process.cwd(), 'public', 'audio');
fs.mkdirSync(outDir, { recursive: true });

for (const [name, compose] of Object.entries(tracks)) {
  const buf = new Float64Array(N);
  compose(buf);
  softClip(buf);
  const pcm = new Int16Array(N);
  for (let i = 0; i < N; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(buf[i] * 32767)));
  const enc = new lamejs.Mp3Encoder(1, SR, 64);
  const chunks = [];
  const BLOCK = 1152;
  for (let i = 0; i < N; i += BLOCK) {
    const out = enc.encodeBuffer(pcm.subarray(i, i + BLOCK));
    if (out.length) chunks.push(Buffer.from(out));
  }
  const flush = enc.flush();
  if (flush.length) chunks.push(Buffer.from(flush));
  const file = path.join(outDir, `eapn-${name}.mp3`);
  fs.writeFileSync(file, Buffer.concat(chunks));
  console.log(`${file} (${(fs.statSync(file).size / 1024).toFixed(0)} KB, ${SECONDS}s)`);
}
