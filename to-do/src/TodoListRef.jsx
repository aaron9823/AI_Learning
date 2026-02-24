import { useRef, useState } from 'react'
import './App.css'

function TodoListRef() {
  const inputRef = useRef(null)
  const [todos, setTodos] = useState([])
  const todoCheckboxRefs = useRef({})

  const handleAdd = () => {
    const value = inputRef.current.value

    if (value.trim() === '') return

    setTodos([...todos, { id: Date.now(), text: value, completed: false }])

    inputRef.current.value = ''
    inputRef.current.focus()
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleToggle = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="app">
      <h1>📝 Todo List (useRef)</h1>

      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="할일을 입력하세요"
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleAdd}>추가</button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              ref={el => todoCheckboxRefs.current[todo.id] = el}
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span className={todo.completed ? 'completed-text' : ''}>
              {todo.text}
            </span>
            <button onClick={() => handleDelete(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoListRef
