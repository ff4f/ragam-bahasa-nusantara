import { RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { thousandSeparator } from "@/lib/utils";

interface QuizMenuProps {
  state: string;
  score: number;
  handleStartQuiz?: () => void;
  setState: (str: string) => void;
}

const QuizMenu = ({ state, score, handleStartQuiz, setState }: QuizMenuProps) => {
  const isFinish = state === "finish";

  const handleStartAgain = () => {
    setState("start");
  };
  
  return (
    <>
      <Header
        title={isFinish ? "Permainan Selesai" : "Ayo Bermain"}
        description={isFinish ? "Selamat kamu mendapatkan skor sebesar" : "Klik tombol untuk memulai"}
      />
      <div className="flex justify-center items-center min-h-80">
        {isFinish ? (
          <div className="flex flex-col gap-4 justify-center">
            <p className="text-8xl font-bold text-center">{thousandSeparator(score)}</p>
            <Button
              className="text-2xl py-8 px-12"
              onClick={handleStartAgain}
            >
              <RefreshCw style={{ width: 24, height: 24 }} />
              Main Lagi
            </Button>
          </div>
        ) : (
          <Button
            className="text-2xl py-8 px-12"
            onClick={handleStartQuiz}
          >
            Mulai
          </Button>
        )}
      </div>
    </>
  );
};

export default QuizMenu;