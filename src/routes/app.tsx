import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { answersAtom, addAnswerAtom, clearAnswersAtom } from "@/store/answers";
import { useSettingsStore } from "@/store/settings";
import { FinishModal } from "@/components/FinishModal";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircleIcon, TimerIcon, XCircleIcon, } from "@phosphor-icons/react";

export const Route = createFileRoute("/app")({ component: Practice });

function Practice() {
  const [answersList] = useAtom(answersAtom);
  const addAnswer = useSetAtom(addAnswerAtom);
  const clearAnswers = useSetAtom(clearAnswersAtom);
  const timeControl = useSettingsStore((s) => s.timeControl);
  const numberOneRange = useSettingsStore((s) => s.numberOneRange);
  const numberTwoRange = useSettingsStore((s) => s.numberTwoRange);
  const getOperation = useSettingsStore((s) => s.getOperation);
  const manualEnabled = useSettingsStore((s) => s.manualEnabled);
  const maunalNumber = useSettingsStore((s) => s.maunalNumber);

  const [operation, setOperation] = useState<string>(() => getOperation());
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [time, setTime] = useState(0);
  const [clock, setClock] = useState(() => parseInt(timeControl) * 60);
  const [isRunning, setIsRunning] = useState(true);

  const RandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min - 1)) + min + 1;
  const [numberOne, setNumberOne] = useState(() => RandomNumber(1, numberOneRange));
  const [numberTwo, setNumberTwo] = useState(() => (manualEnabled ? maunalNumber : RandomNumber(1, numberTwoRange)));
  const [userAnswer, setUserAnswer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) interval = window.setInterval(() => { setTime((p) => p + 1); setClock((p) => p - 1); }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => { if (clock === 0) setIsRunning(false); }, [clock]);
  useEffect(() => { clearAnswers(); }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const formatOperation = (op: string) => (op === "*" ? "×" : op === "/" ? "÷" : op);

  const calculate = (a: number, op: string, b: number): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? 0 : a / b;
      default:
        return 0;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userAnswer === "" || userAnswer.length > 11) return;
    setIsRunning(false);
    const getAnswer = calculate(numberOne, operation, numberTwo).toFixed(2);
    const isCorrect = Number.parseFloat(getAnswer) === Number.parseFloat(userAnswer);
    addAnswer({ correct: isCorrect, userAnswer: `${numberOne} ${formatOperation(operation)} ${numberTwo} -> ${userAnswer}`, timeTaken: time });
    isCorrect ? setCorrectCount((c) => c + 1) : setWrongCount((c) => c + 1);
    setTime(0);
    setNumberOne(RandomNumber(1, numberOneRange));
    setOperation(getOperation());
    setNumberTwo(manualEnabled ? maunalNumber : RandomNumber(1, numberTwoRange));
    setUserAnswer("");
    inputRef.current?.focus();
    setIsRunning(true);
  };

  const resetApp = () => {
    clearAnswers();
    setClock(parseInt(timeControl) * 60);
    setTime(0);
    setUserAnswer("");
    setCorrectCount(0);
    setWrongCount(0);
    setIsRunning(true);
  };

  return (
    <div className="flex w-full">
      {clock === 0 ? <FinishModal correctCount={correctCount} wrongCount={wrongCount} answersList={answersList} resetApp={resetApp} /> : null}
      <div className="h-[calc(100vh-3rem)] w-[23%] min-w-55 overflow-y-auto border-r border-solid border-[#6c6c6cee] p-4">
        <div className="flex items-center rounded-[10px] border-[1.4px] border-dashed border-(--border-color) bg-[#eee0] p-2 text-[#b2b2b2]">
          <div style={{ width: 30, height: 30 }}>
            <CircularProgressbar value={(clock * 100) / (parseInt(timeControl) * 60)} counterClockwise styles={buildStyles({ strokeLinecap: "butt", pathColor: "#079697" })} strokeWidth={50} />
          </div>
          <h3 className="ml-2 text-base font-medium">{formatTime(clock)}</h3>
        </div>
        {answersList.length > 0 && (
          <div className="mt-2 rounded-[10px] border-[1.4px] border-dashed border-(--border-color)">
            <div className="flex items-center justify-center rounded-t-[10px] bg-[#80808078] p-[0.3rem] text-[0.8rem]">
              <p className="mr-4">Answers</p>
              <i className="mx-0.5 rounded-[5px] bg-[#62a941] px-1.5 py-0 font-bold not-italic text-white">{correctCount}</i>
              <i className="mx-0.5 rounded-[5px] bg-[#a63e3e] px-1.5 py-0 font-bold not-italic text-white">{wrongCount}</i>
              <b className="ml-px rounded-[5px] text-white">/ {answersList.length}</b>
            </div>
            {answersList.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-t border-dashed border-(--border-color) p-[0.3rem]">
                <div className="flex items-center">
                  {a.correct ? <CheckCircleIcon size={20} weight="fill" color="#62a941" className="mr-1.25" /> : <XCircleIcon size={20} weight="fill" color="#a63e3e" className="mr-1.25" />}
                  <h4 className="text-[0.85rem] font-light">{a.userAnswer}</h4>
                </div>
                <p className="text-[0.8rem] text-gray-500">{formatTime(a.timeTaken)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-full flex-1 px-12 py-4">
        <div className="flex items-center justify-end">
          <h3 className="mr-1.5 text-base font-normal">{formatTime(time)}</h3>
          <TimerIcon size={30} />
        </div>
        <div className="mt-16 flex justify-center">
          <div className="font-flex font-weight-600 text-8xl font-round-full">
            <div className="relative flex w-80 justify-center border-b-[3px] border-dashed border-(--border-color)">
              <h2 className="absolute bottom-0 left-0 text-[3rem] leading-none text-(--border-color)">{formatOperation(operation)}</h2>
              <div className="text-right">
                <h1 className="leading-none">{numberOne}</h1>
                <h1 className="leading-none">{numberTwo}</h1>
              </div>
            </div>
            <input ref={inputRef} name="answer" autoFocus value={userAnswer} type="number" onChange={(e) => setUserAnswer(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }} disabled={clock === 0} className="my-4 w-80 overflow-hidden rounded-lg border-none bg-transparent px-4 py-0 text-center font-bold leading-none outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
