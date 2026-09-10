import { Separator } from "@/components/ui/separator";
import { CheckCircle, Gear, ListChecks, Target, Timer, XCircle } from "@phosphor-icons/react";
import { useSettingsStore } from "@/store/settings";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Answer } from "@/store/answers";

interface ModalProps {
  correctCount: number;
  wrongCount: number;
  answersList: Answer[];
  resetApp: () => void;
  isOpen?: boolean;
}

export function FinishModal({ correctCount, wrongCount, answersList, resetApp, isOpen = true }: ModalProps) {
  const timeControl = useSettingsStore((s) => s.timeControl);
  const operations = useSettingsStore((s) => s.operations);
  const newOperations = Object.keys(operations).filter((k) => operations[k]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(isOpen);
  const messages = ["Times Up!", "Results Time!", "Let's see how you did..."];
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const getAccuracy = () => parseFloat((correctCount / answersList.length).toFixed(2)) * 100;
  const averageTime = () => Math.round(answersList.reduce((a, b) => a + b.timeTaken, 0) / answersList.length);
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const printOperations = (arr: string[]) => <span>{arr.map(capitalize).join(", ")}</span>;

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
      return () => cancelAnimationFrame(id);
    } else {
      setOpen(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      data-open={open}
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/60 p-3 sm:p-4 backdrop-blur-sm transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 data-[open=true]:opacity-100"
    >
      <div
        data-open={open}
        className="my-4 sm:my-8 h-fit max-h-[90vh] sm:max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1e1f22] p-4 sm:p-6 text-white shadow-xl origin-center transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 scale-[0.96] translate-y-2 data-[open=true]:opacity-100 data-[open=true]:scale-100 data-[open=true]:translate-y-0"
      >
        <h1 className="text-center text-xl sm:text-2xl font-semibold">{messages[Math.floor(Math.random() * messages.length)]}</h1>
        <Separator className="my-4 bg-white/10" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 py-2">
          <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Target size={20} className="sm:h-6 sm:w-6" /> <span className="text-base sm:text-lg font-bold">{answersList.length ? `${getAccuracy()}%` : "0%"}</span>
            </div>
            <p className="mt-1 text-xs text-white/60">Accuracy</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Timer size={20} className="sm:h-6 sm:w-6" /> <span className="text-base sm:text-lg font-bold">{answersList.length ? formatTime(averageTime()) : "0:00"}</span>
            </div>
            <p className="mt-1 text-xs text-white/60">Average Time</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <ListChecks size={20} className="sm:h-6 sm:w-6" /> <span className="text-base sm:text-lg font-bold">{correctCount}</span>
            </div>
            <p className="mt-1 text-xs text-white/60">out of {answersList.length}</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-white/10 rounded-xl bg-white/[0.03]">
          {[
            ["Total Time", `${timeControl} min`],
            ["Calculations involved", printOperations(newOperations)],
            ["Correct answers", correctCount],
            ["Wrong answers", wrongCount],
            ["Total Submissions", answersList.length],
          ].map(([k, v]) => (
            <div key={String(k)} className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 text-sm">
              <span className="text-white/60 text-xs sm:text-sm shrink">{k as string}</span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${k === "Correct answers" ? "bg-[#23a559] text-white" : k === "Wrong answers" ? "bg-red-500 text-white" : "bg-white/10 text-white"}`}>{v as any}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={resetApp}
          className="learn-more-teal mt-6 flex w-full items-center justify-center !rounded-[0.75em] text-center mb-6 sm:mb-8"
        >
          RESET
        </button>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/settings"
            className="inline-flex h-full w-full items-center justify-center gap-2 rounded-[0.75em] border-2 border-white/10 bg-white/[0.06] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 hover:border-white/15 active:scale-[0.98]"
          >
            <Gear size={18} weight="bold" /> Settings
          </Link>
          <button
            type="button"
            onClick={() => setShowAnswers(!showAnswers)}
            className="inline-flex h-full w-full items-center justify-center rounded-[0.75em] border-2 border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/15 active:scale-[0.98]"
          >
            {showAnswers ? "Hide" : "Show"} Submitted Answers
          </button>
        </div>
        <div
          data-open={showAnswers}
          className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100"
        >
          <div className="overflow-hidden">
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <div className="bg-white/5 px-4 py-2 text-center text-sm font-medium">Your Submitted Answers</div>
              {answersList.length ? (
                answersList.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2 border-t border-white/5 px-4 py-2.5 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      {a.correct ? <CheckCircle size={18} weight="fill" className="shrink-0 text-emerald-500" /> : <XCircle size={18} weight="fill" className="shrink-0 text-red-500" />}
                      <span className="truncate">{a.userAnswer}</span>
                    </span>
                    <span className="shrink-0 text-xs text-white/50">{formatTime(a.timeTaken)}</span>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-sm text-white/60">You did not submit any answers. (why?)</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
