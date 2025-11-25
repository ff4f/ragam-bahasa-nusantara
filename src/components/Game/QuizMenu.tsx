import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";

interface QuizMenuProps {
  state: string;
  handleStartQuiz?: () => void;
  setState: (str: string) => void;
}

const QuizMenu = ({ state, handleStartQuiz, setState }: QuizMenuProps) => {
  const { time, start } = useCountdown(3);
  const [startCount, setStartCount] = useState(false);

  const isFinish = state === "finish";

  const handleStart = () => {
    setStartCount(true);
    start();
    setTimeout(handleStartQuiz, 4000);
  };

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
            <p className="text-8xl font-bold text-center">328</p>
            <Button
              className="text-2xl py-8 px-12"
              onClick={handleStartAgain}
            >
              <RefreshCw style={{ width: 24, height: 24 }} />
              Main Lagi
            </Button>
          </div>

        ) : startCount ? (
          <AnimatePresence mode="popLayout">
            {startCount && (
              <motion.div
                key={time}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0.1, opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="text-7xl font-extrabold text-primary"
              >
                {time}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <Button
            className="text-2xl py-8 px-12"
            onClick={handleStart}
          >
            Mulai
          </Button>
        )}
      </div>
    </>
  );
};

export default QuizMenu;