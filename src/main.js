import CaptionStyles from './styles.js';
import VideoSize from './video-size.js';
import { normalize, srt, fmSrt, parseSrt } from './captions.js';
import { extractAudioTrack } from './audio-extractor.js';
import { getStoredKey, saveStoredKey, getStoredModel, saveStoredModel, transcribeAudioBuffer } from './gemini.js';
import { renderVideoWithCaptions } from './video-renderer.js';

// DOM Selectors
const $ = id => document.getElementById(id);
const video = $('video');

// Application State
let currentFile = null;
let audioBuffer = null;
let captions = [];
let selectedIndex = -1;
let history = [];
let abortController = null;
let currentStyle = CaptionStyles.choose('hormozi');
let currentAspect = '9:16';

// Toast Notification
function toast(msg, duration = 4000) {
  const el = $('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    el.style.display = 'none';
  }, duration);
}

// Busy Modal Helpers
function showBusy(title, message = 'Processing...') {
  $('busyTitle').textContent = title;
  $('busyMessage').textContent = message;
  $('busyProgress').value = 0;
  $('busyDialog').showModal();
}

function updateBusy(message, percent = 0) {
  $('busyMessage').textContent = message;
  $('busyProgress').value = percent;
}

function hideBusy() {
  try {
    $('busyDialog').close();
  } catch (e) {}
}

$('cancelBusyBtn').onclick = () => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  hideBusy();
  toast('Operation cancelled.');
};

// Snapshot for Undo
function snapshot() {
  history.push(JSON.stringify({ captions, currentStyle }));
  if (history.length > 30) history.shift();
}

// Format Seconds into MM:SS
const fmt = s => `${String(Math.floor((s || 0) / 60)).padStart(2, '0')}:${String(Math.floor((s || 0) % 60)).padStart(2, '0')}`;

// Bottom Navigation Switching
const navItems = document.querySelectorAll('.nav-item');
const panels = {
  video: $('videoPanel'),
  captions: $('captionsPanel'),
  style: $('stylePanel'),
  fonts: $('fontsPanel'),
  export: $('exportPanel')
};

navItems.forEach(item => {
  item.onclick = () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const tab = item.dataset.tab;
    Object.keys(panels).forEach(key => {
      panels[key].hidden = key !== tab;
    });
  };
});

// Video Picking & Loading
$('chooseVideoBtn').onclick = () => $('videoFileInput').click();
$('repickVideoBtn').onclick = () => $('videoFileInput').click();

$('videoFileInput').onchange = async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  await loadVideoFile(file);
};

