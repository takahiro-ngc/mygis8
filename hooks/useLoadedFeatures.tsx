import { useReducer } from "react";

export const useLoadedFeatures = (init = []) =>
  useReducer((prev, newData) => {
    console.log("LoadedFeatures", newData);
    return { ...prev, ...newData };
  }, init);
