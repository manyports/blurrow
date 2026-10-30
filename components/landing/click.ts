"use client";

/* A short mechanical click, synthesised so there's no audio file to load:
   a burst of filtered noise for the contact, a low blip for the body.
   Only ever played in response to a press, never on its own.         */
let ctx: AudioContext | null = null;

export function playClick({ pitch = 1, volume = 0.18 }: { pitch?: number; volume?: number } = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    ctx ??= new AudioContext();
    const now = ctx.currentTime;

    const len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 3200 * pitch;
    band.Q.value = 0.9;
    const nGain = ctx.createGain();
    nGain.gain.value = volume;
    noise.connect(band).connect(nGain).connect(ctx.destination);
    noise.start(now);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(60 * pitch, now + 0.06);
    const oGain = ctx.createGain();
    oGain.gain.setValueAtTime(volume * 0.9, now);
    oGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(oGain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // No audio is fine; the click is a nicety
  }
}
