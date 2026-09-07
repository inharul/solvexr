import { atom } from "jotai";

export type Answer = {
  id: string;
  correct: boolean;
  userAnswer: string;
  timeTaken: number;
};

export const answersAtom = atom<Answer[]>([]);

export const addAnswerAtom = atom(null, (get, set, payload: { correct: boolean; userAnswer: string; timeTaken: number }) => {
  const prev = get(answersAtom);
  set(answersAtom, [
    { id: Math.random().toString(36).slice(2), correct: payload.correct, userAnswer: payload.userAnswer, timeTaken: payload.timeTaken },
    ...prev,
  ]);
});

export const clearAnswersAtom = atom(null, (_get, set) => set(answersAtom, []));
