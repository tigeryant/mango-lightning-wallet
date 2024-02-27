import React from "react";
import type { RootState } from "../app/store";
import { decrement, increment } from "../features/counter/counterSlice";
import { useAppSelector, useAppDispatch } from '../app/hooks'

const Counter = () => {
  const count = useAppSelector((state: RootState) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}

export default Counter
