"use client";
import { useState } from "react";

function Child({ title, onChangeTitle }) {
  return (
    <div>
      <h3>자식(Child)</h3>
      <div>현재 title: {title}</div>

      <button onClick={() => onChangeTitle("자식이 바꾼 제목")}>
        자식이 부모 title 바꾸기
      </button>

      <button onClick={() => onChangeTitle("안녕")}>
        다시 '안녕'으로
      </button>
    </div>
  );
}

export default function Parent() {
  const [title, setTitle] = useState("안녕");

  // 부모가 가진 state를 바꾸는 함수(= setTitle)를 자식에게 내려줌
  return (
    <div>
      <h2>부모(Parent)</h2>
      <div>부모가 들고있는 title: {title}</div>

      <hr />

      <Child title={title} onChangeTitle={setTitle} />
    </div>
  );
}