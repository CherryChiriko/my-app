export default function MasteredVariant({ deck, activeTheme }) {
  return (
    <div className="p-6 w-full flex flex-col items-center text-center opacity-80">
      <h3 className="text-xl font-bold mb-2">{deck.name}</h3>

      <p className={`${activeTheme.text.secondary} text-sm mb-4`}>
        You mastered this deck.
      </p>

      <div className="w-full py-4 border border-dashed rounded-lg">
        <span className={`${activeTheme.text.accent} font-semibold`}>
          ✓ Mastered
        </span>
      </div>
    </div>
  );
}
