import { RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { thousandSeparator, parseStorage } from "@/lib/utils";
import { STORAGE_KEY } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import people from "@/assets/game-people.svg";

interface QuizMenuProps {
  state: string;
  score: number;
  handleStartQuiz?: () => void;
  setState: (str: string) => void;
}

const QuizMenu = ({ state, score, handleStartQuiz, setState }: QuizMenuProps) => {
  const isFinish = state === "finish";
  const name = parseStorage(STORAGE_KEY.QUIZ)?.name || "";
  const isMobile = useIsMobile();

  const handleStartAgain = () => {
    setState("start");
  };

  const renderButtonStart = (className?: string) => (
    <Button
      className={`text-2xl px-12 bg-white
      text-accent font-bold rounded-xl uppercase
      shadow-[2px_4px_0_rgba(0,0,0,0.3)]
      hover:bg-white/30
      active:shadow-none
      active:translate-y-1
      active:translate-x-1
      transition-all duration-150
      select-none ${className || ""}`}
      onClick={handleStartQuiz}
    >
      Tekan Disini
    </Button>
  );
  
  return isMobile || isFinish ? (
    <>
      {!isFinish && <p className="text-center">SUDAH SIAP BERMAIN</p>}
      <Header
        title={isFinish ? "Permainan Selesai" : "AYO KITA MULAI"}
        description={isFinish ? <span>Selamat{name ? <b> {name},</b> : ""} kamu mendapatkan skor sebesar</span> : "Klik tombol untuk memulai"}
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
        ) : renderButtonStart()}
      </div>
    </>
  ) : (
    <>
      <div className="bg-[url('@/assets/game-start.svg')] w-full min-h-[36rem] bg-no-repeat bg-contain bg-center flex justify-center items-end pb-40 relative">
      <img src={people} alt="People" className="w-48 h-48 lg:w-64 lg:h-64 absolute left-8 bottom-20 lg:bottom-16" />
        {renderButtonStart("mr-10 px-4 lg:px-12")}
      </div>
    </>
  );
};

export default QuizMenu;