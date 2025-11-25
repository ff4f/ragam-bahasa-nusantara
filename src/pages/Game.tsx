import { useState } from "react";
import QuizDragDrop from "@/components/Game/QuizDragDrop";
import QuizMenu from "@/components/Game/QuizMenu";
import QuizLevel from "@/components/Game/QuizLevel";

const Game = () => {
  const [currentState, setCurrentState] = useState<string>("start");
  const [levelData, setLevelData] = useState<any>(null);
  const [score, setScore] = useState<number>(0);

  const handleStartQuiz = () => {
    setCurrentState("choose_level");
    setScore(0);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-8 max-w-5xl">
        {["start", "finish"].includes(currentState) ? (
          <QuizMenu
            state={currentState}
            score={score}
            handleStartQuiz={handleStartQuiz}
            setState={setCurrentState}
          />
        ) : currentState === "choose_level" ? (
          <QuizLevel
            setState={setCurrentState}
            setLevelData={setLevelData}
          />
        ) : (
          <QuizDragDrop
            data={levelData}
            setState={setCurrentState}
            setScore={setScore}
            handleStartQuiz={handleStartQuiz}
          />
        )}
      </div>
    </div>
  );
};

export default Game;