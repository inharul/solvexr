"use client";
import styles from "../styles/home.module.css";
import Image from "next/image";
import play from "@/public/play.svg";
import Link from "next/link";
import { useStorage } from "@/store/storage";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import timerIcon from "@/public/timer.svg";
import addition from "@/public/add.svg";
import rangeIcon from "@/public/expand.svg";
import OSI from "@/public/osi.svg";

const Home = () => {
  const { timeControl, operations, numberOneRange, numberTwoRange } =
    useStorage();

  const newOperations = Object.keys(operations).filter(
    (key) => operations[key]
  );

  const containsDivision = (array: string[]): boolean => {
    return array.indexOf("division") !== -1;
  };
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  function printOperations(arr: string[]): JSX.Element {
    const capitalizedOperations = arr.map(capitalize);
    const operationsString = capitalizedOperations.join(", ");
    return <span>{operationsString}</span>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <div style={{ textAlign: "center" }}>
          <h1>SolvexR</h1>
          <p>
            practice your calculation speed
            <span style={{ color: "#afafaf" }}> (to some extent maybe.)</span>
          </p>
          <WaterMark>
            <a
              href="https://opensource.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={OSI} alt="osi" />
            </a>
            <p>inharul</p>
          </WaterMark>
          <SettingsDisplay>
            <h4>Profile</h4>
            <SettingsItemsContiner>
              <SettingsItems>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image src={timerIcon} alt="time" />
                  Time Control:
                </div>
                <b>{timeControl} min</b>
              </SettingsItems>
              <SettingsItems>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image src={addition} alt="time" />
                  Operations Selection:
                </div>
                <b>{printOperations(newOperations)}</b>
              </SettingsItems>
              <SettingsItems>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image src={rangeIcon} alt="time" />
                  Ranges for Numbers:
                </div>

                <b>{`1: 1-${numberOneRange}, 2: 1-${numberTwoRange}`}</b>
              </SettingsItems>
            </SettingsItemsContiner>
            <b>
              {`-> Go to `} <Link href="/settings">Settings</Link> to change any
              of the above.
            </b>
            {containsDivision(newOperations) && (
              <p>
                NOTE: Please round the value to two decimal places when
                performing division operations, and use the format X.00
                <i>{` (e.g. 9.145 -> 9.15) `}</i>
              </p>
            )}
          </SettingsDisplay>
          <Link href="/app" role="button">
            <Image src={play} alt="play" id={styles.playButton} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const WaterMark = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eee;
  font-size: 13px;
  img {
    height: 20px;
    width: 20px;
    margin-right: 5px;
  }
`;

const SettingsDisplay = styled.div`
  margin: 1rem 0;
  width: 30rem;
  padding: 8px 0 15px 0;
  border: 1.5px var(--border-color) dashed;
  border-radius: 1rem;
  h4 {
    font-size: 16px;
    padding-bottom: 8px;
    font-weight: 500;
  }
  b,
  i {
    font-size: 13px;
    color: #afafaf;
    font-style: normal;
    font-weight: 400;
  }
  a {
    cursor: pointer;
    color: #fff;
    text-decoration: underline;
  }
  i {
    font-size: 11px;
    color: #dadada;
  }
  p {
    padding: 0 10px;
    color: #afafaf;
    margin-top: 7px;
    font-size: 12px;
  }
`;
const SettingsItemsContiner = styled.div`
  margin-bottom: 0.5rem;
  font-size: 14px;
  border-top: 1px dashed var(--border-color);
`;
const SettingsItems = styled.div`
  padding: 10px 10px;
  border-bottom: 1px dashed var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
`;

export default dynamic(() => Promise.resolve(Home), { ssr: false });
