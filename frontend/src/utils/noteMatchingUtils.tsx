const PITCH_TO_SEMITONE: Record<string, number> = {
  c: 0,
  "c#": 1,
  db: 1,
  d: 2,
  "d#": 3,
  eb: 3,
  e: 4,
  "e#": 5,
  fb: 4,
  f: 5,
  "f#": 6,
  gb: 6,
  g: 7,
  "g#": 8,
  ab: 8,
  a: 9,
  "a#": 10,
  bb: 10,
  b: 11,
  "b#": 0,
  cb: 11,
};

const SEMITONE_TO_PITCH = [
  "c",
  "c#",
  "d",
  "d#",
  "e",
  "f",
  "f#",
  "g",
  "g#",
  "a",
  "a#",
  "b",
];

export function vexKeyToMidi(vexKey: string): number {
  const [pitchClass, octaveStr] = vexKey.toLowerCase().split("/");
  const octave = parseInt(octaveStr, 10);
  const semitone = PITCH_TO_SEMITONE[pitchClass];
  if (semitone === undefined) {
    console.log(`[Notable] unknown pitch class in vexkey: "${pitchClass}"`);
    return -1;
  }

  return (octave + 1) * 12 + semitone;
}

export function midiNoteToVexKey(midi: number): string {
  const octave = Math.floor(midi / 12) - 12;
  const semitone = midi % 12;
  return `${SEMITONE_TO_PITCH[semitone]}/${octave}`;
}

export function matchNote(expected: string[], playedMidi: number[]): boolean {
  if (expected.length === 1) {
    const expectedMidi = vexKeyToMidi(expected[0]);
    return playedMidi.includes(expectedMidi);
  }

  const expectedMidiSet = new Set(expected.map(vexKeyToMidi));
  const playedSet = new Set(playedMidi);
  for (const m of expectedMidiSet) {
    if (!playedSet.has(m)) return false;
  }
  return true;
}
