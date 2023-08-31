"use client";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
  title: "SolveR - Settings",
};
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  return (
    <div style={{ width: "100%" }}>
      <div className="pageHeader">
        <span
          className="close"
          onClick={() => {
            router.push("/");
          }}
          style={{
            cursor: "pointer",
            marginRight: 30,
            color: "lightblue",
          }}
        >
          {"<- Home"}
        </span>
        <p>Settings</p>
        <span
          style={{
            cursor: "pointer",
            marginRight: 5,
          }}
          onClick={handleClose}
        >
          &#10006;
        </span>
      </div>
      {children}
    </div>
  );
}
