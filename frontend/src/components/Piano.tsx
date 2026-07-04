const WHITE_KEY_W = 36;
const WHITE_KEY_H = 120;
const BLACK_KEY_W = 22;
const BLACK_KEY_H = 76;

const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

const BLACK_OFFSETS: Array<{
  semitone: number;
  whiteKeyIndex: number;
  fraction: number;
}> = [
  { semitone: 1, whiteKeyIndex: 0, fraction: 0.65 },
  { semitone: 3, whiteKeyIndex: 1, fraction: 0.65 },
  { semitone: 6, whiteKeyIndex: 3, fraction: 0.65 },
  { semitone: 8, whiteKeyIndex: 4, fraction: 0.65 },
  { semitone: 10, whiteKeyIndex: 5, fraction: 0.65 },
];

const START_OCTAVE = 3;
const NUM_OCTAVES = 3;

interface KeyInfo {
  midi: number;
  x: number;
  isBlack: boolean;
}

function buildKeyMap(): KeyInfo[] {
  const keys: KeyInfo[] = [];

  for (let oct = 0; oct < NUM_OCTAVES; oct++) {
    const octaveBase = (START_OCTAVE + 1 + oct) * 12;

    WHITE_SEMITONES.forEach((semitone, i) => {
      keys.push({
        midi: octaveBase + semitone,
        x: (oct * WHITE_SEMITONES.length + i) * WHITE_KEY_W,
        isBlack: false,
      });
    });

    const octaveWhiteStart = oct * WHITE_SEMITONES.length;
    BLACK_OFFSETS.forEach(({ semitone, whiteKeyIndex, fraction }) => {
      const leftWhiteX = (octaveWhiteStart + whiteKeyIndex) * WHITE_KEY_W;
      keys.push({
        midi: octaveBase + semitone,
        x: leftWhiteX + WHITE_KEY_W * fraction - BLACK_KEY_W / 2,
        isBlack: true,
      });
    });

    return keys;
  }
}

const KEY_MAP = buildKeyMap();
const PIANO_WIDTH = NUM_OCTAVES * WHITE_SEMITONES.length * WHITE_KEY_W;

export interface PianoProps {
  onNoteOn: (midiNote: number, velocity: number) => void;
  activeNotes?: number[];
}

export default function Piano({ onNoteOn, activeNotes = [] }: PianoProps) {
  const activeSet = new Set(activeNotes);

  const whites = KEY_MAP.filter((k) => !k.isBlack);
  const blacks = KEY_MAP.filter((k) => k.isBlack);

  return (
    <div
      style={{
        position: "relative",
        width: PIANO_WIDTH,
        height: WHITE_KEY_H,
        userSelect: "none",
      }}
      aria-label="piano keyboard"
    >
      {whites.map((key) => (
        <button
          key={key.midi}
          onPointerDown={(e) => {
            e.preventDefault();
            onNoteOn(key.midi, 100);
          }}
          aria-label={`Note ${key.midi}`}
          style={{
            position: "absolute",
            left: key.x,
            top: 0,
            width: WHITE_KEY_W - 2,
            height: WHITE_KEY_H,
            background: activeSet.has(key.midi) ? "var(--accent)" : "white",
            border: "1px solid #888",
            borderRadius: "0 0 4px 4px",
            cursor: "pointer",
            padding: 0,
            zIndex: 1,
            transition: "background 0.1s",
          }}
        />
      ))}
      {blacks.map((key) => (
        <button
          key={key.midi}
          onPointerDown={(e) => {
            e.preventDefault();
            onNoteOn(key.midi, 100);
          }}
          aria-label={`Note ${key.midi}`}
          style={{
            position: "absolute",
            left: key.x,
            top: 0,
            width: BLACK_KEY_W,
            height: BLACK_KEY_H,
            background: activeSet.has(key.midi) ? "var(--accent)" : "#1a1a1a",
            border: "1px solid #000",
            borderRadius: "0 0 4px 4px",
            cursor: "pointer",
            padding: 0,
            zIndex: 2,
            transition: "background 0.1s",
          }}
        />
      ))}
    </div>
  );
}
