import { SideAnswer } from "@/styles/AppStyle";
import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Divider } from "@mui/joy";

import check from "@/public/check.svg";
import error from "@/public/error.svg";
import accuracy from "@/public/target.svg";
import reload from "@/public/reload.svg";
import clock from "@/public/timer.svg";
import checkbox from "@/public/checkbox.svg";
import { useStorage } from "@/store/storage";

type Answer = {
  id: string;
  correct: boolean;
  userAnswer: string;
  timeTaken: number;
};

interface ModalProps {
  correctCount: number;
  wrongCount: number;
  answersList: Answer[];
  resetApp: () => void;
}

const FinishModal: React.FC<ModalProps> = ({
  correctCount,
  wrongCount,
  answersList,
  resetApp,
}) => {
  const { timeControl, operations } = useStorage();
  const newOperations = Object.keys(operations).filter(
    (key) => operations[key]
  );
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const messages: string[] = [
    "Times Up!",
    "Results Time!",
    "Let's see how you did...",
  ];
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const getAccuracy = (): number => {
    const preErrorPercentage = parseFloat(
      (correctCount / answersList.length).toFixed(2)
    );
    return preErrorPercentage * 100;
  };

  const getTimeTaken = (answersList: Answer[]): number[] => {
    // Define a function that takes an Answer object and returns its timeTaken property
    const getTime = (answer: Answer) => answer.timeTaken;
    // Use the map method to create a new array with the timeTaken values
    const timeTakenArray = answersList.map(getTime);
    // Return the new array
    return timeTakenArray;
  };

  const averageTime = (): number => {
    const times = getTimeTaken(answersList);

    const sum = times.reduce((a, b) => a + b, 0);
    // Divide the sum by the length of the array
    const average = sum / times.length;

    // Convert the average back to a string with two decimal places
    return Math.round(average);
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  function printOperations(arr: string[]): JSX.Element {
    // Use the map method to apply the capitalize function to each element of the array
    const capitalizedOperations = arr.map(capitalize);

    // Use the join method to join the elements of the array with a comma and a space
    const operationsString = capitalizedOperations.join(", ");
    return <span>{operationsString}</span>;
  }

  return (
    <ModalContainer>
      <Modal>
        <Results>
          <h1>{messages[Math.floor(Math.random() * messages.length)]}</h1>
          <Divider />
          <MainAnalysis>
            <AnalysisItems>
              <div>
                <Image src={accuracy} alt="accuracy" />
                <h2>{answersList.length !== 0 ? `${getAccuracy()}%` : "0%"}</h2>
              </div>
              <p>Accuracy</p>
            </AnalysisItems>
            <AnalysisItems>
              <div>
                <Image src={clock} alt="clock" />
                <h2>
                  {answersList.length !== 0
                    ? formatTime(averageTime())
                    : "0:00"}
                </h2>
              </div>
              <p>Average Time</p>
            </AnalysisItems>
            <AnalysisItems>
              <div>
                <Image src={checkbox} alt="checkbox" />
                <h2>{correctCount}</h2>
              </div>
              <p>out of {answersList.length}</p>
            </AnalysisItems>
          </MainAnalysis>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AnalysisList>
              <AnalysisListItems>
                <p>Total Time: </p>
                <b>{timeControl} min</b>
              </AnalysisListItems>
              <AnalysisListItems>
                <p>Calculations involved:</p>
                <b>{printOperations(newOperations)}</b>
              </AnalysisListItems>
              <AnalysisListItems>
                <p>Correct answers:</p>
                <b style={{ backgroundColor: "#62a941b5" }}>{correctCount}</b>
              </AnalysisListItems>
              <AnalysisListItems>
                <p>Wrong answers:</p>
                <b style={{ backgroundColor: "#a63e3e" }}>{wrongCount}</b>
              </AnalysisListItems>
              <AnalysisListItems>
                <p>Total Submissions: </p>
                <b>{answersList.length}</b>
              </AnalysisListItems>
            </AnalysisList>
          </div>
          <ButtonsContainer>
            <ResetButton onClick={resetApp}>
              <Image src={reload} alt="reset" />
              <b>RESET</b>
            </ResetButton>
            <ShowButton onClick={() => setShowAnswers(!showAnswers)}>
              {showAnswers == true ? "Hide " : "Show "} Submitted Answers
            </ShowButton>
          </ButtonsContainer>
        </Results>

        {showAnswers && (
          <ShowMeMyAnswers>
            <h3>Your Submitted Answers</h3>
            {answersList.length > 0 ? (
              <div>
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

                    <p>{formatTime(answers.timeTaken)}</p>
                  </SideAnswer>
                ))}
              </div>
            ) : (
              <h5>You did not sumbit any answers. (why?)</h5>
            )}
          </ShowMeMyAnswers>
        )}
      </Modal>
    </ModalContainer>
  );
};

export default FinishModal;

const ModalContainer = styled.div`
  position: absolute;
  background-color: #00000070;
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100%;
  user-select: none;
  z-index: 99;
`;

const Modal = styled.div`
  z-index: 100;
  width: 70%;
  height: 80%;
  /* display: flex; */
  justify-content: center;
  margin-top: 2rem;
  overflow-y: scroll;
  padding: 1.5rem 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0px 2px 6px 0px #383838;
  border-radius: 15px 0 0 15px;
  text-align: center;
  background-color: #202020;
  h1 {
    text-align: center;
    font-weight: 500;
    font-size: 28px;
  }
`;

const Results = styled.div`
  h1 {
    margin-bottom: 10px;
  }
`;
const MainAnalysis = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;
const AnalysisItems = styled.div`
  margin: 0 2rem;
  img {
    width: 32px;
    height: 32px;
  }
  p {
    color: #afafaf;
    font-size: 14px;
  }
`;

const AnalysisList = styled.div`
  width: 80%;
`;
const AnalysisListItems = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed var(--border-color);
  p {
    color: #afafaf;
    font-size: 14px;
  }
  b {
    font-size: 0.8rem;
    font-weight: 500;
    color: #fff;
    margin-left: 1px;
    padding: 2px 4px;
    border-radius: 5px;
  }
`;

const ShowMeMyAnswers = styled.div`
  border: 2px dashed var(--border-color);
  border-radius: 15px;
  margin: 2rem auto;
  width: 65%;
  h3 {
    text-align: center;
    background-color: #80808078;
    border-radius: 15px 15px 0 0;
    font-size: small;
    padding: 5px 0;
    font-weight: normal;
    width: 100%;
  }
  h5 {
    font-style: normal;
    text-align: center;
    font-weight: 400;
    padding: 4rem 0;
    font-size: smaller;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;

  button {
    cursor: pointer;
  }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  border-radius: 15px;
  padding: 0 3px;
  border: none;
  outline: none;
  font-family: var(--font-inter);
  background-color: #079697;
  color: #1f1f1f;
  transition: all ease-in 100ms;
  margin-right: 1rem;
  img {
    width: 48px;
    height: 48px;
  }
  b {
    margin-right: 16px;
  }
`;

const ShowButton = styled.button`
  height: 1.2rem;
  background-color: transparent;
  border: none;
  color: #fff;
  letter-spacing: 0.5px;
  outline: none;
  font-family: var(--font-inter);
  font-weight: 400;
`;
