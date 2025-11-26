import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STORAGE_KEY } from "@/lib/constants";
import { QUIZ_LEVELS, languageArchiveQuiz } from "@/lib/dummy";
import { parseStorage } from "@/lib/utils";
import { useCountdown } from "@/hooks/use-countdown";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface QuizMenuProps {
  setState: (str: string) => void;
  setLevelData: (val: any) => void;
}

const QuizLevel = ({ setState, setLevelData }: QuizMenuProps) => {
  const { time, start } = useCountdown(3);
  const { toast } = useToast();
  const { user } = useUser();
  const [startCount, setStartCount] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [levels, setLevels] = useState(QUIZ_LEVELS);
  const [choose, setChoose] = useState(false);
  const [chosenLanguage, setChosenLanguage] = useState("");
  const [chosenLevel, setChosenLevel] = useState(null);

  const parsedQuizStorage = parseStorage(STORAGE_KEY.QUIZ);

  const handleBack = () => {
    if (chosenLevel) {
      setChoose(false);
      setChosenLevel(null);
    } else {
      setState("start")
    }
  };

  const handleChoose = (item: any) => {
    if (!name) {
      toast({ title: "Silahkan isi nama terlebih dahulu sebelum memulai permainan." });
      return;
    }
    setChoose(true);
    setChosenLevel(item);
  };

  const handleStartGame = () => {
    setStartCount(true);
    start();
    setTimeout(() => {
      setLevelData(chosenLevel);
      localStorage.setItem(STORAGE_KEY.QUIZ, JSON.stringify({
        ...(parsedQuizStorage || {}),
        name,
      }));
      setState("ongoing");
    }, 4000);
  };

  useEffect(() => {
    setLevels(parsedQuizStorage?.data || QUIZ_LEVELS);
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
        title={chosenLevel?.title || "Pilih Bahasa dan Level"}
        description={chosenLevel?.description || "Silahkan memilih bahasa dan level bermain yang kamu inginkan"}
      />
      <div className={`flex justify-center min-h-80 ${choose ? "items-center" : ""}`}>
        {!choose ? (
          <div className="flex flex-col gap-12 w-full">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  placeholder="Tulis namamu disini..."
                  className="bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Bahasa</Label>
                <Select
                  value={chosenLanguage}
                  onValueChange={(value) => setChosenLanguage(value)}
                >
                  <SelectTrigger className="bg-white" id="language">
                    <SelectValue placeholder="Pilih bahasa"/>
                  </SelectTrigger>
                  <SelectContent>
                    {languageArchiveQuiz.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {chosenLanguage && (
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
            )}
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