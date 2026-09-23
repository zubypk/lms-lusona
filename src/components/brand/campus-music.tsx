import { Volume2, VolumeX } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MUTE_KEY = "lms.musicMuted";
const BPM = 66;
const BEAT = 60 / BPM;
const EIGHTH = BEAT / 2;

type MusicState = {
  muted: boolean;
  ready: boolean;
  setMuted: (muted: boolean) => void;
  toggle: () => void;
  ensurePlaying: () => void;
};

const MusicContext = createContext<MusicState | null>(null);

function midi(n: number) {
  return 440 * 2 ** ((n - 69) / 12);
}

/** Public-domain salon progression (Canon in C), arpeggiated — not a drone. */
const BARS: { bass: number; chord: number[]; melody: number }[] = [
  { bass: 48, chord: [60, 64, 67, 72], melody: 76 },
  { bass: 43, chord: [55, 59, 62, 67], melody: 74 },
  { bass: 45, chord: [57, 60, 64, 69], melody: 72 },
  { bass: 40, chord: [52, 55, 59, 64], melody: 71 },
  { bass: 41, chord: [53, 57, 60, 65], melody: 69 },
  { bass: 48, chord: [52, 60, 64, 67], melody: 67 },
  { bass: 41, chord: [53, 57, 60, 65], melody: 69 },
  { bass: 43, chord: [55, 59, 62, 67], melody: 71 },
];

const ARP = [0, 2, 3, 1, 3, 2, 0, 1];

class CampusPiano {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private dry: GainNode | null = null;
  private wet: GainNode | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private bar = 0;
  private started = false;

  /** Must run synchronously inside a user gesture (iOS). */
  unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext({ latencyHint: "playback" });
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  start() {
    const ctx = this.unlock();
    if (this.started) return;
    this.started = true;

    const master = ctx.createGain();
    master.gain.value = 0;
    const dry = ctx.createGain();
    dry.gain.value = 0.85;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.45;

    const delay1 = ctx.createDelay();
    delay1.delayTime.value = 0.29;
    const delay2 = ctx.createDelay();
    delay2.delayTime.value = 0.43;
    const fb1 = ctx.createGain();
    fb1.gain.value = 0.28;
    const fb2 = ctx.createGain();
    fb2.gain.value = 0.2;
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 1800;

    dry.connect(filter);
    wet.connect(delay1);
    delay1.connect(fb1);
    fb1.connect(damp);
    damp.connect(delay2);
    delay2.connect(fb2);
    fb2.connect(delay1);
    delay1.connect(filter);
    delay2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    this.dry = dry;
    this.wet = wet;
    this.nextTime = ctx.currentTime + 0.08;
    this.step = 0;
    this.bar = 0;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 120);
  }

  private tick() {
    const ctx = this.ctx;
    if (!ctx || !this.dry || !this.wet) return;
    const horizon = ctx.currentTime + 0.9;
    while (this.nextTime < horizon) {
      this.scheduleStep(this.nextTime);
      this.nextTime += EIGHTH;
      this.step += 1;
      if (this.step >= 8) {
        this.step = 0;
        this.bar = (this.bar + 1) % BARS.length;
      }
    }
  }

  private scheduleStep(when: number) {
    const bar = BARS[this.bar]!;
    const ctx = this.ctx!;
    if (this.step === 0) {
      this.note(midi(bar.bass), when, BEAT * 3.6, 0.07, 0, "bass");
      this.note(midi(bar.melody), when + 0.03, BEAT * 3.2, 0.045, 0.22, "lead");
    }
    const chordTone = bar.chord[ARP[this.step]!]!;
    const pan = this.step % 2 === 0 ? -0.28 : 0.28;
    this.note(midi(chordTone), when, BEAT * 1.15, 0.038, pan, "arp");
  }

  private note(
    freq: number,
    when: number,
    dur: number,
    vel: number,
    pan: number,
    kind: "bass" | "arp" | "lead",
  ) {
    const ctx = this.ctx!;
    const dry = this.dry!;
    const wet = this.wet!;
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, when);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(Math.max(vel, 0.001), when + (kind === "bass" ? 0.03 : 0.012));
    env.gain.exponentialRampToValueAtTime(0.0001, when + dur);

    const harmonics =
      kind === "bass"
        ? [
            [1, 1],
            [2.003, 0.18],
          ]
        : kind === "lead"
          ? [
              [1, 1],
              [2.002, 0.22],
              [3.01, 0.08],
            ]
          : [
              [1, 1],
              [2.004, 0.16],
              [4.01, 0.05],
            ];

    const oscs: OscillatorNode[] = [];
    for (const [mult, amp] of harmonics) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * mult, when);
      g.gain.value = amp;
      osc.connect(g);
      g.connect(env);
      osc.start(when);
      osc.stop(when + dur + 0.05);
      oscs.push(osc);
    }

    env.connect(panner);
    panner.connect(dry);
    panner.connect(wet);
    const last = oscs[oscs.length - 1];
    if (last) {
      last.onended = () => {
        env.disconnect();
        panner.disconnect();
      };
    }
  }

  setMuted(muted: boolean) {
    if (!this.master || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(muted ? 0 : 0.22, now, 0.18);
    if (!muted) this.unlock();
  }

  stop() {
    if (this.timer != null) window.clearInterval(this.timer);
    this.timer = null;
    this.started = false;
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.dry = null;
    this.wet = null;
  }
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const piano = useRef(new CampusPiano());
  const mutedRef = useRef(false);
  const [muted, setMutedState] = useState(false);
  const [ready, setReady] = useState(false);

  const ensurePlaying = () => {
    piano.current.unlock();
    piano.current.start();
    piano.current.setMuted(mutedRef.current);
    setReady(true);
  };

  useEffect(() => {
    try {
      mutedRef.current = window.localStorage.getItem(MUTE_KEY) === "1";
      setMutedState(mutedRef.current);
    } catch {
      /* ignore */
    }
    const onFirst = () => ensurePlaying();
    window.addEventListener("pointerdown", onFirst, { once: true });
    window.addEventListener("keydown", onFirst, { once: true });
    const onVis = () => {
      if (document.visibilityState === "visible") piano.current.unlock();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
      document.removeEventListener("visibilitychange", onVis);
      piano.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start once
  }, []);

  const setMuted = (next: boolean) => {
    mutedRef.current = next;
    setMutedState(next);
    try {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    piano.current.setMuted(next);
    if (!next) ensurePlaying();
  };

  const value = useMemo<MusicState>(
    () => ({
      muted,
      ready,
      setMuted,
      toggle: () => setMuted(!mutedRef.current),
      ensurePlaying,
    }),
    [muted, ready],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("MusicProvider missing");
  return ctx;
}

export function MusicToggle({ light = false, className }: { light?: boolean; className?: string }) {
  const { muted, toggle, ensurePlaying } = useMusic();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "h-11 gap-1.5 px-2.5 sm:px-3",
        light ? "border-white/20 bg-white/8 text-white hover:bg-white/12" : "border-line bg-surface text-ink",
        className,
      )}
      aria-label={muted ? "Unmute campus piano" : "Mute campus piano"}
      aria-pressed={!muted}
      onClick={() => {
        ensurePlaying();
        toggle();
      }}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span className="text-[11px] font-medium sm:text-xs">{muted ? "Music off" : "Music on"}</span>
    </Button>
  );
}
