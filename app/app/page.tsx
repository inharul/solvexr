"use client";
import {
  AnswersContainer,
  AppContainer,
  CalcAnswer,
  CalcForm,
  CalcSum,
  CalcTimer,
  ClockTimer,
  Main,
  SideAnswer,
  SideCounts,
  SideTopBar,
  Sidebar,
} from "@/styles/AppStyle";
import React, { useState, useEffect, FormEvent, useRef } from "react";
import FinishModal from "@/components/FinishModal";
import { useAnswers } from "@/store/answers";
import { useStorage } from "@/store/storage";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import timerIcon from "@/public/timer.svg";
import check from "@/public/check.svg";
import error from "@/public/error.svg";
import dynamic from "next/dynamic";

const App = () => {
  const { answersList, handleAddAnswer, emptyAnswer } = useAnswers();
  const { timeControl, numberOneRange, numberTwoRange, getOperation } =
    useStorage();

  const [operation, setOperation] = useState<string>(getOperation());
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [time, setTime] = useState<number>(0);
  const [clock, setClock] = useState<number>(parseInt(timeControl) * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Calc
  const RandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min - 1)) + min + 1;
  };
  const [numberOne, setNumberOne] = useState<number>(
    RandomNumber(1, numberOneRange)
  );
  const [numberTwo, setNumberTwo] = useState<number>(
    RandomNumber(1, numberTwoRange)
  );

  //Answer
  const [userAnswer, setUserAnswer] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setClock((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (clock === 0) {
      setIsRunning(false);
    }
  }, [clock]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatOperation = (op: string): string => {
    if (op == "*") {
      return "×";
    } else if (op == "/") {
      return "÷";
    }
    return op;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userAnswer === "" || userAnswer.toString().length > 11) {
      return;
    }
    setIsRunning(false);

    const getAnswer = eval(`${numberOne} ${operation} ${numberTwo}`).toFixed(2);
    const isCorrect = getAnswer == parseFloat(userAnswer);

    handleAddAnswer(
      isCorrect,
      `${numberOne} ${formatOperation(
        operation
      )} ${numberTwo} -> ${userAnswer}`,
      time
    );

    isCorrect
      ? setCorrectCount(correctCount + 1)
      : setWrongCount(wrongCount + 1);

    setTime(0);

    setNumberOne(RandomNumber(1, numberOneRange));
    setOperation(getOperation());
    setNumberTwo(RandomNumber(1, numberTwoRange));

    setUserAnswer("");
    textareaRef.current?.focus();

    setIsRunning(true);
  };

  const resetApp = () => {
    emptyAnswer();
    setClock(parseInt(timeControl) * 60);
    setTime(0);
    setUserAnswer("");
    setCorrectCount(0);
    setWrongCount(0);
    setIsRunning(true);
  };

  return (
    <AppContainer>
      {clock === 0 ? (
        <FinishModal
          correctCount={correctCount}
          wrongCount={wrongCount}
          answersList={answersList}
          resetApp={resetApp}
        />
      ) : (
        <></>
      )}
      <Sidebar>
        <ClockTimer>
          <div style={{ width: 30, height: 30 }}>
            <CircularProgressbar
              value={(clock * 100) / (parseInt(timeControl) * 60)}
              counterClockwise
              styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: "#079697",
              })}
              strokeWidth={50}
            />
          </div>

          <h3>{formatTime(clock)}</h3>
        </ClockTimer>
        {answersList.length > 0 && (
          <AnswersContainer>
            <SideTopBar>
              <p>Answers</p>{" "}
              <SideCounts style={{ backgroundColor: "#62a941" }}>
                {correctCount}
              </SideCounts>
              <SideCounts style={{ backgroundColor: "#a63e3e" }}>
                {wrongCount}
              </SideCounts>
              <b>/ {answersList.length}</b>
            </SideTopBar>
            {answersList.map((answers) => (
              <SideAnswer key={answers.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {answers.correct ? (
                    <Image src={check} alt="correct" />
                  ) : (
                    <Image src={error} alt="wrong" />
                  )}
                  <h4>{answers.userAnswer}</h4>
                </div>

                <p> {formatTime(answers.timeTaken)}</p>
              </SideAnswer>
            ))}
          </AnswersContainer>
        )}
      </Sidebar>
      <Main>
        <CalcTimer>
          <h3>{formatTime(time)}</h3>
          <Image
            src={timerIcon}
            alt="timer"
            style={{ width: 30, height: 30 }}
          />
        </CalcTimer>
        <CalcForm>
          <div>
            <CalcSum>
              <h2>{formatOperation(operation)}</h2>
              <div style={{ textAlign: "right" }}>
                <h1>{numberOne}</h1>

                <h1>{numberTwo}</h1>
              </div>
            </CalcSum>
            <CalcAnswer
              name="answer"
              autoFocus
              value={userAnswer}
              type="number"
              onChange={(e) => {
                setUserAnswer(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  handleSubmit(e);
                }
              }}
              disabled={clock === 0}
            />
          </div>
        </CalcForm>
      </Main>
    </AppContainer>
  );
};

export default dynamic(() => Promise.resolve(App), { ssr: false });
