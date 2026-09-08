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

  return (
    <div className="flex w-full">
      {showResult && (
        <div className="absolute inset-0 z-50 flex justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-8 h-fit max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1e1f22] p-6 text-white shadow-xl">
            <h1 className="text-center text-2xl font-semibold">
              {masteredNow ? "Mastered! 🎉" : clock === 0 ? "Time's up!" : "Session complete"}
            </h1>
            <p className="mt-1 text-center text-sm text-white/60">{node.title} — {node.description}</p>
            <Separator className="my-4 bg-white/10" />
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="rounded-xl bg-white/[0.04] p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Target size={24} /> <span className="text-lg font-bold">{totalQuestions ? `${Math.round(accuracy * 100)}%` : "0%"}</span>
                </div>
                <p className="mt-1 text-xs text-white/60">Accuracy</p>
                <p className="mt-1 text-[11px] text-white/40">{meetsAcc ? "✓ 100% required" : "needs 100%"}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <TimerIcon size={24} /> <span className="text-lg font-bold">{totalQuestions ? formatTime(avgTime) : "0:00"}</span>
                </div>
                <p className="mt-1 text-xs text-white/60">Average Time</p>
                <p className="mt-1 text-[11px] text-white/40">{meetsTime ? "✓ ≤5s" : ">5s needed"}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Trophy size={24} /> <span className="text-lg font-bold">{totalQuestions}</span>
                </div>
                <p className="mt-1 text-xs text-white/60">Questions</p>
                <p className="mt-1 text-[11px] text-white/40">{meetsMin ? "✓ ≥20" : "needs 20"}</p>
              </div>
            </div>

            {/* Mastery status */}
            <div className={`mt-4 rounded-xl p-4 text-center ${masteredNow ? "bg-emerald-500/15 ring-1 ring-emerald-500/30" : "bg-white/[0.03] ring-1 ring-white/10"}`}>
              {masteredNow ? (
                <span className="text-sm font-semibold text-emerald-400">✓ Mastered — progress saved</span>
              ) : (
                <span className="text-sm text-white/70">
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

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Link to="/journeys" className="inline-flex h-full w-full items-center justify-center gap-2 rounded-[0.75em] border-2 border-white/10 bg-white/[0.06] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Journeys
              </Link>
              <button type="button" onClick={resetApp} className="learn-more-teal flex h-full w-full items-center justify-center !rounded-[0.75em] text-center">
                RETRY
              </button>
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
                  <div key={a.id} className="flex items-center justify-between border-t border-white/5 px-4 py-2.5 text-sm">
                    <span className="flex items-center gap-2">
                      {a.correct ? <CheckCircle size={18} weight="fill" className="text-emerald-500" /> : <XCircle size={18} weight="fill" className="text-red-500" />}
                      {a.userAnswer}
                    </span>
                    <span className="text-xs text-white/50">{formatTime(a.timeTaken)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Left sidebar like app.tsx */}
      <div className="h-[calc(100vh-3rem)] w-[23%] min-w-55 overflow-y-auto border-r border-solid border-[#6c6c6cee] p-4">
        <Link to="/journeys" className="mb-3 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={14} /> Back to Journeys
        </Link>
        <Card className="p-3">
          <div className="text-xs font-medium text-white/60">{node.group} · {node.category}</div>
          <div className="text-sm font-semibold text-white">{node.title}</div>
          <div className="mt-1 text-xs text-[#949ba4]">{node.description}</div>
          {node.strategyNote && <div className="mt-1 text-[11px] italic text-white/40">{node.strategyNote}</div>}
        </Card>

        <div className="mt-3 flex items-center rounded-[10px] border-[1.4px] border-dashed border-(--border-color) bg-[#eee0] p-2 text-[#b2b2b2]">
          <div style={{ width: 30, height: 30 }}>
            <CircularProgressbar value={(clock * 100) / (parseInt(timeControl) * 60)} counterClockwise styles={buildStyles({ strokeLinecap: "butt", pathColor: "#079697" })} strokeWidth={50} />
          </div>
          <h3 className="ml-2 text-base font-medium">{formatTime(clock)}</h3>
          <button onClick={handleFinishEarly} className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/15">
            Finish
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
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
          <div className="mt-3 rounded-lg bg-white/[0.04] p-2.5 text-xs">
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

        {answersList.length > 0 && (
          <div className="mt-3 rounded-[10px] border-[1.4px] border-dashed border-(--border-color)">
            <div className="flex items-center justify-center rounded-t-[10px] bg-[#80808078] p-[0.3rem] text-[0.8rem]">
              <p className="mr-4">Answers</p>
              <i className="mx-0.5 rounded-[5px] bg-[#62a941] px-1.5 py-0 font-bold not-italic text-white">{correctCount}</i>
              <i className="mx-0.5 rounded-[5px] bg-[#a63e3e] px-1.5 py-0 font-bold not-italic text-white">{wrongCount}</i>
              <b className="ml-px rounded-[5px] text-white">/ {answersList.length}</b>
            </div>
            {answersList.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-t border-dashed border-(--border-color) p-[0.3rem]">
                <div className="flex items-center">
                  {a.correct ? <CheckCircle size={20} weight="fill" color="#62a941" className="mr-1.25" /> : <XCircle size={20} weight="fill" color="#a63e3e" className="mr-1.25" />}
                  <h4 className="text-[0.85rem] font-light">{a.userAnswer}</h4>
                </div>
                <p className="text-[0.8rem] text-gray-500">{formatTime(a.timeTaken)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Center practice area */}
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
            <input
              ref={inputRef}
              name="answer"
              autoFocus
              value={userAnswer}
              type="number"
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              disabled={clock === 0 || showResult}
              className="my-4 w-80 overflow-hidden rounded-lg border-none bg-transparent px-4 py-0 text-center font-bold leading-none outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-white/30">
          Mastery: {MASTERY_MIN_QUESTIONS}+ questions · 100% accuracy · ≤{MASTERY_AVERAGE_TIME}s avg · Press Enter to submit
        </div>
      </div>
    </div>
  );
}
