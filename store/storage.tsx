"use client";

import { createContext, ReactNode, useContext } from "react";
import useLocalStorage from "use-local-storage";

interface Operations {
  [key: string]: boolean;
}

export type StorageContext = {
  timeControl: string;
  numberOneRange: number;
  numberTwoRange: number;
  changeStorage: (key: string, value: string) => void;
  changeRanges: (number: number, newValue: string) => void;
  operations: Operations;
  changeOperations: (element: string, newState: boolean) => void;
};

export const storageContext = createContext<StorageContext | null>(null);

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [timeControl, setTimeControl] = useLocalStorage<string>(
    "timeControl",
    "3"
  );
  const [numberOneRange, setNumberOneRange] = useLocalStorage<number>(
    "numberOne",
    100
  );
  const [numberTwoRange, setNumberTwoRange] = useLocalStorage<number>(
    "numberTwo",
    100
  );
  const [operations, setOperations] = useLocalStorage<Operations>(
    "operations",
    {
      addition: false,
      substraction: false,
      multiplication: true,
      division: false,
    }
  );
  console.log(Object.keys(operations).filter((key) => operations[key]));

  const changeStorage = (key: string, value: string) => {
    if (key == "timeControl") {
      setTimeControl(value);
    }
  };
  const changeRanges = (number: number, nv: string) => {
    number == 1
      ? setNumberOneRange(parseInt(nv))
      : setNumberTwoRange(parseInt(nv));
  };
  const changeOperations = (element: string, newState: boolean) => {
    // Check if the element is a valid key of the operations object
    if (element in operations) {
      // Use the setOperations function to change the value of the element to true
      setOperations({ ...operations, [element]: newState });
    } else {
      // Handle the case when the element is not valid
      console.error("Invalid element");
    }
  };

  return (
    // @ts-ignore
    <storageContext.Provider
      value={{
        timeControl,
        changeStorage,
        numberOneRange,
        numberTwoRange,
        changeRanges,
        operations,
        changeOperations,
      }}
    >
      {children}
    </storageContext.Provider>
  );
};

export function useStorage(): StorageContext {
  const storageContextValue = useContext(storageContext);
  if (!storageContextValue) {
    throw new Error("useStorage used outside of Provider");
  }

  return storageContextValue;
}