async function loadVideoFile(file) {
  currentFile = file;
  const url = URL.createObjectURL(file);
  video.src = url;

  showBusy('Loading Video', 'Decoding audio for Gemini AI transcription...');
  try {
    audioBuffer = await extractAudioTrack(file, updateBusy);
    $('emptyState').hidden = true;
    $('videoWrap').hidden = false;
    $('videoDetailsText').textContent = `${file.name} · ${fmt(audioBuffer.duration)} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    hideBusy();
    toast('Video and audio loaded successfully!');
  } catch (err) {
    hideBusy();
    toast(err.message || 'Error decoding video audio.');
  }
}

// Aspect Ratio Handling
$('aspectRatioSelect').onchange = e => {
  currentAspect = e.target.value;
  const wrap = $('videoWrap');
  if (currentAspect === '9:16') {
    wrap.style.aspectRatio = '9/16';
  } else if (currentAspect === '1:1') {
    wrap.style.aspectRatio = '1/1';
  } else if (currentAspect === '16:9') {
    wrap.style.aspectRatio = '16/9';
  } else {
    wrap.style.aspectRatio = 'auto';
  }
};

// Video Transport Controls
$('playBtn').onclick = () => {
  if (video.paused) {
    video.play().catch(() => toast('Playback error'));
    $('playBtn').textContent = 'Ⅱ';
  } else {
    video.pause();
    $('playBtn').textContent = '▶';
  }
};

$('backBtn').onclick = () => {
  video.currentTime = Math.max(0, video.currentTime - 5);
};

$('fwdBtn').onclick = () => {
  video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
};

$('seekBar').oninput = e => {
  if (video.duration) {
    video.currentTime = (Number(e.target.value) / 1000) * video.duration;
  }
};

// Continuous Playback & Caption Overlay Loop
function renderOverlay() {
  if (video.duration) {
    $('timeDisplay').textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
    $('seekBar').value = (video.currentTime / video.duration) * 1000;
  }

  const el = $('captionOverlay');
  if (!captions.length || video.paused && !video.currentTime) {
    el.replaceChildren();
    requestAnimationFrame(renderOverlay);
    return;
  }

  const t = video.currentTime;
  const activeCaption = captions.find(c => t >= c.start && t < c.end);
  const s = CaptionStyles.resolve(currentStyle);
  const scale = ($('videoWrap').clientHeight || 400) / 1080;

  if (activeCaption) {
    drawCaptionElement(el, activeCaption, s, t, scale);
  } else {
    el.replaceChildren();
  }

  requestAnimationFrame(renderOverlay);
}
requestAnimationFrame(renderOverlay);

function drawCaptionElement(el, c, s, t, scale) {
  const parts = CaptionStyles.frame(c, s, t);
  el.replaceChildren();

  const inner = document.createElement('span');
  inner.className = 'caption-inner';

  if (s.motion) {
    const m = CaptionStyles.motion(c, s, t);
    inner.style.display = 'inline-block';
    inner.style.maxWidth = '100%';
    inner.style.opacity = m.opacity;
    inner.style.transform = `translate(${m.x * scale}px, ${m.y * scale}px) scale(${m.scale})`;
    inner.style.transformOrigin = s.position === 'top' ? 'center top' : s.position === 'bottom' ? 'center bottom' : 'center';
  }

  parts.forEach(p => {
    const span = document.createElement('span');
    span.textContent = p.text;
    span.style.color = p.color;
    if (s.mode === 'reveal') span.style.webkitTextStroke = s.outline * scale + 'px ' + p.color;
    if (p.fontScale) span.style.fontSize = p.fontScale * 100 + '%';
    if (p.opacity !== undefined) span.style.opacity = p.opacity;
    inner.append(span);
  });

  el.style.fontFamily = `"${s.font}", "Nirmala UI", sans-serif`;
  el.style.fontSize = Math.max(16, s.size * scale) + 'px';
  el.style.webkitTextStroke = (s.box || s.mode === 'reveal' ? 0 : s.outline * scale) + 'px ' + (s.glow ? s.accent : '#121218');
  el.style.textShadow = s.glow
    ? `0 0 ${7 * scale}px ${s.accent}`
    : s.shadow
    ? `${s.shadow * scale}px ${s.shadow * scale}px ${(s.mode === 'reveal' ? 3 : 1) * scale}px #000`
    : 'none';

  inner.style.background = s.box ? 'rgba(18, 18, 24, 0.85)' : 'transparent';
  inner.style.padding = s.box ? `${4 * scale}px ${8 * scale}px` : '0';
  inner.style.borderRadius = s.box ? `${6 * scale}px` : '0';

  el.style.bottom = s.position === 'bottom' ? '9%' : s.position === 'middle' ? '50%' : 'auto';
  el.style.top = s.position === 'top' ? '9%' : 'auto';
  el.style.transform = s.position === 'middle' ? 'translateY(50%)' : 'none';

  el.append(inner);
}

// Live Style Demo Box in Style Panel
const sampleCaption = { start: 0, end: 4, text: 'ඔබේ කතාව ලස්සනට කියන්න' };
setInterval(() => {
  if (!$('stylePanel').hidden) {
    const el = $('styleDemoText');
    const s = CaptionStyles.resolve(currentStyle);
    drawCaptionElement(el, sampleCaption, s, (performance.now() / 1000) % 4, 0.45);
  }
}, 100);

// Captions UI List Rendering
function renderCaptionsList() {
  const list = $('captionList');
  $('captionCountLabel').textContent = `${captions.length} clips`;
  list.replaceChildren();

  if (!captions.length) {
    list.innerHTML = '<p class="subtext" style="text-align: center; margin: 24px 0;">Generate captions or add lines manually.</p>';
    return;
  }

  captions.forEach((c, idx) => {
    const card = document.createElement('div');
    card.className = 'caption-card' + (selectedIndex === idx ? ' selected' : '');

    const head = document.createElement('div');
    head.className = 'caption-head';
    head.innerHTML = `<span>#${idx + 1} · ${fmt(c.start)}</span>`;

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.title = 'Delete';
    delBtn.onclick = e => {
      e.stopPropagation();
      snapshot();
      captions.splice(idx, 1);
      renderCaptionsList();
    };
    head.append(delBtn);

    const textarea = document.createElement('textarea');
    textarea.value = c.text;
    textarea.onfocus = () => snapshot();
    textarea.oninput = () => {
      c.text = textarea.value;
    };

    const times = document.createElement('div');
    times.className = 'caption-times';

    const startInp = document.createElement('input');
    startInp.type = 'number';
    startInp.step = '0.1';
    startInp.value = c.start.toFixed(2);
    startInp.onchange = () => {
      snapshot();
      c.start = Number(startInp.value) || 0;
      captions.sort((a, b) => a.start - b.start);
      renderCaptionsList();
    };

    const endInp = document.createElement('input');
    endInp.type = 'number';
    endInp.step = '0.1';
    endInp.value = c.end.toFixed(2);
    endInp.onchange = () => {
      snapshot();
      c.end = Number(endInp.value) || 0;
      captions.sort((a, b) => a.start - b.start);
      renderCaptionsList();
    };

    times.append(startInp, endInp);

    card.append(head, textarea, times);
    card.onclick = () => {
      selectedIndex = idx;
      video.currentTime = c.start;
      renderCaptionsList();
    };
    list.append(card);
  });
}

// Add & Undo Caption Actions
$('addCaptionBtn').onclick = () => {
  if (!video.duration) return toast('Import a video first.');
  snapshot();
  const cur = video.currentTime;
  captions.push({
    start: cur,
    end: Math.min(cur + 2.5, video.duration),
    text: 'ඔබේ වචන මෙතැනින්'
  });
  captions.sort((a, b) => a.start - b.start);
  renderCaptionsList();
  toast('Caption line added.');
};

$('undoBtn').onclick = () => {
  if (!history.length) return toast('Nothing to undo.');
  const prev = JSON.parse(history.pop());
  captions = prev.captions;
  currentStyle = prev.currentStyle;
  renderCaptionsList();
  syncStyleInputs();
  toast('Action undone.');
};

// Generate Captions with Gemini Flash
$('generateBtn').onclick = async () => {
  if (!audioBuffer) return toast('Please choose a video first.');
  const apiKey = getStoredKey();
  if (!apiKey) {
    openSettingsDialog();
    toast('Please enter your Gemini API key.');
    return;
  }

  showBusy('Finding your words', 'Google Gemini Flash is listening...');
  abortController = new AbortController();

  try {
    const lang = $('languageSelect').value;
    const model = getStoredModel();
    const result = await transcribeAudioBuffer({
      audioBuffer,
      apiKey,
      model,
      language: lang,
      onProgress: updateBusy,
      signal: abortController.signal
    });

    snapshot();
    captions = result;
    renderCaptionsList();
    hideBusy();
    toast(`Done! ${result.length} caption phrases ready.`);
    // Switch to captions panel
    document.querySelector('[data-tab="captions"]').click();
  } catch (err) {
    hideBusy();
    toast(err.message || 'Caption generation failed.');
  }
};

// Build Presets Grid & SinCap Category Filtering
function initPresets() {
  const grid = $('presetGrid');
  grid.replaceChildren();

  CaptionStyles.presets.forEach(p => {
    const card = document.createElement('div');
    card.className = 'preset-card' + (currentStyle.id === p.id ? ' chosen' : '');
    card.dataset.preset = p.id;
    card.dataset.category = p.category || 'popular';
    card.dataset.motion = p.motion ? 'yes' : 'no';

    const swatch = document.createElement('div');
    swatch.className = 'preset-swatch';
    const preview = document.createElement('span');
    drawCaptionElement(preview, sampleCaption, CaptionStyles.choose(p.id), 1.6, 0.28);
    swatch.append(preview);

    const title = document.createElement('strong');
    title.textContent = p.name + (p.motion ? ' ✦' : '');

    const hint = document.createElement('small');
    hint.textContent = p.hint;

    card.append(swatch, title, hint);
    card.onclick = () => {
      snapshot();
      currentStyle = CaptionStyles.choose(p.id, currentStyle);
      syncStyleInputs();
      toast(`${p.name} applied to all captions.`);
    };

    grid.append(card);
  });

  // Filter Buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const filter = btn.dataset.filter;

      document.querySelectorAll('#presetGrid .preset-card').forEach(card => {
        if (filter === 'all') card.hidden = false;
        else if (filter === 'motion') card.hidden = card.dataset.motion !== 'yes';
        else card.hidden = card.dataset.category !== filter;
      });
    };
  });
}

