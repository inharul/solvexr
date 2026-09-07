import { createFileRoute } from "@tanstack/react-router";
import { useSettingsStore } from "@/store/settings";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const RANGE_OPTIONS = ["10", "100", "1000", "10000"];
const OPERATION_OPTIONS = [
  { key: "addition", label: "Addition", icon: "+" },
  { key: "substraction", label: "Substration", icon: "−" },
  { key: "multiplication", label: "Multiplication", icon: "×" },
  { key: "division", label: "Division", icon: "÷" },
] as const;

function SettingsPage() {
  const [warn, setWarn] = useState("");
  useEffect(() => {
    const t = setInterval(() => setWarn(""), 3000);
    return () => clearInterval(t);
  }, []);
  const timeControl = useSettingsStore((s) => s.timeControl);
  const numberOneRange = useSettingsStore((s) => s.numberOneRange);
  const numberTwoRange = useSettingsStore((s) => s.numberTwoRange);
  const maunalNumber = useSettingsStore((s) => s.maunalNumber);
  const manualEnabled = useSettingsStore((s) => s.manualEnabled);
  const operations = useSettingsStore((s) => s.operations);
  const changeStorage = useSettingsStore((s) => s.changeStorage);
  const changeRanges = useSettingsStore((s) => s.changeRanges);
  const changeOperations = useSettingsStore((s) => s.changeOperations);

  const changeManualValue = (e: string) => {
    if (e == "") setWarn("Enter a value.");
    else if (parseInt(e) > 10000) setWarn("The value cannot exceed 10000!");
    else {
      changeStorage("manualNumber", e);
      setWarn(`Changed to: ${parseInt(e)}`);
    }
  };

  return (
    <div className="w-full bg-[#0f1113] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[720px]">
        <h1 className="mb-4 text-xl font-semibold tracking-tight text-white">Settings</h1>
        <div className="overflow-hidden rounded-xl bg-[#1e1f22] shadow-sm ring-1 ring-white/[0.06]">
          <div className="divide-y divide-white/[0.06]">
            <div className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium leading-5 text-white">Time Control</div>
                  <div className="mt-1 text-[13px] leading-5 text-[#949ba4]">Change how much time you want to set for each session.</div>
                </div>
                <div className="shrink-0 self-start rounded-full bg-white/[0.06] px-3 py-1 text-sm font-medium text-white sm:self-center">{timeControl} min</div>
              </div>
              <div className="mt-4 px-1">
                <Slider min={1} max={60} step={1} value={[parseInt(timeControl)]} onValueChange={(v) => changeStorage("timeControl", `${v[0]}`)} className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-white" />
                <div className="mt-2 flex justify-between text-xs text-[#949ba4]">
                  <span>1min</span>
                  <span>1H</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-[15px] font-medium leading-5 text-white">Operations</div>
                  <div className="mt-1 text-[13px] leading-5 text-[#949ba4]">Select which arithmetic operations you want to practice.</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {OPERATION_OPTIONS.map((op) => (
                    <label key={op.key} htmlFor={`op-${op.key}`} className="inline-flex cursor-pointer items-center overflow-hidden rounded-full bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-[#d1d4d8] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] has-[[data-state=checked]]:bg-white has-[[data-state=checked]]:text-black has-[[data-state=checked]]:gap-1.5 gap-0">
                      <Checkbox id={`op-${op.key}`} checked={operations[op.key]} onCheckedChange={(c) => changeOperations(op.key, c === true)} className="h-5 shrink-0 overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] w-0 opacity-0 -translate-x-1 scale-90 data-[state=checked]:w-5 data-[state=checked]:opacity-100 data-[state=checked]:translate-x-0 data-[state=checked]:scale-100 data-[state=checked]:bg-transparent data-[state=checked]:text-black">
                        <span className="text-sm font-bold leading-none text-black">{op.icon}</span>
                      </Checkbox>
                      {op.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium leading-5 text-white">Number 1 range</div>
                <div className="mt-1 text-[13px] leading-5 text-[#949ba4]">Set max value for the first number. e.g. 100 → 1–100</div>
              </div>
              <Select value={`${numberOneRange}`} onValueChange={(nv) => changeRanges(1, `${nv}`)}>
                <SelectTrigger className="h-9 w-full shrink-0 rounded-full border-white/10 bg-white/[0.06] text-sm text-white sm:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RANGE_OPTIONS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium leading-5 text-white">Number 2 range</div>
                <div className="mt-1 text-[13px] leading-5 text-[#949ba4]">Set max value for the second number. Disabled when manual is on.</div>
              </div>
              <Select value={`${numberTwoRange}`} disabled={manualEnabled} onValueChange={(nv) => changeRanges(2, `${nv}`)}>
                <SelectTrigger className="h-9 w-full shrink-0 rounded-full border-white/10 bg-white/[0.06] text-sm text-white disabled:opacity-40 sm:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RANGE_OPTIONS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium leading-5 text-white">Enter Manual Number</div>
                <div className="mt-1 text-[13px] leading-5 text-[#949ba4]">Set a specific number for Number 2 instead of a random range.</div>
              </div>
              <Switch checked={manualEnabled} onCheckedChange={() => changeStorage("manualEnabled", !manualEnabled)} className="shrink-0 data-[state=checked]:bg-[#23a559] data-[state=unchecked]:bg-white/20" />
            </div>
            {manualEnabled && (
              <div className="bg-white/[0.02] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input type="text" placeholder={`${maunalNumber}`} defaultValue={manualEnabled ? `${maunalNumber}` : undefined} onInput={(e) => { const target = e.target as HTMLInputElement; const v = target.value.replace(/[^0-9.]/g, "").replace(/[\\.]/g, ""); target.value = v; changeManualValue(v); }} className="h-9 w-full rounded-full border border-white/10 bg-[#2b2d31] px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20 focus:ring-0 sm:w-[180px]" />
                  <span className="text-sm font-medium text-[#23a559]">{warn}</span>
                </div>
                <p className="mt-2 text-xs text-[#949ba4]">Value must be 1–10000. Applied on next problem.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
