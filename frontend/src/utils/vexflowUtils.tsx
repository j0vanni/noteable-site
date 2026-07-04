import { Formatter, Renderer, Stave, StaveNote, Voice } from "vexflow";

export type HighlightState = "idle" | "correct" | "wrong";

interface RenderOptions {
  width?: number;
  height?: number;
}

export function renderStave(
  container: HTMLElement,
  notes: string[],
  clef: "treble" | "bass",
  keySignature: string,
  highlight: HighlightState = "idle",
  opts: RenderOptions = {},
): void {
  container.innerHTML = "";

  const width = opts.width ?? 420;
  const height = opts.height ?? 160;

  const renderer = new Renderer(
    container as HTMLDivElement,
    Renderer.Backends.SVG,
  );
  renderer.resize(width, height);
  const context = renderer.getContext();

  const stave = new Stave(10, 30, width - 20);
  stave.addClef(clef).addKeySignature(keySignature);
  stave.setContext(context).draw();

  const staveNote = new StaveNote({
    clef,
    keys: notes,
    duration: "q",
  });

  const colors: Record<HighlightState, string> = {
    idle: "#e8e8f0",
    correct: "#22c55e",
    wrong: "#ef4444",
  };
  const color = colors[highlight];
  staveNote.setStyle({ fillStyle: color, strokeStyle: color });

  const voice = new Voice({ numBeats: 1, beatValue: 4 });
  voice.setStrict(false);
  voice.addTickables([staveNote]);

  new Formatter().joinVoices([voice]).format([voice], width - 40);
  voice.draw(context, stave);
}
