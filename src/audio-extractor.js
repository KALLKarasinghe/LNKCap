// Web Audio API browser-based audio extractor and 16kHz mono WAV encoder
// Works completely offline in mobile browsers (Android / iOS / WebView) without ffmpeg binary!

export async function extractAudioTrack(videoFile, onProgress = () => {}) {
  onProgress('Reading video file from device...', 10);
  const arrayBuffer = await videoFile.arrayBuffer();

  onProgress('Decoding audio track with mobile hardware...', 30);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error('Web Audio API is not supported on this browser.');
  
  const audioCtx = new AudioContextClass();
  let audioBuffer;
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    audioCtx.close().catch(() => {});
    throw new Error('Could not decode audio from this video. Please ensure the video has an audio track.');
  } finally {
    audioCtx.close().catch(() => {});
  }

  onProgress('Audio track decoded successfully.', 50);
  return audioBuffer;
}

/**
 * Encodes a section of an AudioBuffer into 16kHz 16-bit mono WAV.
 * 16kHz mono WAV is the speech-recognition standard and takes only ~32KB per second!
 */
export function encode16kMonoWav(audioBuffer, startSec = 0, durationSec = null) {
  const targetSampleRate = 16000;
  const start = Math.max(0, startSec);
  const dur = durationSec ? Math.min(durationSec, audioBuffer.duration - start) : (audioBuffer.duration - start);
  const targetLength = Math.max(1, Math.floor(dur * targetSampleRate));

  const pcm16 = new Int16Array(targetLength);
  const numSrcChannels = audioBuffer.numberOfChannels;
  const srcSampleRate = audioBuffer.sampleRate;
  const srcData = [];
  for (let c = 0; c < numSrcChannels; c++) {
    srcData.push(audioBuffer.getChannelData(c));
  }

  const startSample = Math.floor(start * srcSampleRate);
  for (let i = 0; i < targetLength; i++) {
    const srcIndex = startSample + Math.floor((i * srcSampleRate) / targetSampleRate);
    let sample = 0;
    for (let c = 0; c < numSrcChannels; c++) {
      sample += srcData[c][srcIndex] || 0;
    }
    sample /= numSrcChannels;
    const clamped = Math.max(-1, Math.min(1, sample));
    pcm16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }

  const wavBuffer = new ArrayBuffer(44 + pcm16.byteLength);
  const view = new DataView(wavBuffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcm16.byteLength, true);
  writeString(8, 'WAVE');
  // Subchunk 1 (fmt)
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // Linear quantization (PCM)
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, targetSampleRate, true);
  view.setUint32(28, targetSampleRate * 2, true); // Byte rate (16000 * 2)
  view.setUint16(32, 2, true); // Block align (1 * 16/8)
  view.setUint16(34, 16, true); // Bits per sample
  // Subchunk 2 (data)
  writeString(36, 'data');
  view.setUint32(40, pcm16.byteLength, true);

  // Copy PCM bytes
  new Uint8Array(wavBuffer, 44).set(new Uint8Array(pcm16.buffer));
  return wavBuffer;
}

/**
 * Converts ArrayBuffer to Base64 in chunks to prevent call-stack overflow on mobile.
 */
export function bufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
