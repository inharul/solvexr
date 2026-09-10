import { createFileRoute, Link } from "@tanstack/react-router";
import { useSettingsStore } from "@/store/settings";
import { ArrowsLeftRight, Calculator, Timer } from "@phosphor-icons/react";

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
            <a href="https://inharul.com" target="_blank" rel="noopener noreferrer" aria-label="Inharul" className="mr-[5px] flex">
              <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M149.842 479.078C142.314 476.868 134.832 475.029 127.625 472.43C107.664 465.234 96.0475 450.902 92.2072 430.073C89.6448 416.175 89.498 402.239 90.8236 388.22C93.1423 363.7 99.3153 340.112 108.059 317.171C114.563 300.109 122.723 283.839 132.311 268.291C132.952 267.252 133.579 266.205 134.047 265.435C130.315 260.644 126.459 256.154 123.116 251.311C114.882 239.383 110.51 225.967 108.559 211.693C106.155 194.097 107.771 176.661 110.812 159.311C112.231 151.215 114.039 143.188 115.588 135.115C115.766 134.188 115.595 133.094 115.276 132.186C110.574 118.788 106.138 105.308 103.057 91.4284C100.419 79.5426 98.1738 67.5894 97.9399 55.3599C97.7853 47.2773 98.7148 39.3471 101.539 31.7194C103.631 26.0698 105.927 24.6964 111.891 25.0525C119.199 25.4888 125.734 28.3558 132.21 31.3717C152.981 41.0446 171.475 54.1413 188.511 69.337C191.031 71.5849 192.935 71.9663 196.115 70.6502C221.189 60.2722 247.357 57.2908 274.251 59.6809C289.752 61.0585 304.582 65.0846 318.854 71.1934C321.366 72.2688 323.148 72.0196 325.237 70.1652C336.083 60.5394 347.442 51.5561 359.675 43.731C369.66 37.344 379.85 31.2817 391.13 27.4655C395.07 26.1328 399.324 25.5866 403.483 25.0892C407.419 24.6184 410.195 26.5515 411.889 30.202C414.4 35.6153 415.238 41.3452 415.543 47.2208C416.285 61.4903 413.941 75.4091 410.868 89.2521C407.771 103.204 403.652 116.851 398.533 130.189C397.616 132.577 397.55 134.779 398.125 137.293C402.722 157.426 406.123 177.725 405.67 198.481C405.119 223.699 396.984 245.891 379.248 264.213C379.015 264.454 378.82 264.731 378.586 265.018C381.498 269.882 384.48 274.665 387.268 279.558C398.491 299.255 407.023 320.076 413.141 341.896C418.835 362.201 422.625 382.813 422.845 403.962C422.96 415.007 421.986 425.965 419.255 436.717C415.612 451.063 407.152 461.62 394.079 468.426C382.752 474.323 370.562 477.628 358.067 479.932C330.209 485.069 302.043 486.897 273.789 487.164C253.863 487.352 233.916 487.09 214.003 486.372C192.514 485.597 171.116 483.514 149.842 479.078Z" fill="white"/>
              </svg>
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
