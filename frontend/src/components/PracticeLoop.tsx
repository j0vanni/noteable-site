import React, { useCallback, useEffect, useState } from "react";
import type { HighlightState } from "../utils/vexflowUtils";
import type { SessionState } from "../hooks/usePracticeSession";
import SheetMusic from "./SheetMusic";
import Piano from "./Piano";

interface PracticeLoopsProps {
  state: SessionState;
  onNoteInput: (midiNote: number) => void;
}

function PracticeLoop({ state, onNoteInput }: PracticeLoopsProps) {
  const [highlight, setHighlight] = useState<HighlightState>("idle");

  const handleNote = useCallback(
    (midiNote: number) => {
      onNoteInput(midiNote);
      setHighlight("idle");
    },
    [onNoteInput],
  );

  useEffect(() => {
    if (state.history.length === 0) return;
    const last = state.history[state.history.length - 1];
    const newHighlight: HighlightState = last.correct ? "correct" : "wrong";
    setHighlight(newHighlight);
    const timer = setTimeout(() => setHighlight("idle"), 400);
    return () => clearTimeout(timer);
  }, [state.history]);

  const correct = state.history.filter((a) => a.correct).length;
  const total = state.history.length;

  if (!state.currentNote) return null;

  return (
    <div>
      <SheetMusic
        notes={state.currentNote}
        clef={state.config.clef}
        keySignature={state.config.key}
        highlightState={highlight}
      />

      <div>
        <Piano onNoteOn={handleNote} />
      </div>
    </div>
  );
}

export default PracticeLoop;
