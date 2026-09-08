import { createFileRoute, Link } from "@tanstack/react-router";
import { useSettingsStore } from "@/store/settings";
import { ArrowsLeftRight, Calculator, Scales, Timer } from "@phosphor-icons/react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const timeControl = useSettingsStore((s) => s.timeControl);
  const operations = useSettingsStore((s) => s.operations);
  const numberOneRange = useSettingsStore((s) => s.numberOneRange);
  const numberTwoRange = useSettingsStore((s) => s.numberTwoRange);
  const newOperations = Object.keys(operations).filter((k) => operations[k]);
  const containsDivision = newOperations.includes("division");
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const printOperations = (arr: string[]) => <span>{arr.map(capitalize).join(", ")}</span>;
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-4 py-8 sm:py-10">
      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-[30rem] text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">SolvexR</h1>
          <p className="mt-1 px-2 text-sm leading-relaxed">
            practice your calculation speed <span className="text-[#afafaf]"> (to some extent maybe.)</span>
          </p>
          <div className="mt-[6px] flex items-center justify-center text-[13px] text-[#eee]">
            <a href="https://opensource.org/" target="_blank" rel="noopener noreferrer" aria-label="Open Source Initiative" className="mr-[5px] flex">
              <Scales size={20} />
            </a>
            <p className="text-[13px] text-[#eee]">inharul</p>
          </div>
          <div className="my-4 w-full rounded-2xl border-[1.5px] border-dashed border-[var(--border-color)] bg-transparent px-0 pb-[15px] pt-2">
            <h4 className="pb-2 text-base font-medium">Profile</h4>
            <div className="mb-2 border-t border-dashed border-[var(--border-color)] text-sm">
              <div className="flex items-center justify-between gap-2 border-b border-dashed border-[var(--border-color)] p-[10px] text-left">
                <div className="flex shrink-0 items-center gap-1">
                  <Timer size={20} className="mr-1" /> Time Control:
                </div>
                <b className="text-right text-[13px] font-normal not-italic text-[#afafaf]">{timeControl} min</b>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-dashed border-[var(--border-color)] p-[10px] text-left">
                <div className="flex shrink-0 items-center gap-1">
                  <Calculator size={20} className="mr-1" /> Operations Selection:
                </div>
                <b className="text-right text-[13px] font-normal not-italic text-[#afafaf]">{printOperations(newOperations)}</b>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-dashed border-[var(--border-color)] p-[10px] text-left">
                <div className="flex shrink-0 items-center gap-1">
                  <ArrowsLeftRight size={20} className="mr-1" /> Ranges for Numbers:
                </div>
                <b className="text-right text-[13px] font-normal not-italic text-[#afafaf]">{`1: 1-${numberOneRange}, 2: 1-${numberTwoRange}`}</b>
              </div>
            </div>
            <b className="px-2 text-[13px] font-normal not-italic text-[#afafaf]">
              {`-> Go to `} <Link to="/settings" className="cursor-pointer text-white underline">Settings</Link> to change any of the above.
            </b>
          </div>
          {containsDivision && (
            <div className="mx-auto mb-6 w-full overflow-hidden rounded-xl bg-[#1e1f22] p-4 text-left shadow-sm ring-1 ring-white/[0.06]">
              <div className="text-[13px] font-semibold leading-5 tracking-wide text-white">Tip</div>
              <div className="mt-1 text-[13px] leading-5 text-[#949ba4]">Use division carefully — answers are checked to two decimal places (X.00). Example 9.145 → 9.15</div>
            </div>
          )}
          <Link to="/app" aria-label="Start practicing" className="learn-more-teal mx-auto">
            START
          </Link>
        </div>
      </div>
    </div>
  );
}
