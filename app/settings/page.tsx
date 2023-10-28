"use client";
import { useStorage } from "@/store/storage";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";

import {
  Checkbox,
  Divider,
  Slider,
  Box,
  Select,
  Option,
  Switch,
} from "@mui/joy";

import timerIcon from "@/public/timer.svg";

import addition from "@/public/add.svg";
import rangeIcon from "@/public/expand.svg";
import manualIcon from "@/public/manual.svg";

const SettingsModal = () => {
  const [warn, setWarn] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setWarn("");
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const changeManualValue = (e: string) => {
    if (e == "") {
      setWarn("Enter a value.");
    } else if (parseInt(e) > 10000) {
      setWarn("The value cannot exceed 10000!");
      return;
    } else {
      changeStorage("manualNumber", e);
      setWarn(`Changed to: ${parseInt(e)}`);
    }
  };
  const {
    timeControl,
    changeStorage,
    numberOneRange,
    numberTwoRange,
    maunalNumber,
    manualEnabled,
    changeRanges,
    operations,
    changeOperations,
  } = useStorage();
  return (
    <Modal>
      <Settings>
        <h2>Settings</h2>
        <Divider />
        <TimeSettings>
          <section>
            <Image src={timerIcon} alt="timer" />
            <h4>
              Time Control: <b>{timeControl} min</b>
            </h4>
          </section>
          <p>Change how much time you want to set for each session.</p>

          <div style={{ margin: "10px 20px" }}>
            <Slider
              color="primary"
              orientation="horizontal"
              size="md"
              variant="solid"
              min={1}
              max={60}
              value={parseInt(timeControl)}
              onChange={(e: Event, v: number | number[]) => {
                changeStorage("timeControl", `${v as number}`);
              }}
              step={1}
              marks={[
                {
                  value: 1,
                  label: "1min",
                },
                {
                  value: 60,
                  label: "1H",
                },
              ]}
              // value={[1, 100]}
              // value={numberRanges.numberOne}
              valueLabelDisplay="auto"
              sx={{
                "--Slider-thumbSize": "13px",
                "--Slider-thumbWidth": "13px",
                "--Slider-valueLabelArrowSize": "9px",
              }}
            />
          </div>
        </TimeSettings>
        <Divider />

        <div>
          <section>
            <Image src={addition} alt="operations" />
            <h4>Operations</h4>
          </section>
          <p>Select which arithmetic operations you want to practice.</p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginY: 2 }}>
            <Checkbox
              variant="solid"
              size="sm"
              label="Addition"
              checked={operations["addition"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeOperations("addition", e.target.checked);
              }}
            />
            <Checkbox
              variant="solid"
              size="sm"
              label="Substration"
              checked={operations["substraction"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeOperations("substraction", e.target.checked);
              }}
            />
            <Checkbox
              variant="solid"
              size="sm"
              label="Multiplication"
              checked={operations["multiplication"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeOperations("multiplication", e.target.checked);
              }}
            />
            <Checkbox
              variant="solid"
              size="sm"
              label="Division"
              checked={operations["division"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeOperations("division", e.target.checked);
              }}
            />
          </Box>
        </div>
        <Divider />
        <div>
          <section>
            <Image src={rangeIcon} alt="range" />
            <h4>Range of Numbers</h4>
          </section>
          <p>
            Set max values for each number. e.g. 10: 1-10 (number of 0s = number
            of digits)
          </p>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              marginY: 2,
              alignItems: "center",
            }}
          >
            <p>Number 1: </p>
            <Select
              defaultValue={`${numberOneRange}`}
              size="sm"
              variant="solid"
              onChange={(
                event: React.SyntheticEvent | null,
                nv: string | null
              ) => {
                changeRanges(1, `${nv}`);
              }}
            >
              <Option value="10">10</Option>
              <Option value="100">100</Option>
              <Option value="1000">1000</Option>
              <Option value="10000">10000</Option>
            </Select>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              marginBottom: 2,
              alignItems: "center",
            }}
          >
            <p>Number 2: </p>
            <Select
              defaultValue={`${numberTwoRange}`}
              size="sm"
              disabled={manualEnabled}
              variant="solid"
              onChange={(
                event: React.SyntheticEvent | null,
                nv: string | null
              ) => {
                changeRanges(2, `${nv}`);
              }}
            >
              <Option value="10">10</Option>
              <Option value="100">100</Option>
              <Option value="1000">1000</Option>
              <Option value="10000">10000</Option>
            </Select>
          </Box>
        </div>
        <Divider />
        <div>
          <section style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
              <Image src={manualIcon} alt="manual" />
              <h4>Enter Manual Number</h4>
            </div>

            <Switch
              sx={{
                "--Switch-trackWidth": "32px",
                "--Switch-trackRadius": "20px",
                "--Switch-trackHeight": "20px",
              }}
              checked={manualEnabled}
              onChange={(e) => changeStorage("manualEnabled", !manualEnabled)}
            />
          </section>
          <p>Set a specific number for Number 2</p>
          <ManualSettings>
            <input
              type="text"
              placeholder={`${maunalNumber}`}
              disabled={!manualEnabled}
              onInputCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/[\\.]/g, "");
                e.target.value = value;
                changeManualValue(value);
              }}
            />
            <p style={{ color: "#48a4ff" }}>{warn}</p>
          </ManualSettings>
        </div>
      </Settings>
    </Modal>
  );
};

const Modal = styled.div`
  display: flex;
  margin-top: 2rem;
  justify-content: center;
  width: 100%;
  label {
    color: #fff !important;
  }
`;

const Settings = styled.div`
  width: 60%;
  padding: 1.5rem 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0px 2px 6px 0px #383838;
  border-radius: 15px;
  background-color: #33333375;
  h2 {
    margin-bottom: 0.5rem;
  }
  section {
    margin: 10px 0 0 0;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
  h4 {
    font-weight: 500;
    font-size: 16px;
  }
  p {
    font-size: 13px;
    margin: 4px 0 0 2px;
    color: #afafaf;
  }
  b {
    font-style: normal;
    margin: 0 2px;
    font-weight: normal;
    color: #000;
    background-color: #eee;
    padding: 0 6px;
    border-radius: 7px;
  }
`;

const TimeSettings = styled.div`
  margin-top: 10px;
`;

const ManualSettings = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0.1rem;
  align-items: center;
  p {
    transition: all ease-in 1s;
  }
  input {
    background-color: #636b74;
    outline: none;
    border: 1px solid transparent;
    padding: 0.5rem 0.6rem;
    color: #fff;
    border-radius: 6px;
    font-family: var(--inter);
    &:disabled {
      opacity: 0.2;
      /* background-color: #23272b; */
    }
    &:enabled {
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export default dynamic(() => Promise.resolve(SettingsModal), { ssr: false });
