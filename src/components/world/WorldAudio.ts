/**
 * WorldAudio - Procedural Web Audio API Sound Synthesizer
 * Zero external audio downloads, instant playback, 100% lightweight & offline-ready.
 */

export class WorldAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isEngineRunning: boolean = false;

  // Background Music (BGM)
  private bgmAudio: HTMLAudioElement | null = null;
  private isMusicEnabled: boolean = true;
  private musicVolume: number = 0.35;

  constructor() {
    // AudioContext and BGM will be initialized on first user interaction
    if (typeof window !== "undefined") {
      try {
        const savedMusic = localStorage.getItem("dluckyx_music_enabled");
        if (savedMusic !== null) {
          this.isMusicEnabled = savedMusic === "true";
        }
      } catch {}
    }
  }

  public init(): void {
    this.initContext();
    this.initBGM();
  }

  public initBGM(): void {
    if (typeof window === "undefined") return;
    if (!this.bgmAudio) {
      try {
        this.bgmAudio = new Audio("/assets/musik/backsond.mp3");
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.musicVolume;
        this.bgmAudio.preload = "auto";
      } catch {
        // audio unavailable
      }
    }

    if (this.isMusicEnabled && !this.isMuted) {
      this.playMusic();
    }
  }

  public playMusic(): void {
    if (!this.bgmAudio) {
      this.initBGM();
    }
    if (this.bgmAudio && this.isMusicEnabled && !this.isMuted) {
      this.bgmAudio.volume = this.musicVolume;
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy: will start upon next user click
        });
      }
    }
  }

  public pauseMusic(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  public setMusicEnabled(enabled: boolean): boolean {
    this.isMusicEnabled = enabled;
    try {
      localStorage.setItem("dluckyx_music_enabled", String(enabled));
    } catch {}

    if (enabled && !this.isMuted) {
      this.playMusic();
    } else {
      this.pauseMusic();
    }
    return this.isMusicEnabled;
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  public toggleMusic(): boolean {
    return this.setMusicEnabled(!this.isMusicEnabled);
  }

  private initContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        return this.ctx;
      }
    } catch {
      // AudioContext unavailable
    }
    return null;
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.isMuted) {
      if (this.engineGain) {
        this.engineGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
      }
      this.pauseMusic();
    } else {
      if (this.isMusicEnabled) {
        this.playMusic();
      }
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound: Golden Coin Collection Chime (Chirpy dual sine wave)
   */
  public playCoin() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Rapid arpeggio (B5 -> E6)
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  /**
   * Sound: Jump / Spring launch whoosh
   */
  public playJump() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Sound: Water Splash when entering water or landing a ramp
   */
  public playSplash() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  /**
   * Sound: Soccer Ball Kick Thud
   */
  public playKick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Sound: Turbo Nitro Boost
   */
  public playBoost() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.35);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Sound: GOAL! / Celebration Fanfare
   */
  public playGoal() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major Triad + Octave

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + 1.2);
    });
  }

  /**
   * Sound: Arcade Objective Chime (Crystal clear ascending bell chime)
   */
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [880, 1174.66, 1760]; // A5 -> D6 -> A6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.35);
    });
  }

  /**
   * Sound: Arcade Challenge Victory Fanfare
   */
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    melody.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + 1.5);
    });
  }

  /**
   * Sound: Classic Retro 8-Bit Game Over Fanfare
   */
  public playGameOver() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [493.88, 440.0, 392.0, 329.63, 261.63]; // B4, A4, G4, E4, C4 descending
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.16);

      gain.gain.setValueAtTime(0, now + idx * 0.16);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.16 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.16);
      osc.stop(now + idx * 0.16 + 0.38);
    });
  }

  /**
   * Sound: UI Menu Hover Tick (Subtle tactile high click)
   */
  public playMenuHover() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.02);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  /**
   * Sound: UI Menu Select Confirmation (Crisp pleasant dual chord)
   */
  public playMenuSelect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  /**
   * Sound: UI Menu Back / Cancel (Soft descending blip)
   */
  public playMenuBack() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.07);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Sound: Gentle tactile footstep on turf / wood / sand
   */
  public playFootstep() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.045);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Sound: Continuous Sprint Wind / Thruster Hum (Frequency scaled with speed)
   */
  public updateEngineSound(speed: number, isSprinting: boolean = false) {
    if (this.isMuted || !isSprinting || speed < 2.0) {
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      }
      return;
    }

    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.isEngineRunning || !this.engineOsc || !this.engineGain) {
      this.engineOsc = ctx.createOscillator();
      this.engineGain = ctx.createGain();

      this.engineOsc.type = "triangle";
      this.engineOsc.frequency.setValueAtTime(80, ctx.currentTime);
      this.engineGain.gain.setValueAtTime(0.03, ctx.currentTime);

      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(ctx.destination);

      this.engineOsc.start();
      this.isEngineRunning = true;
    }

    const targetFreq = 70 + Math.min(speed * 12, 160);
    const targetVol = Math.min(0.02 + speed * 0.008, 0.05);

    this.engineOsc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.05);
    this.engineGain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.05);
  }

  public dispose() {
    this.pauseMusic();
    if (this.bgmAudio) {
      this.bgmAudio.src = "";
      this.bgmAudio = null;
    }
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch {}
      this.engineOsc = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
