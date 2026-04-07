import { ChordDiagram } from "./ChordDiagram";

interface Props {
  chords: string[];
  activeChord?: string | null;
}

export function ChordGrid({ chords, activeChord }: Props) {
  const unique = Array.from(new Set(chords));

  return (
    <section>
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-text-primary mb-6">
        Vocabulary
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {unique.map((chord) => (
          <ChordDiagram key={chord} chordName={chord} isActive={chord === activeChord} />
        ))}
      </div>
    </section>
  );
}
