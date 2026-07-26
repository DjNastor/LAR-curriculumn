import { GroovePreset } from "../types";

export const GROOVE_PRESETS: GroovePreset[] = [
  {
    id: "amapiano-logdrum",
    name: "Amapiano Log Drum & 3-Step Shaker",
    genre: "Amapiano",
    bpm: 113,
    description: "Signature pitch-bent sub log drum pattern with 3-step shaker syncopation"
  },
  {
    id: "afrohouse-conga",
    name: "Afro House Polyrhythmic Conga & Kick",
    genre: "Afro House",
    bpm: 122,
    description: "Deep 3-against-2 tribal conga syncopation with warm low-end kick"
  },
  {
    id: "edm-supersaw",
    name: "EDM Mainstage 4-on-the-Floor & Sidechain",
    genre: "Electronic Dance Music",
    bpm: 128,
    description: "High-impact kick drum with sidechained supersaw synth pumping"
  },
  {
    id: "musicbiz-harmonics",
    name: "Jazzy EP Chords & Harmonic Progression",
    genre: "Music Rights & Business",
    bpm: 110,
    description: "Lush 7th and 9th electric piano chords highlighting composition structure"
  }
];

class WebAudioGrooveEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentStep: number = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.currentStep = 0;
  }

  public playPreset(presetId: string, onStepChange?: (step: number) => void) {
    this.initCtx();
    this.stop();

    if (!this.ctx) return;

    this.isPlaying = true;
    const preset = GROOVE_PRESETS.find((p) => p.id === presetId) || GROOVE_PRESETS[0];
    const stepDurationMs = (60 / preset.bpm / 4) * 1000; // 16th note step time

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      this.triggerStep(preset.id, this.currentStep, now);

      if (onStepChange) {
        onStepChange(this.currentStep);
      }

      this.currentStep = (this.currentStep + 1) % 16;
    }, stepDurationMs);
  }

  private triggerStep(presetId: string, step: number, time: number) {
    if (!this.ctx) return;

    switch (presetId) {
      case "amapiano-logdrum":
        this.playAmapianoStep(step, time);
        break;
      case "afrohouse-conga":
        this.playAfroHouseStep(step, time);
        break;
      case "edm-supersaw":
        this.playEdmStep(step, time);
        break;
      case "musicbiz-harmonics":
        this.playHarmonicsStep(step, time);
        break;
      default:
        this.playAmapianoStep(step, time);
        break;
    }
  }

  // --- AMAPIANO LOG DRUM SYNTHESIS ---
  private playAmapianoStep(step: number, time: number) {
    if (!this.ctx) return;

    // Soft Kick on beats 0, 4, 8, 12
    if (step === 0 || step === 8) {
      this.playKick(time, 48, 0.25);
    }

    // 3-Step Shaker pattern
    if (step % 2 === 0 || step === 3 || step === 7 || step === 11 || step === 15) {
      this.playHiHat(time, step % 4 === 2 ? 0.08 : 0.04);
    }

    // Amapiano Rimshot on step 10 & 14
    if (step === 10 || step === 14) {
      this.playWoodblock(time, 800, 0.15);
    }

    // Log Drum Pitch Bends on steps 2, 6, 12, 13
    if (step === 2 || step === 6 || step === 12 || step === 13) {
      const pitch = step === 13 ? 110 : step === 12 ? 82.4 : 65.4; // Low E, C, C#
      this.playLogDrum(time, pitch, step === 13 ? 0.2 : 0.35);
    }
  }

  // --- AFRO HOUSE POLYRHYTHM SYNTHESIS ---
  private playAfroHouseStep(step: number, time: number) {
    if (!this.ctx) return;

    // Deep Four on the floor Kick
    if (step % 4 === 0) {
      this.playKick(time, 52, 0.35);
    }

    // Shakers on every 16th with accents
    const shakerVol = step % 4 === 2 ? 0.08 : step % 2 === 1 ? 0.05 : 0.03;
    this.playHiHat(time, shakerVol);

    // 3-against-2 Conga polyrhythm (steps 0, 3, 6, 9, 12, 15)
    if (step === 0 || step === 3 || step === 6 || step === 9 || step === 12 || step === 15) {
      const congaPitch = step === 0 ? 220 : step === 6 ? 280 : 330;
      this.playConga(time, congaPitch, 0.2);
    }
  }

  // --- EDM MAINSTAGE SYNTHESIS ---
  private playEdmStep(step: number, time: number) {
    if (!this.ctx) return;

    // Hard EDM Kick
    if (step % 4 === 0) {
      this.playKick(time, 65, 0.45);
    }

    // Offbeat Hat
    if (step % 4 === 2) {
      this.playHiHat(time, 0.12, true);
    }

    // Sidechained Supersaw Chord (Pumping on 16ths, ducked on beat)
    const isDucked = step % 4 === 0;
    const vol = isDucked ? 0.02 : 0.15;
    if (step % 2 === 0) {
      this.playSupersawChord(time, [261.63, 329.63, 392.00, 493.88], vol); // Cmaj7
    }
  }

  // --- MUSIC BIZ JAZZ EP CHORDS ---
  private playHarmonicsStep(step: number, time: number) {
    if (!this.ctx) return;

    if (step === 0) {
      this.playEPianoChord(time, [130.81, 196.00, 246.94, 293.66], 0.2); // Cmaj9
    } else if (step === 8) {
      this.playEPianoChord(time, [146.83, 220.00, 261.63, 329.63], 0.2); // Dm9
    }

    if (step % 4 === 2) {
      this.playHiHat(time, 0.03);
    }
  }

  // --- SYNTHESIS SOUND HELPERS ---
  private playKick(time: number, startFreq: number, gainVal: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.16);
  }

  private playLogDrum(time: number, baseFreq: number, duration: number) {
    if (!this.ctx) return;
    // Transient click + Sine sub with pitch drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq * 1.8, time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.04);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private playConga(time: number, freq: number, gainVal: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, time + 0.1);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.14);
  }

  private playHiHat(time: number, gainVal: number, open: boolean = false) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * (open ? 0.15 : 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.14 : 0.035));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(time);
  }

  private playWoodblock(time: number, freq: number, gainVal: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  private playSupersawChord(time: number, freqs: number[], gainVal: number) {
    if (!this.ctx) return;
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(gainVal, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(time);
      osc.stop(time + 0.26);
    });
  }

  private playEPianoChord(time: number, freqs: number[], gainVal: number) {
    if (!this.ctx) return;
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(gainVal, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(time);
      osc.stop(time + 0.85);
    });
  }
}

export const grooveEngine = new WebAudioGrooveEngine();
