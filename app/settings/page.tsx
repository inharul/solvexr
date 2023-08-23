// app/@settings/page.js
"use client";
import { useRouter } from "next/navigation";

export default function SettingsModal() {
  // Get the navigation context
  const router = useRouter();

  // Close the modal by going back
  const handleClose = () => {
    router.back();
  };

  return (
    <div className="modal">
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
    </div>
  );
}
