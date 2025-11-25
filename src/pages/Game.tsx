import { useState } from "react";
import QuizDragDrop from "@/components/Game/QuizDragDrop";
import QuizMenu from "@/components/Game/QuizMenu";
import { QUIZ_ITEMS_LEVEL_1 } from "@/lib/dummy";

const Game = () => {
  const [currentState, setCurrentState] = useState<string>("start");

  const handleStartQuiz = () => {
    setCurrentState("ongoing");
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-8 max-w-5xl">
        {["start", "finish"].includes(currentState) ? (
          <QuizMenu
            state={currentState}
            handleStartQuiz={handleStartQuiz}
            setState={setCurrentState}
          />
        ) : (
          <QuizDragDrop
            level={1}
            data={QUIZ_ITEMS_LEVEL_1}
            setState={setCurrentState}
          />
        )}
      </div>
    </div>
  );
};

export default Game;