// https://dev.to/sanderdebr/building-a-custom-react-localstorage-hook-2bja
// https://codesandbox.io/s/z20gn?file=/pages/index.js
// 上のURLをベースに作成。SSRでwindowを参照しようとするとエラーが生じるため，下のURLを参考に改変
import React, { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    item && setStoredValue(JSON.parse(item));
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(initialValue));
  }, [key, initialValue]);

  // const setValue = (value) => {
  //   try {
  //     const valueToStore =
  //       value instanceof Function ? value(storedValue) : value;
  //     setStoredValue(valueToStore);

  //     useEffect(() => {
  //       window.localStorage.setItem(key, JSON.stringify(valueToStore));
  //     }, [key, valueToStore]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return [storedValue, setStoredValue];
  // return [storedValue, setValue];
}
