import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solvexr - About",
  description:
    "Solvexr is a webapp that lets you practice arithmetic operation based calculations. Each session lets you solve as many sums as you can under a time pressure, at the end of it, Accuracy, Average Time and Submissions are shown to correct mistakes.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
