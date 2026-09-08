import type { JourneyNode } from "@/journeys/types";
import type { MasteryStats } from "@/journeys/types";
import { getProgressPercent } from "@/journeys/mastery";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { CheckCircleIcon, LockIcon, TimerIcon, TargetIcon, LightbulbIcon, CalculatorIcon, DivideIcon, XIcon } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Props {
  node: JourneyNode;
  stats?: MasteryStats;
  locked: boolean;
}

const GROUP_ICON: Record<string, React.ElementType> = {
  multiplication: XIcon,
  division: DivideIcon,
  addition: CalculatorIcon,
  subtraction: CalculatorIcon,
};

export function NodeCard({ node, stats, locked }: Props) {
  const progress = getProgressPercent(stats);
  const isMastered = stats?.mastered ?? false;
  const bestAccuracy = stats ? Math.round(stats.bestAccuracy * 100) : 0;
  const avg = stats?.averageTime ?? 0;
  const GroupIcon = GROUP_ICON[node.group] ?? CalculatorIcon;

  return (
    <Card
      className={cn(
        "relative flex flex-col p-4 transition",
        locked
          ? "border border-white/5 opacity-60 ring-white/[0.03]"
          : isMastered
            ? "border border-emerald-500/30 ring-emerald-500/20"
            : "border border-white/10 hover:border-white/15",
      )}
    >
      {locked && (
        <div className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/70">
          <LockIcon size={14} weight="bold" />
        </div>
      )}

      {/* Header: icon inline with title + description stacked in rows */}
      <div className="flex gap-3 pr-8">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${locked ? "bg-white/10 text-white/40" : isMastered ? "bg-emerald-500 text-white" : "bg-[#079697]/15 text-[#079697]"}`}
        >
          {isMastered && !locked ? <CheckCircleIcon size={18} weight="fill" /> : <GroupIcon size={18} weight="bold" />}
        </span>
        <div className="flex min-w-0 flex-col">
          <h3 className="flex items-center gap-1.5 text-[15px] font-semibold leading-5 text-white">
            {node.title}
            {node.strategyNote && (
              <span
                title={node.strategyNote}
                aria-label={node.strategyNote}
                className="inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full bg-white/[0.06] text-[#949ba4] transition hover:bg-white/10 hover:text-white"
              >
                <LightbulbIcon size={12} weight="bold" />
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-[13px] leading-4 text-[#949ba4]">{node.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-2">
          <TargetIcon size={16} className="text-[#949ba4]" />
          <div className="flex flex-col leading-none">
            <span className="text-[11px] text-white/50">Best accuracy</span>
            <span className="mt-0.5 text-sm font-semibold text-white">{stats ? `${bestAccuracy}%` : "—"}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-2">
          <TimerIcon size={16} className="text-[#949ba4]" />
          <div className="flex flex-col leading-none">
            <span className="text-[11px] text-white/50">Avg speed</span>
            <span className="mt-0.5 text-sm font-semibold text-white">{stats && avg > 0 ? `${avg.toFixed(1)}s` : "—"}</span>
          </div>
        </div>
      </div>

      {/* Progress bar — shadcn Progress (below stats, above practice button) */}
      <div className="mt-3">
        <Progress value={progress} indicatorClassName={isMastered ? "bg-emerald-500" : "bg-white"} />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className={cn("font-medium", isMastered ? "text-emerald-400" : "text-white/60")}>
            {progress}%
          </span>
          {isMastered && <span className="font-medium text-emerald-400">Mastered</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4">
        {locked ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-white/40">Locked</span>
            <span className="text-[11px] leading-3 text-white/30">
              Complete: {node.prerequisites.join(", ")}
            </span>
          </div>
        ) : isMastered ? (
          <Link
            to="/journeys/$nodeId"
            params={{ nodeId: node.id }}
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold !text-white transition hover:bg-emerald-600"
          >
            ✓ Mastered — Practice again
          </Link>
        ) : (
          <Link
            to="/journeys/$nodeId"
            params={{ nodeId: node.id }}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold !text-black transition hover:bg-white/90"
          >
            Practice
          </Link>
        )}
      </div>

      {stats && stats.totalQuestions > 0 && (
        <div className="mt-2 text-center text-[11px] text-white/30">
          {stats.totalCorrect}/{stats.totalQuestions} correct · {stats.attempts ?? 0} sessions
        </div>
      )}
    </Card>
  );
}
