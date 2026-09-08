import { createFileRoute, Link } from "@tanstack/react-router";
import { JOURNEY_NODES, GROUP_LABELS } from "@/journeys/nodes";
import type { JourneyGroup, JourneyCategory } from "@/journeys/types";
import { CategorySection } from "@/components/journeys/CategorySection";
import { useJourneysStore } from "@/store/journeys";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DivideIcon, CompassIcon, TrophyIcon, XIcon } from "@phosphor-icons/react";

export const Route = createFileRoute("/journeys/")({
  component: JourneysPage,
});
// NOTE: TanStack Router generates route id as "/journeys/" for index file

const GROUP_ORDER: JourneyGroup[] = ["multiplication", "division"];
const CATEGORY_ORDER: JourneyCategory[] = ["recognition", "basic-facts", "strategies", "scale", "fluency"];

function JourneysPage() {
  const nodeStats = useJourneysStore((s) => s.nodeStats);

  const totalNodes = JOURNEY_NODES.length;
  const masteredCount = JOURNEY_NODES.filter((n) => nodeStats[n.id]?.mastered).length;

  return (
    <div className="w-full bg-[#0f1113] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <CompassIcon size={24} weight="bold" className="text-[#079697]" />
              Journeys
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-[#949ba4]">
              Structured mastery path for mental arithmetic. Complete nodes to unlock the next. Mastery requires 100% accuracy and ≤5s average speed over at least 20 questions.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-white/[0.06] px-4 py-2 text-sm font-medium text-white">
            <TrophyIcon size={14} weight="fill" className="text-[#079697]" />
            {masteredCount} / {totalNodes} mastered
          </div>
        </div>

        {/* Overall progress summary */}
        <Card className="mt-6 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-white">Overall progress</span>
            <span className="text-[#949ba4]">{totalNodes > 0 ? Math.round((masteredCount / totalNodes) * 100) : 0}%</span>
          </div>
          <Progress value={totalNodes > 0 ? (masteredCount / totalNodes) * 100 : 0} className="mt-2" />
        </Card>

        {GROUP_ORDER.map((group) => {
          const groupNodes = JOURNEY_NODES.filter((n) => n.group === group);
          if (groupNodes.length === 0) return null;
          const GroupIcon = group === "multiplication" ? XIcon : DivideIcon;
          return (
            <div key={group} className="mt-10">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white">
                  <GroupIcon size={16} weight="bold" />
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-white">{GROUP_LABELS[group]}</h2>
                <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-[#949ba4]">
                  {groupNodes.filter((n) => nodeStats[n.id]?.mastered).length}/{groupNodes.length}
                </span>
              </div>
              <div className="mt-2 h-px w-full bg-white/[0.06]" />

              {CATEGORY_ORDER.map((cat) => {
                const nodesInCat = groupNodes.filter((n) => n.category === cat);
                if (nodesInCat.length === 0) return null;
                return <CategorySection key={`${group}-${cat}`} category={cat} nodes={nodesInCat} />;
              })}
            </div>
          );
        })}

        <Card className="mt-10 flex flex-col gap-2 p-4 text-sm">
          <span className="font-medium text-white">How mastery works</span>
          <span className="text-[#949ba4]">
            Each node tracks your <b className="text-white/80">best accuracy</b> and <b className="text-white/80">average speed</b>. A node is mastered only when you answer at least 20 questions with 100% accuracy and ≤5s average. Progress bar is visual only — mastery is determined by explicit criteria.
          </span>
          <Link to="/app" className="mt-2 inline-flex w-fit rounded-full bg-white px-4 py-1.5 text-sm font-semibold !text-black">
            Or practice freely →
          </Link>
        </Card>
      </div>
    </div>
  );
}
