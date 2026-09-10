import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { useAtom, useSetAtom } from "jotai";
import { answersAtom, addAnswerAtom, clearAnswersAtom } from "@/store/answers";
import { useSettingsStore } from "@/store/settings";
import { useJourneysStore } from "@/store/journeys";
import { getNodeById } from "@/journeys/nodes";
import { computeSessionStats, evaluateMastery, getProgressPercent } from "@/journeys/mastery";
import { MASTERY_ACCURACY, MASTERY_AVERAGE_TIME, MASTERY_MIN_QUESTIONS } from "@/journeys/constants";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CheckCircle, XCircle, TimerIcon, Lock, ArrowLeft, Target, Trophy } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export const Route = createFileRoute("/journeys/$nodeId")({
  component: JourneyPractice,
});

function JourneyPractice() {
  const { nodeId } = Route.useParams();
  const node = getNodeById(nodeId);
  const navigate = useNavigate();
  const timeControl = useSettingsStore((s) => s.timeControl);
  const isUnlocked = useJourneysStore((s) => s.isUnlocked);
  const recordSession = useJourneysStore((s) => s.recordSession);
  const stats = useJourneysStore((s) => s.nodeStats[nodeId]);

  const [answersList] = useAtom(answersAtom);
  const addAnswer = useSetAtom(addAnswerAtom);
  const clearAnswers = useSetAtom(clearAnswersAtom);

  if (!node) {
    return (
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Node not found</h2>
          <Link to="/journeys" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
            Back to Journeys
          </Link>
        </div>
      </div>
    );
  }

  const locked = !isUnlocked(node.id, node.prerequisites);
  if (locked) {
    return (
      <div className="w-full bg-[#0f1113] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[720px] rounded-xl bg-[#1e1f22] p-8 text-center ring-1 ring-white/[0.06]">
          <Lock size={32} className="mx-auto text-white/40" weight="bold" />
          <h2 className="mt-3 text-lg font-semibold text-white">Locked</h2>
          <p className="mt-1 text-sm text-[#949ba4]">Complete prerequisites to unlock this node:</p>
          <p className="mt-2 text-sm font-medium text-white">{node.prerequisites.join(", ")}</p>
          <Link to="/journeys" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
            <ArrowLeft size={16} /> Back to Journeys
          </Link>
        </div>
      </div>
    );
  }

  return <JourneySession node={node} stats={stats} timeControl={timeControl} answersList={answersList} addAnswer={addAnswer} clearAnswers={clearAnswers} recordSession={recordSession} navigate={navigate} />;
}

interface SessionProps {
  node: NonNullable<ReturnType<typeof getNodeById>>;
  stats: ReturnType<typeof useJourneysStore.getState>["nodeStats"][string] | undefined;
  timeControl: string;
  answersList: { id: string; correct: boolean; userAnswer: string; timeTaken: number }[];
  addAnswer: (p: { correct: boolean; userAnswer: string; timeTaken: number }) => void;
  clearAnswers: () => void;
  recordSession: (nodeId: string, s: ReturnType<typeof computeSessionStats>) => void;
  navigate: ReturnType<typeof useNavigate>;
}