function syncStyleInputs() {
  const s = CaptionStyles.resolve(currentStyle);
  $('fontSizeRange').value = s.size;
  $('sizeValue').textContent = s.size;
  $('textColorInput').value = s.color;
  $('accentColorInput').value = s.accent;
  $('outlineRange').value = s.outline;
  $('outlineValue').textContent = s.outline;
  $('shadowRange').value = s.shadow;
  $('shadowValue').textContent = s.shadow;
  $('positionSelect').value = s.position;

  document.querySelectorAll('#presetGrid .preset-card').forEach(c => {
    c.classList.toggle('chosen', c.dataset.preset === s.preset);
  });
  document.querySelectorAll('#fontGrid .font-card').forEach(c => {
    c.classList.toggle('chosen', c.dataset.font === s.font);
  });
}

// Style Customizers
$('fontSizeRange').oninput = e => {
  currentStyle.size = Number(e.target.value);
  $('sizeValue').textContent = e.target.value;
};
$('textColorInput').oninput = e => {
  currentStyle.color = e.target.value;
};
$('accentColorInput').oninput = e => {
  currentStyle.accent = e.target.value;
};
$('outlineRange').oninput = e => {
  currentStyle.outline = Number(e.target.value);
  $('outlineValue').textContent = e.target.value;
};
$('shadowRange').oninput = e => {
  currentStyle.shadow = Number(e.target.value);
  $('shadowValue').textContent = e.target.value;
};
$('positionSelect').onchange = e => {
  currentStyle.position = e.target.value;
};

