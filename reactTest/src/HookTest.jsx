import { useState } from 'react';
import './HookTest.css';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h1>카운터</h1>
      <div className="counter-display">
        <p className="count-number">{count}</p>
      </div>
      <div className="counter-buttons">
        <button 
          className="counter-btn decrease-btn"
          onClick={() => setCount(count - 1)}
        >
          - 감소
        </button>
        <button 
          className="counter-btn increase-btn"
          onClick={() => setCount(count + 1)}
        >
          + 증가
        </button>
      </div>
      <button 
        className="reset-btn"
        onClick={() => setCount(0)}
      >
        리셋
      </button>
    </div>
  );
}
