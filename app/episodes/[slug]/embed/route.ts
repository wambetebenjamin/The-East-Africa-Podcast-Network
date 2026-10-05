import { NextResponse } from 'next/server';
import { getEpisode, getShow } from '@/lib/data';
import { site } from '@/lib/site';

/**
 * Standalone embeddable player for an episode — served as raw HTML so an
 * external iframe never loads the full app runtime. Matches the 180px
 * height referenced by ShareButtons' embed snippet.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const revalidate = 300;

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const ep = getEpisode(params.slug);
  if (!ep) {
    return NextResponse.json({ ok: false, error: 'Episode not found' }, { status: 404 });
  }

  const showTitle = getShow(ep.showSlug)?.title ?? site.name;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(ep.title)} — ${esc(site.name)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a0a; color: #fff;
    display: flex; align-items: center;
    padding: 14px 16px; gap: 14px;
  }
  a { color: inherit; text-decoration: none; }
  .art { position: relative; width: 84px; height: 84px; flex: none; border-radius: 4px; overflow: hidden; background: #1a1a1a; }
  .art img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .art button {
    position: absolute; inset: 0; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(10,10,10,0.45); border: 0; cursor: pointer;
    transition: background .2s ease;
  }
  .art button:hover { background: rgba(10,10,10,0.65); }
  .art svg { width: 30px; height: 30px; fill: #fff; filter: drop-shadow(0 1px 4px rgba(0,0,0,.6)); }
  .meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .show { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #f23a2e; font-weight: 300; }
  .title { font-size: 15px; font-weight: 400; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .bar { position: relative; height: 4px; border-radius: 2px; background: rgba(255,255,255,.18); cursor: pointer; margin-top: 6px; }
  .bar-fill { position: absolute; inset: 0 auto 0 0; width: 0%; border-radius: 2px; background: #f23a2e; }
  .times { display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,.55); font-weight: 300; font-variant-numeric: tabular-nums; }
  .cta { font-size: 12px; color: rgba(255,255,255,.7); white-space: nowrap; }
  .cta:hover { color: #f23a2e; }
  .cta svg { vertical-align: -2px; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
</head>
<body>
  <div class="art">
    <img src="${esc(ep.artwork)}" alt="">
    <button id="toggle" aria-label="Play episode" aria-pressed="false">
      <svg id="ic-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      <svg id="ic-pause" viewBox="0 0 24 24" style="display:none"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
    </button>
  </div>
  <div class="meta">
    <span class="show">${esc(showTitle)}</span>
    <span class="title">${esc(ep.title)}</span>
    <div class="bar" id="bar" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
      <div class="bar-fill" id="fill"></div>
    </div>
    <div class="times"><span id="cur">0:00</span><span id="dur">${Math.floor(ep.duration / 60)}:${String(ep.duration % 60).padStart(2, '0')}</span></div>
  </div>
  <a class="cta" href="${esc(site.url)}/episodes/${esc(ep.slug)}" target="_blank" rel="noopener">Listen on EAPN
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg>
  </a>
  <audio id="au" src="${esc(ep.audio)}" preload="metadata"></audio>
<script>
(function () {
  var au = document.getElementById('au'),
      btn = document.getElementById('toggle'),
      play = document.getElementById('ic-play'),
      pause = document.getElementById('ic-pause'),
      fill = document.getElementById('fill'),
      bar = document.getElementById('bar'),
      cur = document.getElementById('cur'),
      dur = document.getElementById('dur');
  function fmt(s) {
    if (!isFinite(s)) return '0:00';
    s = Math.round(s);
    return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
  }
  function setIcon(playing) {
    play.style.display = playing ? 'none' : 'block';
    pause.style.display = playing ? 'block' : 'none';
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pause episode' : 'Play episode');
  }
  btn.addEventListener('click', function () {
    if (au.paused) { au.play(); } else { au.pause(); }
  });
  au.addEventListener('play', function () { setIcon(true); });
  au.addEventListener('pause', function () { setIcon(false); });
  au.addEventListener('timeupdate', function () {
    var pct = au.duration ? (au.currentTime / au.duration) * 100 : 0;
    fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    cur.textContent = fmt(au.currentTime);
  });
  au.addEventListener('loadedmetadata', function () { dur.textContent = fmt(au.duration); });
  function seek(ev) {
    var r = bar.getBoundingClientRect();
    var x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
    if (au.duration) au.currentTime = Math.max(0, Math.min(1, x / r.width)) * au.duration;
  }
  bar.addEventListener('click', seek);
  var dragging = false;
  bar.addEventListener('touchstart', function (ev) { dragging = true; seek(ev); }, { passive: true });
  bar.addEventListener('touchmove', function (ev) { if (dragging) seek(ev); }, { passive: true });
  bar.addEventListener('keydown', function (ev) {
    if (!au.duration) return;
    if (ev.key === 'ArrowRight') { au.currentTime = Math.min(au.duration, au.currentTime + 5); ev.preventDefault(); }
    if (ev.key === 'ArrowLeft') { au.currentTime = Math.max(0, au.currentTime - 5); ev.preventDefault(); }
  });
})();
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
