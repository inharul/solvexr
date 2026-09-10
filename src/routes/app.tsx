import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { answersAtom, addAnswerAtom, clearAnswersAtom } from "@/store/answers";
import { useSettingsStore } from "@/store/settings";
import { FinishModal } from "@/components/FinishModal";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircleIcon, TimerIcon, XCircleIcon, } from "@phosphor-icons/react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

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

  useKeyboardShortcuts(undefined, resetApp, { skipNavigation: true });

  const [showHistory, setShowHistory] = useState(true);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const lastAnswer = answersList.length > 0 ? answersList[0] : null;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col lg:flex-row">
      <FinishModal isOpen={clock === 0} correctCount={correctCount} wrongCount={wrongCount} answersList={answersList} resetApp={resetApp} />

      {/* Mobile minimal header - clock + last answer check only */}
      <div className="flex w-full items-center justify-between gap-2 border-b border-[#6c6c6cee] bg-[#101215] px-3 py-2.5 lg:hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div style={{ width: 28, height: 28 }} className="shrink-0">
            <CircularProgressbar value={(clock * 100) / (parseInt(timeControl) * 60)} counterClockwise styles={buildStyles({ strokeLinecap: "butt", pathColor: "#079697" })} strokeWidth={50} />
          </div>
          <span className="text-sm font-medium tracking-tight">{formatTime(clock)}</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          {lastAnswer ? (
            <div className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs">
              {lastAnswer.correct ? <CheckCircleIcon size={16} weight="fill" color="#62a941" className="shrink-0" /> : <XCircleIcon size={16} weight="fill" color="#a63e3e" className="shrink-0" />}
              <span className="truncate max-w-[38vw] font-light tracking-tight">{lastAnswer.userAnswer}</span>
            </div>
          ) : (
            <span className=" hidden sm:inline text-xs text-white/30">no answers yet</span>
          )}
          {answersList.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMobileHistory(true)}
              className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15 active:scale-95"
            >
              Show all
            </button>
          )}
        </div>
      </div>

      {/* Mobile history sheet - animated bottom sheet */}
      <div
        data-open={showMobileHistory}
        className={`fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm lg:hidden transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${showMobileHistory ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowMobileHistory(false)}
        aria-hidden={!showMobileHistory}
      >
        <div
          data-open={showMobileHistory}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[70vh] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1e1f22] shadow-xl flex flex-col origin-bottom transition-[opacity,transform] duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[open=true]:opacity-100 data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=false]:opacity-0 data-[open=false]:translate-y-4 data-[open=false]:scale-[0.98]"
        >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="text-sm font-medium">Answers</div>
              <button type="button" onClick={() => setShowMobileHistory(false)} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/15">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {answersList.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    {a.correct ? <CheckCircleIcon size={16} weight="fill" color="#62a941" className="shrink-0" /> : <XCircleIcon size={16} weight="fill" color="#a63e3e" className="shrink-0" />}
                    <span className="truncate font-light">{a.userAnswer}</span>
                  </span>
                  <span className="shrink-0 text-xs text-white/40">{formatTime(a.timeTaken)}</span>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Desktop Sidebar - fixed header + scrollable answers */}
      <div className="hidden lg:flex lg:flex-col lg:h-[calc(100vh-3.5rem)] lg:w-[300px] lg:min-w-[300px] xl:w-[340px] xl:min-w-[340px] lg:border-r lg:border-[#6c6c6cee] bg-[#101215] shrink-0 overflow-hidden">
        <div className="shrink-0 p-4 pb-3">
          <div className="flex items-center justify-between gap-2 rounded-[10px] border-[1.4px] border-dashed border-(--border-color) bg-[#eee0] p-2 text-[#b2b2b2]">
            <div className="flex items-center">
              <div style={{ width: 30, height: 30 }} className="shrink-0">
                <CircularProgressbar value={(clock * 100) / (parseInt(timeControl) * 60)} counterClockwise styles={buildStyles({ strokeLinecap: "butt", pathColor: "#079697" })} strokeWidth={50} />
              </div>
              <h3 className="ml-2 text-sm font-medium sm:text-base">{formatTime(clock)}</h3>
            </div>
            <span className="text-xs text-white/40">time left</span>
          </div>

          {answersList.length > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
              <span className="text-white/60">Progress</span>
              <span className="flex items-center gap-1">
                <i className="rounded-[5px] bg-[#62a941] px-1.5 py-0.5 font-bold not-italic text-white">{correctCount}</i>
                <i className="rounded-[5px] bg-[#a63e3e] px-1.5 py-0.5 font-bold not-italic text-white">{wrongCount}</i>
                <b className="ml-1 text-white">/ {answersList.length}</b>
              </span>
            </div>
          )}
        </div>

        {answersList.length > 0 && (
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
            <div className={`${showHistory ? "flex" : "hidden"} lg:flex min-h-0 flex-1 flex-col rounded-[10px] border-[1.4px] border-dashed border-(--border-color) overflow-hidden`}>
              <div className="shrink-0 flex items-center justify-center rounded-t-[10px] bg-[#80808078] p-[0.4rem] text-[0.8rem] backdrop-blur">
                <p>Answers</p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {answersList.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2 border-t border-dashed border-(--border-color) p-2 sm:p-[0.4rem]">
                    <div className="flex min-w-0 items-center">
                      {a.correct ? <CheckCircleIcon size={18} weight="fill" color="#62a941" className="mr-1.5 shrink-0 sm:mr-1.25" /> : <XCircleIcon size={18} weight="fill" color="#a63e3e" className="mr-1.5 shrink-0 sm:mr-1.25" />}
                      <h4 className="truncate text-[0.8rem] font-light sm:text-[0.85rem]">{a.userAnswer}</h4>
                    </div>
                    <p className="shrink-0 text-[0.75rem] text-gray-500 sm:text-[0.8rem]">{formatTime(a.timeTaken)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {answersList.length > 0 && (
          <button type="button" onClick={() => setShowHistory((v) => !v)} className="mt-2 text-xs text-white/40 hover:text-white/60 lg:hidden px-4">Toggle history</button>
        )}
      </div>

      {/* Main game area - only main content on mobile */}
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-12">
        {/* per-question timer - desktop only, hidden on mobile for minimalism */}
        <div className="hidden lg:flex items-center justify-end gap-1.5">
          <h3 className="text-sm font-normal sm:text-base">{formatTime(time)}</h3>
          <TimerIcon size={24} className="sm:h-[30px] sm:w-[30px]" />
        </div>
        <div className="flex flex-1 items-center justify-center py-6 sm:py-8 lg:py-10">
          <div className="font-flex w-full max-w-[20rem] font-round-full text-[2.75rem] font-semibold leading-none min-[360px]:text-[3.25rem] sm:max-w-[22rem] sm:text-[4.5rem] md:text-[5.5rem] lg:max-w-[24rem] lg:text-[6rem] xl:max-w-[20rem] xl:text-8xl">
            <div className="relative flex w-full justify-center border-b-[3px] border-dashed border-(--border-color) pb-1 sm:pb-2">
              <h2 className="absolute bottom-1 left-1 text-[1.5rem] leading-none text-(--border-color) sm:bottom-1.5 sm:text-[2rem] lg:text-[2.5rem] xl:text-[3rem]">{formatOperation(operation)}</h2>
              <div className="text-right">
                <h1 className="leading-none tracking-tight">{numberOne}</h1>
                <h1 className="leading-none tracking-tight">{numberTwo}</h1>
              </div>
            </div>
            <input
              ref={inputRef}
              name="answer"
              autoFocus
              value={userAnswer}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="—"
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }}
              disabled={clock === 0}
              className="my-3 w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] px-2 py-3 text-center text-[2.5rem] font-bold leading-none outline-none placeholder:text-white/20 focus-visible:border-white/15 focus-visible:ring-0 sm:my-4 sm:px-4 sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[3.75rem] disabled:opacity-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