function JourneySession({ node, stats, timeControl, answersList, addAnswer, clearAnswers, recordSession, navigate }: SessionProps) {
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [time, setTime] = useState(0);
  const [clock, setClock] = useState(() => parseInt(timeControl) * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate problem based on practiceConfig
  // Reuses existing arithmetic logic: operation symbols, number generation
  const cfg = node.practiceConfig;

  const operationSymbol = (() => {
    switch (cfg.operation) {
      case "addition":
        return "+";
      case "substraction":
        return "-";
      case "multiplication":
        return "*";
      case "division":
        return "/";
      default:
        return "+";
    }
  })();

  const RandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min - 1)) + min + 1;

  const generateNumbers = (): { a: number; b: number } => {
    const oneRange = cfg.numberOneRange ?? 100;
    const twoRange = cfg.numberTwoRange ?? 100;

    // Manual number case: second operand fixed
    if (cfg.manualNumber !== undefined) {
      const a = RandomNumber(1, oneRange);
      const b = cfg.manualNumber;
      if (cfg.operation === "division" && cfg.ensureIntegerDivision) {
        // For division with manual divisor, ensure dividend divisible
        // Generate quotient then dividend = quotient * divisor
        // Keep dividend within range roughly
        const q = RandomNumber(1, Math.max(10, Math.floor(oneRange / cfg.manualNumber) || 10));
        return { a: q * b, b };
      }
      return { a, b };
    }

    // Non-manual: both random
    if (cfg.operation === "division" && cfg.ensureIntegerDivision) {
      // Generate divisor and quotient, then dividend
      const divisor = RandomNumber(1, twoRange);
      const safeDivisor = divisor === 0 ? 1 : divisor;
      const quotient = RandomNumber(1, Math.max(10, Math.floor(oneRange / 10) || 10));
      // For 1-digit ÷ 1-digit, keep product small: cap quotient*divisor < oneRange
      const dividend = quotient * safeDivisor;
      // If dividend exceeds range, retry with smaller quotient
      if (dividend >= oneRange && oneRange <= 10) {
        // For 1-digit case, just generate divisor 1..9 and quotient 1..9, but ensure dividend <=9 if need strictly 1-digit dividend
        // For MVP, allow dividend up to 81 (9*9) - still integer exact, not strictly 1-digit
        // Keep as is for meaningful division practice
      }
      return { a: dividend, b: safeDivisor };
    }

    return { a: RandomNumber(1, oneRange), b: RandomNumber(1, twoRange) };
  };

  const [nums] = useState(() => generateNumbers());
  const [operation] = useState(operationSymbol);
  const [numberOne, setNumberOne] = useState(nums.a);
  const [numberTwo, setNumberTwo] = useState(nums.b);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && !showResult) interval = window.setInterval(() => { setTime((p) => p + 1); setClock((p) => p - 1); }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, showResult]);

  useEffect(() => {
    if (clock === 0 && !showResult) {
      setIsRunning(false);
      setShowResult(true);
      // Record session on time up
      const total = correctCount + wrongCount;
      const session = computeSessionStats(total, correctCount, responseTimes);
      if (total > 0) recordSession(node.id, session);
    }
  }, [clock, showResult, correctCount, wrongCount, responseTimes, node.id, recordSession]);

  useEffect(() => {
    clearAnswers();
    setCorrectCount(0);
    setWrongCount(0);
    setResponseTimes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setResponseTimes((prev) => [...prev, time]);
    isCorrect ? setCorrectCount((c) => c + 1) : setWrongCount((c) => c + 1);
    setTime(0);
    const next = generateNumbers();
    setNumberOne(next.a);
    setNumberTwo(next.b);
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
    setResponseTimes([]);
    setShowResult(false);
    setIsRunning(true);
    const next = generateNumbers();
    setNumberOne(next.a);
    setNumberTwo(next.b);
  };

  useKeyboardShortcuts(undefined, resetApp, { skipNavigation: true });

  const handleFinishEarly = () => {
    setShowResult(true);
    setIsRunning(false);
    const total = correctCount + wrongCount;
    const session = computeSessionStats(total, correctCount, responseTimes);
    if (total > 0) recordSession(node.id, session);
  };

  // Result calculation for modal
  const totalQuestions = correctCount + wrongCount;
  const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const avgTime = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;
  const sessionForEval = computeSessionStats(totalQuestions, correctCount, responseTimes);
  const masteredNow = evaluateMastery(sessionForEval);
  const meetsMin = totalQuestions >= MASTERY_MIN_QUESTIONS;
  const meetsAcc = accuracy >= MASTERY_ACCURACY;
  const meetsTime = sessionForEval.averageTime <= MASTERY_AVERAGE_TIME;

  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const lastAnswer = answersList.length > 0 ? answersList[0] : null;

  // Modal enter/exit animation (001)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMounted, setModalMounted] = useState(showResult);
  useEffect(() => {
    if (showResult) {
      setModalMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setModalOpen(true)));
      return () => cancelAnimationFrame(id);
    } else {
      setModalOpen(false);
      const t = setTimeout(() => setModalMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [showResult]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col lg:flex-row">
      {modalMounted && (
        <div
          data-open={modalOpen}
          className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/60 p-3 sm:p-4 backdrop-blur-sm transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 data-[open=true]:opacity-100"
        >
          <div
            data-open={modalOpen}
            className="my-4 sm:my-8 h-fit max-h-[90vh] sm:max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1e1f22] p-4 sm:p-6 text-white shadow-xl origin-center transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 scale-[0.96] translate-y-2 data-[open=true]:opacity-100 data-[open=true]:scale-100 data-[open=true]:translate-y-0"
          >
            <h1 className="text-center text-xl font-semibold sm:text-2xl">
              {masteredNow ? "Mastered! 🎉" : clock === 0 ? "Time's up!" : "Session complete"}
            </h1>
            <p className="mt-1 text-center text-xs sm:text-sm text-white/60">{node.title} — {node.description}</p>
            <Separator className="my-4 bg-white/10" />
            <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2">
              <div className="rounded-xl bg-white/[0.04] p-2 sm:p-4 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <Target size={20} className="sm:h-6 sm:w-6" /> <span className="text-base sm:text-lg font-bold">{totalQuestions ? `${Math.round(accuracy * 100)}%` : "0%"}</span>
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-white/60">Accuracy</p>
                <p className="mt-1 text-[10px] sm:text-[11px] text-white/40">{meetsAcc ? "✓ 100% required" : "needs 100%"}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-2 sm:p-4 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <TimerIcon size={20} className="sm:h-6 sm:w-6" /> <span className="text-base sm:text-lg font-bold">{totalQuestions ? formatTime(avgTime) : "0:00"}</span>
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-white/60">Average Time</p>
                <p className="mt-1 text-[10px] sm:text-[11px] text-white/40">{meetsTime ? "✓ ≤5s" : ">5s needed"}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-2 sm:p-4 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <Trophy size={20} className="sm:h-6 sm:w-6" /> <span className="text-base sm:text-lg font-bold">{totalQuestions}</span>
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-white/60">Questions</p>
                <p className="mt-1 text-[10px] sm:text-[11px] text-white/40">{meetsMin ? "✓ ≥20" : "needs 20"}</p>
              </div>
            </div>

            {/* Mastery status */}
            <div className={`mt-4 rounded-xl p-3 sm:p-4 text-center ${masteredNow ? "bg-emerald-500/15 ring-1 ring-emerald-500/30" : "bg-white/[0.03] ring-1 ring-white/10"}`}>
              {masteredNow ? (
                <span className="text-sm font-semibold text-emerald-400">✓ Mastered — progress saved</span>
              ) : (
                <span className="text-xs sm:text-sm text-white/70">
                  Not yet mastered. Need 100% accuracy, ≤5s avg, and ≥20 questions in a single session.
                </span>
              )}
              {stats && (
                <div className="mt-2 text-xs text-white/50">
                  Best accuracy: {Math.round(stats.bestAccuracy * 100)}% · Avg: {stats.averageTime.toFixed(1)}s ·{" "}
                  {stats.mastered ? "Mastered ✓" : `${getProgressPercent(stats)}% progress`}
                </div>
              )}
            </div>

            <div className="mt-4 divide-y divide-white/10 rounded-xl bg-white/[0.03]">
              {[
                ["Correct", correctCount],
                ["Wrong", wrongCount],
                ["Total", totalQuestions],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-white/60">{k as string}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${k === "Correct" ? "bg-[#23a559] text-white" : k === "Wrong" ? "bg-red-500 text-white" : "bg-white/10 text-white"}`}>{v as any}</span>
                </div>
              ))}
            </div>

            <button type="button" onClick={resetApp} className="learn-more-teal mt-6 flex w-full items-center justify-center !rounded-[0.75em] text-center mb-6 sm:mb-8">
              RETRY
            </button>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link to="/journeys" className="inline-flex h-full w-full items-center justify-center gap-2 rounded-[0.75em] border-2 border-white/10 bg-white/[0.06] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Journeys
              </Link>
              <button
                type="button"
                onClick={() => {
                  navigate({ to: "/journeys" });
                }}
                className="inline-flex h-full w-full items-center justify-center rounded-[0.75em] border-2 border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/15"
              >
                Continue
              </button>
            </div>

            {answersList.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
                <div className="bg-white/5 px-4 py-2 text-center text-sm font-medium">Your Submitted Answers</div>
                {answersList.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2 border-t border-white/5 px-4 py-2.5 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      {a.correct ? <CheckCircle size={18} weight="fill" className="shrink-0 text-emerald-500" /> : <XCircle size={18} weight="fill" className="shrink-0 text-red-500" />}
                      <span className="truncate">{a.userAnswer}</span>
                    </span>
                    <span className="shrink-0 text-xs text-white/50">{formatTime(a.timeTaken)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile minimal header - only clock + last answer */}
      <div className="flex w-full items-center justify-between gap-2 border-b border-[#6c6c6cee] bg-[#101215] px-3 py-2.5 lg:hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div style={{ width: 28, height: 28 }} className="shrink-0">
            <CircularProgressbar value={(clock * 100) / (parseInt(timeControl) * 60)} counterClockwise styles={buildStyles({ strokeLinecap: "butt", pathColor: "#079697" })} strokeWidth={50} />
          </div>
          <span className="text-sm font-medium tracking-tight">{formatTime(clock)}</span>
          <button onClick={handleFinishEarly} className="ml-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/15">Finish</button>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          {lastAnswer ? (
            <div className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs">
              {lastAnswer.correct ? <CheckCircle size={16} weight="fill" color="#62a941" className="shrink-0" /> : <XCircle size={16} weight="fill" color="#a63e3e" className="shrink-0" />}
              <span className="truncate max-w-[38vw] font-light tracking-tight">{lastAnswer.userAnswer}</span>
            </div>
          ) : (
            <span className="hidden sm:inline text-xs text-white/30">no answers yet</span>
          )}
          {answersList.length > 0 && (
            <button type="button" onClick={() => setShowMobileHistory(true)} className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15 active:scale-95">
              Show all
            </button>
          )}
        </div>
      </div>

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
                  <span className="flex min-w-0 items-center gap-2"><span className="truncate font-light">{a.userAnswer}</span>{a.correct ? <CheckCircle size={16} weight="fill" color="#62a941" className="shrink-0" /> : <XCircle size={16} weight="fill" color="#a63e3e" className="shrink-0" />}</span>
                  <span className="shrink-0 text-xs text-white/40">{formatTime(a.timeTaken)}</span>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Desktop Left sidebar - fixed header + scrollable answers */}
      <div className="hidden lg:flex lg:flex-col lg:h-[calc(100vh-3.5rem)] lg:w-[320px] lg:min-w-[320px] xl:w-[360px] xl:min-w-[360px] lg:border-r lg:border-[#6c6c6cee] bg-[#101215] shrink-0 overflow-hidden">
        <div className="shrink-0 p-3 sm:p-4 pb-3 space-y-3 overflow-y-auto">
          <Link to="/journeys" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
            <ArrowLeft size={14} /> Back to Journeys
          </Link>
          <Card className="p-3">
            <div className="text-xs font-medium text-white/60">{node.group} · {node.category}</div>
            <div className="text-sm font-semibold text-white">{node.title}</div>
            <div className="mt-1 text-xs leading-relaxed text-[#949ba4]">{node.description}</div>
            {node.strategyNote && <div className="mt-1 text-[11px] italic text-white/40">{node.strategyNote}</div>}
          </Card>

          <div className="flex items-center gap-2 rounded-[10px] border-[1.4px] border-dashed border-(--border-color) bg-[#eee0] p-2 text-[#b2b2b2]">
            <div style={{ width: 30, height: 30 }} className="shrink-0">
              <CircularProgressbar value={(clock * 100) / (parseInt(timeControl) * 60)} counterClockwise styles={buildStyles({ strokeLinecap: "butt", pathColor: "#079697" })} strokeWidth={50} />
            </div>
            <h3 className="text-sm font-medium sm:text-base">{formatTime(clock)}</h3>
            <button onClick={handleFinishEarly} className="ml-auto shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/15">
              Finish
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="font-bold text-white">{correctCount}</div>
              <div className="text-white/50">Correct</div>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="font-bold text-white">{wrongCount}</div>
              <div className="text-white/50">Wrong</div>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="font-bold text-white">{totalQuestions}</div>
              <div className="text-white/50">Total</div>
            </div>
          </div>

          {stats && (
            <div className="rounded-lg bg-white/[0.04] p-2.5 text-xs">
              <div className="font-medium text-white/80">Your best</div>
              <div className="mt-1 flex justify-between text-white/60">
                <span>Accuracy</span>
                <span className="font-semibold text-white">{Math.round(stats.bestAccuracy * 100)}%</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Avg</span>
                <span className="font-semibold text-white">{stats.averageTime ? `${stats.averageTime.toFixed(1)}s` : "—"}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Status</span>
                <span className={stats.mastered ? "font-semibold text-emerald-400" : "font-semibold text-white/60"}>{stats.mastered ? "Mastered ✓" : `${getProgressPercent(stats)}%`}</span>
              </div>
            </div>
          )}
        </div>

        {answersList.length > 0 && (
          <div className="flex min-h-0 flex-1 flex-col px-3 sm:px-4 pb-4">
            <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border-[1.4px] border-dashed border-(--border-color) overflow-hidden">
              <div className="shrink-0 flex items-center justify-center rounded-t-[10px] bg-[#80808078] p-[0.4rem] text-[0.8rem]">
                <p>Answers</p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {answersList.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2 border-t border-dashed border-(--border-color) p-2 sm:p-[0.4rem]">
                    <div className="flex min-w-0 items-center">
                      {a.correct ? <CheckCircle size={18} weight="fill" color="#62a941" className="mr-1.5 shrink-0" /> : <XCircle size={18} weight="fill" color="#a63e3e" className="mr-1.5 shrink-0" />}
                      <h4 className="truncate text-[0.8rem] font-light sm:text-[0.85rem]">{a.userAnswer}</h4>
                    </div>
                    <p className="shrink-0 text-[0.75rem] text-gray-500 sm:text-[0.8rem]">{formatTime(a.timeTaken)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center practice area - only main content on mobile */}
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-12">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              disabled={clock === 0 || showResult}
              className="my-3 w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] px-2 py-3 text-center text-[2.5rem] font-bold leading-none outline-none placeholder:text-white/20 focus-visible:border-white/15 focus-visible:ring-0 sm:my-4 sm:px-4 sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[3.75rem] disabled:opacity-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
