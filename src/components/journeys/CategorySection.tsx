import type { JourneyCategory, JourneyNode } from "@/journeys/types";
import { CATEGORY_LABELS } from "@/journeys/nodes";
import { NodeCard } from "./NodeCard";
import { useJourneysStore } from "@/store/journeys";
import { EyeIcon, LightningIcon, LightbulbIcon, ArrowsOutSimpleIcon, InfinityIcon } from "@phosphor-icons/react";

interface Props {
  category: JourneyCategory;
  nodes: JourneyNode[];
}

const CATEGORY_ICON_MAP: Record<JourneyCategory, React.ElementType> = {
  recognition: EyeIcon,
  "basic-facts": LightningIcon,
  strategies: LightbulbIcon,
  scale: ArrowsOutSimpleIcon,
  fluency: InfinityIcon,
};

export function CategorySection({ category, nodes }: Props) {
  const isUnlocked = useJourneysStore((s) => s.isUnlocked);
  const nodeStats = useJourneysStore((s) => s.nodeStats);

  if (nodes.length === 0) return null;
  const CategoryIcon = CATEGORY_ICON_MAP[category];

  return (
    <div className="mt-8">
      <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest leading-none text-[#949ba4]">
        <CategoryIcon size={14} weight="bold" className="shrink-0" />
        <span className="leading-none">{CATEGORY_LABELS[category]}</span>
      </h3>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nodes.map((node) => {
          const locked = !isUnlocked(node.id, node.prerequisites);
          const stats = nodeStats[node.id];
          return <NodeCard key={node.id} node={node} stats={stats} locked={locked} />;
        })}
      </div>
    </div>
  );
}
