import { useEffect, useRef } from "react";
import { renderStave, type HighlightState } from "../utils/vexflowUtils";

export interface SheetMusicProps {
  notes: string[];
  clef: "treble" | "bass";
  keySignature: string;
  highlightState?: HighlightState;
  className?: string;
}

export default function SheetMusic({
  notes,
  clef,
  keySignature,
  highlightState = "idle",
  className,
}: SheetMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || notes.length === 0) return;
    try {
      renderStave(
        containerRef.current,
        notes,
        clef,
        keySignature,
        highlightState,
      );
    } catch (err) {
      console.error("Vexflow render error:", err, {
        notes,
        clef,
        keySignature,
      });
    }
  }, [notes, clef, keySignature, highlightState]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        background: "var(--surface)",
        borderRadius: "12px",
        padding: "16px",
        display: "inline-block",
      }}
    />
  );
}
