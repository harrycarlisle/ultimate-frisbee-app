/* Private Gameplay Analyzer — client application */
(function () {
  'use strict';

  const LAB_ACCESS_CODE = 'ultimate-lab';
  const LAB_UNLOCK_KEY = 'ufc-gameplay-analyzer-unlocked';
  const API_BASE = detectApiBase();
  const PROGRESS_STEPS = [
    'extracting frames',
    'detecting players',
    'tracking movement',
    'mapping to board',
    'generating notes',
    'building animation',
  ];

  const state = {
    unlocked: false,
    demo: false,
    analysis: null,
    frameIndex: 0,
    clipStart: 2,
    clipEnd: 10.5,
    youtubeId: null,
    localVideoUrl: null,
    backendOnline: false,
    corrections: { dragPlayerId: null },
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function detectApiBase() {
    const p = new URLSearchParams(location.search);
    if (p.get('api')) return p.get('api').replace(/\/$/, '');
    if (location.port === '5055') return '';
    return '';
  }

  function isUnlocked() {
    try {
      return (
        localStorage.getItem(LAB_UNLOCK_KEY) === '1' ||
        new URLSearchParams(location.search).get('lab') === LAB_ACCESS_CODE
      );
    } catch (_e) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      localStorage.setItem(LAB_UNLOCK_KEY, '1');
    } catch (_e) {}
  }

  function syncLock() {
    state.unlocked = isUnlocked();
    $('#gaLockShell').hidden = state.unlocked;
    $('#gaAppShell').hidden = !state.unlocked;
  }

  function tryUnlock() {
    const val = $('#gaLockCode').value.trim();
    if (val === LAB_ACCESS_CODE) {
      setUnlocked();
      $('#gaLockError').hidden = true;
      syncLock();
      initApp();
      return;
    }
    $('#gaLockError').hidden = false;
  }

  async function pingBackend() {
    if (!API_BASE && location.port !== '5055') {
      state.backendOnline = false;
      $('#gaBackendStatus').textContent = 'Backend: not connected (demo/local exports only)';
      return;
    }
    try {
      const base = API_BASE || '';
      const res = await fetch(base + '/api/health', { signal: AbortSignal.timeout(2500) });
      state.backendOnline = res.ok;
      $('#gaBackendStatus').textContent = state.backendOnline
        ? 'Backend: connected (local pipeline available)'
        : 'Backend: unavailable — demo mode recommended';
    } catch (_e) {
      state.backendOnline = false;
      $('#gaBackendStatus').textContent = 'Backend: not connected (demo/local exports only)';
    }
  }

  function setYoutubePreview(url) {
    const id = parseYoutubeId(url);
    state.youtubeId = id;
    const box = $('#gaSourcePreview');
    if (!id) {
      box.innerHTML = '<div class="ga-placeholder-frame">Paste a YouTube URL for embed preview only. No download.</div>';
      return;
    }
    box.innerHTML =
      '<iframe title="YouTube preview" src="https://www.youtube.com/embed/' +
      id +
      '?rel=0" allowfullscreen loading="lazy"></iframe>';
  }

  function parseYoutubeId(url) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function onLocalFile(file) {
    if (!file) return;
    if (state.localVideoUrl) URL.revokeObjectURL(state.localVideoUrl);
    state.localVideoUrl = URL.createObjectURL(file);
    $('#gaSourcePreview').innerHTML =
      '<video id="gaLocalVideo" controls playsinline src="' + state.localVideoUrl + '"></video>';
    const v = $('#gaLocalVideo');
    v.onloadedmetadata = () => {
      state.clipEnd = Math.min(18, v.duration || 18);
      $('#gaClipEnd').value = state.clipEnd.toFixed(1);
      $('#gaClipEndVal').textContent = state.clipEnd.toFixed(1) + 's';
      updateClipDuration();
    };
  }

  function updateClipDuration() {
    state.clipStart = parseFloat($('#gaClipStart').value);
    state.clipEnd = parseFloat($('#gaClipEnd').value);
    const dur = Math.max(0, state.clipEnd - state.clipStart);
    $('#gaClipDuration').textContent = dur.toFixed(1) + 's';
    $('#gaClipStartVal').textContent = state.clipStart.toFixed(1) + 's';
    $('#gaClipEndVal').textContent = state.clipEnd.toFixed(1) + 's';
  }

  async function loadDemo() {
    setProgress(-1);
    state.demo = true;
    $('#gaDemoBadge').hidden = false;
    try {
      const data = await fetchAnalysis({ demo: true });
      applyAnalysis(data, true);
      setStatus('Demo possession loaded. All data is sample — not from live ML.');
    } catch (e) {
      setStatus('Failed to load demo: ' + e.message);
    }
  }

  async function fetchAnalysis(opts) {
    const base = API_BASE || '';
    if (opts.demo) {
      const sampleUrl = base + '/api/demo';
      try {
        const res = await fetch(sampleUrl);
        if (res.ok) return res.json();
      } catch (_e) {}
      const staticUrl = '../data/samples/demo_possession.json';
      const res2 = await fetch(staticUrl);
      if (!res2.ok) throw new Error('Sample data not found');
      const demo = await res2.json();
      const notesRes = await fetch('../data/samples/coaching_notes.json');
      const lessonRes = await fetch('../data/samples/lesson_export_sample.json');
      demo.notes = notesRes.ok ? await notesRes.json() : {};
      demo.lessonDraft = lessonRes.ok ? await lessonRes.json() : null;
      demo.demo = true;
      return buildBoardFramesClient(demo);
    }

    if (state.backendOnline && (opts.videoFile || opts.youtube)) {
      const fd = new FormData();
      if (opts.videoFile) fd.append('video', opts.videoFile);
      const payload = {
        demo: false,
        youtubeUrl: opts.youtube || null,
        startSec: state.clipStart,
        endSec: state.clipEnd,
      };
      fd.append('json', JSON.stringify(payload));
      const res = await fetch(base + '/api/analyze', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Analyze API failed');
      return res.json();
    }

    // Client-side fallback: demo with warning
    return fetchAnalysis({ demo: true });
  }

  function buildBoardFramesClient(data) {
    const tracks = data.tracks || {};
    const players = data.players || [];
    const maxF = Math.max(...Object.values(tracks).map((t) => t.length), 0);
    const frames = [];
    for (let fi = 0; fi < maxF; fi++) {
      const positions = {};
      players.forEach((p) => {
        const pts = tracks[p.id] || [];
        const xy = pts[fi] || pts[pts.length - 1] || [0.5, 0.5];
        positions[p.id] = { x: xy[0], y: xy[1], team: p.team, label: p.label };
      });
      let disc = { x: 0.5, y: 0.5, inAir: false };
      const kf = data.disc && data.disc.keyframes;
      if (kf) disc = interpolateDisc(kf, fi);
      frames.push({ frame: fi, positions, disc });
    }
    data.boardFrames = frames;
    return data;
  }

  function interpolateDisc(keyframes, frame) {
    if (!keyframes.length) return { x: 0.5, y: 0.5 };
    if (frame <= keyframes[0].frame) return { x: keyframes[0].x, y: keyframes[0].y, inAir: !!keyframes[0].inAir };
    if (frame >= keyframes[keyframes.length - 1].frame) {
      const k = keyframes[keyframes.length - 1];
      return { x: k.x, y: k.y, inAir: !!k.inAir };
    }
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i];
      const b = keyframes[i + 1];
      if (frame >= a.frame && frame <= b.frame) {
        const t = (frame - a.frame) / Math.max(b.frame - a.frame, 1);
        return {
          x: a.x + t * (b.x - a.x),
          y: a.y + t * (b.y - a.y),
          inAir: !!(a.inAir || b.inAir),
        };
      }
    }
    return { x: 0.5, y: 0.5 };
  }

  function setProgress(activeIdx) {
    $$('.ga-progress-step').forEach((el, i) => {
      el.classList.toggle('is-active', i === activeIdx);
      el.classList.toggle('is-done', activeIdx >= 0 && i < activeIdx);
    });
  }

  async function runAnalysis() {
    $('#gaAnalyzeBtn').disabled = true;
    state.demo = false;
    $('#gaDemoBadge').hidden = true;
    setStatus('Running analysis…');

    for (let i = 0; i < PROGRESS_STEPS.length; i++) {
      setProgress(i);
      await sleep(350);
    }
    setProgress(PROGRESS_STEPS.length);

    try {
      const youtube = $('#gaYoutubeUrl').value.trim();
      const fileInput = $('#gaVideoUpload');
      const file = fileInput.files && fileInput.files[0];
      let data;
      if (youtube && !file) {
        data = await fetchAnalysis({ youtube });
        if (data.pipelineMode === 'youtube_metadata_only') {
          state.demo = true;
          $('#gaDemoBadge').hidden = false;
          setStatus('YouTube metadata only — showing demo board. Upload permitted local footage for analysis.');
        }
      } else if (file) {
        data = await fetchAnalysis({ videoFile: file });
        setStatus(data.message || 'Local analysis complete (stub detector). Refine in corrections panel.');
      } else {
        data = await fetchAnalysis({ demo: true });
        state.demo = true;
        $('#gaDemoBadge').hidden = false;
        setStatus('No source selected — loaded demo possession.');
      }
      applyAnalysis(data, !!data.demo);
    } catch (e) {
      setStatus('Analysis error: ' + e.message);
    } finally {
      $('#gaAnalyzeBtn').disabled = false;
    }
  }

  function applyAnalysis(data, isDemo) {
    state.analysis = data;
    state.demo = isDemo;
    state.frameIndex = 0;
  if (data.clip) {
      state.clipStart = data.clip.startSec ?? state.clipStart;
      state.clipEnd = data.clip.endSec ?? state.clipEnd;
    }
    renderCorrections();
    renderNotes();
    renderBoard();
    renderVideoPanel();
    $('#gaResultsSection').hidden = false;
    $('#gaNotesSection').hidden = false;
    $('#gaExportSection').hidden = false;
    $('#gaCorrectionsSection').hidden = false;
    const maxF = (data.boardFrames?.length || 1) - 1;
    $('#gaFrameScrub').max = String(maxF);
  }

  function renderVideoPanel() {
    const panel = $('#gaVideoPanel');
    if (state.localVideoUrl) {
      panel.innerHTML =
        '<span class="ga-panel-label">Clip preview</span><video id="gaClipVideo" controls playsinline style="width:100%;min-height:280px" src="' +
        state.localVideoUrl +
        '"></video>';
      return;
    }
    if (state.youtubeId) {
      panel.innerHTML =
        '<span class="ga-panel-label">YouTube preview (no download)</span><div class="ga-placeholder-frame">Embed preview in source panel. Board driven by analysis data.</div>';
      return;
    }
    const fi = state.frameIndex;
    panel.innerHTML =
      '<span class="ga-panel-label">' +
      (state.demo ? 'Demo frame' : 'Frame') +
      '</span><div class="ga-placeholder-frame">Frame ' +
      (fi + 1) +
      ' / ' +
      (state.analysis?.boardFrames?.length || 0) +
      '<br><small>Upload local video for frame-synced preview</small></div>';
  }

  function fieldToSvg(x, y) {
    const pad = 24;
    const w = 280;
    const h = 420;
    return { x: pad + x * (w - pad * 2), y: pad + y * (h - pad * 2) };
  }

  function renderBoard() {
    const svg = $('#gaBoardSvg');
    if (!state.analysis || !state.analysis.boardFrames) {
      svg.innerHTML = '';
      return;
    }
    const fr = state.analysis.boardFrames[state.frameIndex] || state.analysis.boardFrames[0];
    const w = 280;
    const h = 420;
    let html =
      '<defs><linearGradient id="gaField" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#164f27"/><stop offset="100%" stop-color="#113d22"/></linearGradient></defs>';
    html += '<rect width="' + w + '" height="' + h + '" rx="12" fill="url(#gaField)"/>';
    html += '<rect x="18" y="18" width="244" height="384" rx="8" fill="none" stroke="rgba(255,255,255,.25)"/>';
    html += '<line x1="18" y1="90" x2="262" y2="90" stroke="rgba(255,255,255,.3)"/>';
    html += '<line x1="18" y1="330" x2="262" y2="330" stroke="rgba(255,255,255,.3)"/>';

    const positions = fr.positions || {};
    Object.entries(positions).forEach(([id, p]) => {
      const pt = fieldToSvg(p.x, p.y);
      const off = p.team === 'offense';
      const r = off ? 12 : 10;
      const fill = off ? '#1669e8' : '#171717';
      const stroke = off ? '#fff' : '#9b9b9b';
      html +=
        '<g class="ga-puck" data-player-id="' +
        id +
        '" transform="translate(' +
        (pt.x - r) +
        ',' +
        (pt.y - r) +
        ')"><circle cx="' +
        r +
        '" cy="' +
        r +
        '" r="' +
        r +
        '" fill="' +
        fill +
        '" stroke="' +
        stroke +
        '" stroke-width="2"/><text x="' +
        r +
        '" y="' +
        (r + 4) +
        '" text-anchor="middle" fill="#fff" font-size="9" font-weight="900">' +
        (p.label || id) +
        '</text></g>';
    });

    const disc = fr.disc || { x: 0.5, y: 0.5 };
    const dpt = fieldToSvg(disc.x, disc.y);
    html +=
      '<ellipse cx="' +
      dpt.x +
      '" cy="' +
      dpt.y +
      '" rx="11" ry="5" fill="#fff" opacity="0.95"/>';

    // throw route if available
    const throws = state.analysis.throws || [];
    throws.forEach((th) => {
      if (th.startFrame <= state.frameIndex && state.frameIndex <= th.endFrame) {
        const from = positions[th.fromId];
        const to = positions[th.toId];
        if (from && to) {
          const a = fieldToSvg(from.x, from.y);
          const b = fieldToSvg(to.x, to.y);
          html +=
            '<line x1="' +
            a.x +
            '" y1="' +
            a.y +
            '" x2="' +
            b.x +
            '" y2="' +
            b.y +
            '" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 5" opacity="0.85"/>';
        }
      }
    });

    svg.innerHTML = html;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    bindPuckDrag();
  }

  function bindPuckDrag() {
    $$('.ga-puck').forEach((g) => {
      g.onmousedown = (e) => startDrag(e, g.getAttribute('data-player-id'));
      g.ontouchstart = (e) => startDrag(e, g.getAttribute('data-player-id'));
    });
  }

  function startDrag(e, playerId) {
    e.preventDefault();
    state.corrections.dragPlayerId = playerId;
    const move = (ev) => {
      const svg = $('#gaBoardSvg');
      const pt = svgPoint(svg, ev);
      if (!pt || !state.analysis) return;
      const pad = 24;
      const w = 280;
      const h = 420;
      const nx = Math.max(0, Math.min(1, (pt.x - pad) / (w - pad * 2)));
      const ny = Math.max(0, Math.min(1, (pt.y - pad) / (h - pad * 2)));
      const fr = state.analysis.boardFrames[state.frameIndex];
      if (fr.positions[playerId]) {
        fr.positions[playerId].x = nx;
        fr.positions[playerId].y = ny;
        const tr = state.analysis.tracks[playerId];
        if (tr) tr[state.frameIndex] = [nx, ny];
        renderBoard();
      }
    };
    const up = () => {
      state.corrections.dragPlayerId = null;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
      setStatus('Puck position updated. Regenerate animation to apply across frames.');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  }

  function svgPoint(svg, ev) {
    const touch = ev.touches && ev.touches[0];
    const cx = touch ? touch.clientX : ev.clientX;
    const cy = touch ? touch.clientY : ev.clientY;
    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  }

  function renderNotes() {
    const grid = $('#gaNotesGrid');
    grid.innerHTML = '';
    const notes = state.analysis?.notes || {};
    Object.entries(notes).forEach(([key, n]) => {
      const card = document.createElement('article');
      card.className = 'ga-note-card';
      card.innerHTML =
        '<h3>' +
        escapeHtml(n.title) +
        '</h3><textarea data-note-key="' +
        key +
        '">' +
        escapeHtml(n.body) +
        '</textarea><span class="ga-tag ga-tag--' +
        (n.tag || 'neutral') +
        '">' +
        escapeHtml(n.tag || 'note') +
        '</span>';
      grid.appendChild(card);
    });
  }

  function renderCorrections() {
    const list = $('#gaPlayerList');
    list.innerHTML = '';
    (state.analysis?.players || []).forEach((p) => {
      const row = document.createElement('div');
      row.className = 'ga-player-row';
      row.innerHTML =
        '<strong>' +
        escapeHtml(p.id) +
        '</strong><input type="text" data-player-label="' +
        p.id +
        '" value="' +
        escapeHtml(p.label) +
        '" /><select data-player-team="' +
        p.id +
        '"><option value="offense"' +
        (p.team === 'offense' ? ' selected' : '') +
        '>Offense</option><option value="defense"' +
        (p.team === 'defense' ? ' selected' : '') +
        '>Defense</option></select><select data-player-role="' +
        p.id +
        '"><option value="handler"' +
        (p.role === 'handler' ? ' selected' : '') +
        '>Handler</option><option value="cutter"' +
        (p.role === 'cutter' ? ' selected' : '') +
        '>Cutter</option><option value="marker"' +
        (p.role === 'marker' ? ' selected' : '') +
        '>Marker</option></select>';
      list.appendChild(row);
    });
    list.onchange = list.oninput = () => {
      (state.analysis?.players || []).forEach((p) => {
        const label = list.querySelector('[data-player-label="' + p.id + '"]');
        const team = list.querySelector('[data-player-team="' + p.id + '"]');
        const role = list.querySelector('[data-player-role="' + p.id + '"]');
        if (label) p.label = label.value;
        if (team) p.team = team.value;
        if (role) p.role = role.value;
      });
      renderBoard();
    };
  }

  function collectEditedNotes() {
    const notes = { ...(state.analysis?.notes || {}) };
    $$('#gaNotesGrid textarea').forEach((ta) => {
      const key = ta.getAttribute('data-note-key');
      if (key && notes[key]) notes[key].body = ta.value;
    });
    return notes;
  }

  function exportJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportAnimation() {
    if (!state.analysis) return;
    exportJson('analyzer-animation.json', {
      title: state.analysis.title || 'Possession',
      boardFrames: state.analysis.boardFrames,
      throws: state.analysis.throws,
      demo: state.demo,
    });
  }

  function exportLesson() {
    if (!state.analysis) return;
    const lesson = state.analysis.lessonDraft || {
      title: state.analysis.title || 'Exported lesson',
      steps: (state.analysis.boardFrames || []).filter((_, i) => i % 28 === 0).map((fr, i) => ({
        title: 'Step ' + (i + 1),
        body: collectEditedNotes().drill?.body || '',
        positions: fr.positions,
        disc: fr.disc,
        routes: [],
      })),
      coachingSummary: Object.values(collectEditedNotes())
        .map((n) => n.body)
        .join(' '),
      metadata: { demo: state.demo, exportedAt: new Date().toISOString() },
    };
    exportJson('learn-ultimate-lesson-draft.json', lesson);
  }

  function exportCoachingSummary() {
    const notes = collectEditedNotes();
    const text = Object.values(notes)
      .map((n) => n.title + ': ' + n.body)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'coaching-summary.txt';
    a.click();
  }

  function exportBoardFrames() {
    if (!state.analysis?.boardFrames) return;
    exportJson('board-frames.json', { frames: state.analysis.boardFrames });
  }

  function regenerateAnimation() {
    if (!state.analysis?.boardFrames) return;
    setStatus('Animation regenerated from current board state.');
    renderBoard();
  }

  function setStatus(msg) {
    $('#gaStatusLine').textContent = msg;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function initApp() {
    pingBackend();
    $('#gaYoutubeUrl').oninput = (e) => setYoutubePreview(e.target.value);
    $('#gaVideoUpload').onchange = (e) => onLocalFile(e.target.files[0]);
    $('#gaClipStart').oninput = $('#gaClipEnd').oninput = updateClipDuration;
    $('#gaAnalyzeBtn').onclick = runAnalysis;
    $('#gaDemoBtn').onclick = loadDemo;
    $('#gaFrameScrub').oninput = (e) => {
      state.frameIndex = parseInt(e.target.value, 10) || 0;
      $('#gaFrameVal').textContent = state.frameIndex + 1;
      renderBoard();
      renderVideoPanel();
    };
    $('#gaExportAnim').onclick = exportAnimation;
    $('#gaExportLesson').onclick = exportLesson;
    $('#gaExportSummary').onclick = exportCoachingSummary;
    $('#gaExportFrames').onclick = exportBoardFrames;
    $('#gaRegenAnim').onclick = regenerateAnimation;
    $('#gaMarkDisc').onclick = () => setStatus('Disc keyframe marking: click board in a future build. Use demo disc track for now.');
    updateClipDuration();
  }

  function boot() {
    if (new URLSearchParams(location.search).get('lab') === LAB_ACCESS_CODE) setUnlocked();
    syncLock();
    $('#gaUnlockBtn').onclick = tryUnlock;
    $('#gaLockCode').onkeydown = (e) => {
      if (e.key === 'Enter') tryUnlock();
    };
    if (state.unlocked) initApp();
  }

  boot();
})();