$('applyAllStyleBtn').onclick = () => {
  snapshot();
  syncStyleInputs();
  toast('Style successfully applied to all captions.');
};

// Build 19 Bundled Sinhala Fonts Grid
function initFonts() {
  const grid = $('fontGrid');
  grid.replaceChildren();

  CaptionStyles.fontCatalog.forEach(f => {
    if (!f.bundled) return;
    const card = document.createElement('div');
    card.className = 'font-card' + (currentStyle.font === f.family ? ' chosen' : '');
    card.dataset.font = f.family;

    const head = document.createElement('div');
    head.className = 'font-head';
    head.innerHTML = `<span>${f.name}</span><small style="color: #a48ecc;">✓</small>`;

    const sample = document.createElement('span');
    sample.className = 'font-sample';
    sample.style.fontFamily = `"${f.family}", sans-serif`;
    sample.textContent = 'ඔබේ කතාව ලස්සනට කියන්න';

    const hint = document.createElement('small');
    hint.textContent = f.hint;

    card.append(head, sample, hint);
    card.onclick = () => {
      snapshot();
      currentStyle.font = f.family;
      syncStyleInputs();
      toast(`${f.name} font applied.`);
    };

    grid.append(card);
  });
}

// Download or Share File Utility
async function shareOrDownloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const file = new File([blob], filename, { type: mimeType });

  // Native Mobile Web Share if supported
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: filename
      });
      toast(`${filename} shared successfully!`);
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
    }
  }

  // Standard File Download fallback
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`${filename} downloaded.`);
}

