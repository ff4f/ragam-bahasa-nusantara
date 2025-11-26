import { useState, useEffect } from "react";
import moment from "moment";
import Header from "@/components/Header";
import { capitalize } from "@/lib/utils";
import { STORAGE_KEY } from "@/lib/constants";
import { QUIZ_LEVELS } from "@/lib/dummy";
import { Check, X, ArrowRight, Timer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";

interface QuizDragDropProps {
  data: any;
  setState: (str: string) => void;
  setScore: (num: number | Function) => void;
  handleStartQuiz?: () => void;
}

const QuizDragDrop = ({ data, setState, setScore }: QuizDragDropProps) => {
  const { time, start, stop, reset } = useCountdown(30);

  const dataQuiz = data?.details;
  const [startedTime, setStartedTime] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [currentData, setCurrentData] = useState(dataQuiz?.[0]);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOverOption, setDragOverOption] = useState<string | null>(null);
  const [wrongItems, setWrongItems] = useState<Record<string, string>>({});
  const [lockedItems, setLockedItems] = useState<string | null>(null);

  const isFinish = currentQuestion === dataQuiz.length;

  const handleDragStart = (word: string) => {
    setDragItem(word);
  };

  const handleDrop = (quizId: string, option: string) => {
    const item = dataQuiz.find((q) => q.id === quizId);
    if (!item || !dragItem) return;

    const isCorrect = item.correct === option;

    if (isCorrect) {
      setLockedItems(dragItem);
    } else {
      const opt = item.options.find(opt => opt.name === option);
      setWrongItems((prev) => ({ ...prev, [opt.id]: opt.mean }));
    }

    setDragItem(null);
  };

  const handleScore = () => {
    let result = 0;
    if (lockedItems) result += 15000;
    Object.entries(wrongItems)?.forEach(() => result -= 2000);
    result += 30000 - (moment().valueOf() - startedTime);
    setScore((prev: number) => prev + (result < 0 ? 0 : result));
  };

  const resetLevel = () => {
    setDragItem(null);
    setDragOverOption(null);
    setWrongItems({});
    setLockedItems(null);
    reset();
  };

  const handleNextLevel = () => {
    handleScore();
    setCurrentQuestion(currentQuestion + 1);
    setCurrentData(dataQuiz[currentQuestion]);
    resetLevel();
    window.scrollTo({ top: 0, behavior: "smooth" });
    start();
    if (isFinish) {
      // dummy storage processing after finish in local
      const storage = localStorage.getItem(STORAGE_KEY.QUIZ);
      const parsedStorage = storage ? JSON.parse(storage) : null;
      const updatedData = (parsedStorage?.data || QUIZ_LEVELS || [])?.map(item => {
        if (Number(item.id) == (Number(data.id) + 1)) {
          return { ...item, locked: false };
        }
        return item;
      });
      const mappedStorage = {
        ...(parsedStorage || {}),
        level: (parsedStorage?.level || 1) + 1,
        data: updatedData,
      };
      localStorage.setItem(STORAGE_KEY.QUIZ, JSON.stringify(mappedStorage));
      setState("finish");
    }
  };

  useEffect(() => {
    if (lockedItems) stop();
    else start();
  }, [lockedItems]);

  useEffect(() => {
    if (currentQuestion) setStartedTime(moment().valueOf());
  }, [currentQuestion]);

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => {
          resetLevel();
          setState("start");
        }}
      >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
      </Button>
      <p className="text-center font-bold text-xl">{data?.title || "Level 1"}</p>
      <Header
        title={`Pertanyaan ${currentQuestion}`}
        description={currentData.question}
      />
      <div className="mb-16 max-w-24 h-16 m-auto relative flex justify-center items-center">
        <Timer className="text-primary absolute -top-[5px] -right-[5px]" />
        <div className={`text-center text-5xl font-extrabold text-primary ${lockedItems || time === 0 ? "" : "animate-pulse"}`}>
          {time}
        </div>
      </div>
      <div className="mb-10">
        <div
          key={currentData.id}
          draggable={!lockedItems && time > 0}
          onDragStart={() => handleDragStart(currentData.indonesia)}
          onDragEnd={() => setDragItem(null)}
          className={`
            p-6 mb-3 rounded-lg border shadow-sm transition text-center text-4xl font-bold max-w-sm m-auto
            ${lockedItems || time <= 0 ? "bg-gray-200 cursor-default opacity-60" : "cursor-grab"}
            ${dragItem === currentData.indonesia ? "scale-105 shadow-lg" : "bg-white"}
          `}
        >
          {capitalize(currentData.indonesia, true)}
        </div>
      </div>
      <div className="w-full">
        <div key={currentData.id} className="mb-6">
          {currentData.options.map((opt) => {
            const isCorrectDrop =
              lockedItems &&
              currentData.correct === opt.name;

            const isWrongDrop = wrongItems?.[opt.id];

            return (
              <div key={opt.id} className="flex gap-2 justify-center items-center pr-12">
                <div className="min-w-10">
                  {isCorrectDrop && <Check className="text-green-700" size={32} />}
                  {isWrongDrop && <X className="text-red-700" size={32} />}
                </div>
                <div key={opt.name}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setDragOverOption(opt.id)}
                  onDragLeave={() => setDragOverOption(null)}
                  onDrop={() => {
                    handleDrop(currentData.id, opt.name);
                    setDragOverOption(null);
                  }}
                  className={`
                    p-3 mb-2 border rounded-lg transition text-center text-2xl font-medium flex-1
                    ${dragOverOption === opt.id 
                      ? "bg-blue-100 border-blue-500 shadow-md scale-[1.05]" 
                      : "border-gray-300"
                    }
                    ${
                      isCorrectDrop
                        ? "bg-green-100 border-green-400"
                        : isWrongDrop ? "bg-red-100 border-red-400" : (
                          dragOverOption === opt.id 
                            ? "bg-blue-100 border-blue-500 shadow-md scale-[1.05]" 
                            : "border-gray-300"
                        )
                    }
                  `}
                >
                  {capitalize(opt.name, true)} ={" "}
                  {isCorrectDrop ? (
                    <span className="font-semibold text-green-700">
                      {capitalize(lockedItems, true)}
                    </span>
                  ) : isWrongDrop ? (
                    <span className="font-semibold text-red-700">
                      {capitalize(isWrongDrop, true)}
                    </span>
                  ) : (
                    <span className="text-gray-400">...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {(!!lockedItems || time === 0) && (
        <div className="px-12 mt-12">
          <Button
            className="text-2xl py-8 px-12 w-full"
            onClick={handleNextLevel}
          >
            {isFinish ? "Selesai" : "Lanjut"}
            {!isFinish && <ArrowRight style={{ width: 24, height: 24 }} />}
          </Button>
        </div>
      )}
    </>
  );
};

export default QuizDragDrop;