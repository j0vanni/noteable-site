export const KEY_SCALES: Record<string, string[]> = {
  C: ["c", "d", "e", "f", "g", "a", "b"],
  G: ["g", "a", "b", "c", "d", "e", "f#"],
  D: ["d", "e", "f#", "g", "a", "b", "c#"],
  A: ["a", "b", "c#", "d", "e", "f#", "g#"],
  E: ["e", "f#", "g#", "a", "b", "c#", "d#"],
  B: ["b", "c#", "d#", "e", "f#", "g#", "a#"],
  "F#": ["f#", "g#", "a#", "b", "c#", "d#", "e#"],
  F: ["f", "g", "a", "bb", "c", "d", "e"],
  Bb: ["bb", "c", "d", "eb", "f", "g", "a"],
  Eb: ["eb", "f", "g", "ab", "bb", "c", "d"],
  Ab: ["ab", "bb", "c", "db", "eb", "f", "g"],
  Db: ["db", "eb", "f", "gb", "ab", "bb", "c"],
};

const CLEF_OCTAVES: Record<string, number[]> = {
  treble: [4, 5],
  bass: [2, 3],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomOctave(clef: string): number {
  const octaves = CLEF_OCTAVES[clef] ?? [4, 5];
  return randomItem(octaves);
}

function toVexKey(pitchClass: string, octave: number): string {
  return `${pitchClass}/${octave}`;
}

function scaleKeysForClef(key: string, clef: string): string[] {
  const scale = KEY_SCALES[key] ?? KEY_SCALES["C"];
  const octaves = CLEF_OCTAVES[clef] ?? [4, 5];
  const keys: string[] = [];
  for (const octave of octaves) {
    for (const pc of scale) {
      keys.push(toVexKey(pc, octave));
    }
  }
  return keys;
}

export function generateNote(key: string, clef: string): string[] {
  const allKeys = scaleKeysForClef(key, clef);
  return [randomItem(allKeys)];
}

export function generateInterval(key: string, clef: string): string[] {
  const scale = KEY_SCALES[key] ?? KEY_SCALES["C"];
  const octave = randomOctave(clef);

  const rootIdx = Math.floor(Math.random() * (scale.length - 1));
  const intervalSteps = Math.floor(Math.random() * 5) + 1;
  const topIdx = (rootIdx + intervalSteps) % scale.length;
  const topOctave =
    rootIdx + intervalSteps >= scale.length ? octave + 1 : octave;

  return [toVexKey(scale[rootIdx], octave), toVexKey(scale[topIdx], topOctave)];
}

export function generateChord(key: string, clef: string): string[] {
  const scale = KEY_SCALES[key] ?? KEY_SCALES["C"];
  const octave = randomOctave(clef);
  const rootIdx = Math.floor(Math.random() * scale.length);
  const size = Math.random() < 0.5 ? 3 : 4;

  const notes: string[] = [];
  for (let i = 0; i < size; i++) {
    const idx = (rootIdx + i * 2) % scale.length;
    const extraOctave = rootIdx + i * 2 >= scale.length ? 1 : 0;
    notes.push(toVexKey(scale[idx], octave + extraOctave));
  }

  return notes;
}
