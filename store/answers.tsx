"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type Answer = {
  id: string;
  correct: boolean;
  userAnswer: string;
  timeTaken: number;
};

export type AnswerContext = {
  answersList: Answer[];
  handleAddAnswer: (
    corret: boolean,
    userAnswer: string,
    timeTaken: number
  ) => void;
};
export const answerContext = createContext<AnswerContext | null>(null);

export const AnswerProvider = ({ children }: { children: ReactNode }) => {
  const [answersList, setAnswersList] = useState<Answer[]>([]);
  const handleAddAnswer = (
    correct: boolean,
    userAnswer: string,
    timeTaken: number
  ) => {
    setAnswersList((prev) => {
      // create a new array
      const newUserAnswer: Answer[] = [
        {
          id: Math.random().toString(),
          correct: correct,
          userAnswer: userAnswer,
          timeTaken: timeTaken,
        },
        ...prev,
      ];
      return newUserAnswer;
    });
  };
  return (
    // @ts-ignore
    <answerContext.Provider value={{ answersList, handleAddAnswer }}>
      {children}
    </answerContext.Provider>
  );
};

export function useAnswers() {
  const answersContextValue = useContext(answerContext);
  if (!answersContextValue) {
    throw new Error("useTodos used outside of Provider");
  }

  return answersContextValue;
}
