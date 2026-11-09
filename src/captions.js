// Captions normalization, SRT generation, and FM Wijesekara SRT generation
import FmConverter from './fm-converter.js';
import CaptionStyles from './styles.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function normalize(items, duration = 86400) {
  if (!Array.isArray(items)) return [];
  return items
    .map(c => ({
      start: clamp(Number(c.start), 0, duration),
      end: clamp(Number(c.end), 0, duration),
      text: String(c.text ?? '').trim()
    }))
    .filter(c => Number.isFinite(c.start) && Number.isFinite(c.end) && c.end > c.start && c.text)
    .sort((a, b) => a.start - b.start);
}

export function time(t, ass = false) {
  let n = Math.round(Math.max(0, t) * (ass ? 100 : 1000));
  const scale = ass ? 100 : 1000;
  const frac = n % scale;
  n = Math.floor(n / scale);
  const s = n % 60;
  n = Math.floor(n / 60);
  const m = n % 60;
  const h = Math.floor(n / 60);
  return `${ass ? h : String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}${ass ? '.' : ','}${String(frac).padStart(ass ? 2 : 3, '0')}`;
}

export function srt(c) {
  return c.map((x, i) => `${i + 1}\n${time(x.start)} --> ${time(x.end)}\n${x.text}\n`).join('\n');
}

export function fmSrt(c) {
  const converter = FmConverter?.unicodeToFm ? FmConverter : window?.FmConverter;
  return c.map((x, i) => {
    const fmText = converter ? converter.unicodeToFm(x.text) : x.text;
    return `${i + 1}\n${time(x.start)} --> ${time(x.end)}\n${fmText}\n`;
  }).join('\n');
}

export function parseSrt(t) {
  return t
    .replace(/^\uFEFF/, '')
    .replace(/\r/g, '')
    .trim()
    .split(/\n\s*\n/)
    .map(b => {
      const lines = b.split('\n');
      const i = lines.findIndex(l => l.includes('-->'));
      if (i < 0) return null;
      const p = lines[i].match(/(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)/);
      if (!p) return null;
      const sec = o => +p[o] * 3600 + +p[o + 1] * 60 + +p[o + 2] + Number('0.' + p[o + 3]);
      return { start: sec(1), end: sec(5), text: lines.slice(i + 1).join('\n') };
    })
    .filter(Boolean);
}

export default { normalize, time, srt, fmSrt, parseSrt };
