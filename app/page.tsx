"use client";
import styles from "../styles/home.module.css";
import Image from "next/image";
import play from "@/public/play.svg";
import Link from "next/link";
import { useStorage } from "@/store/storage";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CircularProgress from "@mui/joy/CircularProgress";

const Home = () => {
  const { timeControl } = useStorage();
  // const [isClient, setIsClient] = useState(false);
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <div style={{ textAlign: "center" }}>
          <h1>SolveR</h1>
          <p>practice your calculation speed (to some extent maybe)</p>
          <div className={styles.settingsDisplay}>
            <CircularProgress variant="plain" thickness={1} />
            <div>Time Control: {timeControl} min</div>
          </div>
          <Link href="/app" role="button">
            <Image src={play} alt="play" id={styles.playButton} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
