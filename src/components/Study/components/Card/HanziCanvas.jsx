import { useHanziWriter } from "../../hooks/useHanziWriter";

const HanziCanvas = ({
  character,
  displayState = "reveal",
  onQuizComplete,
  activeTheme,
  strokeColor,
}) => {
  const hanziWriterRef = useHanziWriter({
    character,
    displayState,
    onQuizComplete,
    activeTheme,
    strokeColor,
  });
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      <div
        ref={hanziWriterRef.containerRef}
        className={`${activeTheme?.background?.canvas ?? "bg-white"} border-4 ${
          activeTheme?.border?.card ?? "border-gray-200"
        } rounded-xl shadow-lg transition-all duration-300`}
        style={{ width: "250px", height: "250px" }}
      />
    </div>
  );
};

export default HanziCanvas;
