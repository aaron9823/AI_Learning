import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorage에서 todos 로드 (마운트될 때만)
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    console.log('저장된 todos:', savedTodos) // 디버깅
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (e) {
        console.error('localStorage 파싱 실패:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // todos 변경되면 localStorage에 저장
  useEffect(() => {
    if (isLoaded) {
      console.log('localStorage에 저장:', todos) // 디버깅
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }])
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  return (
    <div className="app">
      <h1>할 일 목록</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="새로운 할 일을 입력하세요..."
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>할 일을 추가하세요!</p>}
    </div>
  )
}
