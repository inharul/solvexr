import React from "react";
import Image from "next/image";
import loader from "@/public/loader.svg";

function Loading() {
  return (
    <div>
      <Image src={loader} alt="loader" id="loader" />
    </div>
  );
}

export default Loading;
