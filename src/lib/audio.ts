class AudioManager {
  private sounds: Map<string, HTMLAudioElement[]> = new Map();
  private enabled = true;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private getOrCreate(name: string, src: string, poolSize = 3): HTMLAudioElement[] {
    if (this.sounds.has(name)) return this.sounds.get(name)!;

    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = 0.5;
      pool.push(audio);
    }
    this.sounds.set(name, pool);
    return pool;
  }

  play(name: string) {
    if (!this.enabled) return;

    const srcMap: Record<string, string> = {
      pop: "/sounds/pop.mp3",
      wrong: "/sounds/wrong.mp3",
      combo: "/sounds/combo.mp3",
      achievement: "/sounds/achievement.mp3",
      gameOver: "/sounds/game-over.mp3",
      phaseUp: "/sounds/phase-up.mp3",
    };

    const src = srcMap[name];
    if (!src) return;

    const pool = this.getOrCreate(name, src);
    const available = pool.find((a) => a.paused || a.ended) || pool[0];
    available.currentTime = 0;
    available.play().catch(() => {});
  }
}

export const audioManager = typeof window !== "undefined" ? new AudioManager() : null;
