// Client-side Video Renderer with burned-in styled subtitles using HTML5 Canvas & MediaRecorder
import CaptionStyles from './styles.js';

export async function renderVideoWithCaptions({ videoElement, captions, style, onProgress = () => {}, signal }) {
  if (!videoElement || !videoElement.duration) throw new Error('No video loaded.');
  if (!captions.length) throw new Error('No captions to burn into video.');

  const video = videoElement;
  const width = video.videoWidth || 1080;
  const height = video.videoHeight || 1920;
  const duration = video.duration;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Video playback setup for offline drawing
  const prevTime = video.currentTime;
  const prevMuted = video.muted;
  video.pause();
  video.currentTime = 0;

  // Set up audio stream from video element
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioDest = null;
  let audioCtx = null;
  if (AudioContextClass) {
    try {
      audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaElementSource(video);
      audioDest = audioCtx.createMediaStreamDestination();
      source.connect(audioDest);
      source.connect(audioCtx.destination);
    } catch (e) {
      console.warn('Audio capture warning:', e);
    }
  }

  const canvasStream = canvas.captureStream(30);
  if (audioDest && audioDest.stream.getAudioTracks().length) {
    canvasStream.addTrack(audioDest.stream.getAudioTracks()[0]);
  }

  let mimeType = 'video/mp4';
  if (!MediaRecorder.isTypeSupported('video/mp4')) {
    mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=h264')
      ? 'video/webm;codecs=h264'
      : 'video/webm';
  }

  const recorder = new MediaRecorder(canvasStream, {
    mimeType,
    videoBitsPerSecond: 6000000 // 6 Mbps high quality
  });

  const chunks = [];
  recorder.ondataavailable = e => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  return new Promise(async (resolve, reject) => {
    recorder.onstop = () => {
      video.muted = prevMuted;
      video.currentTime = prevTime;
      const blob = new Blob(chunks, { type: mimeType });
      resolve({ blob, mimeType });
    };

    recorder.onerror = err => {
      video.currentTime = prevTime;
      reject(err);
    };

    recorder.start();

    // Start video playback and render frames to canvas
    try {
      await video.play();
    } catch (e) {
      recorder.stop();
      return reject(new Error('Cannot start video playback for rendering: ' + e.message));
    }

    const resolvedStyle = CaptionStyles.resolve(style);
    const scale = height / 1080;

    function drawFrame() {
      if (signal?.aborted || video.ended || video.currentTime >= duration) {
        recorder.stop();
        video.pause();
        return;
      }

      const t = video.currentTime;
      onProgress(`Rendering video frames: ${Math.round((t / duration) * 100)}%`, Math.round((t / duration) * 100));

      // 1. Draw video background
      ctx.drawImage(video, 0, 0, width, height);

      // 2. Find active caption
      const activeCaption = captions.find(c => t >= c.start && t < c.end);
      if (activeCaption) {
        const parts = CaptionStyles.frame(activeCaption, resolvedStyle, t);
        const fullText = parts.map(p => p.text).join('');

        const fontSize = Math.round(resolvedStyle.size * scale);
        ctx.font = `bold ${fontSize}px "${resolvedStyle.font}", "Nirmala UI", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = width / 2;
        let y = height * 0.91; // bottom
        if (resolvedStyle.position === 'top') y = height * 0.09;
        if (resolvedStyle.position === 'middle') y = height / 2;

        // Apply motion if present
        let motionScale = 1;
        let motionY = 0;
        if (resolvedStyle.motion) {
          const m = CaptionStyles.motion(activeCaption, resolvedStyle, t);
          motionScale = m.scale;
          motionY = m.y * scale;
        }

        ctx.save();
        ctx.translate(x, y + motionY);
        ctx.scale(motionScale, motionScale);

        // Draw subtitle box if enabled
        if (resolvedStyle.box) {
          const metrics = ctx.measureText(fullText);
          const boxWidth = metrics.width + 32 * scale;
          const boxHeight = fontSize * 1.5;
          ctx.fillStyle = 'rgba(18, 18, 24, 0.85)';
          ctx.beginPath();
          ctx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 8 * scale);
          ctx.fill();
        }

        // Draw text stroke / glow
        if (resolvedStyle.outline > 0) {
          ctx.lineWidth = resolvedStyle.outline * scale * 2;
          ctx.strokeStyle = resolvedStyle.glow ? resolvedStyle.accent : '#121218';
          ctx.lineJoin = 'round';
          ctx.strokeText(fullText, 0, 0);
        }

        // Draw text shadow
        if (resolvedStyle.shadow > 0 && !resolvedStyle.glow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = resolvedStyle.shadow * scale * 2;
          ctx.shadowOffsetX = resolvedStyle.shadow * scale;
          ctx.shadowOffsetY = resolvedStyle.shadow * scale;
        }

        // Draw parts
        let currentX = -ctx.measureText(fullText).width / 2;
        ctx.textAlign = 'left';
        parts.forEach(part => {
          ctx.fillStyle = part.color || '#ffffff';
          ctx.fillText(part.text, currentX, 0);
          currentX += ctx.measureText(part.text).width;
        });

        ctx.restore();
      }

      requestAnimationFrame(drawFrame);
    }

    drawFrame();
  });
}
