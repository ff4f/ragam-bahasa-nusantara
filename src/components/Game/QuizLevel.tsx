import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STORAGE_KEY } from "@/lib/constants";
import { QUIZ_LEVELS } from "@/lib/dummy";
import { useCountdown } from "@/hooks/use-countdown";

interface QuizMenuProps {
  setState: (str: string) => void;
  setLevelData: (val: any) => void;
}

const QuizLevel = ({ setState, setLevelData }: QuizMenuProps) => {
  const { time, start } = useCountdown(3);
  const [startCount, setStartCount] = useState(false);
  const [choose, setChoose] = useState(false);
  const [levels, setLevels] = useState(QUIZ_LEVELS);
  const [chosenLevel, setChosenLevel] = useState(null);

  const handleBack = () => {
    if (chosenLevel) {
      setChoose(false);
      setChosenLevel(null);
    } else {
      setState("start")
    }
  };

  const handleChoose = (item: any) => {
    setChoose(true);
    setChosenLevel(item);
  };

  const handleStartGame = () => {
    setStartCount(true);
    start();
    setTimeout(() => {
      setLevelData(chosenLevel);
      setState("ongoing");
    }, 4000);
  };

  useEffect(() => {
    const storage = localStorage.getItem(STORAGE_KEY.QUIZ);
    const parsedStorage = storage ? JSON.parse(storage) : null;
    setLevels(parsedStorage?.data || QUIZ_LEVELS);
  }, []);
  
  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={handleBack}
      >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
      </Button>
      <Header
        title={chosenLevel?.title || "Pilih Level"}
        description={chosenLevel?.description || "Silahkan memilih level bermain yang kamu inginkan"}
      />
      <div className="flex justify-center items-center min-h-80">
        {!choose ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {levels.map(quiz => (
              <Card key={quiz.id} className={`relative pb-14 ${quiz.locked ? "opacity-50" : ""}`}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <div className="absolute bottom-6 left-6 right-6">
                  <Button
                    className="w-full"
                    disabled={quiz.locked}
                    onClick={() => handleChoose(quiz)}
                  >
                    Mulai
                  </Button>
                </div>
              </Card>
            ))}
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
            onClick={handleStartGame}
          >
            Mulai
          </Button>
        )}
      </div>
    </>
  );
};

export default QuizLevel;