// Export Handlers
$('exportUnicodeSrtBtn').onclick = async () => {
  if (!captions.length) return toast('Generate or add captions first.');
  const baseName = currentFile?.name?.replace(/\.[^.]+$/, '') || 'Captions';
  const content = srt(normalize(captions, video.duration || 86400));
  await shareOrDownloadFile(`${baseName}-Unicode.srt`, content, 'text/plain');
};

$('exportFmSrtBtn').onclick = async () => {
  if (!captions.length) return toast('Generate or add captions first.');
  const baseName = currentFile?.name?.replace(/\.[^.]+$/, '') || 'Captions';
  const content = fmSrt(normalize(captions, video.duration || 86400));
  await shareOrDownloadFile(`${baseName}-FM.srt`, content, 'text/plain');
};

$('importSrtBtn').onclick = () => $('srtFileInput').click();
$('srtFileInput').onchange = async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const parsed = parseSrt(text);
  if (parsed.length) {
    snapshot();
    captions = normalize(parsed, video.duration || 86400);
    renderCaptionsList();
    toast(`Imported ${parsed.length} subtitles.`);
    document.querySelector('[data-tab="captions"]').click();
  } else {
    toast('No valid captions found in this SRT file.');
  }
};

$('saveProjectBtn').onclick = async () => {
  const baseName = currentFile?.name?.replace(/\.[^.]+$/, '') || 'Project';
  const data = JSON.stringify({
    version: 1,
    name: baseName,
    captions,
    style: currentStyle,
    aspect: currentAspect
  }, null, 2);
  await shareOrDownloadFile(`${baseName}.lnkcap`, data, 'application/json');
};

// Burned-In Video Export
$('exportVideoBtn').onclick = async () => {
  if (!video.src) return toast('Please choose a video first.');
  if (!captions.length) return toast('Generate captions first.');

  showBusy('Rendering Video', 'Drawing styled subtitles on video frames...');
  abortController = new AbortController();

  try {
    const { blob, mimeType } = await renderVideoWithCaptions({
      videoElement: video,
      captions,
      style: currentStyle,
      onProgress: updateBusy,
      signal: abortController.signal
    });

    hideBusy();
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const baseName = currentFile?.name?.replace(/\.[^.]+$/, '') || 'Video';
    await shareOrDownloadFile(`${baseName}-LNKcap.${ext}`, blob, mimeType);
  } catch (err) {
    hideBusy();
    toast(err.message || 'Video export error.');
  }
};

// Settings Modal Handling
function openSettingsDialog() {
  $('apiKeyInput').value = getStoredKey();
  $('modelSelect').value = getStoredModel();
  $('settingsMessage').textContent = '';
  $('settingsDialog').showModal();
}

$('settingsBtn').onclick = openSettingsDialog;
$('closeSettingsBtn').onclick = () => $('settingsDialog').close();

$('saveSettingsBtn').onclick = () => {
  const key = $('apiKeyInput').value.trim();
  const model = $('modelSelect').value;
  saveStoredKey(key);
  saveStoredModel(model);
  $('settingsDialog').close();
  toast('Gemini settings saved.');
};

$('clearKeyBtn').onclick = () => {
  saveStoredKey('');
  $('apiKeyInput').value = '';
  toast('API key removed.');
};

// PWA Service Worker & Install Prompt Handling
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = $('installAppBtn');
  if (btn) btn.style.display = 'inline-flex';
});

const installBtn = $('installAppBtn');
if (installBtn) {
  installBtn.onclick = async () => {
    if (!deferredInstallPrompt) {
      toast('To install, tap browser menu (⋮) -> "Install App" / "Add to Home Screen".');
      return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      toast('LNKcap installed to your device!');
      installBtn.style.display = 'none';
    }
    deferredInstallPrompt = null;
  };
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('ServiceWorker registration error:', err);
    });
  });
}

// Initialize App
initPresets();
initFonts();
syncStyleInputs();
renderCaptionsList();
